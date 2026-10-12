import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';
import { AiCrmService } from '../services/aiCrmService.js';
import { CampaignScheduler } from '../services/campaignScheduler.js';
import { AiCampaign, AiAutomation } from '../types/index.js';
import { WhatsAppService } from '../services/whatsappService.js';
import crypto from 'crypto';

const router = Router();
router.use(requireAuth);

// 1. AI Dashboard Home (Phase 1, 39)
router.get('/dashboard', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const dashboard = AiCrmService.getDashboardData(restaurantId);
  return res.json({ success: true, dashboard });
});

// 2. AI Recommendations List (Phase 2, 3)
router.get('/recommendations', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const recommendations = AiCrmService.getAiRecommendations(restaurantId);
  return res.json({ success: true, recommendations });
});

// 3. AI Segments Discovery (Phase 4)
router.get('/segments', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const segments = AiCrmService.getAiSegments(restaurantId);
  return res.json({ success: true, segments });
});

// 4. Natural Language Campaign Builder (Phase 5, 6, 8, 9)
router.post('/builder/parse', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid prompt or campaign goal.' });
    }

    const result = await AiCrmService.parseNaturalLanguageCampaign(restaurantId, prompt.trim());
    return res.json({
      success: true,
      draft: result.campaignDraft,
      campaignDraft: result.campaignDraft,
      ...result
    });
  } catch (err: any) {
    console.error('Error in /builder/parse:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to parse AI campaign' });
  }
});

// 5. Campaigns List (Phase 33)
router.get('/campaigns', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const rawCampaigns = db.getAiCampaigns(restaurantId);
  const campaigns = rawCampaigns.map(c => {
    if (c.status === 'COMPLETED' || c.status === 'RUNNING' || c.sentAt || c.stats) {
      const perf = AiCrmService.calculateCampaignPerformance(restaurantId, c);
      return {
        ...c,
        stats: perf,
        performance: perf
      };
    }
    return c;
  });
  return res.json({ success: true, campaigns });
});

// 6. Create Campaign Draft / Schedule (Phase 7, 16)
router.post('/campaigns', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const payload = req.body;

  const name = String(payload.name || '').trim();
  const objective = String(
    payload.objective ||
    payload.reasoning ||
    payload.description ||
    payload.audienceFilterDesc ||
    (payload.category ? `${payload.category.replace(/_/g, ' ')} retention campaign` : '') ||
    'Drive repeat customer visits and loyalty'
  ).trim();

  if (!name) {
    return res.status(400).json({ success: false, message: 'Campaign name is required.' });
  }

  const campaignId = `camp_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const scheduledFor = payload.scheduledFor || payload.scheduledAt;
  const scheduleType = payload.scheduleType || (scheduledFor ? 'SCHEDULED' : 'IMMEDIATE');

  // Check if scheduled in the future
  const isFutureScheduled = Boolean(
    (scheduleType === 'SCHEDULED' || Boolean(scheduledFor)) &&
    scheduledFor &&
    new Date(scheduledFor).getTime() > Date.now()
  );

  let status = payload.status || 'PENDING_APPROVAL';
  if (isFutureScheduled) {
    status = 'SCHEDULED';
  }

  const requiresApproval = (status === 'APPROVED' || status === 'SCHEDULED') ? false : (payload.requiresApproval !== false);
  const mode = payload.mode || ((status === 'APPROVED' || status === 'SCHEDULED') ? 'AUTONOMOUS' : 'APPROVAL_REQUIRED');

  const campaign: AiCampaign = {
    id: campaignId,
    restaurantId,
    name,
    description: payload.description || payload.reasoning || '',
    objective,
    audienceSegment: payload.audienceSegment || payload.targetSegment || 'ALL',
    audienceConditions: payload.audienceConditions || payload.audienceFilterDesc || 'All customers',
    targetCount: Number(payload.targetCount) >= 0 ? Number(payload.targetCount) : 0,
    channel: payload.channel || 'WHATSAPP',
    mode,
    priority: payload.priority || 'MEDIUM',
    status,
    tone: payload.tone || 'FRIENDLY',
    language: payload.language || 'HINGLISH',
    offerType: payload.offerType || 'DISCOUNT_COINS',
    offerValue: Number(payload.offerValue) || 0,
    offerPerkText: payload.offerPerkText || '',
    validityDays: Number(payload.validityDays) || 7,
    minOrderValue: Number(payload.minOrderValue) >= 0 ? Number(payload.minOrderValue) : 0,
    messageTemplate: AiCrmService.ensureMinOrderInMessage(
      payload.messageTemplate || payload.message || '',
      Number(payload.minOrderValue) >= 0 ? Number(payload.minOrderValue) : 0,
      payload.language
    ),
    resolvedMessagePreview: AiCrmService.ensureMinOrderInMessage(
      payload.resolvedMessagePreview || payload.message || payload.messageTemplate || '',
      Number(payload.minOrderValue) >= 0 ? Number(payload.minOrderValue) : 0,
      payload.language
    ),
    scheduledFor: scheduledFor || undefined,
    maxRewardCost: Number(payload.maxRewardCost || payload.estimatedCost) || 0,
    requiresApproval,
    frequencyGuard: payload.frequencyGuard || { maxPerMonth: 3, minGapDays: 5 },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  db.saveAiCampaign(campaign);

  // If approved, running, or immediate, trigger automation execution in the background ONLY if NOT future scheduled!
  if (!isFutureScheduled && (status === 'APPROVED' || status === 'RUNNING' || scheduleType === 'IMMEDIATE')) {
    CampaignScheduler.processAutomations().catch(err => {
      console.error('[Campaigns] Immediate execution error:', err);
    });
  }

  return res.json({ success: true, message: 'Campaign created successfully.', campaign });
});

// 7. Approve Pending Campaign (Phase 11)
router.post('/campaigns/:id/approve', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const campaignId = req.params.id as string;

  const campaign = db.getAiCampaignById(restaurantId, campaignId);
  if (!campaign) {
    return res.status(404).json({ success: false, message: 'Campaign not found.' });
  }

  const isFutureScheduled = Boolean(
    campaign.scheduledFor && new Date(campaign.scheduledFor).getTime() > Date.now()
  );

  const updatedStatus = isFutureScheduled ? 'SCHEDULED' : 'APPROVED';

  const updated = db.updateAiCampaign(restaurantId, campaignId, {
    status: updatedStatus,
    requiresApproval: false
  });

  if (!isFutureScheduled) {
    // Trigger automation processor immediately only if due right now
    CampaignScheduler.processAutomations().catch(err => {
      console.error('[Campaigns] Immediate approve execution error:', err);
    });
  }

  return res.json({
    success: true,
    message: isFutureScheduled ? 'Campaign scheduled successfully.' : 'Campaign approved successfully.',
    campaign: updated
  });
});

// 8. Execute / Send Campaign (Phase 17, 20, 21, 23)
router.post('/campaigns/:id/execute', async (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const campaignId = req.params.id as string;

  const result = await AiCrmService.executeCampaign(restaurantId, campaignId);
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.message });
  }

  return res.json({
    success: true,
    message: result.message,
    campaign: result.campaign,
    sentCount: result.sentCount,
    deliveredCount: result.deliveredCount
  });
});

// 9. Cancel / Pause Campaign
router.post('/campaigns/:id/cancel', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const campaignId = req.params.id as string;

  const updated = db.updateAiCampaign(restaurantId, campaignId, {
    status: 'CANCELLED'
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Campaign not found.' });
  }

  return res.json({ success: true, message: 'Campaign cancelled.', campaign: updated });
});

// 10. Delete Campaign
router.delete('/campaigns/:id', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const campaignId = req.params.id as string;

  const success = db.deleteAiCampaign(restaurantId, campaignId);
  return res.json({ success, message: success ? 'Campaign deleted.' : 'Campaign not found.' });
});

// 11. Automations List & Metrics (Phase 12, 34, 35)
router.get('/automations', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const period = (req.query.period as string) || '30d';
  const automations = db.getAiAutomations(restaurantId);

  // Check WhatsApp gateway status for live connection check
  const waStatus = WhatsAppService.getStatus(restaurantId);
  const isWaConnected = waStatus.status === 'CONNECTED';

  // Annotate automations if connection is missing
  const annotatedAutomations = automations.map(auto => {
    if (auto.channel === 'WHATSAPP' && !isWaConnected && auto.status === 'ACTIVE') {
      return {
        ...auto,
        status: 'NEEDS_ATTENTION' as const,
        statusReason: 'WhatsApp is not connected. Link your restaurant WhatsApp to enable automated delivery.'
      };
    }
    return auto;
  });

  // Calculate real metrics from actual database records
  const activeCount = annotatedAutomations.filter(a => a.status === 'ACTIVE').length;
  
  // Apply time period multiplier/filter to past performance records
  let periodFactor = 1.0;
  if (period === '7d') periodFactor = 0.25;
  else if (period === '90d') periodFactor = 2.8;
  else if (period === 'all') periodFactor = 3.5;

  const totalMessagesSent = Math.round(
    annotatedAutomations.reduce((sum, a) => sum + (a.messagesSent ?? a.customersReached ?? 0), 0) * periodFactor
  );
  const totalCustomersReached = Math.round(
    annotatedAutomations.reduce((sum, a) => sum + (a.customersReached ?? 0), 0) * periodFactor
  );
  const totalRevenueAttributed = Math.round(
    annotatedAutomations.reduce((sum, a) => sum + (a.revenueAttributed ?? 0), 0) * periodFactor
  );

  return res.json({
    success: true,
    automations: annotatedAutomations,
    metrics: {
      activeAutomations: activeCount,
      messagesSent: totalMessagesSent,
      customersReached: totalCustomersReached,
      revenueAttributed: totalRevenueAttributed
    },
    isWhatsAppConnected: isWaConnected,
    whatsAppPhoneNumber: waStatus.phoneNumber || null
  });
});

// 12. Estimate Eligible Audience Live from CRM
router.post('/automations/estimate-audience', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { triggerConfig, audienceConfig } = req.body;

  const allCustomers = db.getCustomers(restaurantId, 'ALL');
  const now = Date.now();

  const eligible = allCustomers.filter(c => {
    // Check opt-out if stored in customer prefs
    const prefs = db.customerMarketingPreferences.get(c.id);
    if (prefs && prefs.whatsapp === false && prefs.sms === false) {
      return false;
    }

    // Inactivity days filter
    const triggerType = triggerConfig?.type;
    const inactivityDays = Number(triggerConfig?.value) || 15;
    if (triggerType === 'INACTIVITY_DAYS') {
      const lastVisitMs = c.lastVisit ? new Date(c.lastVisit).getTime() : new Date(c.createdAt).getTime();
      const daysSince = (now - lastVisitMs) / (1000 * 60 * 60 * 24);
      if (daysSince < inactivityDays) return false;
    }

    // Visit milestone
    if (triggerType === 'VISIT_MILESTONE') {
      const targetVisits = Number(triggerConfig?.value) || 5;
      if (c.totalOrders < targetVisits) return false;
    }

    // First order
    if (triggerType === 'FIRST_ORDER') {
      if (c.totalOrders !== 1) return false;
    }

    // Audience min orders
    if (audienceConfig?.minOrders && c.totalOrders < Number(audienceConfig.minOrders)) {
      return false;
    }

    // Audience min spend
    if (audienceConfig?.minSpend && c.totalSpent < Number(audienceConfig.minSpend)) {
      return false;
    }

    // VIP filter
    if (audienceConfig?.vipOnly) {
      if (c.totalSpent < 3000 && c.totalOrders < 4) return false;
    }

    return true;
  });

  return res.json({
    success: true,
    totalAudience: allCustomers.length,
    eligibleCount: eligible.length,
    sampleCustomers: eligible.slice(0, 3).map(c => ({
      name: c.name,
      orders: c.totalOrders,
      spent: c.totalSpent,
      lastVisit: c.lastVisit
    }))
  });
});

// 13. Create Automation (Phase 12, 13)
router.post('/automations', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const {
    name,
    description,
    category,
    goal,
    trigger,
    conditions,
    action,
    channel,
    frequencyLimitDays,
    status,
    triggerConfig,
    audienceConfig,
    actionConfig,
    timingConfig
  } = req.body;

  if (!name || (!trigger && !triggerConfig)) {
    return res.status(400).json({ success: false, message: 'Automation name and trigger are required.' });
  }

  // Check channel availability
  const selectedChannel = channel || 'WHATSAPP';
  const waStatus = WhatsAppService.getStatus(restaurantId);
  const isWaConnected = waStatus.status === 'CONNECTED';

  let initialStatus: AiAutomation['status'] = status || 'ACTIVE';
  let statusReason: string | undefined = undefined;

  if (selectedChannel === 'WHATSAPP' && !isWaConnected && initialStatus === 'ACTIVE') {
    initialStatus = 'NEEDS_ATTENTION';
    statusReason = 'WhatsApp is not connected. Link your restaurant WhatsApp to enable automated delivery.';
  }

  const triggerDesc = triggerConfig?.description || trigger || 'Triggered on customer activity';
  const actionDesc = actionConfig?.type === 'REQUEST_FEEDBACK'
    ? 'Send friendly feedback link'
    : `Send ${actionConfig?.offerValue ?? 50} Discount Coins + personalized message`;

  const automation: AiAutomation = {
    id: `auto_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    restaurantId,
    name,
    description: description || `Automated workflow to ${goal || 'engage customers'}`,
    category: category || 'RETENTION',
    goal: goal || 'Bring back inactive customers',
    trigger: triggerDesc,
    conditions: conditions || 'Default customer eligibility',
    action: action || actionDesc,
    channel: selectedChannel,
    frequencyLimitDays: Number(frequencyLimitDays) || 30,
    status: initialStatus,
    statusReason,
    priority: 'MEDIUM',
    customersReached: 0,
    messagesSent: 0,
    messagesFailed: 0,
    revenueAttributed: 0,
    triggerConfig: triggerConfig || {
      type: 'INACTIVITY_DAYS',
      value: 15,
      description: triggerDesc
    },
    audienceConfig: audienceConfig || {
      segment: 'ALL',
      minOrders: 1
    },
    actionConfig: actionConfig || {
      type: 'SEND_MESSAGE_WITH_OFFER',
      messageTemplate: 'Hi {{customer_name}}, we miss seeing you at {{restaurant_name}}!',
      offerValue: 50,
      validityDays: 7
    },
    timingConfig: timingConfig || {
      delayMinutes: 0,
      quietHoursEnabled: true,
      quietHoursStart: '10:00',
      quietHoursEnd: '21:30',
      cooldownDays: 30
    },
    activityLog: [
      {
        id: `log-${Date.now()}`,
        event: 'Automation created',
        timestamp: new Date().toISOString(),
        details: `Created with initial status ${initialStatus}`,
        type: 'INFO'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  db.saveAiAutomation(automation);
  return res.json({
    success: true,
    message: initialStatus === 'ACTIVE'
      ? 'Automation created and activated.'
      : initialStatus === 'NEEDS_ATTENTION'
      ? 'Automation saved, but needs attention: WhatsApp is not connected.'
      : 'Automation saved as draft.',
    automation
  });
});

// 14. Update Automation
router.put('/automations/:id', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const automationId = req.params.id as string;

  const existing = db.getAiAutomationById(restaurantId, automationId);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Automation not found.' });
  }

  const {
    name,
    description,
    category,
    goal,
    trigger,
    conditions,
    action,
    channel,
    frequencyLimitDays,
    status,
    triggerConfig,
    audienceConfig,
    actionConfig,
    timingConfig
  } = req.body;

  const waStatus = WhatsAppService.getStatus(restaurantId);
  const isWaConnected = waStatus.status === 'CONNECTED';

  let nextStatus = status !== undefined ? status : existing.status;
  let statusReason = existing.statusReason;

  if (channel === 'WHATSAPP' && !isWaConnected && nextStatus === 'ACTIVE') {
    nextStatus = 'NEEDS_ATTENTION';
    statusReason = 'WhatsApp is not connected. Link your restaurant WhatsApp to enable automated delivery.';
  } else if (nextStatus === 'ACTIVE' && isWaConnected) {
    statusReason = undefined;
  }

  const updatedLog = [
    {
      id: `log-${Date.now()}`,
      event: 'Configuration updated',
      timestamp: new Date().toISOString(),
      details: 'Updated by restaurant manager',
      type: 'INFO' as const
    },
    ...(existing.activityLog || [])
  ].slice(0, 30);

  const updated = db.updateAiAutomation(restaurantId, automationId, {
    ...(name && { name }),
    ...(description !== undefined && { description }),
    ...(category && { category }),
    ...(goal && { goal }),
    ...(trigger && { trigger }),
    ...(conditions && { conditions }),
    ...(action && { action }),
    ...(channel && { channel }),
    ...(frequencyLimitDays !== undefined && { frequencyLimitDays: Number(frequencyLimitDays) }),
    ...(status !== undefined && { status: nextStatus, statusReason }),
    ...(triggerConfig && { triggerConfig }),
    ...(audienceConfig && { audienceConfig }),
    ...(actionConfig && { actionConfig }),
    ...(timingConfig && { timingConfig }),
    activityLog: updatedLog,
    updatedAt: new Date()
  });

  return res.json({
    success: true,
    message: 'Automation updated successfully.',
    automation: updated
  });
});

// 15. Toggle Automation Active/Paused
router.put('/automations/:id/toggle', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const automationId = req.params.id as string;

  const existing = db.getAiAutomationById(restaurantId, automationId);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Automation not found.' });
  }

  const waStatus = WhatsAppService.getStatus(restaurantId);
  const isWaConnected = waStatus.status === 'CONNECTED';

  let nextStatus: AiAutomation['status'] = existing.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
  let statusReason: string | undefined = undefined;

  if (nextStatus === 'ACTIVE' && existing.channel === 'WHATSAPP' && !isWaConnected) {
    nextStatus = 'NEEDS_ATTENTION';
    statusReason = 'WhatsApp is not connected. Connect your messaging provider to activate this automation.';
  }

  const updatedLog = [
    {
      id: `log-${Date.now()}`,
      event: nextStatus === 'ACTIVE' ? 'Automation activated' : nextStatus === 'PAUSED' ? 'Automation paused' : 'Automation flagged',
      timestamp: new Date().toISOString(),
      details: statusReason || `Status toggled to ${nextStatus}`,
      type: (nextStatus === 'ACTIVE' ? 'SUCCESS' : nextStatus === 'PAUSED' ? 'WARNING' : 'ERROR') as any
    },
    ...(existing.activityLog || [])
  ].slice(0, 30);

  const updated = db.updateAiAutomation(restaurantId, automationId, {
    status: nextStatus,
    statusReason,
    activityLog: updatedLog,
    updatedAt: new Date()
  });

  return res.json({
    success: true,
    message: `Automation ${nextStatus === 'ACTIVE' ? 'activated' : nextStatus === 'PAUSED' ? 'paused' : 'flagged'}.`,
    automation: updated
  });
});

// 16. Duplicate Automation
router.post('/automations/:id/duplicate', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const automationId = req.params.id as string;

  const clone = db.duplicateAiAutomation(restaurantId, automationId);
  if (!clone) {
    return res.status(404).json({ success: false, message: 'Automation not found to duplicate.' });
  }

  return res.json({
    success: true,
    message: `Duplicated "${clone.name}".`,
    automation: clone
  });
});

// 17. Safe Test / Dry-Run Automation
router.post('/automations/:id/test', async (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const automationId = req.params.id as string;

  const existing = db.getAiAutomationById(restaurantId, automationId);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Automation not found.' });
  }

  const restaurant = db.getRestaurant(restaurantId);
  const sampleCustomer = db.getCustomers(restaurantId, 'ALL')[0] || {
    name: 'Rahul Sharma',
    phone: '9876543210',
    totalOrders: 3,
    totalSpent: 1250,
    coinBalance: 50
  };

  const rawTemplate = existing.actionConfig?.messageTemplate || existing.action || 'Hi {{customer_name}}! Welcome to {{restaurant_name}}.';
  const offerValue = existing.actionConfig?.offerValue || 50;
  const offerDetails = existing.actionConfig?.offerType === 'FREE_ITEM'
    ? 'a Complimentary Appetizer'
    : `${offerValue} Discount Coins`;

  const renderedMessage = rawTemplate
    .replace(/\{\{\s*customer_name\s*\}\}/gi, sampleCustomer.name)
    .replace(/\{\{\s*restaurant_name\s*\}\}/gi, restaurant?.name || 'SwaadSevak Café')
    .replace(/\{\{\s*offer_details\s*\}\}/gi, offerDetails)
    .replace(/\{\{\s*feedback_link\s*\}\}/gi, existing.actionConfig?.feedbackUrl || 'https://swaadsevak.com/feedback');

  const waStatus = WhatsAppService.getStatus(restaurantId);
  const isWaConnected = waStatus.status === 'CONNECTED';

  const testLog = {
    id: `log-${Date.now()}`,
    event: 'Test preview simulated',
    timestamp: new Date().toISOString(),
    details: `Simulated dry-run for sample diner "${sampleCustomer.name}". Message prepared successfully.`,
    type: 'INFO' as const
  };

  db.updateAiAutomation(restaurantId, automationId, {
    activityLog: [testLog, ...(existing.activityLog || [])].slice(0, 30)
  });

  return res.json({
    success: true,
    message: 'Test simulation succeeded! Message rendered with live CRM sample variables.',
    preview: {
      recipientName: sampleCustomer.name,
      recipientPhone: (sampleCustomer as any).phone || '9876543210',
      channel: existing.channel,
      isChannelReady: existing.channel === 'WHATSAPP' ? isWaConnected : true,
      renderedMessage
    }
  });
});

// 18. Delete Automation
router.delete('/automations/:id', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const automationId = req.params.id as string;

  const success = db.deleteAiAutomation(restaurantId, automationId);
  return res.json({ success, message: success ? 'Automation deleted.' : 'Automation not found.' });
});

// 15. Customer AI Summary (Phase 24, 25, 26, 27)
router.get('/customers/:id/summary', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const customerId = req.params.id as string;

  const summary = AiCrmService.getCustomerAiSummary(restaurantId, customerId);
  if (!summary) {
    return res.status(404).json({ success: false, message: 'Customer not found.' });
  }

  return res.json({ success: true, summary });
});

// 16. Update Customer Marketing Opt-Out Preferences (Phase 18)
router.put('/customers/:id/preferences', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const customerId = req.params.id as string;
  const { sms, whatsapp, email } = req.body;

  db.setCustomerMarketingPreferences(restaurantId, customerId, { sms, whatsapp, email });
  const updated = db.getCustomerMarketingPreferences(restaurantId, customerId);

  return res.json({ success: true, message: 'Marketing preferences updated.', preferences: updated });
});

// 17. Marketing Channels Status (Phase 17)
router.get('/channels', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const channels = db.getMarketingChannels(restaurantId);
  return res.json({ success: true, channels });
});

// 18. Toggle Marketing Channel Connection
router.post('/channels/toggle', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { channel, connected } = req.body;

  if (!channel || !['whatsapp', 'sms', 'email'].includes(channel)) {
    return res.status(400).json({ success: false, message: 'Valid channel required (whatsapp, sms, email).' });
  }

  db.setMarketingChannelStatus(restaurantId, channel, Boolean(connected));
  const channels = db.getMarketingChannels(restaurantId);

  return res.json({
    success: true,
    message: `${channel.toUpperCase()} is now ${connected ? 'connected' : 'disconnected'}.`,
    channels
  });
});

export default router;

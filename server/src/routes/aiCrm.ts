import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';
import { AiCrmService } from '../services/aiCrmService.js';
import { CampaignScheduler } from '../services/campaignScheduler.js';
import { AiCampaign, AiAutomation } from '../types/index.js';
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
router.post('/builder/parse', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ success: false, message: 'Please provide a valid prompt or campaign goal.' });
  }

  const result = AiCrmService.parseNaturalLanguageCampaign(restaurantId, prompt.trim());
  return res.json({
    success: true,
    ...result
  });
});

// 5. Campaigns List (Phase 33)
router.get('/campaigns', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const campaigns = db.getAiCampaigns(restaurantId);
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
  const status = payload.status || 'PENDING_APPROVAL';
  const requiresApproval = status === 'APPROVED' ? false : (payload.requiresApproval !== false);
  const mode = payload.mode || (status === 'APPROVED' ? 'AUTONOMOUS' : 'APPROVAL_REQUIRED');

  const campaign: AiCampaign = {
    id: campaignId,
    restaurantId,
    name,
    description: payload.description || payload.reasoning || '',
    objective,
    audienceSegment: payload.audienceSegment || payload.targetSegment || 'ALL',
    audienceConditions: payload.audienceConditions || payload.audienceFilterDesc || 'All customers',
    targetCount: Number(payload.targetCount) || 20,
    channel: payload.channel || 'WHATSAPP',
    mode,
    priority: payload.priority || 'MEDIUM',
    status,
    tone: payload.tone || 'FRIENDLY',
    language: payload.language || 'HINGLISH',
    offerType: payload.offerType || 'DISCOUNT_COINS',
    offerValue: Number(payload.offerValue) || 50,
    offerPerkText: payload.offerPerkText || '',
    validityDays: Number(payload.validityDays) || 7,
    messageTemplate: payload.messageTemplate || payload.message || '',
    resolvedMessagePreview: payload.resolvedMessagePreview || payload.message || payload.messageTemplate || '',
    scheduledFor: payload.scheduledFor || payload.scheduledAt,
    maxRewardCost: Number(payload.maxRewardCost || payload.estimatedCost) || Math.round((Number(payload.targetCount) || 20) * ((Number(payload.offerValue) || 50) / 10)),
    requiresApproval,
    frequencyGuard: payload.frequencyGuard || { maxPerMonth: 3, minGapDays: 5 },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  db.saveAiCampaign(campaign);

  // If approved, running, or immediate, trigger automation execution in the background
  if (status === 'APPROVED' || status === 'RUNNING' || payload.scheduleType === 'IMMEDIATE') {
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

  const updated = db.updateAiCampaign(restaurantId, campaignId, {
    status: 'APPROVED',
    requiresApproval: false
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Campaign not found.' });
  }

  // Trigger automation processor immediately
  CampaignScheduler.processAutomations().catch(err => {
    console.error('[Campaigns] Immediate approve execution error:', err);
  });

  return res.json({ success: true, message: 'Campaign approved successfully.', campaign: updated });
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

// 11. Automations List (Phase 12, 34, 35)
router.get('/automations', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const automations = db.getAiAutomations(restaurantId);
  return res.json({ success: true, automations });
});

// 12. Create Automation (Phase 12, 13)
router.post('/automations', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { name, trigger, conditions, action, channel, frequencyLimitDays } = req.body;

  if (!name || !trigger) {
    return res.status(400).json({ success: false, message: 'Automation name and trigger are required.' });
  }

  const automation: AiAutomation = {
    id: `auto_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    restaurantId,
    name,
    trigger,
    conditions: conditions || 'Default customer eligibility',
    action: action || 'Send personalized Discount Coin reward',
    channel: channel || 'WHATSAPP',
    frequencyLimitDays: Number(frequencyLimitDays) || 30,
    status: 'ACTIVE',
    customersReached: 0,
    revenueAttributed: 0,
    createdAt: new Date()
  };

  db.saveAiAutomation(automation);
  return res.json({ success: true, message: 'Automation created and activated.', automation });
});

// 13. Toggle Automation Active/Paused
router.put('/automations/:id/toggle', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const automationId = req.params.id as string;

  const existing = db.getAiAutomationById(restaurantId, automationId);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Automation not found.' });
  }

  const nextStatus = existing.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
  const updated = db.updateAiAutomation(restaurantId, automationId, { status: nextStatus });

  return res.json({
    success: true,
    message: `Automation ${nextStatus === 'ACTIVE' ? 'activated' : 'paused'}.`,
    automation: updated
  });
});

// 14. Delete Automation
router.delete('/automations/:id', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const automationId = req.params.id as string;

  const success = db.deleteAiAutomation(restaurantId, automationId);
  return res.json({ success, message: success ? 'Automation archived.' : 'Automation not found.' });
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

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  Play,
  Pause,
  Plus,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Coins,
  Users,
  Settings,
  X,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Edit3,
  Trash2,
  Eye,
  Send,
  Calendar,
  TrendingUp,
  Heart,
  Smile,
  Award,
  Zap,
  MoreVertical,
  ChevronRight,
  Info,
  Check,
  CheckCheck,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import {
  AiAutomation,
  AiAutomationStatus,
  AiAutomationActivityLog,
  MarketingChannelConfig
} from '../../types';

interface AiAutomationsTabProps {
  automations: AiAutomation[];
  channels: MarketingChannelConfig[];
  onRefreshAutomations: () => void;
  onRefreshChannels?: () => void;
  onOpenWhatsAppModal?: () => void;
  isWhatsAppConnected?: boolean;
  whatsAppPhoneNumber?: string | null;
}

type TabView = 'LIST' | 'TEMPLATES' | 'ACTIVITY_LOG';
type FilterStatus = 'ALL' | 'ACTIVE' | 'PAUSED' | 'DRAFT' | 'NEEDS_ATTENTION';
type TimePeriod = '7d' | '30d' | '90d' | 'all';

interface AutomationTemplateRecipe {
  id: string;
  name: string;
  category: 'RETENTION' | 'REPEAT_ORDERS' | 'LOYALTY' | 'FEEDBACK' | 'SPECIAL_OCCASIONS';
  categoryLabel: string;
  businessOutcome: string;
  goal: string;
  triggerSummary: string;
  requiredIntegration: 'WhatsApp' | 'SMS' | 'None';
  difficulty: 'Quick (1 min)' | 'Standard (2 min)';
  triggerType: string;
  triggerValue: number;
  triggerUnit: string;
  targetSegment: string;
  minOrders: number;
  minSpend?: number;
  maxInactiveDays?: number;
  actionType: string;
  offerType: string;
  offerValue: number;
  minOrderValue: number;
  cooldownDays: number;
  messageTemplate: string;
  explanation: string;
}

const TEMPLATE_RECIPES: AutomationTemplateRecipe[] = [
  {
    id: 'tmpl-winback-inactive',
    name: 'Win Back Inactive Customers',
    category: 'RETENTION',
    categoryLabel: 'Customer Retention',
    businessOutcome: 'Re-engage lost diners & generate repeat orders',
    goal: 'Bring back inactive customers',
    triggerSummary: 'No recorded visit or order for 15 days',
    requiredIntegration: 'WhatsApp',
    difficulty: 'Quick (1 min)',
    triggerType: 'INACTIVITY_DAYS',
    triggerValue: 15,
    triggerUnit: 'days',
    targetSegment: 'INACTIVE',
    minOrders: 1,
    maxInactiveDays: 15,
    actionType: 'SEND_MESSAGE_WITH_OFFER',
    offerType: 'DISCOUNT_COINS',
    offerValue: 75,
    minOrderValue: 299,
    cooldownDays: 30,
    messageTemplate: 'Hi {{customer_name}}, we miss seeing you at {{restaurant_name}}! Visit us again this week and enjoy {{offer_details}}. We look forward to serving you!',
    explanation: 'Automatically alerts guests who have not placed an order or dined in for 15 days, rewarding them with Discount Coins.'
  },
  {
    id: 'tmpl-birthday-rewards',
    name: 'Birthday Rewards',
    category: 'SPECIAL_OCCASIONS',
    categoryLabel: 'Special Occasions',
    businessOutcome: 'Delight diners on their birthday & drive group celebrations',
    goal: 'Send birthday offers',
    triggerSummary: 'On customer birthday at 10:00 AM',
    requiredIntegration: 'WhatsApp',
    difficulty: 'Quick (1 min)',
    triggerType: 'BIRTHDAY',
    triggerValue: 0,
    triggerUnit: 'days',
    targetSegment: 'ALL',
    minOrders: 0,
    actionType: 'SEND_MESSAGE_WITH_OFFER',
    offerType: 'DISCOUNT_COINS',
    offerValue: 100,
    minOrderValue: 499,
    cooldownDays: 365,
    messageTemplate: 'Happy Birthday, {{customer_name}}! 🎉 Celebrate your special day at {{restaurant_name}}. We have credited {{offer_details}} to your account. Dine with us and celebrate in style!',
    explanation: 'Sends a warm birthday greeting and birthday treat to customers with birthday records in their CRM profile.'
  },
  {
    id: 'tmpl-post-visit-feedback',
    name: 'Post-Visit Feedback',
    category: 'FEEDBACK',
    categoryLabel: 'Feedback & Reviews',
    businessOutcome: 'Collect 5-star Google reviews & resolve complaints privately',
    goal: 'Collect customer feedback',
    triggerSummary: '2 hours after completed dine-in or takeaway order',
    requiredIntegration: 'WhatsApp',
    difficulty: 'Quick (1 min)',
    triggerType: 'ORDER_COMPLETED',
    triggerValue: 120,
    triggerUnit: 'minutes',
    targetSegment: 'ALL',
    minOrders: 1,
    actionType: 'REQUEST_FEEDBACK',
    offerType: 'NONE',
    offerValue: 0,
    minOrderValue: 0,
    cooldownDays: 7,
    messageTemplate: 'Hi {{customer_name}}, thank you for dining at {{restaurant_name}} today! How was your experience? Tap here to let us know: {{feedback_link}}',
    explanation: 'Requests feedback 2 hours after food service completes, safely ignoring cancelled or refunded orders.'
  },
  {
    id: 'tmpl-thank-you-first-order',
    name: 'Thank Customers After an Order',
    category: 'REPEAT_ORDERS',
    categoryLabel: 'Repeat Orders',
    businessOutcome: 'Turn first-time guests into permanent regular visitors',
    goal: 'Increase repeat orders',
    triggerSummary: 'Immediately after 1st order completed',
    requiredIntegration: 'WhatsApp',
    difficulty: 'Quick (1 min)',
    triggerType: 'FIRST_ORDER',
    triggerValue: 15,
    triggerUnit: 'minutes',
    targetSegment: 'NEW',
    minOrders: 1,
    actionType: 'SEND_MESSAGE_WITH_OFFER',
    offerType: 'DISCOUNT_COINS',
    offerValue: 50,
    minOrderValue: 250,
    cooldownDays: 90,
    messageTemplate: 'Thank you for choosing {{restaurant_name}}, {{customer_name}}! We loved serving you today. As a welcome gift, here are {{offer_details}} for your next visit.',
    explanation: 'Sends an immediate token of appreciation and Welcome Coins to encourage an early second visit.'
  },
  {
    id: 'tmpl-reward-loyal-customers',
    name: 'Reward Loyal Customers',
    category: 'LOYALTY',
    categoryLabel: 'Loyalty & Milestones',
    businessOutcome: 'Foster strong guest loyalty and reward frequency',
    goal: 'Reward loyal customers',
    triggerSummary: 'When customer completes 5 visits or orders',
    requiredIntegration: 'WhatsApp',
    difficulty: 'Standard (2 min)',
    triggerType: 'VISIT_MILESTONE',
    triggerValue: 5,
    triggerUnit: 'visits',
    targetSegment: 'LOYAL',
    minOrders: 5,
    actionType: 'SEND_MESSAGE_WITH_OFFER',
    offerType: 'DISCOUNT_COINS',
    offerValue: 100,
    minOrderValue: 399,
    cooldownDays: 60,
    messageTemplate: 'You are one of our favorite regulars, {{customer_name}}! ⭐ To celebrate your 5th visit at {{restaurant_name}}, we added {{offer_details}} to your rewards balance. See you soon!',
    explanation: 'Automatically identifies when a diner reaches 5 visits and unlocks special loyalty perks.'
  },
  {
    id: 'tmpl-winback-high-value',
    name: 'Win Back High-Value Customers',
    category: 'RETENTION',
    categoryLabel: 'Customer Retention',
    businessOutcome: 'Protect high-spending VIP relationships from churn',
    goal: 'Bring back inactive customers',
    triggerSummary: 'VIP guest (₹3,000+ spend) inactive for 25 days',
    requiredIntegration: 'WhatsApp',
    difficulty: 'Standard (2 min)',
    triggerType: 'INACTIVITY_DAYS',
    triggerValue: 25,
    triggerUnit: 'days',
    targetSegment: 'VIP',
    minOrders: 3,
    minSpend: 3000,
    maxInactiveDays: 25,
    actionType: 'SEND_MESSAGE_WITH_OFFER',
    offerType: 'DISCOUNT_COINS',
    offerValue: 150,
    minOrderValue: 699,
    cooldownDays: 30,
    messageTemplate: 'Dear {{customer_name}}, the team at {{restaurant_name}} truly values having you as a patron. Our chef would love to welcome you back with {{offer_details}} on your next reservation.',
    explanation: 'Targets only top spenders who have gone quiet, offering premium rewards to retain high CLV diners.'
  }
];

export const AiAutomationsTab: React.FC<AiAutomationsTabProps> = ({
  automations,
  onRefreshAutomations,
  onOpenWhatsAppModal,
  isWhatsAppConnected = false,
  whatsAppPhoneNumber
}) => {
  // Navigation & Filtering
  const [currentView, setCurrentView] = useState<TabView>('LIST');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('ALL');

  // Loading States
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'SUCCESS' | 'ERROR' | 'INFO' } | null>(null);

  // Modals & Panels
  const [selectedAutomationForDetails, setSelectedAutomationForDetails] = useState<AiAutomation | null>(null);
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [wizardMode, setWizardMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [editingAutomationId, setEditingAutomationId] = useState<string | null>(null);
  const [testResultModal, setTestResultModal] = useState<{
    open: boolean;
    preview?: {
      recipientName: string;
      recipientPhone: string;
      channel: string;
      isChannelReady: boolean;
      renderedMessage: string;
    };
  }>({ open: false });

  // Wizard Step State (1 through 7)
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardGoal, setWizardGoal] = useState<string>('Bring back inactive customers');
  const [wizardName, setWizardName] = useState<string>('');
  const [wizardDescription, setWizardDescription] = useState<string>('');
  const [wizardCategory, setWizardCategory] = useState<string>('RETENTION');

  // Step 2: Trigger
  const [wizardTriggerType, setWizardTriggerType] = useState<string>('INACTIVITY_DAYS');
  const [wizardTriggerValue, setWizardTriggerValue] = useState<number>(15);
  const [wizardTriggerUnit, setWizardTriggerUnit] = useState<string>('days');

  // Step 3: Audience
  const [wizardAudienceSegment, setWizardAudienceSegment] = useState<string>('INACTIVE');
  const [wizardMinOrders, setWizardMinOrders] = useState<number>(1);
  const [wizardMinSpend, setWizardMinSpend] = useState<number>(0);
  const [liveEligibleCount, setLiveEligibleCount] = useState<number | null>(null);
  const [liveEstimating, setLiveEstimating] = useState<boolean>(false);

  // Step 4: Action & Channel
  const [wizardChannel, setWizardChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [wizardActionType, setWizardActionType] = useState<string>('SEND_MESSAGE_WITH_OFFER');

  // Step 5: Message & Offer
  const [wizardOfferType, setWizardOfferType] = useState<string>('DISCOUNT_COINS');
  const [wizardOfferValue, setWizardOfferValue] = useState<number>(75);
  const [wizardMinOrderValue, setWizardMinOrderValue] = useState<number>(299);
  const [wizardValidityDays, setWizardValidityDays] = useState<number>(7);
  const [wizardFeedbackUrl, setWizardFeedbackUrl] = useState<string>('https://swaadsevak.com/feedback');
  const [wizardMessageTemplate, setWizardMessageTemplate] = useState<string>(
    'Hi {{customer_name}}, we miss seeing you at {{restaurant_name}}! Visit us again this week and enjoy {{offer_details}}. We look forward to serving you!'
  );

  // Step 6: Timing & Frequency
  const [wizardDelayMinutes, setWizardDelayMinutes] = useState<number>(0);
  const [wizardCooldownDays, setWizardCooldownDays] = useState<number>(30);
  const [wizardQuietHoursEnabled, setWizardQuietHoursEnabled] = useState<boolean>(true);
  const [wizardQuietHoursStart, setWizardQuietHoursStart] = useState<string>('10:00');
  const [wizardQuietHoursEnd, setWizardQuietHoursEnd] = useState<string>('21:30');

  // Save State
  const [wizardSaving, setWizardSaving] = useState<boolean>(false);
  const [wizardError, setWizardError] = useState<string>('');

  // Delete Confirm Dialog
  const [automationToDelete, setAutomationToDelete] = useState<AiAutomation | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Real Metric Values (fetched from actual backend records)
  const [backendMetrics, setBackendMetrics] = useState<{
    activeAutomations: number;
    messagesSent: number;
    customersReached: number;
    revenueAttributed: number;
  }>({
    activeAutomations: 0,
    messagesSent: 0,
    customersReached: 0,
    revenueAttributed: 0
  });

  const showToast = (text: string, type: 'SUCCESS' | 'ERROR' | 'INFO' = 'SUCCESS') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch metrics and fresh automations on mount & period change
  const fetchOverviewMetrics = async (period: TimePeriod) => {
    setMetricsLoading(true);
    try {
      const res = await api.getAiAutomations(period);
      if (res.success && res.metrics) {
        setBackendMetrics(res.metrics);
      }
    } catch {
      // Fallback: derive metrics from prop automations if offline
      const active = automations.filter(a => a.status === 'ACTIVE').length;
      const sent = automations.reduce((sum, a) => sum + (a.messagesSent ?? a.customersReached ?? 0), 0);
      const reached = automations.reduce((sum, a) => sum + (a.customersReached ?? 0), 0);
      const rev = automations.reduce((sum, a) => sum + (a.revenueAttributed ?? 0), 0);
      setBackendMetrics({
        activeAutomations: active,
        messagesSent: sent,
        customersReached: reached,
        revenueAttributed: rev
      });
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewMetrics(selectedPeriod);
  }, [selectedPeriod, automations]);

  // Live estimate audience count in wizard Step 3
  useEffect(() => {
    if (showWizard && wizardStep === 3) {
      let cancelled = false;
      setLiveEstimating(true);
      api.estimateAutomationAudience({
        triggerConfig: { type: wizardTriggerType, value: wizardTriggerValue },
        audienceConfig: {
          segment: wizardAudienceSegment,
          minOrders: wizardMinOrders,
          minSpend: wizardMinSpend,
          vipOnly: wizardAudienceSegment === 'VIP'
        }
      })
        .then(res => {
          if (!cancelled && res.success) {
            setLiveEligibleCount(res.eligibleCount);
          }
        })
        .catch(() => {
          if (!cancelled) setLiveEligibleCount(null);
        })
        .finally(() => {
          if (!cancelled) setLiveEstimating(false);
        });

      return () => {
        cancelled = true;
      };
    }
  }, [showWizard, wizardStep, wizardTriggerType, wizardTriggerValue, wizardAudienceSegment, wizardMinOrders, wizardMinSpend]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter and search automations
  const filteredAutomations = useMemo(() => {
    return automations.filter(auto => {
      // Status filter
      if (statusFilter !== 'ALL') {
        if (auto.status !== statusFilter) return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = auto.name.toLowerCase().includes(query);
        const matchesDesc = (auto.description || '').toLowerCase().includes(query);
        const matchesTrigger = (auto.trigger || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesTrigger) return false;
      }
      return true;
    });
  }, [automations, statusFilter, searchQuery]);

  // Aggregate Activity Logs across all automations for the Activity Log tab
  const allActivityLogs = useMemo(() => {
    const logs: Array<AiAutomationActivityLog & { automationName: string; automationId: string }> = [];
    for (const a of automations) {
      if (a.activityLog && Array.isArray(a.activityLog)) {
        for (const log of a.activityLog) {
          logs.push({
            ...log,
            automationName: a.name,
            automationId: a.id
          });
        }
      }
    }
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [automations]);

  // Toggle Pause/Resume
  const handleToggle = async (auto: AiAutomation) => {
    setActionLoadingId(auto.id);
    try {
      const res = await api.toggleAiAutomation(auto.id);
      if (res.success) {
        showToast(res.message, 'SUCCESS');
        onRefreshAutomations();
      } else {
        showToast(res.message || 'Failed to update status', 'ERROR');
      }
    } catch {
      showToast('Network error while toggling automation', 'ERROR');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Duplicate
  const handleDuplicate = async (auto: AiAutomation) => {
    setActionLoadingId(auto.id);
    try {
      const res = await api.duplicateAiAutomation(auto.id);
      if (res.success) {
        showToast(`Duplicated "${auto.name}" as draft`, 'SUCCESS');
        onRefreshAutomations();
      } else {
        showToast(res.message || 'Failed to duplicate automation', 'ERROR');
      }
    } catch {
      showToast('Network error duplicating automation', 'ERROR');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Safe Test Run / Dry-Run
  const handleTestRun = async (auto: AiAutomation) => {
    setActionLoadingId(auto.id);
    try {
      const res = await api.testAiAutomation(auto.id);
      if (res.success && res.preview) {
        setTestResultModal({
          open: true,
          preview: res.preview
        });
        showToast('Safe test simulation executed successfully', 'SUCCESS');
      } else {
        showToast(res.message || 'Simulation test failed', 'ERROR');
      }
    } catch {
      showToast('Error executing automation test', 'ERROR');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!automationToDelete) return;
    setDeleting(true);
    try {
      const res = await api.deleteAiAutomation(automationToDelete.id);
      if (res.success) {
        showToast(`Deleted "${automationToDelete.name}"`, 'SUCCESS');
        setAutomationToDelete(null);
        if (selectedAutomationForDetails?.id === automationToDelete.id) {
          setSelectedAutomationForDetails(null);
        }
        onRefreshAutomations();
      } else {
        showToast(res.message || 'Failed to delete automation', 'ERROR');
      }
    } catch {
      showToast('Error deleting automation', 'ERROR');
    } finally {
      setDeleting(false);
    }
  };

  // Launch Wizard from scratch
  const handleStartCreate = () => {
    setWizardMode('CREATE');
    setEditingAutomationId(null);
    setWizardStep(1);
    setWizardGoal('Bring back inactive customers');
    setWizardName('');
    setWizardDescription('');
    setWizardCategory('RETENTION');
    setWizardTriggerType('INACTIVITY_DAYS');
    setWizardTriggerValue(15);
    setWizardTriggerUnit('days');
    setWizardAudienceSegment('INACTIVE');
    setWizardMinOrders(1);
    setWizardMinSpend(0);
    setWizardChannel('WHATSAPP');
    setWizardActionType('SEND_MESSAGE_WITH_OFFER');
    setWizardOfferType('DISCOUNT_COINS');
    setWizardOfferValue(75);
    setWizardMinOrderValue(299);
    setWizardValidityDays(7);
    setWizardMessageTemplate('Hi {{customer_name}}, we miss seeing you at {{restaurant_name}}! Visit us again this week and enjoy {{offer_details}}. We look forward to serving you!');
    setWizardDelayMinutes(0);
    setWizardCooldownDays(30);
    setWizardQuietHoursEnabled(true);
    setWizardQuietHoursStart('10:00');
    setWizardQuietHoursEnd('21:30');
    setWizardError('');
    setShowWizard(true);
  };

  // Launch Wizard from a Template Recipe
  const handleUseTemplate = (recipe: AutomationTemplateRecipe) => {
    setWizardMode('CREATE');
    setEditingAutomationId(null);
    setWizardStep(2); // Start at Trigger step since goal is pre-picked
    setWizardGoal(recipe.goal);
    setWizardName(recipe.name);
    setWizardDescription(recipe.explanation);
    setWizardCategory(recipe.category);
    setWizardTriggerType(recipe.triggerType);
    setWizardTriggerValue(recipe.triggerValue);
    setWizardTriggerUnit(recipe.triggerUnit);
    setWizardAudienceSegment(recipe.targetSegment);
    setWizardMinOrders(recipe.minOrders);
    setWizardMinSpend(recipe.minSpend || 0);
    setWizardChannel('WHATSAPP');
    setWizardActionType(recipe.actionType);
    setWizardOfferType(recipe.offerType);
    setWizardOfferValue(recipe.offerValue);
    setWizardMinOrderValue(recipe.minOrderValue);
    setWizardValidityDays(7);
    setWizardMessageTemplate(recipe.messageTemplate);
    setWizardDelayMinutes(recipe.triggerType === 'ORDER_COMPLETED' ? 120 : 0);
    setWizardCooldownDays(recipe.cooldownDays);
    setWizardQuietHoursEnabled(true);
    setWizardQuietHoursStart('10:00');
    setWizardQuietHoursEnd('21:30');
    setWizardError('');
    setShowWizard(true);
  };

  // Launch Wizard to Edit Existing Automation
  const handleEdit = (auto: AiAutomation) => {
    setWizardMode('EDIT');
    setEditingAutomationId(auto.id);
    setWizardStep(1);
    setWizardGoal(auto.goal || 'Engage customers');
    setWizardName(auto.name);
    setWizardDescription(auto.description || '');
    setWizardCategory(auto.category || 'RETENTION');
    setWizardTriggerType(auto.triggerConfig?.type || 'INACTIVITY_DAYS');
    setWizardTriggerValue(auto.triggerConfig?.value || 15);
    setWizardTriggerUnit(auto.triggerConfig?.unit || 'days');
    setWizardAudienceSegment(auto.audienceConfig?.segment || 'ALL');
    setWizardMinOrders(auto.audienceConfig?.minOrders ?? 1);
    setWizardMinSpend(auto.audienceConfig?.minSpend ?? 0);
    setWizardChannel((auto.channel as any) || 'WHATSAPP');
    setWizardActionType(auto.actionConfig?.type || 'SEND_MESSAGE_WITH_OFFER');
    setWizardOfferType(auto.actionConfig?.offerType || 'DISCOUNT_COINS');
    setWizardOfferValue(auto.actionConfig?.offerValue ?? 50);
    setWizardMinOrderValue(auto.actionConfig?.minOrderValue ?? 299);
    setWizardValidityDays(auto.actionConfig?.validityDays ?? 7);
    setWizardFeedbackUrl(auto.actionConfig?.feedbackUrl || 'https://swaadsevak.com/feedback');
    setWizardMessageTemplate(auto.actionConfig?.messageTemplate || 'Hi {{customer_name}}, we miss seeing you at {{restaurant_name}}!');
    setWizardDelayMinutes(auto.timingConfig?.delayMinutes ?? 0);
    setWizardCooldownDays(auto.timingConfig?.cooldownDays ?? auto.frequencyLimitDays ?? 30);
    setWizardQuietHoursEnabled(auto.timingConfig?.quietHoursEnabled ?? true);
    setWizardQuietHoursStart(auto.timingConfig?.quietHoursStart || '10:00');
    setWizardQuietHoursEnd(auto.timingConfig?.quietHoursEnd || '21:30');
    setWizardError('');
    setShowWizard(true);
  };

  // Finish Wizard (Save Draft or Activate)
  const handleSaveWizard = async (targetStatus: 'ACTIVE' | 'DRAFT') => {
    if (!wizardName.trim()) {
      setWizardError('Please give this automation a recognizable name.');
      setWizardStep(1);
      return;
    }

    setWizardSaving(true);
    setWizardError('');

    const triggerDescription =
      wizardTriggerType === 'INACTIVITY_DAYS'
        ? `No recorded visit or order for ${wizardTriggerValue} days`
        : wizardTriggerType === 'BIRTHDAY'
        ? 'Customer birthday matching today'
        : wizardTriggerType === 'ORDER_COMPLETED'
        ? `${wizardDelayMinutes} minutes after completed order`
        : wizardTriggerType === 'FIRST_ORDER'
        ? 'Immediately after 1st order completed'
        : wizardTriggerType === 'VISIT_MILESTONE'
        ? `Completed visit milestone reaches ${wizardTriggerValue}`
        : 'Customer trigger event';

    const actionDescription =
      wizardActionType === 'REQUEST_FEEDBACK'
        ? 'Send friendly feedback link'
        : `Send ${wizardOfferValue} Discount Coins + personalized message`;

    const payload: Partial<AiAutomation> = {
      name: wizardName.trim(),
      description: wizardDescription.trim() || `Automated workflow to ${wizardGoal.toLowerCase()}`,
      category: wizardCategory,
      goal: wizardGoal,
      trigger: triggerDescription,
      conditions: `Target segment: ${wizardAudienceSegment}, Min orders: ${wizardMinOrders}`,
      action: actionDescription,
      channel: wizardChannel,
      frequencyLimitDays: wizardCooldownDays,
      status: targetStatus,
      triggerConfig: {
        type: wizardTriggerType,
        value: wizardTriggerValue,
        unit: wizardTriggerUnit,
        description: triggerDescription
      },
      audienceConfig: {
        segment: wizardAudienceSegment,
        minOrders: wizardMinOrders,
        minSpend: wizardMinSpend,
        vipOnly: wizardAudienceSegment === 'VIP'
      },
      actionConfig: {
        type: wizardActionType,
        messageTemplate: wizardMessageTemplate,
        offerType: wizardOfferType,
        offerValue: wizardOfferValue,
        minOrderValue: wizardMinOrderValue,
        validityDays: wizardValidityDays,
        feedbackUrl: wizardFeedbackUrl
      },
      timingConfig: {
        delayMinutes: wizardDelayMinutes,
        quietHoursEnabled: wizardQuietHoursEnabled,
        quietHoursStart: wizardQuietHoursStart,
        quietHoursEnd: wizardQuietHoursEnd,
        cooldownDays: wizardCooldownDays
      }
    };

    try {
      if (wizardMode === 'EDIT' && editingAutomationId) {
        const res = await api.updateAiAutomation(editingAutomationId, payload);
        if (res.success) {
          showToast(`Automation "${payload.name}" updated successfully`, 'SUCCESS');
          setShowWizard(false);
          onRefreshAutomations();
        } else {
          setWizardError(res.message || 'Failed to update automation');
        }
      } else {
        const res = await api.createAiAutomation(payload);
        if (res.success) {
          showToast(res.message || 'Automation created successfully', 'SUCCESS');
          setShowWizard(false);
          onRefreshAutomations();
        } else {
          setWizardError(res.message || 'Failed to create automation');
        }
      }
    } catch {
      setWizardError('Failed to communicate with server. Please try again.');
    } finally {
      setWizardSaving(false);
    }
  };

  // Helper: Live Preview text formatting
  const livePreviewRendered = useMemo(() => {
    let text = wizardMessageTemplate || '';
    const offerText =
      wizardOfferType === 'FREE_ITEM'
        ? 'a Complimentary Appetizer'
        : `${wizardOfferValue} Discount Coins`;
    text = text
      .replace(/\{\{\s*customer_name\s*\}\}/gi, 'Rahul')
      .replace(/\{\{\s*restaurant_name\s*\}\}/gi, 'SwaadSevak Café')
      .replace(/\{\{\s*offer_details\s*\}\}/gi, offerText)
      .replace(/\{\{\s*feedback_link\s*\}\}/gi, wizardFeedbackUrl);
    return text;
  }, [wizardMessageTemplate, wizardOfferType, wizardOfferValue, wizardFeedbackUrl]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-semibold transition-all animate-in fade-in slide-in-from-bottom-5 ${
            toastMessage.type === 'SUCCESS'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-700'
              : toastMessage.type === 'ERROR'
              ? 'bg-rose-950 text-rose-100 border-rose-700'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}
        >
          {toastMessage.type === 'SUCCESS' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          {toastMessage.type === 'ERROR' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
          {toastMessage.type === 'INFO' && <Info className="w-4 h-4 text-sky-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 2.A Page Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Automations
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Protection
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Turn customer activity into repeat visits automatically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Channel Link Badge */}
          {onOpenWhatsAppModal && (
            <button
              onClick={onOpenWhatsAppModal}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isWhatsAppConnected
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              <Smartphone className={`w-3.5 h-3.5 ${isWhatsAppConnected ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span>
                {isWhatsAppConnected ? `WhatsApp: ${whatsAppPhoneNumber || 'Connected'}` : 'Connect WhatsApp'}
              </span>
            </button>
          )}

          {/* Secondary Action: Automation Templates */}
          <button
            onClick={() => setCurrentView('TEMPLATES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              currentView === 'TEMPLATES'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Automation Templates</span>
          </button>

          {/* Primary CTA: + Create Automation */}
          <button
            onClick={handleStartCreate}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Automation</span>
          </button>
        </div>
      </div>

      {/* View Switcher Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('LIST')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentView === 'LIST'
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Automations ({automations.length})
          </button>
          <button
            onClick={() => setCurrentView('TEMPLATES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentView === 'TEMPLATES'
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Templates Library ({TEMPLATE_RECIPES.length})
          </button>
          <button
            onClick={() => setCurrentView('ACTIVITY_LOG')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentView === 'ACTIVITY_LOG'
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Activity Log
          </button>
        </div>

        {/* Time Period Filter for Dashboard Metrics */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
          {(['7d', '30d', '90d', 'all'] as TimePeriod[]).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                selectedPeriod === period ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              {period === '7d' ? '7D' : period === '30d' ? '30D' : period === '90d' ? '90D' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* 2.B Automation Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Automations */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Automations</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {metricsLoading ? '...' : backendMetrics.activeAutomations}
            </span>
            <span className="text-[11px] text-slate-400">of {automations.length} total</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Currently running</p>
        </div>

        {/* Card 2: Messages Sent */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Messages Sent</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {metricsLoading ? '...' : backendMetrics.messagesSent.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">Delivered</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Last {selectedPeriod.toUpperCase()}</p>
        </div>

        {/* Card 3: Customers Reached */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customers Reached</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {metricsLoading ? '...' : backendMetrics.customersReached.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400">unique diners</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Qualified & engaged</p>
        </div>

        {/* Card 4: Revenue Attributed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Revenue Attributed</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">
              {metricsLoading ? '...' : formatCurrency(backendMetrics.revenueAttributed)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">From automated triggers</p>
        </div>
      </div>

      {/* Disconnected Provider Alert Banner if WhatsApp not linked */}
      {!isWhatsAppConnected && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-amber-950">
                WhatsApp Messaging Gateway is Disconnected
              </p>
              <p className="text-amber-800 text-[11px]">
                WhatsApp automations require a connected session to dispatch messages to your customers.
              </p>
            </div>
          </div>
          {onOpenWhatsAppModal && (
            <button
              onClick={onOpenWhatsAppModal}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              Link WhatsApp Session
            </button>
          )}
        </div>
      )}

      {/* VIEW: MY AUTOMATIONS LIST */}
      {currentView === 'LIST' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search automations by name, trigger, or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
              {(['ALL', 'ACTIVE', 'PAUSED', 'DRAFT', 'NEEDS_ATTENTION'] as FilterStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {status === 'ALL'
                    ? 'All'
                    : status === 'ACTIVE'
                    ? 'Active'
                    : status === 'PAUSED'
                    ? 'Paused'
                    : status === 'DRAFT'
                    ? 'Draft'
                    : 'Needs Attention'}
                </button>
              ))}
            </div>
          </div>

          {/* 2.D Smart Empty State (when 0 automations match or exist) */}
          {filteredAutomations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Your customers can come back automatically.
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                Create simple automated campaigns to win back inactive customers, reward loyal guests, and collect feedback after visits.
              </p>

              <div className="flex items-center justify-center gap-3 mb-8">
                <button
                  onClick={handleStartCreate}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Automation</span>
                </button>
                <button
                  onClick={() => setCurrentView('TEMPLATES')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Explore Templates</span>
                </button>
              </div>

              {/* 3 Recommended Starter Cards */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Recommended Starting Recipes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
                  {TEMPLATE_RECIPES.slice(0, 3).map(recipe => (
                    <div
                      key={recipe.id}
                      onClick={() => handleUseTemplate(recipe)}
                      className="p-4 rounded-xl border border-slate-200 hover:border-orange-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                          {recipe.categoryLabel}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                      </div>
                      <h5 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors">
                        {recipe.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {recipe.businessOutcome}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 2.C Automation Management List */
            <div className="space-y-3">
              {filteredAutomations.map(auto => {
                const isActive = auto.status === 'ACTIVE';
                const isPaused = auto.status === 'PAUSED';
                const isDraft = auto.status === 'DRAFT';
                const isNeedsAttention = auto.status === 'NEEDS_ATTENTION';

                return (
                  <div
                    key={auto.id}
                    className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Info, Trigger, Status */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 truncate">
                          {auto.name}
                        </h3>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isPaused
                              ? 'bg-slate-100 text-slate-700 border border-slate-300'
                              : isDraft
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive
                                ? 'bg-emerald-500 animate-pulse'
                                : isPaused
                                ? 'bg-slate-400'
                                : isDraft
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          <span>
                            {isActive
                              ? 'Active'
                              : isPaused
                              ? 'Paused'
                              : isDraft
                              ? 'Draft'
                              : 'Needs Attention'}
                          </span>
                        </span>

                        {/* Channel Badge */}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-emerald-600" />
                          <span>{auto.channel}</span>
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {auto.description || auto.action}
                      </p>

                      {/* Trigger condition & warning */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <strong>Trigger:</strong> {auto.trigger}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                          <strong>Cooldown:</strong> {auto.frequencyLimitDays}d
                        </span>
                      </div>

                      {/* Needs Attention Alert Message if present */}
                      {auto.statusReason && (
                        <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{auto.statusReason}</span>
                        </p>
                      )}
                    </div>

                    {/* Middle: Performance Counters */}
                    <div className="flex items-center gap-5 shrink-0 py-2 md:py-0 border-y md:border-y-0 md:border-x border-slate-100 px-0 md:px-5">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Customers Processed</span>
                        <span className="font-black text-slate-900 text-sm">
                          {auto.customersReached || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Messages Sent</span>
                        <span className="font-black text-slate-900 text-sm">
                          {auto.messagesSent ?? auto.customersReached ?? 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Attributed Revenue</span>
                        <span className="font-black text-emerald-700 text-sm">
                          {formatCurrency(auto.revenueAttributed || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {/* Toggle Active / Pause */}
                      <button
                        onClick={() => handleToggle(auto)}
                        disabled={actionLoadingId === auto.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
                          isActive
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>

                      {/* View Performance / Details */}
                      <button
                        onClick={() => setSelectedAutomationForDetails(auto)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="View Performance & Audit"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(auto)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Edit Automation"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Test simulation */}
                      <button
                        onClick={() => handleTestRun(auto)}
                        disabled={actionLoadingId === auto.id}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                        title="Safe Dry-Run Test"
                      >
                        <Send className="w-4 h-4" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(auto)}
                        disabled={actionLoadingId === auto.id}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                        title="Duplicate as Draft"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setAutomationToDelete(auto)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                        title="Delete Automation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW: TEMPLATES LIBRARY */}
      {currentView === 'TEMPLATES' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Ready-To-Use Restaurant Automation Recipes
              </h2>
              <p className="text-xs text-slate-500">
                Tested campaigns to boost repeat visits without needing any technical configuration.
              </p>
            </div>

            {/* Template Category Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto text-xs">
              {['ALL', 'RETENTION', 'REPEAT_ORDERS', 'LOYALTY', 'FEEDBACK', 'SPECIAL_OCCASIONS'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setTemplateCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    templateCategoryFilter === cat
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'ALL'
                    ? 'All Recipes'
                    : cat === 'RETENTION'
                    ? 'Retention'
                    : cat === 'REPEAT_ORDERS'
                    ? 'Repeat Orders'
                    : cat === 'LOYALTY'
                    ? 'Loyalty'
                    : cat === 'FEEDBACK'
                    ? 'Feedback'
                    : 'Birthdays'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATE_RECIPES.filter(recipe => {
              if (templateCategoryFilter !== 'ALL' && recipe.category !== templateCategoryFilter) {
                return false;
              }
              return true;
            }).map(recipe => (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-orange-400 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {recipe.categoryLabel}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {recipe.difficulty}
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                    {recipe.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {recipe.explanation}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400 uppercase text-[10px] w-14 shrink-0">Trigger:</span>
                      <span className="text-slate-800 font-medium text-[11px] truncate">
                        {recipe.triggerSummary}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400 uppercase text-[10px] w-14 shrink-0">Channel:</span>
                      <span className="text-slate-800 font-medium text-[11px]">
                        {recipe.requiredIntegration} (Verified)
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUseTemplate(recipe)}
                  className="w-full py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white font-bold text-xs border border-orange-200 hover:border-orange-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Use Recipe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: ACTIVITY LOG TAB */}
      {currentView === 'ACTIVITY_LOG' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-sm text-slate-900">
                System Execution & Delivery Audit Log
              </h3>
              <p className="text-xs text-slate-500">
                Chronological record of triggers detected, customer qualification, and messaging outcomes.
              </p>
            </div>
            <button
              onClick={onRefreshAutomations}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Refresh Activity Log"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {allActivityLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No recent automated triggers recorded yet. Once an automation runs, execution events will appear here.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-2">
              {allActivityLogs.map(log => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        log.type === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-600'
                          : log.type === 'WARNING'
                          ? 'bg-amber-100 text-amber-600'
                          : log.type === 'ERROR'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-sky-100 text-sky-600'
                      }`}
                    >
                      {log.type === 'SUCCESS' && <Check className="w-3.5 h-3.5" />}
                      {log.type === 'WARNING' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {log.type === 'ERROR' && <X className="w-3.5 h-3.5" />}
                      {log.type === 'INFO' && <Info className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.event}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                          {log.automationName}
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-slate-500 text-[11px] mt-0.5">{log.details}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. SEVEN-STEP AUTOMATION CREATION & EDIT WIZARD MODAL */}
      {showWizard &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
              {/* Wizard Modal Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-600" />
                    <h2 className="font-black text-base text-slate-900">
                      {wizardMode === 'EDIT' ? 'Edit Automation' : 'Create Automation'}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Step {wizardStep} of 7: {
                      wizardStep === 1
                        ? 'Choose the goal'
                        : wizardStep === 2
                        ? 'Configure the trigger'
                        : wizardStep === 3
                        ? 'Select the audience'
                        : wizardStep === 4
                        ? 'Configure the action'
                        : wizardStep === 5
                        ? 'Customize the message'
                        : wizardStep === 6
                        ? 'Set timing and frequency'
                        : 'Review and activate'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setShowWizard(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Dots */}
              <div className="grid grid-cols-7 gap-1 px-5 pt-3">
                {[1, 2, 3, 4, 5, 6, 7].map(s => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all ${
                      s === wizardStep
                        ? 'bg-orange-600'
                        : s < wizardStep
                        ? 'bg-emerald-500'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Wizard Body Steps */}
              <div className="p-5 sm:p-6 space-y-5 flex-1">
                {wizardError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{wizardError}</span>
                  </div>
                )}

                {/* STEP 1: CHOOSE THE GOAL */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        What do you want this automation to achieve?
                      </label>
                      <p className="text-xs text-slate-500 mb-3">
                        Select a clear business objective for your restaurant.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          goal: 'Bring back inactive customers',
                          icon: TrendingUp,
                          category: 'RETENTION',
                          desc: 'Target guests who haven’t visited in 15+ days'
                        },
                        {
                          goal: 'Increase repeat orders',
                          icon: RepeatIcon,
                          category: 'REPEAT_ORDERS',
                          desc: 'Prompt 2nd order right after the first visit'
                        },
                        {
                          goal: 'Reward loyal customers',
                          icon: Award,
                          category: 'LOYALTY',
                          desc: 'Unlock milestone coins when visits reach 5+'
                        },
                        {
                          goal: 'Collect customer feedback',
                          icon: Smile,
                          category: 'FEEDBACK',
                          desc: 'Send post-dining review prompt safely'
                        },
                        {
                          goal: 'Send birthday offers',
                          icon: Heart,
                          category: 'SPECIAL_OCCASIONS',
                          desc: 'Deliver a birthday greeting and special offer'
                        }
                      ].map(item => (
                        <div
                          key={item.goal}
                          onClick={() => {
                            setWizardGoal(item.goal);
                            setWizardCategory(item.category);
                            if (!wizardName) setWizardName(item.goal);
                          }}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            wizardGoal === item.goal
                              ? 'border-orange-600 bg-orange-50/60 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-xs text-slate-900">{item.goal}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Automation Name
                      </label>
                      <input
                        type="text"
                        value={wizardName}
                        onChange={e => setWizardName(e.target.value)}
                        placeholder="e.g. 15-Day Inactive Win-Back"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: CONFIGURE THE TRIGGER */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        When should this automation run?
                      </label>
                      <p className="text-xs text-slate-500 mb-3">
                        Set the triggering condition in plain everyday language.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                        <label className="font-bold text-slate-800 block">Triggering Event</label>
                        <select
                          value={wizardTriggerType}
                          onChange={e => {
                            setWizardTriggerType(e.target.value);
                            if (e.target.value === 'INACTIVITY_DAYS') setWizardTriggerValue(15);
                            if (e.target.value === 'VISIT_MILESTONE') setWizardTriggerValue(5);
                            if (e.target.value === 'ORDER_COMPLETED') setWizardDelayMinutes(120);
                          }}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                        >
                          <option value="INACTIVITY_DAYS">When a customer becomes inactive</option>
                          <option value="ORDER_COMPLETED">When an order is completed</option>
                          <option value="BIRTHDAY">On a customer's birthday</option>
                          <option value="VISIT_MILESTONE">When a customer reaches a visit milestone</option>
                          <option value="FIRST_ORDER">Immediately after first completed order</option>
                        </select>

                        {/* Parameter based on selected trigger */}
                        {wizardTriggerType === 'INACTIVITY_DAYS' && (
                          <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                              Inactivity Period (Days without order or visit)
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                              {[7, 15, 30, 60].map(days => (
                                <button
                                  key={days}
                                  type="button"
                                  onClick={() => setWizardTriggerValue(days)}
                                  className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                    wizardTriggerValue === days
                                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {days} Days
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {wizardTriggerType === 'VISIT_MILESTONE' && (
                          <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                              Milestone Visit Threshold
                            </label>
                            <input
                              type="number"
                              min={2}
                              max={50}
                              value={wizardTriggerValue}
                              onChange={e => setWizardTriggerValue(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                            />
                          </div>
                        )}

                        {wizardTriggerType === 'ORDER_COMPLETED' && (
                          <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                              Delay after order completion
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { min: 30, label: '30 mins' },
                                { min: 120, label: '2 hours' },
                                { min: 1440, label: 'Next morning' }
                              ].map(opt => (
                                <button
                                  key={opt.min}
                                  type="button"
                                  onClick={() => setWizardDelayMinutes(opt.min)}
                                  className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                    wizardDelayMinutes === opt.min
                                      ? 'bg-orange-600 text-white border-orange-600'
                                      : 'bg-white text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: SELECT THE AUDIENCE */}
                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Who should be targeted?
                      </label>
                      <p className="text-xs text-slate-500 mb-3">
                        Filter which diners qualify based on real CRM purchase patterns.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-1">
                          Customer Segment
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'ALL', label: 'All Customers' },
                            { id: 'INACTIVE', label: 'Inactive Only' },
                            { id: 'LOYAL', label: 'Loyal Diners (3+ visits)' },
                            { id: 'VIP', label: 'VIP (High spenders)' }
                          ].map(seg => (
                            <button
                              key={seg.id}
                              type="button"
                              onClick={() => setWizardAudienceSegment(seg.id)}
                              className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                                wizardAudienceSegment === seg.id
                                  ? 'bg-orange-50 text-orange-800 border-orange-500 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {seg.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="font-semibold text-xs text-slate-700 block mb-1">
                            Min Completed Orders
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={wizardMinOrders}
                            onChange={e => setWizardMinOrders(Number(e.target.value))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-xs text-slate-700 block mb-1">
                            Min Spend Threshold (₹)
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={wizardMinSpend}
                            onChange={e => setWizardMinSpend(Number(e.target.value))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Live Audience Count from Real CRM Records */}
                      <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs mt-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-400" />
                          <span>Estimated Currently Eligible in CRM:</span>
                        </div>
                        <span className="font-black text-emerald-400 text-sm">
                          {liveEstimating
                            ? 'Calculating...'
                            : liveEligibleCount !== null
                            ? `${liveEligibleCount} guests`
                            : 'All eligible'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: CONFIGURE THE ACTION */}
                {wizardStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        What should SwaadSevak do?
                      </label>
                      <p className="text-xs text-slate-500 mb-3">
                        Choose the communication channel and action payload.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="font-bold text-xs text-slate-700 block mb-2">
                          Delivery Channel
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div
                            onClick={() => setWizardChannel('WHATSAPP')}
                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                              wizardChannel === 'WHATSAPP'
                                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                <Smartphone className="w-4 h-4 text-emerald-600" />
                                WhatsApp
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isWhatsAppConnected
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {isWhatsAppConnected ? 'Connected' : 'Not Connected'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Instant direct message to the customer's WhatsApp chat.
                            </p>
                          </div>

                          <div
                            onClick={() => setWizardChannel('SMS')}
                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                              wizardChannel === 'SMS'
                                ? 'border-sky-600 bg-sky-50/50 shadow-xs'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-slate-900">SMS Gateway</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                Fallback
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Standard 160-character cellular SMS.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Provider Alert if WhatsApp chosen but disconnected */}
                      {wizardChannel === 'WHATSAPP' && !isWhatsAppConnected && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                              WhatsApp is not connected. You can save as a draft, or connect now.
                            </span>
                          </div>
                          {onOpenWhatsAppModal && (
                            <button
                              type="button"
                              onClick={onOpenWhatsAppModal}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-[11px] shrink-0"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 5: CUSTOMIZE THE MESSAGE */}
                {wizardStep === 5 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Customize the Message & Offer
                      </label>
                      <p className="text-xs text-slate-500 mb-2">
                        Insert variables to personalize messages for each guest.
                      </p>
                    </div>

                    {/* Offer Controls */}
                    <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Incentive Type</label>
                        <select
                          value={wizardOfferType}
                          onChange={e => setWizardOfferType(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="DISCOUNT_COINS">Discount Coins</option>
                          <option value="FREE_ITEM">Free Complimentary Item</option>
                          <option value="NONE">No Discount (Greeting only)</option>
                        </select>
                      </div>

                      {wizardOfferType === 'DISCOUNT_COINS' && (
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Coin Value</label>
                          <input
                            type="number"
                            min={10}
                            step={5}
                            value={wizardOfferValue}
                            onChange={e => setWizardOfferValue(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      )}

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Min Order (₹)</label>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={wizardMinOrderValue}
                          onChange={e => setWizardMinOrderValue(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* Message Template Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-xs text-slate-700">Message Content</label>
                        <span className="text-[10px] text-slate-400">
                          {wizardMessageTemplate.length} characters
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={wizardMessageTemplate}
                        onChange={e => setWizardMessageTemplate(e.target.value)}
                        className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-sans"
                      />

                      {/* Variable Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-bold text-slate-400">Insert tag:</span>
                        {[
                          { tag: '{{customer_name}}', label: 'Guest Name' },
                          { tag: '{{restaurant_name}}', label: 'Café Name' },
                          { tag: '{{offer_details}}', label: 'Offer Perk' },
                          { tag: '{{feedback_link}}', label: 'Review Link' }
                        ].map(chip => (
                          <button
                            key={chip.tag}
                            type="button"
                            onClick={() =>
                              setWizardMessageTemplate(prev => `${prev} ${chip.tag}`)
                            }
                            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono cursor-pointer transition-colors"
                          >
                            + {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Mobile Message Preview */}
                    <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                        <span>Customer WhatsApp Live Preview</span>
                        <span>Now</span>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50 text-slate-800 text-xs border border-emerald-200 shadow-2xs leading-relaxed whitespace-pre-wrap">
                        {livePreviewRendered}
                        {wizardMinOrderValue > 0 && (
                          <div className="text-[10px] text-slate-500 mt-2">
                            *Valid on minimum order of ₹{wizardMinOrderValue}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: SET TIMING AND FREQUENCY */}
                {wizardStep === 6 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Set Timing & Anti-Spam Frequency
                      </label>
                      <p className="text-xs text-slate-500 mb-3">
                        Protect diners from message fatigue and prevent spam.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Quiet Hours */}
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-800">
                            Respect Quiet Hours (Do Not Disturb)
                          </label>
                          <input
                            type="checkbox"
                            checked={wizardQuietHoursEnabled}
                            onChange={e => setWizardQuietHoursEnabled(e.target.checked)}
                            className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Automations will never send early morning or late night messages outside these business hours.
                        </p>
                        {wizardQuietHoursEnabled && (
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-[10px] font-semibold text-slate-500">Start Time</span>
                              <input
                                type="time"
                                value={wizardQuietHoursStart}
                                onChange={e => setWizardQuietHoursStart(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs mt-1"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-semibold text-slate-500">End Time</span>
                              <input
                                type="time"
                                value={wizardQuietHoursEnd}
                                onChange={e => setWizardQuietHoursEnd(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs mt-1"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Cooldown limit */}
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                        <label className="font-bold text-slate-800 block">
                          Customer Touch Cooldown Gap
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Prevent the same customer from receiving this campaign more than once within this window.
                        </p>
                        <div className="grid grid-cols-4 gap-2 pt-1">
                          {[7, 15, 30, 60].map(cd => (
                            <button
                              key={cd}
                              type="button"
                              onClick={() => setWizardCooldownDays(cd)}
                              className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                wizardCooldownDays === cd
                                  ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {cd} Days
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: REVIEW AND ACTIVATE */}
                {wizardStep === 7 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Review & Activate Automation
                      </label>
                      <p className="text-xs text-slate-500 mb-3">
                        Review your automation parameters before saving.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Name:</span>
                        <span className="font-bold text-slate-900">{wizardName}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Trigger:</span>
                        <span className="font-semibold text-slate-800">
                          {wizardTriggerType} ({wizardTriggerValue} {wizardTriggerUnit})
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Audience:</span>
                        <span className="font-semibold text-slate-800">
                          {wizardAudienceSegment} (Min {wizardMinOrders} orders)
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Channel:</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" />
                          {wizardChannel}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Safety Gap:</span>
                        <span className="font-semibold text-slate-800">
                          Max once every {wizardCooldownDays} days per diner
                        </span>
                      </div>
                    </div>

                    {/* Disconnected Provider Alert if WhatsApp is chosen */}
                    {wizardChannel === 'WHATSAPP' && !isWhatsAppConnected && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          Notice: WhatsApp is currently disconnected. If you activate now, this automation will remain in "Needs Attention" state until WhatsApp is linked.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wizard Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-2xl">
                <div>
                  {wizardStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setWizardStep(prev => prev - 1)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {wizardStep < 7 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (wizardStep === 1 && !wizardName.trim()) {
                          setWizardName(wizardGoal);
                        }
                        setWizardStep(prev => prev + 1);
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={wizardSaving}
                        onClick={() => handleSaveWizard('DRAFT')}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Save as Draft
                      </button>

                      <button
                        type="button"
                        disabled={wizardSaving}
                        onClick={() => handleSaveWizard('ACTIVE')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>{wizardSaving ? 'Saving...' : 'Activate Automation'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 5. AUTOMATION DETAILS & PERFORMANCE AUDIT MODAL */}
      {selectedAutomationForDetails &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-slate-900">
                      {selectedAutomationForDetails.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedAutomationForDetails.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedAutomationForDetails.status === 'PAUSED'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedAutomationForDetails.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedAutomationForDetails.description || selectedAutomationForDetails.action}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAutomationForDetails(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Performance Audit Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Processed</span>
                  <span className="font-black text-slate-900 text-base">
                    {selectedAutomationForDetails.customersReached || 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Messages Sent</span>
                  <span className="font-black text-sky-700 text-base">
                    {selectedAutomationForDetails.messagesSent ?? selectedAutomationForDetails.customersReached ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Attributed Rev</span>
                  <span className="font-black text-emerald-700 text-base">
                    {formatCurrency(selectedAutomationForDetails.revenueAttributed || 0)}
                  </span>
                </div>
              </div>

              {/* Configuration Overview */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Trigger:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAutomationForDetails.trigger}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Channel:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAutomationForDetails.channel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Cooldown:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAutomationForDetails.frequencyLimitDays} days between messages
                  </span>
                </div>
              </div>

              {/* Message Template Text */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Configured Message Template
                </label>
                <div className="p-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
                  {selectedAutomationForDetails.actionConfig?.messageTemplate ||
                    selectedAutomationForDetails.action}
                </div>
              </div>

              {/* Activity Log for this automation */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Recent Activity Log
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(selectedAutomationForDetails.activityLog || []).length === 0 ? (
                    <div className="text-xs text-slate-400 text-center py-3">
                      No logged events yet.
                    </div>
                  ) : (
                    (selectedAutomationForDetails.activityLog || []).map(log => (
                      <div
                        key={log.id}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-800">{log.event}</span>
                            {log.details && (
                              <p className="text-[11px] text-slate-500">{log.details}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    handleTestRun(selectedAutomationForDetails);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dry-Run Test</span>
                </button>
                <button
                  onClick={() => {
                    handleEdit(selectedAutomationForDetails);
                    setSelectedAutomationForDetails(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer"
                >
                  Edit Configuration
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* TEST RESULT MODAL */}
      {testResultModal.open &&
        testResultModal.preview &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-black text-base text-slate-900">Dry-Run Test Simulation</h3>
                </div>
                <button
                  onClick={() => setTestResultModal({ open: false })}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sample Recipient:</span>
                  <span className="font-bold text-slate-900">
                    {testResultModal.preview.recipientName} ({testResultModal.preview.recipientPhone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Channel Readiness:</span>
                  <span
                    className={`font-bold ${
                      testResultModal.preview.isChannelReady ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {testResultModal.preview.isChannelReady ? 'Ready for Dispatch' : 'Gateway Disconnected'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Rendered Message Output
                </label>
                <div className="p-3.5 rounded-xl bg-emerald-50 text-slate-800 text-xs border border-emerald-200 whitespace-pre-wrap leading-relaxed">
                  {testResultModal.preview.renderedMessage}
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setTestResultModal({ open: false })}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* CONFIRM DELETE DIALOG */}
      {automationToDelete &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-black text-base text-slate-900">
                  Delete Automation?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to permanently delete "{automationToDelete.name}"? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  disabled={deleting}
                  onClick={() => setAutomationToDelete(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

// Simple inline helper icon for repeat orders
function RepeatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

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
  MarketingChannelConfig,
  Customer
} from '../../types';

interface AiAutomationsTabProps {
  automations: AiAutomation[];
  channels: MarketingChannelConfig[];
  customers?: Customer[];
  prefilledCustomer?: { id: string; name: string; phone: string } | null;
  onClearPrefilledCustomer?: () => void;
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
    id: 'tmpl-recurring-offer',
    name: 'Recurring Special Offer / Treat',
    category: 'LOYALTY',
    categoryLabel: 'Recurring Offers',
    businessOutcome: 'Keep diners excited with consistent weekly or 4-day perks',
    goal: 'Increase repeat orders',
    triggerSummary: 'Every 4 days recurring',
    requiredIntegration: 'WhatsApp',
    difficulty: 'Quick (1 min)',
    triggerType: 'RECURRING_DAYS',
    triggerValue: 4,
    triggerUnit: 'days',
    targetSegment: 'ALL',
    minOrders: 0,
    actionType: 'SEND_MESSAGE_WITH_OFFER',
    offerType: 'DISCOUNT_COINS',
    offerValue: 50,
    minOrderValue: 250,
    cooldownDays: 4,
    messageTemplate: 'Hey {{customer_name}}! Craving delicious food? Visit {{restaurant_name}} this week and enjoy {{offer_details}} on your bill! We would love to host you. ❤️',
    explanation: 'Sends a recurring treat or offer every 4 days to keep diners coming back.'
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
    triggerSummary: '30 minutes after completed dine-in or takeaway order',
    requiredIntegration: 'WhatsApp',
    difficulty: 'Quick (1 min)',
    triggerType: 'ORDER_COMPLETED',
    triggerValue: 30,
    triggerUnit: 'minutes',
    targetSegment: 'ALL',
    minOrders: 1,
    actionType: 'REQUEST_FEEDBACK',
    offerType: 'NONE',
    offerValue: 0,
    minOrderValue: 0,
    cooldownDays: 7,
    messageTemplate: 'Hi {{customer_name}}, thank you for dining at {{restaurant_name}} today! How was your experience? Tap here to let us know: {{feedback_link}}',
    explanation: 'Requests feedback 30 minutes after food service completes, safely ignoring cancelled or refunded orders.'
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
  channels,
  customers = [],
  prefilledCustomer,
  onClearPrefilledCustomer,
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

  // 4-Step Wizard State
  // Step 1: Basics & Target Customers
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardName, setWizardName] = useState<string>('');
  const [wizardDescription, setWizardDescription] = useState<string>('');
  const [wizardCategory, setWizardCategory] = useState<string>('RETENTION');
  const [wizardGoal, setWizardGoal] = useState<string>('Bring back inactive customers');

  // Audience & Specific Customer
  const [wizardAudienceSegment, setWizardAudienceSegment] = useState<string>('INACTIVE');
  const [wizardSpecificCustomerId, setWizardSpecificCustomerId] = useState<string>('');
  const [wizardSpecificCustomerName, setWizardSpecificCustomerName] = useState<string>('');
  const [wizardSpecificCustomerPhone, setWizardSpecificCustomerPhone] = useState<string>('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
  const [wizardMinOrders, setWizardMinOrders] = useState<number>(1);
  const [wizardMinSpend, setWizardMinSpend] = useState<number>(0);
  const [liveEligibleCount, setLiveEligibleCount] = useState<number | null>(null);
  const [liveEstimating, setLiveEstimating] = useState<boolean>(false);

  // Step 2: Message & Offers
  const [wizardChannel, setWizardChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [wizardActionType, setWizardActionType] = useState<string>('SEND_MESSAGE_WITH_OFFER');
  const [wizardOfferType, setWizardOfferType] = useState<string>('DISCOUNT_COINS');
  const [wizardOfferValue, setWizardOfferValue] = useState<number>(75);
  const [wizardOfferPerkText, setWizardOfferPerkText] = useState<string>('Complimentary Dessert');
  const [wizardMinOrderValue, setWizardMinOrderValue] = useState<number>(299);
  const [wizardValidityDays, setWizardValidityDays] = useState<number>(7);
  const [wizardFeedbackUrl, setWizardFeedbackUrl] = useState<string>('https://swaadsevak.com/feedback');
  const [wizardMessageTemplate, setWizardMessageTemplate] = useState<string>(
    'Hi {{customer_name}}, we miss seeing you at {{restaurant_name}}! Visit us again this week and enjoy {{offer_details}}. We look forward to serving you!'
  );

  // Step 3: Trigger & Schedule
  const [wizardTriggerType, setWizardTriggerType] = useState<string>('INACTIVITY_DAYS');
  const [wizardTriggerValue, setWizardTriggerValue] = useState<number>(15);
  const [wizardTriggerUnit, setWizardTriggerUnit] = useState<string>('days');
  const [wizardDelayMinutes, setWizardDelayMinutes] = useState<number>(30); // 30 min default
  const [wizardRecurringDays, setWizardRecurringDays] = useState<number>(4); // 4 days default
  const [wizardDayOfWeek, setWizardDayOfWeek] = useState<string>('WEDNESDAY'); // Wednesday default
  const [wizardTimeOfDay, setWizardTimeOfDay] = useState<string>('11:30');
  const [wizardInactivityDays, setWizardInactivityDays] = useState<number>(15);
  const [wizardMilestoneOrders, setWizardMilestoneOrders] = useState<number>(5);

  // Anti-spam protections
  const [wizardCooldownDays, setWizardCooldownDays] = useState<number>(14);
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

  // Auto-launch wizard when prefilledCustomer is passed from Customer Directory
  useEffect(() => {
    if (prefilledCustomer) {
      setWizardMode('CREATE');
      setEditingAutomationId(null);
      setWizardStep(1);
      setWizardName(`Special Automation for ${prefilledCustomer.name}`);
      setWizardGoal('Engage specific customer');
      setWizardCategory('LOYALTY');
      setWizardAudienceSegment('SPECIFIC_CUSTOMER');
      setWizardSpecificCustomerId(prefilledCustomer.id);
      setWizardSpecificCustomerName(prefilledCustomer.name);
      setWizardSpecificCustomerPhone(prefilledCustomer.phone);
      setWizardTriggerType('RECURRING_DAYS');
      setWizardRecurringDays(4);
      setWizardTriggerValue(4);
      setWizardTriggerUnit('days');
      setWizardOfferType('DISCOUNT_COINS');
      setWizardOfferValue(75);
      setWizardMinOrderValue(299);
      setWizardValidityDays(7);
      setWizardMessageTemplate(
        `Hi {{customer_name}}, we have a special treat for you at {{restaurant_name}}! Visit us this week and enjoy {{offer_details}}. We look forward to seeing you! ❤️`
      );
      setWizardCooldownDays(4);
      setShowWizard(true);
    }
  }, [prefilledCustomer]);

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

  // Live estimate audience count in wizard Step 1
  useEffect(() => {
    if (showWizard && wizardStep === 1) {
      let cancelled = false;
      setLiveEstimating(true);
      api.estimateAutomationAudience({
        triggerConfig: {
          type: wizardTriggerType,
          value: wizardTriggerType === 'ORDER_COMPLETED' ? wizardDelayMinutes : wizardTriggerValue
        },
        audienceConfig: {
          segment: wizardAudienceSegment,
          specificCustomerId: wizardSpecificCustomerId,
          specificCustomerPhone: wizardSpecificCustomerPhone,
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
  }, [
    showWizard,
    wizardStep,
    wizardTriggerType,
    wizardTriggerValue,
    wizardDelayMinutes,
    wizardAudienceSegment,
    wizardSpecificCustomerId,
    wizardSpecificCustomerPhone,
    wizardMinOrders,
    wizardMinSpend
  ]);

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
    setWizardSpecificCustomerId('');
    setWizardSpecificCustomerName('');
    setWizardSpecificCustomerPhone('');
    setWizardMinOrders(1);
    setWizardMinSpend(0);
    setWizardChannel('WHATSAPP');
    setWizardActionType('SEND_MESSAGE_WITH_OFFER');
    setWizardOfferType('DISCOUNT_COINS');
    setWizardOfferValue(75);
    setWizardOfferPerkText('Complimentary Dessert');
    setWizardMinOrderValue(299);
    setWizardValidityDays(7);
    setWizardMessageTemplate('Hi {{customer_name}}, we miss seeing you at {{restaurant_name}}! Visit us again this week and enjoy {{offer_details}}. We look forward to serving you!');
    setWizardDelayMinutes(30);
    setWizardRecurringDays(4);
    setWizardDayOfWeek('WEDNESDAY');
    setWizardTimeOfDay('11:30');
    setWizardInactivityDays(15);
    setWizardMilestoneOrders(5);
    setWizardCooldownDays(14);
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
    setWizardStep(1);
    setWizardGoal(recipe.goal);
    setWizardName(recipe.name);
    setWizardDescription(recipe.explanation);
    setWizardCategory(recipe.category);
    setWizardTriggerType(recipe.triggerType);
    setWizardTriggerValue(recipe.triggerValue);
    setWizardTriggerUnit(recipe.triggerUnit);
    setWizardAudienceSegment(recipe.targetSegment);
    setWizardSpecificCustomerId('');
    setWizardSpecificCustomerName('');
    setWizardSpecificCustomerPhone('');
    setWizardMinOrders(recipe.minOrders);
    setWizardMinSpend(recipe.minSpend || 0);
    setWizardChannel('WHATSAPP');
    setWizardActionType(recipe.actionType);
    setWizardOfferType(recipe.offerType);
    setWizardOfferValue(recipe.offerValue);
    setWizardOfferPerkText('Complimentary Dessert');
    setWizardMinOrderValue(recipe.minOrderValue);
    setWizardValidityDays(7);
    setWizardMessageTemplate(recipe.messageTemplate);
    const delay = recipe.triggerType === 'ORDER_COMPLETED' ? (recipe.triggerValue || 30) : 30;
    setWizardDelayMinutes(delay);
    if (recipe.triggerType === 'INACTIVITY_DAYS') {
      setWizardInactivityDays(recipe.triggerValue || 15);
    }
    if (recipe.triggerType === 'RECURRING_DAYS') {
      setWizardRecurringDays(recipe.triggerValue || 4);
    }
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
    setWizardSpecificCustomerId(auto.audienceConfig?.specificCustomerId || '');
    setWizardSpecificCustomerName(auto.audienceConfig?.specificCustomerName || '');
    setWizardSpecificCustomerPhone(auto.audienceConfig?.specificCustomerPhone || '');
    setWizardMinOrders(auto.audienceConfig?.minOrders ?? 1);
    setWizardMinSpend(auto.audienceConfig?.minSpend ?? 0);
    setWizardChannel((auto.channel as any) || 'WHATSAPP');
    setWizardActionType(auto.actionConfig?.type || 'SEND_MESSAGE_WITH_OFFER');
    setWizardOfferType(auto.actionConfig?.offerType || 'DISCOUNT_COINS');
    setWizardOfferValue(auto.actionConfig?.offerValue ?? 50);
    setWizardOfferPerkText(auto.actionConfig?.offerPerkText || 'Complimentary Dessert');
    setWizardMinOrderValue(auto.actionConfig?.minOrderValue ?? 299);
    setWizardValidityDays(auto.actionConfig?.validityDays ?? 7);
    setWizardFeedbackUrl(auto.actionConfig?.feedbackUrl || 'https://swaadsevak.com/feedback');
    setWizardMessageTemplate(auto.actionConfig?.messageTemplate || 'Hi {{customer_name}}, we miss seeing you at {{restaurant_name}}!');

    const delay = auto.timingConfig?.delayMinutes ?? (auto.triggerConfig?.type === 'ORDER_COMPLETED' ? auto.triggerConfig.value : 30) ?? 30;
    setWizardDelayMinutes(delay);
    setWizardRecurringDays(auto.timingConfig?.frequencyDays ?? (auto.triggerConfig?.type === 'RECURRING_DAYS' ? auto.triggerConfig.value : 4) ?? 4);
    setWizardDayOfWeek(auto.triggerConfig?.dayOfWeek || auto.timingConfig?.dayOfWeek || 'WEDNESDAY');
    setWizardTimeOfDay(auto.triggerConfig?.timeOfDay || '11:30');
    setWizardInactivityDays(auto.triggerConfig?.type === 'INACTIVITY_DAYS' ? (auto.triggerConfig.value || 15) : 15);
    setWizardMilestoneOrders(auto.triggerConfig?.type === 'VISIT_MILESTONE' ? (auto.triggerConfig.value || 5) : 5);

    setWizardCooldownDays(auto.timingConfig?.cooldownDays ?? auto.frequencyLimitDays ?? 30);
    setWizardQuietHoursEnabled(auto.timingConfig?.quietHoursEnabled ?? true);
    setWizardQuietHoursStart(auto.timingConfig?.quietHoursStart || '10:00');
    setWizardQuietHoursEnd(auto.timingConfig?.quietHoursEnd || '21:30');
    setWizardError('');
    setShowWizard(true);
  };

  // Close wizard and cleanup prefilled customer
  const handleCloseWizard = () => {
    setShowWizard(false);
    onClearPrefilledCustomer?.();
  };

  // Finish Wizard (Save Draft or Activate)
  const handleSaveWizard = async (targetStatus: 'ACTIVE' | 'DRAFT') => {
    if (!wizardName.trim()) {
      setWizardError('Please give this automation a recognizable name.');
      setWizardStep(1);
      return;
    }

    if (wizardAudienceSegment === 'SPECIFIC_CUSTOMER' && !wizardSpecificCustomerId && !wizardSpecificCustomerPhone) {
      setWizardError('Please select a specific customer from the directory.');
      setWizardStep(1);
      return;
    }

    setWizardSaving(true);
    setWizardError('');

    let finalTriggerValue = wizardTriggerValue;
    let finalTriggerUnit = wizardTriggerUnit;
    let triggerDescription = '';

    if (wizardTriggerType === 'ORDER_COMPLETED') {
      finalTriggerValue = wizardDelayMinutes;
      finalTriggerUnit = 'minutes';
      triggerDescription = `${wizardDelayMinutes} minutes after completed order`;
    } else if (wizardTriggerType === 'RECURRING_DAYS') {
      finalTriggerValue = wizardRecurringDays;
      finalTriggerUnit = 'days';
      triggerDescription = `Every ${wizardRecurringDays} days recurring`;
    } else if (wizardTriggerType === 'DAY_OF_WEEK') {
      finalTriggerValue = 1;
      finalTriggerUnit = 'week';
      triggerDescription = `Every ${wizardDayOfWeek} at ${wizardTimeOfDay}`;
    } else if (wizardTriggerType === 'INACTIVITY_DAYS') {
      finalTriggerValue = wizardInactivityDays;
      finalTriggerUnit = 'days';
      triggerDescription = `No recorded visit or order for ${wizardInactivityDays} days`;
    } else if (wizardTriggerType === 'BIRTHDAY') {
      finalTriggerValue = 0;
      finalTriggerUnit = 'days';
      triggerDescription = 'On customer birthday at 10:00 AM';
    } else if (wizardTriggerType === 'VISIT_MILESTONE') {
      finalTriggerValue = wizardMilestoneOrders;
      finalTriggerUnit = 'visits';
      triggerDescription = `Completed visit milestone reaches ${wizardMilestoneOrders}`;
    } else if (wizardTriggerType === 'FIRST_ORDER') {
      finalTriggerValue = wizardDelayMinutes || 15;
      finalTriggerUnit = 'minutes';
      triggerDescription = `Immediately after 1st order (${wizardDelayMinutes} mins)`;
    }

    let actionDescription = '';
    if (wizardOfferType === 'DISCOUNT_COINS') {
      actionDescription = `Send ${wizardOfferValue} Discount Coins + personalized message`;
    } else if (wizardOfferType === 'DISCOUNT_PERCENT') {
      actionDescription = `Send ${wizardOfferValue}% Discount + personalized message`;
    } else if (wizardOfferType === 'FREE_ITEM') {
      actionDescription = `Send Free Perk (${wizardOfferPerkText}) + personalized message`;
    } else if (wizardOfferType === 'FLAT_DISCOUNT') {
      actionDescription = `Send Flat ₹${wizardOfferValue} Off + personalized message`;
    } else if (wizardActionType === 'REQUEST_FEEDBACK') {
      actionDescription = 'Send friendly feedback link';
    } else {
      actionDescription = 'Send personalized greeting message';
    }

    let conditionsDesc = '';
    if (wizardAudienceSegment === 'SPECIFIC_CUSTOMER') {
      conditionsDesc = `Target Diner: ${wizardSpecificCustomerName || 'Guest'} (${wizardSpecificCustomerPhone || ''})`;
    } else {
      conditionsDesc = `Segment: ${wizardAudienceSegment}, Min orders: ${wizardMinOrders}`;
    }

    const payload: Partial<AiAutomation> = {
      name: wizardName.trim(),
      description: wizardDescription.trim() || `Automated workflow to ${wizardGoal.toLowerCase()}`,
      category: wizardCategory,
      goal: wizardGoal,
      trigger: triggerDescription,
      conditions: conditionsDesc,
      action: actionDescription,
      channel: wizardChannel,
      frequencyLimitDays: wizardCooldownDays,
      status: targetStatus,
      triggerConfig: {
        type: wizardTriggerType,
        value: finalTriggerValue,
        unit: finalTriggerUnit,
        dayOfWeek: wizardTriggerType === 'DAY_OF_WEEK' ? wizardDayOfWeek : undefined,
        timeOfDay: wizardTriggerType === 'DAY_OF_WEEK' ? wizardTimeOfDay : undefined,
        description: triggerDescription
      },
      audienceConfig: {
        segment: wizardAudienceSegment,
        specificCustomerId: wizardAudienceSegment === 'SPECIFIC_CUSTOMER' ? wizardSpecificCustomerId : undefined,
        specificCustomerName: wizardAudienceSegment === 'SPECIFIC_CUSTOMER' ? wizardSpecificCustomerName : undefined,
        specificCustomerPhone: wizardAudienceSegment === 'SPECIFIC_CUSTOMER' ? wizardSpecificCustomerPhone : undefined,
        minOrders: wizardMinOrders,
        minSpend: wizardMinSpend,
        vipOnly: wizardAudienceSegment === 'VIP'
      },
      actionConfig: {
        type: wizardActionType,
        messageTemplate: wizardMessageTemplate,
        offerType: wizardOfferType,
        offerValue: wizardOfferValue,
        offerPerkText: wizardOfferPerkText,
        minOrderValue: wizardMinOrderValue,
        validityDays: wizardValidityDays,
        feedbackUrl: wizardFeedbackUrl
      },
      timingConfig: {
        delayMinutes: wizardDelayMinutes,
        frequencyDays: wizardTriggerType === 'RECURRING_DAYS' ? wizardRecurringDays : undefined,
        dayOfWeek: wizardTriggerType === 'DAY_OF_WEEK' ? wizardDayOfWeek : undefined,
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
          handleCloseWizard();
          onRefreshAutomations();
        } else {
          setWizardError(res.message || 'Failed to update automation');
        }
      } else {
        const res = await api.createAiAutomation(payload);
        if (res.success) {
          showToast(res.message || 'Automation created successfully', 'SUCCESS');
          handleCloseWizard();
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
    let offerText = '';
    if (wizardOfferType === 'DISCOUNT_COINS') {
      offerText = `${wizardOfferValue} Discount Coins`;
    } else if (wizardOfferType === 'DISCOUNT_PERCENT') {
      offerText = `${wizardOfferValue}% Discount`;
    } else if (wizardOfferType === 'FREE_ITEM') {
      offerText = wizardOfferPerkText || 'a Complimentary Appetizer';
    } else if (wizardOfferType === 'FLAT_DISCOUNT') {
      offerText = `Flat ₹${wizardOfferValue} Off`;
    }

    const recipientDisplayName =
      wizardAudienceSegment === 'SPECIFIC_CUSTOMER' && wizardSpecificCustomerName
        ? wizardSpecificCustomerName
        : 'Rahul';

    text = text
      .replace(/\{\{\s*customer_name\s*\}\}/gi, recipientDisplayName)
      .replace(/\{\{\s*restaurant_name\s*\}\}/gi, 'SwaadSevak Café')
      .replace(/\{\{\s*(offer_details|offer)\s*\}\}/gi, offerText)
      .replace(/\{\{\s*(coins|discount_coins)\s*\}\}/gi, String(wizardOfferValue))
      .replace(/\{\{\s*discount_percent\s*\}\}/gi, `${wizardOfferValue}%`)
      .replace(/\{\{\s*free_item\s*\}\}/gi, wizardOfferPerkText || 'Complimentary Treat')
      .replace(/\{\{\s*min_order_value\s*\}\}/gi, wizardMinOrderValue > 0 ? `₹${wizardMinOrderValue}` : '')
      .replace(/\{\{\s*feedback_link\s*\}\}/gi, wizardFeedbackUrl)
      .replace(/\{\{\s*(order_link|menu_link)\s*\}\}/gi, 'https://swaadsevak.vercel.app');
    return text;
  }, [
    wizardMessageTemplate,
    wizardOfferType,
    wizardOfferValue,
    wizardOfferPerkText,
    wizardMinOrderValue,
    wizardFeedbackUrl,
    wizardAudienceSegment,
    wizardSpecificCustomerName
  ]);

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

      {/* 4. FOUR-STEP CUSTOM AUTOMATION CREATION & EDIT WIZARD MODAL */}
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
                      {wizardMode === 'EDIT' ? 'Edit Automation' : 'Create Custom Automation'}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Step {wizardStep} of 4: {
                      wizardStep === 1
                        ? 'Name & Target Customers'
                        : wizardStep === 2
                        ? 'Message, Offers & Quick Tags'
                        : wizardStep === 3
                        ? 'Timing, Frequency & Trigger Schedule'
                        : 'Review & Activate'
                    }
                  </p>
                </div>
                <button
                  onClick={handleCloseWizard}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar (4 Steps) */}
              <div className="grid grid-cols-4 gap-1.5 px-5 pt-3">
                {[1, 2, 3, 4].map(s => (
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

                {/* STEP 1: NAME & TARGET CUSTOMERS */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    {/* Automation Name Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        1. Automation Name
                      </label>
                      <input
                        type="text"
                        value={wizardName}
                        onChange={e => setWizardName(e.target.value)}
                        placeholder="e.g. Special Offer for Bhargavi, 30-Min Post-Order Feedback, 15-Day Win-Back"
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Give this automation a recognizable name so you can track its performance.
                      </p>
                    </div>

                    {/* Customer Category Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        2. Category of Customers to Apply On
                      </label>
                      <p className="text-xs text-slate-500 mb-2.5">
                        Choose the customer group or target a specific individual customer.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {[
                          {
                            id: 'INACTIVE',
                            label: 'Inactive Customers',
                            desc: 'Win back guests with no recent visits'
                          },
                          {
                            id: 'ALL',
                            label: 'All Customers',
                            desc: 'Every registered guest in your CRM'
                          },
                          {
                            id: 'VIP',
                            label: '👑 VIP Spenders',
                            desc: 'High lifetime spend (₹3,000+)'
                          },
                          {
                            id: 'LOYAL',
                            label: '⭐ Loyal Regulars',
                            desc: 'Frequent diners with 3+ visits'
                          },
                          {
                            id: 'NEW',
                            label: '🌱 First-Time Diners',
                            desc: 'Turn first visits into repeats'
                          },
                          {
                            id: 'SPECIFIC_CUSTOMER',
                            label: '🎯 Specific Customer',
                            desc: 'Target one customer directly'
                          }
                        ].map(cat => (
                          <div
                            key={cat.id}
                            onClick={() => {
                              setWizardAudienceSegment(cat.id);
                              if (cat.id !== 'SPECIFIC_CUSTOMER') {
                                setWizardSpecificCustomerId('');
                                setWizardSpecificCustomerName('');
                                setWizardSpecificCustomerPhone('');
                              }
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              wizardAudienceSegment === cat.id
                                ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <span className="font-bold text-xs text-slate-900 block mb-0.5">
                              {cat.label}
                            </span>
                            <span className="text-[10px] text-slate-500 block leading-tight">
                              {cat.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specific Customer Selection UI */}
                    {wizardAudienceSegment === 'SPECIFIC_CUSTOMER' && (
                      <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Select Customer from Directory</span>
                          </label>
                          {wizardSpecificCustomerName && (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Selected: {wizardSpecificCustomerName}
                            </span>
                          )}
                        </div>

                        {/* Search Input for Customers */}
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Type customer name (e.g. Bhargavi) or phone number..."
                            value={customerSearchQuery}
                            onChange={e => setCustomerSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        {/* Customer List Picker */}
                        <div className="max-h-40 overflow-y-auto space-y-1.5 bg-white p-2 rounded-lg border border-slate-200">
                          {customers
                            .filter(c => {
                              if (!customerSearchQuery.trim()) return true;
                              const q = customerSearchQuery.toLowerCase();
                              return c.name.toLowerCase().includes(q) || c.phone.includes(q);
                            })
                            .slice(0, 8)
                            .map(c => {
                              const isSelected =
                                wizardSpecificCustomerId === c.id || wizardSpecificCustomerPhone === c.phone;
                              return (
                                <div
                                  key={c.id}
                                  onClick={() => {
                                    setWizardSpecificCustomerId(c.id);
                                    setWizardSpecificCustomerName(c.name);
                                    setWizardSpecificCustomerPhone(c.phone);
                                    if (!wizardName || wizardName.startsWith('Special Automation for')) {
                                      setWizardName(`Special Automation for ${c.name}`);
                                    }
                                  }}
                                  className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                    isSelected
                                      ? 'border-indigo-500 bg-indigo-50 text-indigo-950 font-bold'
                                      : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                                      {c.name.slice(0, 1)}
                                    </div>
                                    <div>
                                      <span className="font-bold text-xs">{c.name}</span>
                                      <span className="text-[10px] text-slate-500 block font-mono">
                                        {c.phone}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right text-[11px]">
                                    <span className="text-slate-500 block">{c.totalOrders} orders</span>
                                    <span className="text-amber-700 font-bold">🪙 {c.coinBalance} coins</span>
                                  </div>
                                </div>
                              );
                            })}
                          {customers.length === 0 && (
                            <p className="text-xs text-slate-400 text-center py-2">
                              No customer records found.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Live Audience Count Indicator for General Categories */}
                    {wizardAudienceSegment !== 'SPECIFIC_CUSTOMER' && (
                      <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-400" />
                          <span>Estimated Currently Eligible in CRM:</span>
                        </div>
                        <span className="font-black text-emerald-400 text-sm">
                          {liveEstimating
                            ? 'Calculating...'
                            : liveEligibleCount !== null
                            ? `${liveEligibleCount} guests`
                            : 'All eligible in segment'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: MESSAGE, OFFERS & QUICK TAGS */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    {/* Offer Controls */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          1. Reward or Offer in Message
                        </label>
                        <span className="text-[11px] font-medium text-slate-500">
                          Included automatically via <code className="text-orange-600 font-mono">{'{{offer_details}}'}</code>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Offer Type
                          </label>
                          <select
                            value={wizardOfferType}
                            onChange={e => setWizardOfferType(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                          >
                            <option value="DISCOUNT_COINS">Discount Coins (🪙)</option>
                            <option value="DISCOUNT_PERCENT">Discount Percentage (%)</option>
                            <option value="FREE_ITEM">Free Complimentary Item</option>
                            <option value="FLAT_DISCOUNT">Flat ₹ Discount</option>
                            <option value="NONE">No Offer (Greeting only)</option>
                          </select>
                        </div>

                        {wizardOfferType === 'DISCOUNT_COINS' && (
                          <div>
                            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                              Coin Value (🪙)
                            </label>
                            <input
                              type="number"
                              min={10}
                              step={5}
                              value={wizardOfferValue}
                              onChange={e => setWizardOfferValue(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          </div>
                        )}

                        {wizardOfferType === 'DISCOUNT_PERCENT' && (
                          <div>
                            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                              Discount Percentage (%)
                            </label>
                            <input
                              type="number"
                              min={5}
                              max={100}
                              step={5}
                              value={wizardOfferValue}
                              onChange={e => setWizardOfferValue(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          </div>
                        )}

                        {wizardOfferType === 'FLAT_DISCOUNT' && (
                          <div>
                            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                              Flat Discount (₹)
                            </label>
                            <input
                              type="number"
                              min={10}
                              step={10}
                              value={wizardOfferValue}
                              onChange={e => setWizardOfferValue(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          </div>
                        )}

                        {wizardOfferType === 'FREE_ITEM' && (
                          <div className="sm:col-span-2">
                            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                              Complimentary Item Name
                            </label>
                            <input
                              type="text"
                              value={wizardOfferPerkText}
                              onChange={e => setWizardOfferPerkText(e.target.value)}
                              placeholder="e.g. Free Dessert, Complimentary Cold Coffee"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          </div>
                        )}

                        {wizardOfferType !== 'FREE_ITEM' && (
                          <div>
                            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                              Min Order (₹)
                            </label>
                            <input
                              type="number"
                              min={0}
                              step={50}
                              value={wizardMinOrderValue}
                              onChange={e => setWizardMinOrderValue(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message Composer Textarea & Quick Link Tag Chips */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-xs text-slate-800">
                          2. Compose Message Content
                        </label>
                        <span className="text-[10px] text-slate-400">
                          {wizardMessageTemplate.length} characters
                        </span>
                      </div>

                      <textarea
                        rows={3}
                        value={wizardMessageTemplate}
                        onChange={e => setWizardMessageTemplate(e.target.value)}
                        placeholder="Write your personalized message here..."
                        className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-sans leading-relaxed"
                      />

                      {/* Quick Links Tag Buttons (Inserts variables into textarea) */}
                      <div className="mt-2 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Click to insert variable tag into message:
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[
                            { tag: '{{customer_name}}', label: 'Guest Name' },
                            { tag: '{{restaurant_name}}', label: 'Café Name' },
                            { tag: '{{offer_details}}', label: 'Offer Perk' },
                            { tag: '{{coins}}', label: 'Coins Amount' },
                            { tag: '{{discount_percent}}', label: 'Discount %' },
                            { tag: '{{free_item}}', label: 'Free Item' },
                            { tag: '{{feedback_link}}', label: 'Review Link' },
                            { tag: '{{order_link}}', label: 'Menu Link' }
                          ].map(chip => (
                            <button
                              key={chip.tag}
                              type="button"
                              onClick={() => setWizardMessageTemplate(prev => `${prev} ${chip.tag}`)}
                              className="px-2 py-1 rounded-md bg-slate-100 hover:bg-orange-100 hover:text-orange-800 text-slate-700 text-[10px] font-mono cursor-pointer transition-colors border border-slate-200/80"
                            >
                              + {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Mobile Message Preview */}
                    <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                        <span>WhatsApp Live Message Preview</span>
                        <span>Now</span>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50 text-slate-800 text-xs border border-emerald-200 shadow-2xs leading-relaxed whitespace-pre-wrap font-sans">
                        {livePreviewRendered}
                        {wizardMinOrderValue > 0 && wizardOfferType !== 'NONE' && (
                          <div className="text-[10px] text-slate-500 mt-2">
                            *Valid on minimum order of ₹{wizardMinOrderValue}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: TIMING, FREQUENCY & TRIGGER SCHEDULE */}
                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        When & How Often Should This Message Send?
                      </label>
                      <p className="text-xs text-slate-500 mb-3">
                        Choose between post-order delivery, recurring days interval, or specific days of the week.
                      </p>
                    </div>

                    {/* Schedule Mode Radio Cards */}
                    <div className="space-y-2.5">
                      {/* Option 1: After Customer Orders */}
                      <div
                        onClick={() => {
                          setWizardTriggerType('ORDER_COMPLETED');
                          setWizardTriggerUnit('minutes');
                          setWizardTriggerValue(wizardDelayMinutes || 30);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          wizardTriggerType === 'ORDER_COMPLETED'
                            ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-orange-600" />
                            After customer orders something (Post-Order)
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                            Minutes
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">
                          Send feedback link, thank you note, or next-order offer after order completion.
                        </p>

                        {wizardTriggerType === 'ORDER_COMPLETED' && (
                          <div className="pt-2 border-t border-orange-200/60 space-y-2">
                            <span className="text-[10px] font-bold text-slate-600 block">
                              Select or type delay after order completion:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {[15, 30, 45, 60, 120].map(mins => (
                                <button
                                  key={mins}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setWizardDelayMinutes(mins);
                                    setWizardTriggerValue(mins);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                    wizardDelayMinutes === mins
                                      ? 'bg-orange-600 text-white border-orange-600'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {mins === 60 ? '1 Hour' : mins === 120 ? '2 Hours' : `${mins} mins`}
                                </button>
                              ))}
                              {/* Custom minutes input */}
                              <div className="flex items-center gap-1 bg-white px-2 py-1 border border-slate-200 rounded-lg">
                                <span className="text-[10px] text-slate-500 font-semibold">Custom:</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={1440}
                                  value={wizardDelayMinutes}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => {
                                    const val = Number(e.target.value) || 30;
                                    setWizardDelayMinutes(val);
                                    setWizardTriggerValue(val);
                                  }}
                                  className="w-14 text-xs font-bold outline-none text-slate-900 text-center"
                                />
                                <span className="text-[10px] text-slate-500 font-semibold">mins</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Option 2: Recurring Frequency in Days */}
                      <div
                        onClick={() => {
                          setWizardTriggerType('RECURRING_DAYS');
                          setWizardTriggerUnit('days');
                          setWizardTriggerValue(wizardRecurringDays || 4);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          wizardTriggerType === 'RECURRING_DAYS'
                            ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                            <RepeatIcon className="w-3.5 h-3.5 text-blue-600" />
                            Recurring interval frequency (Every X days)
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            Days
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">
                          Send a periodic perk, message, or offer consistently every few days (e.g. every 4 days for Bhargavi).
                        </p>

                        {wizardTriggerType === 'RECURRING_DAYS' && (
                          <div className="pt-2 border-t border-orange-200/60 space-y-2">
                            <span className="text-[10px] font-bold text-slate-600 block">
                              Select or type interval in days:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {[2, 3, 4, 7, 10, 14, 30].map(days => (
                                <button
                                  key={days}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setWizardRecurringDays(days);
                                    setWizardTriggerValue(days);
                                    setWizardCooldownDays(days);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                    wizardRecurringDays === days
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  Every {days} Days
                                </button>
                              ))}
                              {/* Custom days input */}
                              <div className="flex items-center gap-1 bg-white px-2 py-1 border border-slate-200 rounded-lg">
                                <span className="text-[10px] text-slate-500 font-semibold">Every:</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={365}
                                  value={wizardRecurringDays}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => {
                                    const val = Number(e.target.value) || 4;
                                    setWizardRecurringDays(val);
                                    setWizardTriggerValue(val);
                                    setWizardCooldownDays(val);
                                  }}
                                  className="w-12 text-xs font-bold outline-none text-slate-900 text-center"
                                />
                                <span className="text-[10px] text-slate-500 font-semibold">Days</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Option 3: Particular Day of the Week */}
                      <div
                        onClick={() => {
                          setWizardTriggerType('DAY_OF_WEEK');
                          setWizardTriggerUnit('week');
                          setWizardTriggerValue(1);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          wizardTriggerType === 'DAY_OF_WEEK'
                            ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-purple-600" />
                            Every particular day of the week (e.g. Wednesday)
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            Weekly
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">
                          Automatically deliver weekly promotions every Wednesday, Friday, or chosen day.
                        </p>

                        {wizardTriggerType === 'DAY_OF_WEEK' && (
                          <div className="pt-2 border-t border-orange-200/60 space-y-2">
                            <span className="text-[10px] font-bold text-slate-600 block">
                              Select day of the week and send time:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setWizardDayOfWeek(day);
                                  }}
                                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                    wizardDayOfWeek === day
                                      ? 'bg-purple-600 text-white border-purple-600'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {day.slice(0, 3)}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[11px] text-slate-600 font-semibold">Preferred Send Time:</span>
                              <input
                                type="time"
                                value={wizardTimeOfDay}
                                onChange={e => setWizardTimeOfDay(e.target.value)}
                                className="px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Option 4: Inactivity Threshold */}
                      <div
                        onClick={() => {
                          setWizardTriggerType('INACTIVITY_DAYS');
                          setWizardTriggerUnit('days');
                          setWizardTriggerValue(wizardInactivityDays || 15);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          wizardTriggerType === 'INACTIVITY_DAYS'
                            ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            When customer becomes inactive (Win-Back)
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Inactivity
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">
                          Automatically win back customers who have not visited or ordered for N days.
                        </p>

                        {wizardTriggerType === 'INACTIVITY_DAYS' && (
                          <div className="pt-2 border-t border-orange-200/60 space-y-2">
                            <span className="text-[10px] font-bold text-slate-600 block">
                              Select or type inactive days threshold:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {[7, 14, 15, 21, 30, 45, 60].map(days => (
                                <button
                                  key={days}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setWizardInactivityDays(days);
                                    setWizardTriggerValue(days);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                    wizardInactivityDays === days
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {days} Days
                                </button>
                              ))}
                              {/* Custom days input */}
                              <div className="flex items-center gap-1 bg-white px-2 py-1 border border-slate-200 rounded-lg">
                                <span className="text-[10px] text-slate-500 font-semibold">Custom:</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={365}
                                  value={wizardInactivityDays}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => {
                                    const val = Number(e.target.value) || 15;
                                    setWizardInactivityDays(val);
                                    setWizardTriggerValue(val);
                                  }}
                                  className="w-12 text-xs font-bold outline-none text-slate-900 text-center"
                                />
                                <span className="text-[10px] text-slate-500 font-semibold">Days</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quiet Hours Protection */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
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
                        Prevents sending early morning or late night messages outside these business hours.
                      </p>
                      {wizardQuietHoursEnabled && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <span className="text-[10px] font-semibold text-slate-500">Earliest Send (Morning)</span>
                            <input
                              type="time"
                              value={wizardQuietHoursStart}
                              onChange={e => setWizardQuietHoursStart(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs mt-1"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-slate-500">Latest Send (Night)</span>
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
                  </div>
                )}

                {/* STEP 4: REVIEW & ACTIVATE */}
                {wizardStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Review & Activate Automation
                      </label>
                      <p className="text-xs text-slate-500 mb-3">
                        Carefully review your configured parameters before launching.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Name:</span>
                        <span className="font-bold text-slate-900">{wizardName}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Target Audience:</span>
                        <span className="font-bold text-indigo-900">
                          {wizardAudienceSegment === 'SPECIFIC_CUSTOMER'
                            ? `Specific Patron: ${wizardSpecificCustomerName || 'Guest'} (${wizardSpecificCustomerPhone || ''})`
                            : wizardAudienceSegment === 'INACTIVE'
                            ? 'Inactive Customers'
                            : wizardAudienceSegment === 'VIP'
                            ? 'VIP Spenders'
                            : wizardAudienceSegment === 'LOYAL'
                            ? 'Loyal Diners (3+ visits)'
                            : wizardAudienceSegment === 'NEW'
                            ? 'New Diners'
                            : 'All Customers'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Trigger & Schedule:</span>
                        <span className="font-semibold text-slate-900">
                          {wizardTriggerType === 'ORDER_COMPLETED'
                            ? `${wizardDelayMinutes} minutes after order completed`
                            : wizardTriggerType === 'RECURRING_DAYS'
                            ? `Every ${wizardRecurringDays} days recurring`
                            : wizardTriggerType === 'DAY_OF_WEEK'
                            ? `Every ${wizardDayOfWeek} at ${wizardTimeOfDay}`
                            : wizardTriggerType === 'INACTIVITY_DAYS'
                            ? `No order or visit for ${wizardInactivityDays} days`
                            : wizardTriggerType === 'BIRTHDAY'
                            ? 'On customer birthday at 10:00 AM'
                            : wizardTriggerType === 'VISIT_MILESTONE'
                            ? `Completed visit milestone reaches ${wizardMilestoneOrders}`
                            : `${wizardTriggerType} (${wizardTriggerValue} ${wizardTriggerUnit})`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Offer / Reward:</span>
                        <span className="font-bold text-amber-800">
                          {wizardOfferType === 'DISCOUNT_COINS'
                            ? `🪙 ${wizardOfferValue} Discount Coins`
                            : wizardOfferType === 'DISCOUNT_PERCENT'
                            ? `🏷️ ${wizardOfferValue}% Discount`
                            : wizardOfferType === 'FREE_ITEM'
                            ? `🍟 ${wizardOfferPerkText}`
                            : wizardOfferType === 'FLAT_DISCOUNT'
                            ? `Flat ₹${wizardOfferValue} Off`
                            : 'No Discount (Greeting only)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Channel:</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" />
                          {wizardChannel}
                        </span>
                      </div>
                    </div>

                    {/* Disconnected Provider Alert if WhatsApp chosen */}
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
                  {wizardStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (wizardStep === 1 && !wizardName.trim()) {
                          if (wizardAudienceSegment === 'SPECIFIC_CUSTOMER' && wizardSpecificCustomerName) {
                            setWizardName(`Special Automation for ${wizardSpecificCustomerName}`);
                          } else {
                            setWizardName(wizardGoal || 'Custom Automation');
                          }
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

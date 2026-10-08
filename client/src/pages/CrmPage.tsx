import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Users,
  Coins,
  Sparkles,
  TrendingUp,
  Receipt,
  Settings,
  Filter,
  Search,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Eye,
  X,
  ChevronRight,
  Save,
  Award,
  RefreshCw,
  Gift,
  Bot,
  Layers,
  Send,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import {
  Restaurant,
  Manager,
  Customer,
  CoinTransaction,
  CrmSettings,
  CrmOverviewStats,
  AiCrmDashboardData,
  AiRecommendation,
  AiSegment,
  AiCampaign,
  AiAutomation,
  MarketingChannelConfig,
  CustomerAiSummary
} from '../types';
import { AiGrowthTab } from '../components/crm/AiGrowthTab';
import { AiSegmentsTab } from '../components/crm/AiSegmentsTab';
import { AiCampaignBuilderTab } from '../components/crm/AiCampaignBuilderTab';
import { AiCampaignsTab } from '../components/crm/AiCampaignsTab';
import { AiAutomationsTab } from '../components/crm/AiAutomationsTab';
import { WhatsAppDeviceModal } from '../components/crm/WhatsAppDeviceModal';

interface CrmPageProps {
  restaurant: Restaurant | null;
  manager: Manager | null;
  onNavigateTab?: (tab: string) => void;
}

export const CrmPage: React.FC<CrmPageProps> = ({ restaurant, manager, onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState<
    'ai-growth' | 'ai-segments' | 'ai-builder' | 'ai-campaigns' | 'ai-automations' | 'overview' | 'customers' | 'ledger' | 'settings' | 'analytics'
  >('ai-growth');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // WhatsApp Device Connection State (Cached in localStorage for instant restoration)
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<boolean>(false);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState<boolean>(() => {
    return localStorage.getItem('swaad_wa_connected') === 'true';
  });
  const [whatsAppPhoneNumber, setWhatsAppPhoneNumber] = useState<string | null>(() => {
    return localStorage.getItem('swaad_wa_phone') || null;
  });

  // Overview Stats
  const [overview, setOverview] = useState<CrmOverviewStats | null>(null);

  // AI CRM Data States (Phases 1-40)
  const [aiDashboardData, setAiDashboardData] = useState<AiCrmDashboardData | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<AiRecommendation[]>([]);
  const [aiSegments, setAiSegments] = useState<AiSegment[]>([]);
  const [aiCampaigns, setAiCampaigns] = useState<AiCampaign[]>([]);
  const [aiAutomations, setAiAutomations] = useState<AiAutomation[]>([]);
  const [marketingChannels, setMarketingChannels] = useState<MarketingChannelConfig[]>([]);
  const [selectedCustomerAiSummary, setSelectedCustomerAiSummary] = useState<CustomerAiSummary | null>(null);

  // Campaign Builder Prefill Navigation State
  const [builderPrefillPrompt, setBuilderPrefillPrompt] = useState<string>('');
  const [builderPrefillRec, setBuilderPrefillRec] = useState<AiRecommendation | null>(null);
  const [builderPrefillSegment, setBuilderPrefillSegment] = useState<AiSegment | null>(null);

  // Customers
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerFilter, setCustomerFilter] = useState<string>('ALL');
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [customerCoinHistory, setCustomerCoinHistory] = useState<CoinTransaction[]>([]);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);

  // Direct Customer WhatsApp Message & Reward State
  const [directMessageText, setDirectMessageText] = useState<string>('');
  const [directMessageCoins, setDirectMessageCoins] = useState<number>(50);
  const [directMessageReason, setDirectMessageReason] = useState<string>('Special loyalty reward & perk');
  const [sendingDirectMessage, setSendingDirectMessage] = useState<boolean>(false);
  const [directMessageFeedback, setDirectMessageFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Coin Ledger
  const [ledgerTransactions, setLedgerTransactions] = useState<CoinTransaction[]>([]);

  // Settings
  const [settings, setSettings] = useState<CrmSettings>({
    id: '',
    restaurantId: restaurant?.id || '',
    enabled: true,
    coinsPerAmount: 10,
    coinsEarnedPerUnit: 1,
    signupBonusEnabled: true,
    signupBonusCoins: 100,
    minOrderValue: 300,
    redemptionCoinsUnit: 100,
    redemptionDiscountUnit: 10,
    maxDiscountPerOrder: 100,
    allowFullDiscount: false,
    earnOnFood: true,
    earnOnTax: false,
    earnOnService: false,
    earnOnDelivery: false
  });
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<string | null>(null);

  // Manual Adjust Modal
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [adjustCustomerId, setAdjustCustomerId] = useState<string>('');
  const [adjustCoins, setAdjustCoins] = useState<number>(50);
  const [adjustReason, setAdjustReason] = useState<string>('Customer satisfaction compensation');
  const [adjustSubmitting, setAdjustSubmitting] = useState<boolean>(false);
  const [adjustError, setAdjustError] = useState<string>('');

  // Analytics
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    loadAllCrmData();
  }, [restaurant?.id]);

  const loadAllCrmData = async () => {
    setLoading(true);
    try {
      const [
        overviewRes,
        customersRes,
        ledgerRes,
        settingsRes,
        analyticsRes,
        aiDashRes,
        aiRecsRes,
        aiSegsRes,
        aiCampsRes,
        aiAutosRes,
        aiChansRes,
        whatsAppRes
      ] = await Promise.all([
        api.getCrmOverview().catch(() => ({ success: false, overview: null })),
        api.getCustomers(customerFilter, customerSearch).catch(() => ({ success: false, customers: [] })),
        api.getCoinLedger().catch(() => ({ success: false, transactions: [] })),
        api.getCrmSettings().catch(() => ({ success: false, settings: null })),
        api.getCrmAnalytics().catch(() => ({ success: false, overview: null, topSpenders: [], topFrequent: [], segments: null })),
        api.getAiCrmDashboard().catch(() => ({ success: false, data: null })),
        api.getAiRecommendations().catch(() => ({ success: false, recommendations: [] })),
        api.getAiSegments().catch(() => ({ success: false, segments: [] })),
        api.getAiCampaigns().catch(() => ({ success: false, campaigns: [] })),
        api.getAiAutomations().catch(() => ({ success: false, automations: [] })),
        api.getMarketingChannels().catch(() => ({ success: false, channels: [] })),
        api.getWhatsAppStatus().catch(() => ({ success: false, data: null }))
      ]);

      if (overviewRes.success && overviewRes.overview) {
        setOverview(overviewRes.overview);
      }
      if (customersRes.success && customersRes.customers) {
        setCustomers(customersRes.customers);
      }
      if (ledgerRes.success && ledgerRes.transactions) {
        setLedgerTransactions(ledgerRes.transactions);
      }
      if (settingsRes.success && settingsRes.settings) {
        setSettings(settingsRes.settings);
      }
      if (analyticsRes.success) {
        setAnalyticsData(analyticsRes);
      }
      if (aiDashRes.success && ((aiDashRes as any).dashboard || (aiDashRes as any).data)) {
        setAiDashboardData((aiDashRes as any).dashboard || (aiDashRes as any).data);
      }
      if (aiRecsRes.success && aiRecsRes.recommendations) {
        setAiRecommendations(aiRecsRes.recommendations);
      }
      if (aiSegsRes.success && aiSegsRes.segments) {
        setAiSegments(aiSegsRes.segments);
      }
      if (aiCampsRes.success && aiCampsRes.campaigns) {
        setAiCampaigns(aiCampsRes.campaigns);
      }
      if (aiAutosRes.success && aiAutosRes.automations) {
        setAiAutomations(aiAutosRes.automations);
      }
      if (aiChansRes.success && aiChansRes.channels) {
        const chanObj = (aiChansRes as any).channels;
        const configArr: MarketingChannelConfig[] = [
          { id: 'chan_whatsapp', channel: 'WHATSAPP', connected: chanObj?.whatsapp !== false, optOutCount: 4, dailyLimit: 500 },
          { id: 'chan_sms', channel: 'SMS', connected: chanObj?.sms !== false, optOutCount: 12, dailyLimit: 1000 },
          { id: 'chan_email', channel: 'EMAIL', connected: chanObj?.email !== false, optOutCount: 2, dailyLimit: 2000 }
        ];
        setMarketingChannels(configArr);
      }
      if (whatsAppRes && (whatsAppRes as any).success && (whatsAppRes as any).data) {
        const waData = (whatsAppRes as any).data;
        const isConn = waData.status === 'CONNECTED';
        const phone = waData.phoneNumber || null;
        setIsWhatsAppConnected(isConn);
        setWhatsAppPhoneNumber(phone);
        localStorage.setItem('swaad_wa_connected', isConn ? 'true' : 'false');
        if (phone) localStorage.setItem('swaad_wa_phone', phone);
        else localStorage.removeItem('swaad_wa_phone');
      }
    } catch (err) {
      console.error('Failed to load CRM data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllCrmData();
  };

  // Filter & Search customers
  const handleFilterCustomers = async (filter: string) => {
    setCustomerFilter(filter);
    try {
      const res = await api.getCustomers(filter, customerSearch);
      if (res.success && res.customers) {
        setCustomers(res.customers);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchCustomers = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.getCustomers(customerFilter, customerSearch);
      if (res.success && res.customers) {
        setCustomers(res.customers);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // View Customer Profile Drawer
  const handleViewCustomer = async (cust: Customer) => {
    setSelectedCustomer(cust);
    setSelectedCustomerAiSummary(null);
    setDirectMessageCoins(50);
    setDirectMessageReason('Special loyalty reward & perk');
    setDirectMessageText(`Hey ${cust.name.split(' ')[0]}! We loved serving you at ${restaurant?.name || 'SwaadSevak'}. We've credited 50 Discount Coins to your wallet for your next visit! ❤️`);
    setDirectMessageFeedback(null);
    setLoadingProfile(true);
    try {
      const [custRes, aiRes] = await Promise.all([
        api.getCustomer(cust.id),
        api.getCustomerAiSummary(cust.id).catch(() => ({ success: false, summary: null }))
      ]);
      if (custRes.success) {
        setSelectedCustomer(custRes.customer);
        setCustomerOrders(custRes.orders || []);
        setCustomerCoinHistory(custRes.coinHistory || []);
      }
      if (aiRes.success && aiRes.summary) {
        setSelectedCustomerAiSummary(aiRes.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Send Direct Message & Award Loyalty to Selected Customer
  const handleSendDirectMessage = async () => {
    if (!selectedCustomer) return;
    if (!directMessageText.trim()) {
      setDirectMessageFeedback({ type: 'error', message: 'Message text cannot be empty.' });
      return;
    }

    setSendingDirectMessage(true);
    setDirectMessageFeedback(null);

    try {
      const res = await api.sendDirectCustomerMessage(selectedCustomer.id, {
        message: directMessageText.trim(),
        coins: directMessageCoins,
        reason: directMessageReason.trim() || 'Direct Loyalty Reward & Perk'
      });

      if (res.success) {
        setDirectMessageFeedback({
          type: res.waSent ? 'success' : 'error',
          message: res.message
        });

        if (res.customer) {
          setSelectedCustomer(res.customer);
          setCustomers(prev => prev.map(c => c.id === res.customer.id ? res.customer : c));
        }

        if (res.transaction) {
          setCustomerCoinHistory(prev => [res.transaction!, ...prev]);
        }
      } else {
        setDirectMessageFeedback({ type: 'error', message: res.message || 'Failed to send message.' });
      }
    } catch (e: any) {
      setDirectMessageFeedback({ type: 'error', message: e.message || 'Error sending direct message.' });
    } finally {
      setSendingDirectMessage(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsSaveMsg(null);
    try {
      const res = await api.updateCrmSettings(settings);
      if (res.success && res.settings) {
        setSettings(res.settings);
        setSettingsSaveMsg('CRM & Discount Coin settings saved successfully!');
        setTimeout(() => setSettingsSaveMsg(null), 4000);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Manual Adjust Coins
  const handlePerformAdjustment = async () => {
    if (!adjustCustomerId) {
      setAdjustError('Please select a customer');
      return;
    }
    if (!adjustReason.trim()) {
      setAdjustError('Reason is required');
      return;
    }
    if (adjustCoins === 0) {
      setAdjustError('Coins adjustment must not be zero');
      return;
    }

    setAdjustSubmitting(true);
    setAdjustError('');
    try {
      const res = await api.adjustCustomerCoins(adjustCustomerId, adjustCoins, adjustReason.trim());
      if (res.success) {
        setShowAdjustModal(false);
        // Refresh customer list & ledger
        handleRefresh();
        if (selectedCustomer && selectedCustomer.id === adjustCustomerId) {
          handleViewCustomer(res.customer);
        }
      } else {
        setAdjustError(res.message || 'Failed to adjust coins');
      }
    } catch (e: any) {
      setAdjustError(e.message || 'Adjustment failed');
    } finally {
      setAdjustSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VIP':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">👑 VIP</span>;
      case 'REGULAR':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Regular</span>;
      case 'NEW':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">New</span>;
      case 'AT_RISK':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">⚠️ At Risk</span>;
      case 'INACTIVE':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">Inactive</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-5 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
            🪙
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Customer Loyalty & CRM</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">
                SwaadSevak Coins
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Reward returning diners, build customer profiles, and automate retention
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Restaurant WhatsApp Device Link */}
          <button
            onClick={() => setShowWhatsAppModal(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isWhatsAppConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            }`}
            title="Connect your restaurant WhatsApp phone for automated campaign messaging"
          >
            <span className={`w-2 h-2 rounded-full ${isWhatsAppConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>
              {isWhatsAppConnected ? `WhatsApp: ${whatsAppPhoneNumber || 'Connected'}` : '📱 Link Restaurant WhatsApp'}
            </span>
          </button>

          {/* Quick Active Switch */}
          <button
            onClick={() => {
              const updated = !settings.enabled;
              setSettings(prev => ({ ...prev, enabled: updated }));
              api.updateCrmSettings({ enabled: updated });
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              settings.enabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${settings.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span>Discount Coins: {settings.enabled ? 'Active (ON)' : 'Disabled (OFF)'}</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh CRM Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-orange-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* CRM Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto text-xs font-semibold no-scrollbar">
        {/* AI Growth Group */}
        <button
          onClick={() => setActiveTab('ai-growth')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ai-growth'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Growth</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse ml-0.5" />
        </button>

        <button
          onClick={() => setActiveTab('ai-segments')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ai-segments'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Segments</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold">
            {aiSegments.length || 7}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ai-builder')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ai-builder'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-orange-400" />
          <span>AI Campaign Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-campaigns')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ai-campaigns'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Campaigns & ROI</span>
          {aiCampaigns.some(c => c.status === 'PENDING_APPROVAL') && (
            <span className="w-2 h-2 rounded-full bg-amber-400" title="Approval required" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('ai-automations')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ai-automations'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Automations</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800 font-bold">
            {aiAutomations.filter(a => a.status === 'ACTIVE').length} live
          </span>
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-1 shrink-0" />

        {/* Core CRM Group */}
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'customers'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <span>Directory</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold border border-slate-200">
            {customers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ledger'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-slate-600" />
          <span>Coins Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <span>Retention Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-slate-600" />
          <span>Loyalty Rules</span>
        </button>
      </div>

      {/* TAB: AI GROWTH (Phase 1) */}
      {activeTab === 'ai-growth' && (
        <AiGrowthTab
          dashboardData={aiDashboardData}
          recommendations={aiRecommendations}
          onOpenCampaignBuilder={(prompt, rec) => {
            setBuilderPrefillPrompt(prompt || '');
            setBuilderPrefillRec(rec || null);
            setBuilderPrefillSegment(null);
            setActiveTab('ai-builder');
          }}
          onNavigateTab={(tab) => {
            if (tab === 'segments') setActiveTab('ai-segments');
            else if (tab === 'builder') setActiveTab('ai-builder');
            else if (tab === 'campaigns') setActiveTab('ai-campaigns');
            else if (tab === 'automations') setActiveTab('ai-automations');
            else if (tab === 'customers') setActiveTab('customers');
            else setActiveTab(tab);
          }}
          onDismissRec={(recId) => {
            setAiRecommendations(prev => prev.filter(r => r.id !== recId));
          }}
        />
      )}

      {/* TAB: AI SEGMENTS (Phase 4) */}
      {activeTab === 'ai-segments' && (
        <AiSegmentsTab
          segments={aiSegments}
          onOpenCampaignBuilder={(prompt, rec, segment) => {
            setBuilderPrefillPrompt(prompt || '');
            setBuilderPrefillRec(rec || null);
            setBuilderPrefillSegment(segment || null);
            setActiveTab('ai-builder');
          }}
          onFilterCustomersBySegment={(segId) => {
            handleFilterCustomers('ALL');
            setActiveTab('customers');
          }}
        />
      )}

      {/* TAB: AI CAMPAIGN BUILDER (Phases 5-10, 19, 20) */}
      {activeTab === 'ai-builder' && (
        <AiCampaignBuilderTab
          restaurant={restaurant}
          customers={customers}
          initialPrompt={builderPrefillPrompt}
          initialRecommendation={builderPrefillRec}
          initialSegment={builderPrefillSegment}
          onCampaignCreated={(newCamp) => {
            setAiCampaigns(prev => [newCamp, ...prev]);
          }}
          onNavigateTab={(tab) => {
            if (tab === 'campaigns') setActiveTab('ai-campaigns');
            else if (tab === 'growth') setActiveTab('ai-growth');
            else setActiveTab(tab);
          }}
        />
      )}

      {/* TAB: AI CAMPAIGNS & ROI (Phases 21, 23, 33) */}
      {activeTab === 'ai-campaigns' && (
        <AiCampaignsTab
          campaigns={aiCampaigns}
          onRefreshCampaigns={async () => {
            const res = await api.getAiCampaigns().catch(() => ({ success: false, campaigns: [] }));
            if (res.success && res.campaigns) setAiCampaigns(res.campaigns);
          }}
          onOpenCampaignBuilder={() => {
            setBuilderPrefillPrompt('');
            setBuilderPrefillRec(null);
            setBuilderPrefillSegment(null);
            setActiveTab('ai-builder');
          }}
        />
      )}

      {/* TAB: AI AUTOMATIONS (Phases 11-15, 34, 35) */}
      {activeTab === 'ai-automations' && (
        <AiAutomationsTab
          automations={aiAutomations}
          channels={marketingChannels}
          isWhatsAppConnected={isWhatsAppConnected}
          whatsAppPhoneNumber={whatsAppPhoneNumber}
          onOpenWhatsAppModal={() => setShowWhatsAppModal(true)}
          onRefreshAutomations={async () => {
            const res = await api.getAiAutomations().catch(() => ({ success: false, automations: [] }));
            if (res.success && res.automations) setAiAutomations(res.automations);
          }}
          onRefreshChannels={async () => {
            const res = await api.getMarketingChannels().catch(() => ({ success: false, channels: { whatsapp: true, sms: true, email: true } }));
            if (res.success && res.channels) {
              const chanObj = res.channels as any;
              setMarketingChannels([
                { id: 'chan_whatsapp', channel: 'WHATSAPP', connected: chanObj?.whatsapp !== false, optOutCount: 4, dailyLimit: 500 },
                { id: 'chan_sms', channel: 'SMS', connected: chanObj?.sms !== false, optOutCount: 12, dailyLimit: 1000 },
                { id: 'chan_email', channel: 'EMAIL', connected: chanObj?.email !== false, optOutCount: 2, dailyLimit: 2000 }
              ]);
            }
          }}
        />
      )}

      {/* TAB 1: OVERVIEW (Phase 17) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Growth Engine Retention Callout (Phase 23) */}
          {overview && overview.atRiskCustomers > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border border-amber-300/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                  🔥
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-950">
                    {overview.atRiskCustomers} customers are at risk of becoming inactive
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Recommended action: Send a promotional ₹100 Discount Coin bonus to customers whose average order exceeds ₹500.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    handleFilterCustomers('AT_RISK');
                    setActiveTab('customers');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-900 text-white text-xs font-bold hover:bg-amber-950 transition-all shadow-xs"
                >
                  View At-Risk Customers
                </button>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('growth')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-50 transition-all"
                  >
                    Open Growth Engine →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 8 Metric KPI Cards (Phase 17) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Total Customers</span>
              <span className="text-2xl font-black text-slate-900 block mt-1">
                {overview?.totalCustomers.toLocaleString('en-IN') || 0}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Dine-in + QR Diners</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Identified Customers</span>
              <span className="text-2xl font-black text-emerald-600 block mt-1">
                {overview?.identifiedCustomers.toLocaleString('en-IN') || 0}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Loyalty Profile Active</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Guest Customers</span>
              <span className="text-2xl font-black text-slate-700 block mt-1">
                {overview?.anonymousCustomers.toLocaleString('en-IN') || 0}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Quick Guest Orders</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Active Customers (30d)</span>
              <span className="text-2xl font-black text-blue-600 block mt-1">
                {overview?.activeCustomers.toLocaleString('en-IN') || 0}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Visited within 30 days</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">At-Risk Customers</span>
              <span className="text-2xl font-black text-amber-600 block mt-1">
                {overview?.atRiskCustomers.toLocaleString('en-IN') || 0}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">30–60 days inactive</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Total Coins Issued</span>
              <span className="text-2xl font-black text-orange-600 block mt-1">
                🪙 {overview?.totalCoinsIssued.toLocaleString('en-IN') || 0}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Signups & Order rewards</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Total Coins Redeemed</span>
              <span className="text-2xl font-black text-purple-600 block mt-1">
                🪙 {overview?.totalCoinsRedeemed.toLocaleString('en-IN') || 0}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {formatCurrency(overview?.totalDiscountGenerated || 0)} discounts given
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Outstanding Liability</span>
              <span className="text-2xl font-black text-amber-700 block mt-1">
                🪙 {overview?.outstandingLiability.toLocaleString('en-IN') || 0}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Current wallet balances</span>
            </div>
          </div>

          {/* Quick Action Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-slate-900">Repeat Customer Rate</h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {overview?.repeatCustomerRate || 0}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Percentage of identified diners who have returned for 2 or more dining sessions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Returning Customers</span>
                <span className="font-bold text-slate-900">{overview?.returningCustomers || 0} diners</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-slate-900">Coin Redemption Rate</h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                    {overview?.redemptionRate || 0}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Rate at which issued coins are redeemed for discounts, driving repeat footfall.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Avg Coins / Customer</span>
                <span className="font-bold text-slate-900">{overview?.avgCoinsPerCustomer || 0} coins</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs text-orange-400 font-bold block mb-1">QUICK ACTIONS</span>
                <h4 className="font-bold text-sm text-white">Manual Coin Adjustment</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Credit compensation or loyalty bonus directly to any customer's wallet.
                </p>
              </div>
              <button
                onClick={() => {
                  setAdjustCustomerId(customers[0]?.id || '');
                  setShowAdjustModal(true);
                }}
                className="mt-4 w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adjust Customer Coins</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMERS (Phase 18) */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <form onSubmit={handleSearchCustomers} className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search customer by name or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </form>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAdjustCustomerId(customers[0]?.id || '');
                    setShowAdjustModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manual Adjust Coins</span>
                </button>
              </div>
            </div>

            {/* Filter Chips (Phase 18) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
              {[
                { id: 'ALL', label: 'All Customers' },
                { id: 'NEW', label: 'New' },
                { id: 'RETURNING', label: 'Returning' },
                { id: 'VIP', label: '👑 VIP' },
                { id: 'AT_RISK', label: '⚠️ At Risk' },
                { id: 'INACTIVE', label: 'Inactive' },
                { id: 'HIGH_SPENDING', label: 'High Spending (>₹5k)' },
                { id: 'HIGH_FREQUENCY', label: 'High Frequency (8+)' }
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => handleFilterCustomers(chip.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    customerFilter === chip.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 whitespace-nowrap">Customer</th>
                    <th className="py-3 px-2 whitespace-nowrap">Phone</th>
                    <th className="py-3 px-2 text-center whitespace-nowrap">Orders</th>
                    <th className="py-3 px-2 text-right whitespace-nowrap">Total Spent</th>
                    <th className="py-3 px-2 text-right whitespace-nowrap hidden xl:table-cell">Avg Order</th>
                    <th className="py-3 px-2 whitespace-nowrap hidden lg:table-cell">Last Visit</th>
                    <th className="py-3 px-2 text-right whitespace-nowrap">Discount Coins</th>
                    <th className="py-3 px-2 text-center whitespace-nowrap">Status</th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        No customers found matching filter.
                      </td>
                    </tr>
                  ) : (
                    customers.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => handleViewCustomer(c)}
                        className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                      >
                        <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
                              {c.name.slice(0, 1)}
                            </div>
                            <span className="truncate max-w-[130px]">{c.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                          {c.phone.length === 10 ? `${c.phone.slice(0, 2)}XXXXXX${c.phone.slice(-2)}` : c.phone}
                        </td>
                        <td className="py-2.5 px-2 text-center font-semibold text-slate-700 whitespace-nowrap">
                          {c.totalOrders}
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-slate-900 whitespace-nowrap">
                          {formatCurrency(c.totalSpent)}
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-600 whitespace-nowrap hidden xl:table-cell">
                          {formatCurrency(c.avgOrderValue)}
                        </td>
                        <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap text-[11px] hidden lg:table-cell">
                          {new Date(c.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-amber-700 whitespace-nowrap">
                          🪙 {c.coinBalance}
                        </td>
                        <td className="py-2.5 px-2 text-center whitespace-nowrap">
                          {getStatusBadge(c.status)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCustomer(c);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-orange-600 group-hover:text-white text-slate-700 font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                          >
                            Profile →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISCOUNT COINS LEDGER (Phase 20) */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Discount Coin Transaction Ledger</h3>
              <p className="text-xs text-slate-500">
                Immutable record of every loyalty coin credited, redeemed, refunded, or adjusted
              </p>
            </div>
            <button
              onClick={() => {
                setAdjustCustomerId(customers[0]?.id || '');
                setShowAdjustModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manual Adjustment</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 whitespace-nowrap">Date & Time</th>
                    <th className="py-3 px-4 whitespace-nowrap">Customer</th>
                    <th className="py-3 px-4 whitespace-nowrap">Type</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Coins</th>
                    <th className="py-3 px-4 whitespace-nowrap">Order / Ref</th>
                    <th className="py-3 px-4 whitespace-nowrap">Reason</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Balance After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ledgerTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No coin transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    ledgerTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}{' '}
                          <span className="text-[10px] text-slate-400">
                            {new Date(tx.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {tx.customerName || 'Customer'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.type === 'SIGNUP_BONUS' ? 'bg-amber-100 text-amber-800' :
                            tx.type === 'ORDER_EARN' ? 'bg-emerald-100 text-emerald-800' :
                            tx.type === 'REDEMPTION' ? 'bg-purple-100 text-purple-800' :
                            tx.type === 'ADMIN_ADJUSTMENT' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right font-black whitespace-nowrap ${
                          tx.coins > 0 ? 'text-emerald-600' : 'text-purple-600'
                        }`}>
                          {tx.coins > 0 ? `+${tx.coins}` : tx.coins}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                          {tx.orderId ? tx.orderId.slice(-8) : '—'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                          {tx.reason || 'Loyalty transaction'}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-amber-800 whitespace-nowrap">
                          🪙 {tx.balanceAfter}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS (Phases 3, 4, 26) */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl space-y-6">
          {settingsSaveMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{settingsSaveMsg}</span>
            </div>
          )}

          {/* Master Switch Card (Phase 3) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Discount Coins Master Switch</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reward customers for ordering and let them redeem coins for discounts.
                </p>
              </div>

              <button
                onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                  settings.enabled ? 'bg-orange-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    settings.enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {!settings.enabled && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold">System Inactive:</span> Coin prompts and redemption are hidden from diners. Existing customer balances and transaction history are preserved.
              </div>
            )}
          </div>

          {/* Configuration Rules (Phase 3.1, 3.2, 4) */}
          <div className={`space-y-5 ${!settings.enabled ? 'opacity-60 pointer-events-none' : ''}`}>
            {/* Earning Rules */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900">1. How Customers Earn Coins</h4>
              <p className="text-xs text-slate-500">
                Recommended default: 1 coin for every ₹10 of eligible order value.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-slate-700">Earn 1 coin for every ₹</span>
                <input
                  type="number"
                  min={1}
                  value={settings.coinsPerAmount}
                  onChange={(e) => setSettings(prev => ({ ...prev, coinsPerAmount: Number(e.target.value) || 10 }))}
                  className="w-24 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 outline-none focus:border-orange-500"
                />
                <span className="text-xs text-slate-500">spent by customer</span>
              </div>
            </div>

            {/* Signup Bonus */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">2. New Customer First Signup Bonus</h4>
                  <p className="text-xs text-slate-500">
                    Coins awarded once when a customer registers their profile. (Strict one-time protection per phone number).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.signupBonusEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, signupBonusEnabled: e.target.checked }))}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                />
              </div>

              {settings.signupBonusEnabled && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-semibold text-slate-700">Bonus Coins:</span>
                  <input
                    type="number"
                    min={0}
                    value={settings.signupBonusCoins}
                    onChange={(e) => setSettings(prev => ({ ...prev, signupBonusCoins: Number(e.target.value) || 100 }))}
                    className="w-24 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 outline-none focus:border-orange-500"
                  />
                  <span className="text-xs text-slate-500">coins given on welcome</span>
                </div>
              )}
            </div>

            {/* Redemption Rules (Phase 4) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-slate-900">3. How Customers Redeem Coins</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Minimum Order Value for Redemption
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={settings.minOrderValue}
                      onChange={(e) => setSettings(prev => ({ ...prev, minOrderValue: Number(e.target.value) || 300 }))}
                      className="w-full pl-7 pr-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 outline-none focus:border-orange-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Customer must order at least this amount to use coins</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maximum Discount Per Order
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={settings.maxDiscountPerOrder}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxDiscountPerOrder: Number(e.target.value) || 100 }))}
                      className="w-full pl-7 pr-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 outline-none focus:border-orange-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Caps max savings on a single order</span>
                </div>
              </div>

              {/* Conversion Ratio */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Coin-to-Discount Conversion
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={settings.redemptionCoinsUnit}
                    onChange={(e) => setSettings(prev => ({ ...prev, redemptionCoinsUnit: Number(e.target.value) || 100 }))}
                    className="w-20 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 outline-none focus:border-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-600">coins = ₹</span>
                  <input
                    type="number"
                    min={1}
                    value={settings.redemptionDiscountUnit}
                    onChange={(e) => setSettings(prev => ({ ...prev, redemptionDiscountUnit: Number(e.target.value) || 10 }))}
                    className="w-20 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 outline-none focus:border-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-600">discount</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Example: 100 coins = ₹10 OFF
                </p>
              </div>

              {/* Earn Coins On Checkboxes (Phase 26) */}
              <div className="pt-2">
                <span className="block text-xs font-semibold text-slate-700 mb-2">Earn Coins On:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.earnOnFood}
                      onChange={(e) => setSettings(prev => ({ ...prev, earnOnFood: e.target.checked }))}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span>Food Items (Recommended)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.earnOnTax}
                      onChange={(e) => setSettings(prev => ({ ...prev, earnOnTax: e.target.checked }))}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span>Taxes & GST</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.earnOnService}
                      onChange={(e) => setSettings(prev => ({ ...prev, earnOnService: e.target.checked }))}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span>Service Charges</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.earnOnDelivery}
                      onChange={(e) => setSettings(prev => ({ ...prev, earnOnDelivery: e.target.checked }))}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span>Delivery Charges</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {savingSettings ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save CRM & Coin Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS (Phase 21) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Leaderboards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Top Spenders */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <span>Top Spending Customers</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">VIP</span>
              </h3>
              <div className="divide-y divide-slate-100">
                {analyticsData?.topSpenders?.slice(0, 5).map((cust: Customer, idx: number) => (
                  <div key={cust.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 font-bold text-xs text-slate-400">#{idx + 1}</span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{cust.name}</h4>
                        <span className="text-[11px] text-slate-500">{cust.totalOrders} visits</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs text-slate-900 block">{formatCurrency(cust.totalSpent)}</span>
                      <span className="text-[11px] text-amber-700 font-medium">🪙 {cust.coinBalance} coins</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Frequency */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <span>Most Frequent Diners</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">Loyal</span>
              </h3>
              <div className="divide-y divide-slate-100">
                {analyticsData?.topFrequent?.slice(0, 5).map((cust: Customer, idx: number) => (
                  <div key={cust.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 font-bold text-xs text-slate-400">#{idx + 1}</span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{cust.name}</h4>
                        <span className="text-[11px] text-slate-500">Avg {formatCurrency(cust.avgOrderValue)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs text-slate-900 block">{cust.totalOrders} orders</span>
                      <span className="text-[11px] text-slate-400">
                        Last visit: {new Date(cust.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Segment Breakdown */}
          {analyticsData?.segments && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-3">Customer Lifecycle Segments</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center">
                  <span className="text-[11px] text-purple-700 font-bold block">👑 VIP</span>
                  <span className="text-xl font-black text-purple-900 block mt-0.5">{analyticsData.segments.vip}</span>
                  <span className="text-[10px] text-purple-600">High spending diners</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-[11px] text-blue-700 font-bold block">Regular</span>
                  <span className="text-xl font-black text-blue-900 block mt-0.5">{analyticsData.segments.regular}</span>
                  <span className="text-[10px] text-blue-600">3+ orders</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[11px] text-emerald-700 font-bold block">New</span>
                  <span className="text-xl font-black text-emerald-900 block mt-0.5">{analyticsData.segments.new}</span>
                  <span className="text-[10px] text-emerald-600">First time diners</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[11px] text-amber-700 font-bold block">⚠️ At Risk</span>
                  <span className="text-xl font-black text-amber-900 block mt-0.5">{analyticsData.segments.atRisk}</span>
                  <span className="text-[10px] text-amber-600">No visit in 30-60d</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                  <span className="text-[11px] text-gray-700 font-bold block">Inactive</span>
                  <span className="text-xl font-black text-gray-900 block mt-0.5">{analyticsData.segments.inactive}</span>
                  <span className="text-[10px] text-gray-600">&gt;60 days dormant</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CUSTOMER PROFILE DRAWER / MODAL (Phase 19) */}
      {selectedCustomer && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCustomer(null);
          }}
        >
          <div className="bg-white w-full sm:max-w-md h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {selectedCustomer.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{selectedCustomer.name}</h3>
                    {getStatusBadge(selectedCustomer.status)}
                  </div>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    {selectedCustomer.phone.length === 10
                      ? `${selectedCustomer.phone.slice(0, 2)}XXXXXX${selectedCustomer.phone.slice(-2)}`
                      : selectedCustomer.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="flex-1 overflow-y-auto p-5 pb-8 space-y-5">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Orders</span>
                  <span className="text-base font-black text-slate-900 block mt-0.5">{selectedCustomer.totalOrders}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Total Spent</span>
                  <span className="text-base font-black text-slate-900 block mt-0.5">{formatCurrency(selectedCustomer.totalSpent)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Avg Order</span>
                  <span className="text-base font-black text-slate-900 block mt-0.5">{formatCurrency(selectedCustomer.avgOrderValue)}</span>
                </div>
              </div>

              {/* AI Customer Summary & Intelligence Card (Phases 24-27) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-stone-900 to-orange-950 text-white border border-stone-800 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-orange-300">AI Customer Intelligence</span>
                  </div>
                  {/* Churn Risk Badge (Phase 26) */}
                  {selectedCustomerAiSummary ? (() => {
                    const risk = selectedCustomerAiSummary.churnRisk;
                    const level = typeof risk === 'string' ? risk : risk?.level || 'LOW';
                    return (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        level === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : level === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {level === 'HIGH' ? '🔴 High Churn Risk' :
                         level === 'MEDIUM' ? '🟡 Medium Risk' : '🟢 Low Churn Risk'}
                      </span>
                    );
                  })() : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                      Analyzing...
                    </span>
                  )}
                </div>

                {/* AI Summary Text (Phase 24) */}
                <p className="text-xs text-stone-300 leading-relaxed font-normal">
                  {selectedCustomerAiSummary?.summary || selectedCustomerAiSummary?.summaryText ||
                    `${selectedCustomer.name} has visited ${selectedCustomer.totalOrders} times with an average spend of ${formatCurrency(selectedCustomer.avgOrderValue)}.`}
                </p>

                {/* Estimated Customer Lifetime Value (CLV - Phase 25) */}
                {selectedCustomerAiSummary && (
                  <div className="p-2.5 rounded-xl bg-stone-800/80 border border-stone-700/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Estimated Lifetime Value (CLV)</span>
                      <span className="text-sm font-black text-amber-300 block mt-0.5">
                        {formatCurrency(selectedCustomerAiSummary.estimatedLifetimeValue || selectedCustomerAiSummary.estimatedClv || 0)}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 bg-stone-900/60 px-2 py-0.5 rounded border border-stone-700">
                      Estimated
                    </span>
                  </div>
                )}

                {/* Recommended Next Action (Phase 27) */}
                {selectedCustomerAiSummary?.nextBestAction && (() => {
                  const recAction = selectedCustomerAiSummary.nextBestAction;
                  const actionName = recAction?.action || recAction?.actionText || recAction?.title || 'Send campaign';
                  const actionReason = recAction?.reason || '';

                  return (
                    <div className="pt-2 border-t border-stone-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-orange-400 block">Recommended Next Action:</span>
                          <span className="text-xs font-bold text-white block mt-0.5">
                            {actionName}
                          </span>
                          <span className="text-[11px] text-stone-400 block mt-0.5">
                            {actionReason}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setBuilderPrefillPrompt(`Create campaign: ${actionName} for customer ${selectedCustomer.name}. Reason: ${actionReason}`);
                          setBuilderPrefillRec(null);
                          setBuilderPrefillSegment(null);
                          setSelectedCustomer(null);
                          setActiveTab('ai-builder');
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Create Campaign for {selectedCustomer.name.split(' ')[0]}</span>
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Wallet Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-800 font-medium block">Discount Coin Balance</span>
                  <span className="text-2xl font-black text-amber-900 block mt-0.5">
                    🪙 {selectedCustomer.coinBalance} <span className="text-xs font-bold text-amber-700">Coins</span>
                  </span>
                  <span className="text-[11px] text-amber-700 block mt-0.5">
                    Total Earned: {selectedCustomer.totalCoinsEarned} • Redeemed: {selectedCustomer.totalCoinsRedeemed}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setAdjustCustomerId(selectedCustomer.id);
                    setShowAdjustModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all"
                >
                  Adjust Coins
                </button>
              </div>

              {/* Direct WhatsApp Message & Loyalty Award */}
              <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Direct WhatsApp & Reward</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          1-to-1
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Send WhatsApp message to {selectedCustomer.phone} and award coins
                      </p>
                    </div>
                  </div>
                </div>

                {/* Award Coins Chips */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">
                    Award Discount Coins / Perk:
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[0, 25, 50, 75, 100, 150].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setDirectMessageCoins(c);
                          if (c > 0 && !directMessageText.includes('Coins')) {
                            setDirectMessageText(prev => `${prev} Plus ₹${c} Discount Coins on us!`);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          directMessageCoins === c
                            ? 'bg-amber-500 text-slate-950 shadow-2xs font-extrabold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {c === 0 ? 'No Coins' : `+${c} 🪙`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Message Templates */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">
                    Quick Templates:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDirectMessageCoins(50);
                        setDirectMessageReason('Loyalty appreciation reward');
                        setDirectMessageText(`Hey ${selectedCustomer.name.split(' ')[0]}! We loved having you at ${restaurant?.name || 'SwaadSevak'}. We've added 50 Discount Coins to your wallet for your next visit! ❤️`);
                      }}
                      className="p-2 rounded-xl border border-slate-200 text-left hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-[11px] cursor-pointer"
                    >
                      <span className="font-bold text-slate-800 block">🎁 Loyalty Perk</span>
                      <span className="text-[10px] text-slate-500 truncate block">+50 Coins gift</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDirectMessageCoins(75);
                        setDirectMessageReason('Win-back incentive');
                        setDirectMessageText(`Hey ${selectedCustomer.name.split(' ')[0]}! We haven't seen you in a while at ${restaurant?.name || 'SwaadSevak'}. Here is a ₹75 Discount Coin perk for your next visit! See you soon!`);
                      }}
                      className="p-2 rounded-xl border border-slate-200 text-left hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-[11px] cursor-pointer"
                    >
                      <span className="font-bold text-slate-800 block">🔥 We Miss You</span>
                      <span className="text-[10px] text-slate-500 truncate block">+75 Coins win-back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDirectMessageCoins(100);
                        setDirectMessageReason('VIP Patron privilege');
                        setDirectMessageText(`Dear ${selectedCustomer.name.split(' ')[0]}, thank you for being a valued guest at ${restaurant?.name || 'SwaadSevak'}. We've gifted you 100 VIP bonus coins for your next reservation! 👑`);
                      }}
                      className="p-2 rounded-xl border border-slate-200 text-left hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-[11px] cursor-pointer"
                    >
                      <span className="font-bold text-slate-800 block">👑 VIP Treat</span>
                      <span className="text-[10px] text-slate-500 truncate block">+100 Coins privilege</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDirectMessageCoins(0);
                        setDirectMessageText(`Hi ${selectedCustomer.name.split(' ')[0]}! Thank you for dining with us at ${restaurant?.name || 'SwaadSevak'}. Hope you loved your meal and see you again soon! ✨`);
                      }}
                      className="p-2 rounded-xl border border-slate-200 text-left hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-[11px] cursor-pointer"
                    >
                      <span className="font-bold text-slate-800 block">💬 Friendly Note</span>
                      <span className="text-[10px] text-slate-500 truncate block">No discount required</span>
                    </button>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">
                    WhatsApp Message Text:
                  </label>
                  <textarea
                    rows={3}
                    value={directMessageText}
                    onChange={(e) => setDirectMessageText(e.target.value)}
                    placeholder="Type your WhatsApp message..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed font-sans"
                  />
                </div>

                {/* Reason if coins > 0 */}
                {directMessageCoins > 0 && (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Coin Ledger Note:
                    </label>
                    <input
                      type="text"
                      value={directMessageReason}
                      onChange={(e) => setDirectMessageReason(e.target.value)}
                      placeholder="e.g. VIP loyalty appreciation"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                {/* Feedback Alert */}
                {directMessageFeedback && (
                  <div
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      directMessageFeedback.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    {directMessageFeedback.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-medium leading-tight">{directMessageFeedback.message}</span>
                  </div>
                )}

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSendDirectMessage}
                  disabled={sendingDirectMessage || !directMessageText.trim()}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {sendingDirectMessage
                      ? 'Sending...'
                      : directMessageCoins > 0
                      ? `Send WhatsApp & Award ${directMessageCoins} Coins`
                      : 'Send WhatsApp Message'}
                  </span>
                </button>
              </div>

              {/* Dates */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">FIRST VISIT</span>
                  <span className="font-semibold text-slate-900">{new Date(selectedCustomer.firstVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">LAST VISIT</span>
                  <span className="font-semibold text-slate-900">{new Date(selectedCustomer.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Order History (Phase 19) */}
              <div>
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">Order History</h4>
                {customerOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3">No orders recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.slice(0, 8).map(ord => (
                      <div key={ord.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{ord.orderNumber}</span>
                            <span className="text-[10px] text-slate-400">{ord.tableNumber}</span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • {ord.items?.length || 0} dishes
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">{formatCurrency(ord.total)}</span>
                          {ord.coinDiscount > 0 && (
                            <span className="text-[10px] text-purple-700 font-semibold">-₹{ord.coinDiscount} (🪙 {ord.coinsUsed})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coin History (Phase 19) */}
              <div>
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">Coin History Ledger</h4>
                {customerCoinHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3">No coin movements recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {customerCoinHistory.slice(0, 10).map(tx => (
                      <div key={tx.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              tx.coins > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {tx.type}
                            </span>
                            <span className="text-[11px] text-slate-600 truncate max-w-[180px]">{tx.reason}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • Balance after: {tx.balanceAfter}
                          </span>
                        </div>
                        <span className={`font-black text-xs ${tx.coins > 0 ? 'text-emerald-600' : 'text-purple-600'}`}>
                          {tx.coins > 0 ? `+${tx.coins}` : tx.coins}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Bottom Action Footer */}
            <div className="p-4 pb-6 sm:pb-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  setAdjustCustomerId(selectedCustomer.id);
                  setShowAdjustModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adjust Coins</span>
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MANUAL ADJUST COINS MODAL */}
      {showAdjustModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <h3 className="font-bold text-sm text-slate-900">Manual Coin Adjustment</h3>
              </div>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Customer</label>
                <select
                  value={adjustCustomerId}
                  onChange={(e) => setAdjustCustomerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-orange-500"
                >
                  <option value="">-- Choose Diner --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone.slice(-4)}) — Balance: {c.coinBalance} coins
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Coins to Adjust</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustCoins(prev => prev > 0 ? -Math.abs(prev) : Math.abs(prev))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      adjustCoins >= 0
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-purple-50 text-purple-800 border-purple-300'
                    }`}
                  >
                    {adjustCoins >= 0 ? '+ Add' : '- Deduct'}
                  </button>
                  <input
                    type="number"
                    value={adjustCoins}
                    onChange={(e) => setAdjustCoins(Number(e.target.value))}
                    className="flex-1 px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Adjustment <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Compensation for delay, VIP loyalty gift..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-orange-500"
                />
              </div>

              {adjustError && (
                <p className="text-xs text-red-600">{adjustError}</p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePerformAdjustment}
                  disabled={adjustSubmitting}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50"
                >
                  {adjustSubmitting ? 'Adjusting...' : 'Confirm Adjustment'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* WhatsApp Device Connection Modal */}
      <WhatsAppDeviceModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        onStatusChange={(connected, phone) => {
          setIsWhatsAppConnected(connected);
          setWhatsAppPhoneNumber(phone || null);
          localStorage.setItem('swaad_wa_connected', connected ? 'true' : 'false');
          if (phone) localStorage.setItem('swaad_wa_phone', phone);
          else localStorage.removeItem('swaad_wa_phone');
        }}
      />
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  RefreshCw,
  Zap,
  PauseCircle,
  PlayCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sliders,
  DollarSign,
  TrendingUp,
  Receipt,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Package,
  PlusCircle,
  HelpCircle,
  Printer,
  Sparkles,
  ArrowUpRight,
  Send,
  Eye,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import {
  Restaurant,
  Manager,
  MenuCategory,
  UnifiedMenuItem,
  AggregatorConnection,
  AggregatorSyncLog,
  AggregatorReconciliationSummary,
  KitchenIntelligence,
  Order
} from '../types';
import { api } from '../services/api';

interface AggregatorHubPageProps {
  restaurant: Restaurant | null;
  manager: Manager | null;
  orders: Order[];
  onRefreshOrders?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const AggregatorHubPage: React.FC<AggregatorHubPageProps> = ({
  restaurant,
  manager,
  orders,
  onRefreshOrders,
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'menu' | 'orders' | 'reconciliation' | 'logs'>('menu');
  const [loading, setLoading] = useState<boolean>(true);
  const [syncingMenu, setSyncingMenu] = useState<boolean>(false);
  const [connections, setConnections] = useState<AggregatorConnection[]>([]);
  const [kitchenIntel, setKitchenIntel] = useState<KitchenIntelligence | null>(null);
  const [menuItems, setMenuItems] = useState<UnifiedMenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [syncLogs, setSyncLogs] = useState<AggregatorSyncLog[]>([]);
  const [reconciliations, setReconciliations] = useState<AggregatorReconciliationSummary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [connectProvider, setConnectProvider] = useState<'SWIGGY' | 'ZOMATO'>('SWIGGY');
  const [connectForm, setConnectForm] = useState({ outletId: '', outletName: '', apiKey: '' });

  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState<boolean>(false);
  const [bulkPriceConfig, setBulkPriceConfig] = useState<{
    channels: ('SWIGGY' | 'ZOMATO' | 'SWAAD_SEVAK')[];
    adjustmentType: 'PERCENTAGE' | 'FIXED' | 'EXACT';
    adjustmentValue: number;
    rounding: 'NONE' | 'NEAREST_1' | 'NEAREST_5' | 'NEAREST_10';
  }>({
    channels: ['SWIGGY', 'ZOMATO'],
    adjustmentType: 'PERCENTAGE',
    adjustmentValue: 10,
    rounding: 'NEAREST_5'
  });
  const [bulkPreview, setBulkPreview] = useState<any[] | null>(null);
  const [bulkLoading, setBulkLoading] = useState<boolean>(false);

  const [isItemEditModalOpen, setIsItemEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<UnifiedMenuItem | null>(null);
  const [editForm, setEditForm] = useState<{
    priceMode: 'SAME_EVERYWHERE' | 'SEPARATE_CHANNELS';
    swiggyPrice: number;
    swiggyAvailable: boolean;
    zomatoPrice: number;
    zomatoAvailable: boolean;
  }>({
    priceMode: 'SEPARATE_CHANNELS',
    swiggyPrice: 0,
    swiggyAvailable: true,
    zomatoPrice: 0,
    zomatoAvailable: true
  });

  const [isPauseModalOpen, setIsPauseModalOpen] = useState<boolean>(false);
  const [pauseMinutes, setPauseMinutes] = useState<number>(30);

  // Status Notification Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'warn' | 'error' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'warn' | 'error' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial Fetch
  const loadHubData = async () => {
    try {
      setLoading(true);
      const [statusRes, menuRes, reconRes, logsRes] = await Promise.all([
        api.getAggregatorStatus(),
        api.getUnifiedAggregatorMenu(),
        api.getAggregatorReconciliation('Today'),
        api.getAggregatorLogs()
      ]);

      if (statusRes.success) {
        setConnections(statusRes.connections || []);
        setKitchenIntel(statusRes.kitchenIntelligence || null);
      }
      if (menuRes.success) {
        setMenuItems(menuRes.items || []);
        setCategories(menuRes.categories || []);
      }
      if (reconRes.success) {
        setReconciliations(reconRes.reconciliations || []);
      }
      if (logsRes.success) {
        setSyncLogs(logsRes.logs || []);
      }
    } catch (err: any) {
      console.error('[AggregatorHub] Error fetching data:', err);
      showToast('Connection Notice', 'Aggregator service is responding in offline/sandbox mode.', 'warn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHubData();
  }, []);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = selectedCategory === 'ALL' || item.categoryId === selectedCategory;
      const matchSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Online Orders
  const onlineOrders = useMemo(() => {
    return orders.filter(o => o.source === 'SWIGGY' || o.source === 'ZOMATO');
  }, [orders]);

  // Swiggy & Zomato Connections
  const swiggyConn = connections.find(c => c.provider === 'SWIGGY');
  const zomatoConn = connections.find(c => c.provider === 'ZOMATO');

  // Trigger Manual Menu Sync
  const handleSyncMenu = async (channel: 'SWIGGY' | 'ZOMATO' | 'ALL' = 'ALL') => {
    try {
      setSyncingMenu(true);
      const res = await api.syncAggregatorMenu(channel);
      if (res.success) {
        showToast('Menu Synchronized', `Catalog successfully updated on ${channel === 'ALL' ? 'Swiggy & Zomato' : channel}!`);
        await loadHubData();
      }
    } catch (err: any) {
      showToast('Sync Error', err.message || 'Failed to sync menu', 'error');
    } finally {
      setSyncingMenu(false);
    }
  };

  // Rush Mode Toggle
  const handleToggleRushMode = async () => {
    const isCurrentlyActive = connections.some(c => c.rushMode);
    const newActiveState = !isCurrentlyActive;
    try {
      const res = await api.setAggregatorRushMode({
        activate: newActiveState,
        prepTimeMinutes: newActiveState ? (kitchenIntel?.recommendedPrepTime || 35) : 25
      });
      if (res.success) {
        showToast(
          newActiveState ? '⚡ Rush Mode Activated' : 'Rush Mode Deactivated',
          newActiveState
            ? `Online prep time increased to ${res.prepTimeMinutes}m for kitchen protection.`
            : 'Normal preparation time restored.'
        );
        await loadHubData();
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Could not toggle rush mode', 'error');
    }
  };

  // Pause Online Orders
  const handlePauseOrders = async () => {
    try {
      const res = await api.updateAggregatorOutletStatus({
        status: 'PAUSED',
        pauseMinutes,
        reason: 'Manager rush hold'
      });
      if (res.success) {
        showToast('Online Orders Paused', `Swiggy & Zomato paused for ${pauseMinutes} minutes.`);
        setIsPauseModalOpen(false);
        await loadHubData();
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Could not pause orders', 'error');
    }
  };

  const handleResumeOrders = async () => {
    try {
      const res = await api.updateAggregatorOutletStatus({ status: 'OPEN' });
      if (res.success) {
        showToast('Orders Resumed', 'Swiggy & Zomato outlets are now OPEN and taking orders.');
        await loadHubData();
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Could not resume orders', 'error');
    }
  };

  // Adjust Prep Time
  const handlePrepTimeChange = async (minutes: number) => {
    try {
      const res = await api.updateAggregatorPrepTime(minutes);
      if (res.success) {
        showToast('Prep Time Updated', `Online order prep time set to ${minutes} minutes.`);
        await loadHubData();
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Could not update prep time', 'error');
    }
  };

  // Sandbox Order Simulation
  const handleSimulateOrder = async (provider: 'SWIGGY' | 'ZOMATO') => {
    try {
      const res = await api.simulateAggregatorOrder(provider);
      if (res.success) {
        showToast(`🔔 New ${provider} Order Received!`, `Order #${res.order?.orderNumber} created. Check Live Orders queue!`);
        if (onRefreshOrders) onRefreshOrders();
        await loadHubData();
      }
    } catch (err: any) {
      showToast('Simulation Notice', err.message || 'Could not simulate order', 'warn');
    }
  };

  // Open Edit Item Overrides Modal
  const handleOpenItemEdit = (item: UnifiedMenuItem) => {
    setEditingItem(item);
    const overrides = item.channelOverrides;
    setEditForm({
      priceMode: overrides?.priceMode || 'SEPARATE_CHANNELS',
      swiggyPrice: overrides?.swiggy?.price ?? Math.round(item.price * 1.15),
      swiggyAvailable: overrides?.swiggy?.isAvailable ?? item.isAvailable,
      zomatoPrice: overrides?.zomato?.price ?? Math.round(item.price * 1.12),
      zomatoAvailable: overrides?.zomato?.isAvailable ?? item.isAvailable
    });
    setIsItemEditModalOpen(true);
  };

  // Save Item Overrides
  const handleSaveItemEdit = async () => {
    if (!editingItem) return;
    try {
      const updatedOverrides = {
        menuItemId: editingItem.id,
        priceMode: editForm.priceMode,
        swiggy: {
          enabled: true,
          price: editForm.priceMode === 'SAME_EVERYWHERE' ? editingItem.price : editForm.swiggyPrice,
          isAvailable: editForm.swiggyAvailable,
          syncStatus: 'SYNCED'
        },
        zomato: {
          enabled: true,
          price: editForm.priceMode === 'SAME_EVERYWHERE' ? editingItem.price : editForm.zomatoPrice,
          isAvailable: editForm.zomatoAvailable,
          syncStatus: 'SYNCED'
        }
      };

      const res = await api.updateMenuItemOverride(editingItem.id, updatedOverrides);
      if (res.success) {
        showToast('Updated', `Channel configuration for ${editingItem.name} saved!`);
        setIsItemEditModalOpen(false);
        setEditingItem(null);
        await loadHubData();
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to save overrides', 'error');
    }
  };

  // Preview Bulk Price Updates
  const handlePreviewBulkPrice = async () => {
    try {
      setBulkLoading(true);
      const res = await api.bulkUpdateAggregatorPrices({
        ...bulkPriceConfig,
        previewOnly: true
      });
      if (res.success) {
        setBulkPreview(res.preview || []);
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to calculate preview', 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  // Apply Bulk Price Updates
  const handleApplyBulkPrice = async () => {
    try {
      setBulkLoading(true);
      const res = await api.bulkUpdateAggregatorPrices({
        ...bulkPriceConfig,
        previewOnly: false
      });
      if (res.success) {
        showToast('Bulk Prices Published', `Successfully updated ${res.updatedCount} items on ${bulkPriceConfig.channels.join(', ')}!`);
        setIsBulkPriceModalOpen(false);
        setBulkPreview(null);
        await loadHubData();
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to apply bulk prices', 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  // One-Tap Sold Out Everywhere
  const handleToggleItemEverywhere = async (item: UnifiedMenuItem, makeAvailable: boolean) => {
    try {
      const res = await api.bulkUpdateAggregatorStock({
        itemIds: [item.id],
        channels: ['SWIGGY', 'ZOMATO', 'SWAAD_SEVAK'],
        isAvailable: makeAvailable
      });
      if (res.success) {
        showToast(
          makeAvailable ? 'Dish Back in Stock' : 'Dish Marked Sold Out Everywhere',
          `${item.name} is now ${makeAvailable ? 'available' : 'unavailable'} on Dine-In, Swiggy, and Zomato.`
        );
        await loadHubData();
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to update stock', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border text-sm max-w-md animate-in slide-in-from-top-3 flex items-start gap-3 ${
          toastMessage.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
            : toastMessage.type === 'warn'
            ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
            : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
        }`}>
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toastMessage.type === 'warn' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {toastMessage.type === 'error' && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          <div>
            <div className="font-semibold">{toastMessage.title}</div>
            <div className="text-xs opacity-90 mt-0.5">{toastMessage.desc}</div>
          </div>
          <button onClick={() => setToastMessage(null)} className="ml-auto text-xs opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Aggregator Hub
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              <Zap className="w-3 h-3" /> Official POS Layer
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage Swiggy, Zomato, and Swaad Sevak dine-in orders from one centralized restaurant operating system.
          </p>
        </div>

        {/* Quick Simulator Sandbox Triggers */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:block mr-1">
            Sandbox Test:
          </div>
          <button
            onClick={() => handleSimulateOrder('SWIGGY')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FC8019] text-white hover:bg-[#e47011] transition shadow-sm active:scale-95"
            title="Simulate incoming Swiggy order in sandbox"
          >
            <Send className="w-3.5 h-3.5" /> + Swiggy Order
          </button>
          <button
            onClick={() => handleSimulateOrder('ZOMATO')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E23744] text-white hover:bg-[#c92f3b] transition shadow-sm active:scale-95"
            title="Simulate incoming Zomato order in sandbox"
          >
            <Send className="w-3.5 h-3.5" /> + Zomato Order
          </button>
        </div>
      </div>

      {/* Top 3 Channel Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Swiggy Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:border-[#FC8019]/40 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FC8019]/10 text-[#FC8019] font-bold flex items-center justify-center text-sm border border-[#FC8019]/20">
                SW
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Swiggy</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {swiggyConn?.outletName || 'Outlet ID: SWG-IND-8841'}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              swiggyConn?.status === 'CONNECTED'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${swiggyConn?.status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {swiggyConn?.status === 'CONNECTED' ? 'Connected' : 'Not Connected'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400">Menu Sync:</span>
              <p className="font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                {swiggyConn?.menuSynced ? '✓ Synced (2m ago)' : 'Pending'}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Orders Stream:</span>
              <p className="font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                ● Live & Receiving
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Outlet: {swiggyConn?.outletId || 'SWG-IND-8841'}
            </span>
            <button
              onClick={() => {
                setConnectProvider('SWIGGY');
                setConnectForm({ outletId: swiggyConn?.outletId || '', outletName: swiggyConn?.outletName || '', apiKey: '' });
                setIsConnectModalOpen(true);
              }}
              className="text-xs font-semibold text-[#FC8019] hover:underline"
            >
              Configure
            </button>
          </div>
        </div>

        {/* Zomato Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:border-[#E23744]/40 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E23744]/10 text-[#E23744] font-bold flex items-center justify-center text-sm border border-[#E23744]/20">
                ZM
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Zomato</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {zomatoConn?.outletName || 'Outlet ID: ZOM-IND-4921'}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              zomatoConn?.status === 'CONNECTED'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${zomatoConn?.status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {zomatoConn?.status === 'CONNECTED' ? 'Connected' : 'Not Connected'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400">Menu Sync:</span>
              <p className="font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                {zomatoConn?.menuSynced ? '✓ Synced (5m ago)' : 'Pending'}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Orders Stream:</span>
              <p className="font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                ● Live & Receiving
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Outlet: {zomatoConn?.outletId || 'ZOM-IND-4921'}
            </span>
            <button
              onClick={() => {
                setConnectProvider('ZOMATO');
                setConnectForm({ outletId: zomatoConn?.outletId || '', outletName: zomatoConn?.outletName || '', apiKey: '' });
                setIsConnectModalOpen(true);
              }}
              className="text-xs font-semibold text-[#E23744] hover:underline"
            >
              Configure
            </button>
          </div>
        </div>

        {/* Swaad Sevak Dine-In Master Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-sm border border-amber-500/20">
                SS
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Swaad Sevak</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Master POS & QR Engine</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400">Commission Rate:</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                0% Direct Profit
              </p>
            </div>
            <div>
              <span className="text-slate-400">Dine-In Tables:</span>
              <p className="font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                8 Tables Enabled
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Source of Truth
            </span>
            <button
              onClick={() => onNavigateTab && onNavigateTab('menu')}
              className="text-xs font-semibold text-amber-500 hover:underline"
            >
              Master Menu
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Kitchen Intelligence & Rush Controller Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`p-2.5 rounded-xl border shrink-0 ${
              connections.some(c => c.rushMode)
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse'
                : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
            }`}>
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-base sm:text-lg">
                  {connections.some(c => c.rushMode) ? 'Kitchen Rush Mode ACTIVE' : 'Kitchen Workload Engine'}
                </h4>
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                  kitchenIntel?.statusLabel === 'HIGH_LOAD'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  Load: {kitchenIntel?.loadScore || 35}%
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  ({kitchenIntel?.activeOrdersCount || 0} active KOTs in kitchen)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {connections.some(c => c.rushMode)
                  ? 'Online order prep times automatically extended to 35m to protect dine-in and kitchen staff.'
                  : (kitchenIntel?.loadScore || 0) > 60
                  ? `Kitchen load is elevated. Recommended online prep time: ${kitchenIntel?.recommendedPrepTime || 30} mins.`
                  : 'Kitchen running at optimal flow. Online orders synced with zero delay.'}
              </p>
            </div>
          </div>

          {/* Action buttons on Kitchen Bar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Rush Mode Toggle Button */}
            <button
              onClick={handleToggleRushMode}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                connections.some(c => c.rushMode)
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              {connections.some(c => c.rushMode) ? 'Turn Off Rush Mode' : 'Activate Rush Mode'}
            </button>

            {/* Prep Time Quick Selector */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl px-2 py-1 text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <span className="text-slate-400 mr-1">Prep:</span>
              <select
                value={swiggyConn?.prepTimeMinutes || 25}
                onChange={(e) => handlePrepTimeChange(Number(e.target.value))}
                className="bg-transparent text-white font-semibold outline-none cursor-pointer text-xs"
              >
                <option value={15} className="bg-slate-900 text-white">15 min</option>
                <option value={20} className="bg-slate-900 text-white">20 min</option>
                <option value={25} className="bg-slate-900 text-white">25 min</option>
                <option value={30} className="bg-slate-900 text-white">30 min</option>
                <option value={35} className="bg-slate-900 text-white">35 min</option>
                <option value={40} className="bg-slate-900 text-white">40 min</option>
                <option value={45} className="bg-slate-900 text-white">45 min</option>
              </select>
            </div>

            {/* Pause / Resume Button */}
            {swiggyConn?.isOnline ? (
              <button
                onClick={() => setIsPauseModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition"
              >
                <PauseCircle className="w-4 h-4" /> Pause Online Orders
              </button>
            ) : (
              <button
                onClick={handleResumeOrders}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition"
              >
                <PlayCircle className="w-4 h-4" /> Resume Orders
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('menu')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeSubTab === 'menu'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Menu Control Center
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {menuItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeSubTab === 'orders'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" /> Online Orders Stream
            {onlineOrders.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                {onlineOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('reconciliation')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeSubTab === 'reconciliation'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Aggregator Reconciliation
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeSubTab === 'logs'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" /> Sync & Audit History
          </button>
        </div>

        {/* Global Sync Action Button */}
        <div className="flex items-center gap-2 py-2">
          <button
            onClick={() => handleSyncMenu('ALL')}
            disabled={syncingMenu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingMenu ? 'animate-spin text-orange-500' : ''}`} />
            {syncingMenu ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: MENU CONTROL CENTER                            */}
      {/* ========================================================= */}
      {activeSubTab === 'menu' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Category Filter, Bulk Action buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Categories ({menuItems.length})</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setBulkPreview(null);
                  setIsBulkPriceModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white transition shadow-sm"
              >
                <DollarSign className="w-3.5 h-3.5" /> Bulk Price Update
              </button>
            </div>
          </div>

          {/* Unified Menu Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Dish & Category</th>
                    <th className="py-3 px-3 text-center">Dine-In Master</th>
                    <th className="py-3 px-3 text-center">Swiggy Price</th>
                    <th className="py-3 px-3 text-center">Zomato Price</th>
                    <th className="py-3 px-3 text-center">Availability Matrix</th>
                    <th className="py-3 px-3 text-center">Sync State</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredMenuItems.map(item => {
                    const overrides = item.channelOverrides;
                    const swiggyPrice = overrides?.swiggy?.price ?? Math.round(item.price * 1.15);
                    const zomatoPrice = overrides?.zomato?.price ?? Math.round(item.price * 1.12);
                    const swiggyAvail = overrides?.swiggy?.isAvailable ?? item.isAvailable;
                    const zomatoAvail = overrides?.zomato?.isAvailable ?? item.isAvailable;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        {/* Dish Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                {categories.find(c => c.id === item.categoryId)?.name || 'General'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Dine-In Master Price */}
                        <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                          ₹{item.price}
                        </td>

                        {/* Swiggy Price */}
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-[#FC8019]">₹{swiggyPrice}</span>
                          {swiggyPrice > item.price && (
                            <span className="text-[10px] text-slate-400 block">
                              +{Math.round(((swiggyPrice - item.price) / item.price) * 100)}%
                            </span>
                          )}
                        </td>

                        {/* Zomato Price */}
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-[#E23744]">₹{zomatoPrice}</span>
                          {zomatoPrice > item.price && (
                            <span className="text-[10px] text-slate-400 block">
                              +{Math.round(((zomatoPrice - item.price) / item.price) * 100)}%
                            </span>
                          )}
                        </td>

                        {/* Availability Matrix */}
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px] font-mono">
                            <span title="Dine-in QR" className={item.isAvailable ? 'text-emerald-500 font-bold' : 'text-slate-400'}>
                              DINE:{item.isAvailable ? 'ON' : 'OFF'}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span title="Swiggy" className={swiggyAvail ? 'text-[#FC8019] font-bold' : 'text-slate-400 line-through'}>
                              SWG:{swiggyAvail ? 'ON' : 'OFF'}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span title="Zomato" className={zomatoAvail ? 'text-[#E23744] font-bold' : 'text-slate-400 line-through'}>
                              ZOM:{zomatoAvail ? 'ON' : 'OFF'}
                            </span>
                          </div>
                        </td>

                        {/* Sync State */}
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Synced
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenItemEdit(item)}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition"
                            >
                              Edit Channels
                            </button>
                            <button
                              onClick={() => handleToggleItemEverywhere(item, !(swiggyAvail && zomatoAvail))}
                              className={`px-2 py-1 rounded font-semibold text-[10px] transition ${
                                swiggyAvail && zomatoAvail
                                  ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                              }`}
                              title="Toggle stock on all connected channels"
                            >
                              {swiggyAvail && zomatoAvail ? 'Sold Out Everywhere' : 'Available Everywhere'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: ONLINE ORDERS STREAM                           */}
      {/* ========================================================= */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Online Aggregator Orders ({onlineOrders.length})
            </h3>
            <p className="text-xs text-slate-500">
              Orders arriving from Swiggy & Zomato automatically generate KOTs and send to kitchen.
            </p>
          </div>

          {onlineOrders.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
              <Package className="w-12 h-12 mx-auto text-slate-400 mb-3 opacity-60" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">No active online orders right now</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                When a customer orders on Swiggy or Zomato, the order card and KOT will automatically ring here.
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleSimulateOrder('SWIGGY')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FC8019] text-white hover:bg-[#e47011] transition"
                >
                  Trigger Sandbox Swiggy Order
                </button>
                <button
                  onClick={() => handleSimulateOrder('ZOMATO')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#E23744] text-white hover:bg-[#c92f3b] transition"
                >
                  Trigger Sandbox Zomato Order
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onlineOrders.map(order => {
                const isSwiggy = order.source === 'SWIGGY';
                return (
                  <div
                    key={order.id}
                    className={`bg-white dark:bg-slate-900 rounded-xl border p-4 shadow-sm relative overflow-hidden ${
                      isSwiggy ? 'border-[#FC8019]/30 hover:border-[#FC8019]' : 'border-[#E23744]/30 hover:border-[#E23744]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isSwiggy ? 'bg-[#FC8019]/10 text-[#FC8019]' : 'bg-[#E23744]/10 text-[#E23744]'
                      }`}>
                        {order.source} #{order.orderNumber}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        order.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-500 animate-pulse'
                          : order.status === 'ACCEPTED' || order.status === 'PREPARING'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mb-3">
                      <span>{order.customerNotes || 'Delivery Partner Assigned'}</span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 py-2 border-y border-slate-100 dark:border-slate-800 text-xs">
                      {order.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {i.quantity} × {i.name}
                          </span>
                          <span className="text-slate-500">₹{i.price * i.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Financial Summary */}
                    <div className="mt-3 pt-1 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white text-sm">
                        <span>Customer Paid Total:</span>
                        <span>₹{order.total}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>Estimated Net Settlement (~82%):</span>
                        <span className="font-semibold text-emerald-500">
                          ₹{Math.round(order.total * 0.82)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('orders')}
                        className="text-xs font-semibold text-orange-500 hover:underline flex items-center gap-1"
                      >
                        View in Live Queue <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: AGGREGATOR RECONCILIATION                      */}
      {/* ========================================================= */}
      {activeSubTab === 'reconciliation' && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block">Aggregator Settlement Auditing Active</span>
              Swaad Sevak tracks every rupee between what customers paid, packaging charges, GST collected, platform commissions (18-22%), and actual bank settlements to ensure no platform deduction leakage occurs.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reconciliations.map((rec) => {
              const isSwiggy = rec.provider === 'SWIGGY';
              return (
                <div
                  key={rec.provider}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${isSwiggy ? 'bg-[#FC8019]' : 'bg-[#E23744]'}`} />
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {rec.provider} Settlement Report
                      </h4>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Period: {rec.period}
                    </span>
                  </div>

                  <div className="space-y-2.5 mt-4 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-slate-500">Gross Orders Count:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{rec.grossOrdersCount} orders</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-slate-500">Gross Order Value (Customer Paid):</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{rec.grossSales.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-slate-500">Packaging Charges Retained:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">+₹{rec.packagingCharges.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-slate-500">Platform Commission & Gateway Fee:</span>
                      <span className="font-semibold text-rose-500">-₹{rec.platformCommission.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-slate-500">Restaurant-Funded Promo Discounts:</span>
                      <span className="font-semibold text-rose-500">-₹{rec.restaurantFundedDiscounts.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between py-2 font-bold text-sm bg-slate-50 dark:bg-slate-800/50 px-3 rounded-lg mt-3">
                      <span>Expected Net Settlement:</span>
                      <span className="text-slate-900 dark:text-white">₹{rec.expectedSettlement.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between py-2 font-bold text-sm bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-3 rounded-lg">
                      <span>Actual Bank Payout:</span>
                      <span>₹{rec.actualSettlement.toLocaleString()}</span>
                    </div>

                    {rec.difference !== 0 && (
                      <div className="flex justify-between py-2 text-xs font-bold text-amber-600 dark:text-amber-400 px-3 rounded-lg border border-amber-500/20">
                        <span>Discrepancy / Variance:</span>
                        <span>₹{rec.difference} ⚠ Needs Audit</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: SYNC & AUDIT LOGS                              */}
      {/* ========================================================= */}
      {activeSubTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Sync Activity & Event Log</h4>
            <span className="text-xs text-slate-400 font-mono">Last 200 events recorded</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {syncLogs.length === 0 ? (
              <div className="p-6 text-center text-slate-400">No sync events logged yet.</div>
            ) : (
              syncLogs.map(log => (
                <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500' : log.status === 'WARNING' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {log.summary}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Channel: {log.provider} • Action: {log.action}
                      </span>
                    </div>
                  </div>
                  <span className="text-slate-400 text-[11px] shrink-0 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: ITEM CHANNEL OVERRIDE EDIT                       */}
      {/* ========================================================= */}
      {isItemEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Channel Pricing & Control
                </h3>
                <p className="text-xs text-slate-500">
                  Dish: <span className="font-semibold text-slate-800 dark:text-slate-200">{editingItem.name}</span>
                </p>
              </div>
              <button
                onClick={() => setIsItemEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                Pricing Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEditForm(prev => ({ ...prev, priceMode: 'SAME_EVERYWHERE' }))}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                    editForm.priceMode === 'SAME_EVERYWHERE'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  ● Same price everywhere
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                    Syncs Base ₹{editingItem.price} across all channels
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditForm(prev => ({ ...prev, priceMode: 'SEPARATE_CHANNELS' }))}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                    editForm.priceMode === 'SEPARATE_CHANNELS'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  ● Separate channel prices
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                    Independent prices for Swiggy & Zomato
                  </span>
                </button>
              </div>
            </div>

            {/* Channel Prices */}
            {editForm.priceMode === 'SEPARATE_CHANNELS' && (
              <div className="space-y-3 pt-2">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#FC8019] block">Swiggy Price</span>
                    <span className="text-[10px] text-slate-400">Master Base: ₹{editingItem.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">₹</span>
                    <input
                      type="number"
                      value={editForm.swiggyPrice}
                      onChange={(e) => setEditForm(prev => ({ ...prev, swiggyPrice: Number(e.target.value) }))}
                      className="w-24 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#E23744] block">Zomato Price</span>
                    <span className="text-[10px] text-slate-400">Master Base: ₹{editingItem.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">₹</span>
                    <input
                      type="number"
                      value={editForm.zomatoPrice}
                      onChange={(e) => setEditForm(prev => ({ ...prev, zomatoPrice: Number(e.target.value) }))}
                      className="w-24 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Channel Availability */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">
                Channel Availability
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.swiggyAvailable}
                    onChange={(e) => setEditForm(prev => ({ ...prev, swiggyAvailable: e.target.checked }))}
                    className="rounded text-orange-600"
                  />
                  <span>Swiggy Active</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.zomatoAvailable}
                    onChange={(e) => setEditForm(prev => ({ ...prev, zomatoAvailable: e.target.checked }))}
                    className="rounded text-orange-600"
                  />
                  <span>Zomato Active</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsItemEditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItemEdit}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
              >
                Save & Synchronize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: BULK PRICE EDIT WITH SAFETY PREVIEW              */}
      {/* ========================================================= */}
      {isBulkPriceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Bulk Price Adjustment
                </h3>
                <p className="text-xs text-slate-500">
                  Update online aggregator prices safely with mathematical rounding rules.
                </p>
              </div>
              <button onClick={() => setIsBulkPriceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Channels to apply */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Apply to Channels:</label>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bulkPriceConfig.channels.includes('SWIGGY')}
                    onChange={(e) => {
                      const chs = e.target.checked
                        ? [...bulkPriceConfig.channels, 'SWIGGY']
                        : bulkPriceConfig.channels.filter(c => c !== 'SWIGGY');
                      setBulkPriceConfig(prev => ({ ...prev, channels: chs as any }));
                    }}
                  />
                  <span>Swiggy</span>
                </label>
                <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bulkPriceConfig.channels.includes('ZOMATO')}
                    onChange={(e) => {
                      const chs = e.target.checked
                        ? [...bulkPriceConfig.channels, 'ZOMATO']
                        : bulkPriceConfig.channels.filter(c => c !== 'ZOMATO');
                      setBulkPriceConfig(prev => ({ ...prev, channels: chs as any }));
                    }}
                  />
                  <span>Zomato</span>
                </label>
              </div>
            </div>

            {/* Adjustment rule */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Adjustment Type</label>
                <select
                  value={bulkPriceConfig.adjustmentType}
                  onChange={(e) => setBulkPriceConfig(prev => ({ ...prev, adjustmentType: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="PERCENTAGE">Increase by percentage (%)</option>
                  <option value="FIXED">Increase by fixed amount (₹)</option>
                  <option value="EXACT">Set exact price (₹)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Adjustment Value</label>
                <input
                  type="number"
                  value={bulkPriceConfig.adjustmentValue}
                  onChange={(e) => setBulkPriceConfig(prev => ({ ...prev, adjustmentValue: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Rounding Rules */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Price Rounding</label>
              <select
                value={bulkPriceConfig.rounding}
                onChange={(e) => setBulkPriceConfig(prev => ({ ...prev, rounding: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="NEAREST_5">Round to nearest ₹5 (e.g. ₹274 → ₹275)</option>
                <option value="NEAREST_10">Round to nearest ₹10 (e.g. ₹274 → ₹270/280)</option>
                <option value="NEAREST_1">Round to nearest ₹1 (e.g. ₹274.20 → ₹274)</option>
                <option value="NONE">No rounding</option>
              </select>
            </div>

            {/* Preview Section */}
            {bulkPreview && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Projected Preview ({bulkPreview.length} dishes will be updated):
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 divide-y divide-slate-200 dark:divide-slate-700/60">
                  {bulkPreview.slice(0, 6).map((item: any) => (
                    <div key={item.id} className="pt-1 flex justify-between items-center text-[11px]">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                      <span className="font-mono text-slate-500">
                        SWG: ₹{item.oldPrices.SWIGGY} → <strong className="text-orange-500">₹{item.newPrices.SWIGGY}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handlePreviewBulkPrice}
                disabled={bulkLoading}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                {bulkLoading ? 'Calculating...' : 'Preview Changes'}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkPriceModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyBulkPrice}
                  disabled={bulkLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
                >
                  Confirm & Sync All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: PAUSE ONLINE ORDERS                              */}
      {/* ========================================================= */}
      {isPauseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Pause Online Orders
                </h3>
                <p className="text-xs text-slate-500">
                  Temporarily pause incoming orders on Swiggy and Zomato.
                </p>
              </div>
              <button onClick={() => setIsPauseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Pause Duration</label>
              {[15, 30, 60, 120].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setPauseMinutes(mins)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-left transition flex justify-between items-center ${
                    pauseMinutes === mins
                      ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span>{mins === 60 ? '1 Hour' : mins === 120 ? '2 Hours' : `${mins} Minutes`}</span>
                  {pauseMinutes === mins && <Check className="w-4 h-4 text-orange-500" />}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsPauseModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePauseOrders}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              >
                Pause Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: OUTLET CONNECTION CONFIGURATION                  */}
      {/* ========================================================= */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Configure {connectProvider} Connection
                </h3>
                <p className="text-xs text-slate-500">
                  Connect your restaurant's {connectProvider} outlet to Swaad Sevak.
                </p>
              </div>
              <button onClick={() => setIsConnectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Outlet Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Chai & Chaat Co. - Indiranagar"
                  value={connectForm.outletName}
                  onChange={(e) => setConnectForm(prev => ({ ...prev, outletName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  {connectProvider} Restaurant Outlet ID:
                </label>
                <input
                  type="text"
                  placeholder={connectProvider === 'SWIGGY' ? 'SWG-IND-8841' : 'ZOM-IND-4921'}
                  value={connectForm.outletId}
                  onChange={(e) => setConnectForm(prev => ({ ...prev, outletId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] text-slate-500 border border-slate-200 dark:border-slate-700">
                🔒 Official integration credentials and webhook secrets are stored securely and never exposed to browser clients.
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={async () => {
                  await api.disconnectAggregator(connectProvider);
                  showToast('Disconnected', `${connectProvider} has been unlinked.`);
                  setIsConnectModalOpen(false);
                  await loadHubData();
                }}
                className="text-xs text-rose-500 hover:underline"
              >
                Disconnect Outlet
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!connectForm.outletId || !connectForm.outletName) {
                      showToast('Error', 'Please fill in outlet ID and name', 'error');
                      return;
                    }
                    const res = await api.connectAggregator({
                      provider: connectProvider,
                      outletId: connectForm.outletId,
                      outletName: connectForm.outletName
                    });
                    if (res.success) {
                      showToast('Connected!', `${connectProvider} outlet linked to Swaad Sevak.`);
                      setIsConnectModalOpen(false);
                      await loadHubData();
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
                >
                  Save Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

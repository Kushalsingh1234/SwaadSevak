import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Clock,
  AlertTriangle,
  ShoppingBag,
  Coins,
  ChevronRight,
  Layers,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  ArrowUpRight,
  Info,
  SlidersHorizontal,
  Flame,
  Lightbulb,
  AlertCircle,
  Tag,
  Gift,
  Users,
  Coffee,
  Utensils,
  Pizza,
  Croissant,
  Store,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import {
  GrowthEngineData,
  GrowthRecommendation,
  GrowthDataMode,
  BusinessType,
  Restaurant,
  Manager
} from '../types';
import { UploadPosModal } from '../components/growth/UploadPosModal';
import { ManageReportsModal } from '../components/growth/ManageReportsModal';
import { SetItemCostModal } from '../components/growth/SetItemCostModal';
import { CreateOfferModal } from '../components/growth/CreateOfferModal';

interface GrowthEnginePageProps {
  restaurant: Restaurant | null;
  manager: Manager | null;
  onNavigateTab: (tab: string) => void;
}

export const GrowthEnginePage: React.FC<GrowthEnginePageProps> = ({
  restaurant,
  manager,
  onNavigateTab
}) => {
  const [data, setData] = useState<GrowthEngineData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & preference states
  const [currentMode, setCurrentMode] = useState<GrowthDataMode>('swaad');
  const [businessType, setBusinessType] = useState<BusinessType>('Café');

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isManageReportsOpen, setIsManageReportsOpen] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [costModalItem, setCostModalItem] = useState<{ name: string; price: number }>({ name: 'Cold Coffee', price: 129 });
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedOfferRec, setSelectedOfferRec] = useState<GrowthRecommendation | null>(null);

  // Automatic immediate loading on mount
  useEffect(() => {
    loadGrowthData();
  }, [currentMode, businessType]);

  const loadGrowthData = async (modeOverride?: GrowthDataMode) => {
    try {
      setLoading(true);
      setError(null);
      const mode = modeOverride || currentMode;
      const res = await api.getGrowthData({
        dataMode: mode,
        businessType
      });

      if (res.success && res.growth) {
        setData(res.growth);
        setCurrentMode(res.growth.dataMode);
        setBusinessType(res.growth.businessType);
      } else {
        setError('Unable to load Growth Engine insights.');
      }
    } catch (err: any) {
      console.error('Error fetching growth data:', err);
      setError(err.message || 'Failed to connect to Growth Engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = async (newMode: GrowthDataMode) => {
    setCurrentMode(newMode);
    try {
      await api.setGrowthDataMode(newMode);
    } catch (e) {
      console.warn('Could not persist mode:', e);
    }
  };

  const handleBusinessTypeChange = async (newType: BusinessType) => {
    setBusinessType(newType);
    try {
      await api.setGrowthBusinessType(newType);
    } catch (e) {
      console.warn('Could not persist business type:', e);
    }
  };

  const handleToggleAction = async (recId: string) => {
    try {
      await api.toggleGrowthRecommendation(recId);
      loadGrowthData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle action');
    }
  };

  const handleOpenActionModal = (rec: GrowthRecommendation) => {
    if (rec.actionType === 'SET_COST') {
      setCostModalItem({ name: rec.targetItemName || 'Cold Coffee', price: rec.currentPrice || 129 });
      setIsCostModalOpen(true);
    } else if (rec.actionType === 'UPDATE_PRICE') {
      onNavigateTab('menu');
    } else {
      setSelectedOfferRec(rec);
      setIsOfferModalOpen(true);
    }
  };

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const businessTypeIcons: Record<BusinessType, any> = {
    'Café': Coffee,
    'Restaurant': Utensils,
    'Bakery / Café': Croissant,
    'Fast Food': Pizza,
    'QSR': Store,
    'Other': Store
  };

  return (
    <div className="space-y-5 w-full animate-fadeIn">
      {/* 1. HERO HEADER */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>SwaadSevak Growth Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <span>{getGreeting()}</span>
              <span>👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-normal leading-relaxed">
              Your business, turned into actions. Here is what we found from your recent sales to help you increase revenue and improve margins.
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsManageReportsOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5"
              title="Manage uploaded reports and sources"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Data Sources</span>
              {data?.availableReports && data.availableReports.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  {data.availableReports.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add POS Report</span>
            </button>
          </div>
        </div>

        {/* Positioning Banner: Pos tells what happened, Growth Engine tells what to do */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>
              <strong className="text-slate-800">Core Principle:</strong> Your POS tells you what happened. Growth Engine tells you what to do next.
            </span>
          </p>

          {/* Business Profile Selector */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-[11px] font-medium text-slate-500">Business Profile:</span>
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              {(['Café', 'Restaurant', 'Bakery / Café', 'Fast Food', 'QSR'] as BusinessType[]).map((type) => {
                const isSelected = businessType === type;
                return (
                  <button
                    key={type}
                    onClick={() => handleBusinessTypeChange(type)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DATA SOURCE SELECTOR & STATUS BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Source Radio Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 mr-1">Analyze:</span>

          <button
            onClick={() => handleModeChange('swaad')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              currentMode === 'swaad'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${currentMode === 'swaad' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span>SwaadSevak only</span>
          </button>

          <button
            onClick={() => handleModeChange('pos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              currentMode === 'pos'
                ? 'bg-orange-50 border-orange-500 text-orange-800 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${currentMode === 'pos' ? 'bg-orange-500' : 'bg-slate-400'}`} />
            <span>Uploaded POS report</span>
            {data?.sources.pos.provider && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-700 font-bold">
                {data.sources.pos.provider}
              </span>
            )}
          </button>

          <button
            onClick={() => handleModeChange('combined')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              currentMode === 'combined'
                ? 'bg-violet-50 border-violet-500 text-violet-800 shadow-2xs font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${currentMode === 'combined' ? 'bg-violet-600' : 'bg-slate-400'}`} />
            <span>Combined</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-100 text-violet-700 font-bold">
              Complete View
            </span>
          </button>
        </div>

        {/* Source sales summary */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          {data?.sources.swaad.available && (
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>SwaadSevak: <strong>₹{data.sources.swaad.sales.toLocaleString('en-IN')}</strong></span>
            </span>
          )}

          {data?.sources.pos.available && (
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>POS: <strong>₹{data.sources.pos.sales.toLocaleString('en-IN')}</strong></span>
            </span>
          )}

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <span className="font-extrabold text-slate-900">
            Total Analyzed: ₹{(data?.snapshot.revenue || 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* OVERLAP DETECTION NOTIFICATION BANNER */}
      {data?.sources.overlapDetected && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Date overlap detected across data sources</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {data.sources.overlapMessage || 'Some dates overlap between your uploaded report and SwaadSevak data. We have kept them separate to avoid double counting.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleModeChange('swaad')}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-800 hover:bg-amber-100/60 font-semibold text-[11px] transition-colors"
            >
              Analyze Separately
            </button>
            <button
              onClick={() => handleModeChange('combined')}
              className="px-2.5 py-1 rounded-lg bg-amber-600 text-white hover:bg-amber-500 font-semibold text-[11px] transition-colors"
            >
              Combine Data
            </button>
          </div>
        </div>
      )}

      {/* CONFIDENCE & PERIOD INDICATOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
            data?.confidence.level === 'High confidence'
              ? 'bg-emerald-100 text-emerald-800'
              : data?.confidence.level === 'Moderate confidence'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-800'
          }`}>
            {data?.confidence.level || 'Moderate confidence'}
          </span>
          <span className="text-[11px] text-slate-500">
            {data?.confidence.message}
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Period: <strong className="text-slate-600">{data?.period.label}</strong>
        </div>
      </div>

      {/* 3. SECTION: 🔥 TODAY'S TOP OPPORTUNITIES (3 MAIN CARDS) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Today's Top Opportunities
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Prioritized for action</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-64 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(data?.topOpportunities || []).map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onAction={() => handleOpenActionModal(rec)}
                onToggleDone={() => handleToggleAction(rec.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. BUSINESS SNAPSHOT (COMPACT & FOCUSED) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Business Snapshot
            </h3>
          </div>

          {/* Historical comparison explanation */}
          {data?.snapshot.comparison && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
              <span className="font-extrabold">+{data.snapshot.comparison.percentChange}%</span>
              <span className="text-slate-500 text-[11px]">{data.snapshot.comparison.periodLabel}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <span className="text-[11px] font-medium text-slate-400">Total Analyzed Sales</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">
              ₹{(data?.snapshot.revenue || 0).toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-500">
              {currentMode === 'combined' ? 'SwaadSevak + POS' : currentMode === 'pos' ? 'POS Report' : 'Dine-In Orders'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <span className="text-[11px] font-medium text-slate-400">Total Analyzed Orders</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">
              {(data?.snapshot.orders || 0).toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-500">Completed bills</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <span className="text-[11px] font-medium text-slate-400">Average Order Value</span>
            <p className="text-lg font-black text-emerald-600 mt-0.5">
              ₹{(data?.snapshot.averageOrderValue || 0).toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-500">Per table / ticket</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <span className="text-[11px] font-medium text-slate-400">Best Seller</span>
            <p className="text-sm font-bold text-slate-900 mt-1 truncate" title={data?.snapshot.bestsellerItem}>
              {data?.snapshot.bestsellerItem || 'Cold Coffee'}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {data?.snapshot.bestsellerQty || 0} orders
            </span>
          </div>
        </div>

        {/* Growth Driver Explanation from prompt: "Most of the growth came from higher evening orders" */}
        {data?.snapshot.comparison?.explanation && (
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              <strong>Growth Driver:</strong> {data.snapshot.comparison.explanation}
            </span>
          </div>
        )}
      </div>

      {/* 5. TWO-COLUMN INSIGHTS: MENU OPPORTUNITIES & TIMING INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menu Opportunities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Menu & Pricing Opportunities
              </h3>
            </div>
            <button
              onClick={() => {
                setCostModalItem({ name: 'Cold Coffee', price: 129 });
                setIsCostModalOpen(true);
              }}
              className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            >
              + Set Item Costs
            </button>
          </div>

          <div className="space-y-3">
            {data?.menuOpportunities.map(rec => (
              <SimpleInsightRow
                key={rec.id}
                recommendation={rec}
                onAction={() => handleOpenActionModal(rec)}
                onToggleDone={() => handleToggleAction(rec.id)}
              />
            ))}

            {data?.pricingOpportunities.map(rec => (
              <SimpleInsightRow
                key={rec.id}
                recommendation={rec}
                onAction={() => handleOpenActionModal(rec)}
                onToggleDone={() => handleToggleAction(rec.id)}
              />
            ))}
          </div>
        </div>

        {/* Timing & Time-Based Insights */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Timing & Hourly Insights
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Peak vs Quiet Hours</span>
          </div>

          <div className="space-y-3">
            {data?.timingOpportunities.map(rec => (
              <SimpleInsightRow
                key={rec.id}
                recommendation={rec}
                onAction={() => handleOpenActionModal(rec)}
                onToggleDone={() => handleToggleAction(rec.id)}
              />
            ))}

            {data?.customerOpportunities.map(rec => (
              <SimpleInsightRow
                key={rec.id}
                recommendation={rec}
                onAction={() => handleOpenActionModal(rec)}
                onToggleDone={() => handleToggleAction(rec.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 6. SECTION: ⚠️ THINGS TO WATCH (INVENTORY & RISK SIGNALS) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Things to Watch & Inventory Signals
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Preventing food waste & over-purchasing</span>
        </div>

        {data?.inventoryAvailable && data.inventoryOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.inventoryOpportunities.map(rec => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/80 text-amber-900">
                      {rec.badge}
                    </span>
                    <button
                      onClick={() => handleToggleAction(rec.id)}
                      className={`text-[11px] font-semibold flex items-center gap-1 ${
                        rec.implemented ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{rec.implemented ? 'Implemented' : 'Mark Done'}</span>
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 leading-snug">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {rec.found}
                  </p>
                  <p className="text-xs font-semibold text-amber-800 mt-2">
                    💡 Try: {rec.action}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-amber-200/50 flex items-center justify-between text-[11px]">
                  <span className="text-amber-900 font-medium">{rec.expectedImpact}</span>
                  <button
                    onClick={() => handleOpenActionModal(rec)}
                    className="font-bold text-amber-900 hover:text-amber-950 underline"
                  >
                    Take Action →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Honest inventory missing state per specification */
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Inventory data unavailable</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload inventory purchase records or connect your stock log to unlock wastage and over-ordering alerts.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold shrink-0 transition-colors"
            >
              + Upload POS / Stock Report
            </button>
          </div>
        )}
      </div>

      {/* 6.5. SECTION: CRM & LOYALTY RETENTION INTELLIGENCE (Phase 23) */}
      <div className="bg-linear-to-br from-amber-500/10 via-orange-500/5 to-purple-500/10 rounded-2xl p-5 border border-amber-500/20 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">CRM & Loyalty Retention Engine</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Customer Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Target high-value guests and win back churn-risk diners with Discount Coins.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('crm')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <span>Open Loyalty CRM</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> At-Risk Win-Back
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700">Priority</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Win back 42 churn-risk diners</h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              42 regular customers haven't dined in the last 30+ days. Recommended: Issue 100 Discount Coins incentive.
            </p>
            <button
              onClick={() => onNavigateTab('crm')}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-800 pt-1 inline-flex items-center gap-1 cursor-pointer"
            >
              Configure in CRM →
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> VIP Protection
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-800">High LTV</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Protect top 15% spenders</h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              VIP diners generate ₹780+ AOV. Keep them engaged with exclusive coin redemption tiers.
            </p>
            <button
              onClick={() => onNavigateTab('crm')}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-800 pt-1 inline-flex items-center gap-1 cursor-pointer"
            >
              View VIP Segment →
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-emerald-600" /> Guest-to-Member Conversion
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">Acquisition</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Post-order guest signup bonus</h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              Active with 100 signup coins. Converts anonymous QR diners into recognized repeat visitors.
            </p>
            <button
              onClick={() => onNavigateTab('crm')}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-800 pt-1 inline-flex items-center gap-1 cursor-pointer"
            >
              Manage Coin Rules →
            </button>
          </div>
        </div>
      </div>

      {/* 7. BOTTOM BANNER: Want deeper insights? Upload your POS report */}
      {currentMode === 'swaad' && !data?.sources.pos.available && (
        <div className="p-5 rounded-2xl bg-linear-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Want deeper insights across both Dine-in and POS?</span>
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Upload your sales report exported from Petpooja, Posist, or another POS to combine your business view.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/20 shrink-0 transition-all flex items-center gap-1.5"
          >
            <span>+ Upload POS Report</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MODALS */}
      <UploadPosModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(rep, mode) => {
          setCurrentMode(mode);
          loadGrowthData(mode);
        }}
      />

      <ManageReportsModal
        isOpen={isManageReportsOpen}
        onClose={() => setIsManageReportsOpen(false)}
        reports={data?.availableReports || []}
        activeReportId={data?.sources.pos.reportId}
        onSelectReport={(repId) => {
          handleModeChange('pos');
        }}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onRefresh={() => loadGrowthData()}
      />

      <SetItemCostModal
        isOpen={isCostModalOpen}
        onClose={() => setIsCostModalOpen(false)}
        targetItemName={costModalItem.name}
        currentPrice={costModalItem.price}
        onSuccess={() => loadGrowthData()}
      />

      <CreateOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        recommendation={selectedOfferRec}
        onActionComplete={() => loadGrowthData()}
      />
    </div>
  );
};

// -------------------------------------------------------------
// SUBCOMPONENT: PROMINENT TOP RECOMMENDATION CARD
// -------------------------------------------------------------
interface RecommendationCardProps {
  recommendation: GrowthRecommendation;
  onAction: () => void;
  onToggleDone: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onAction,
  onToggleDone
}) => {
  const isHigh = recommendation.priority === 'HIGH';
  const isImplemented = recommendation.implemented;

  return (
    <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all bg-white relative ${
      isImplemented
        ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
        : isHigh
          ? 'border-orange-300 shadow-md shadow-orange-500/5 ring-1 ring-orange-200'
          : 'border-slate-200 shadow-xs'
    }`}>
      {/* Priority Pill & Toggle Implemented */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
            recommendation.badge.includes('🔥')
              ? 'bg-orange-100 text-orange-900 border border-orange-200'
              : recommendation.badge.includes('⚠️')
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-blue-100 text-blue-900 border border-blue-200'
          }`}>
            {recommendation.badge}
          </span>

          <button
            onClick={onToggleDone}
            className={`text-[11px] font-semibold flex items-center gap-1 transition-colors ${
              isImplemented ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Mark as executed"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isImplemented ? 'Done' : 'Mark done'}</span>
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
          {recommendation.title}
        </h3>

        {/* Structured 4-part breakdown */}
        <div className="space-y-2 mt-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">What we found:</span>
            <p className="text-slate-600 mt-0.5 leading-relaxed">{recommendation.found}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Why it matters:</span>
            <p className="text-slate-600 mt-0.5 leading-relaxed">{recommendation.impact}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/60">
            <span className="text-[10px] uppercase font-bold text-orange-800 tracking-wider">Try this:</span>
            <p className="text-slate-900 font-semibold mt-0.5 leading-relaxed">{recommendation.action}</p>
          </div>
        </div>
      </div>

      {/* Expected Impact & Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="overflow-hidden">
          <span className="text-[10px] text-slate-400 block truncate">Potential opportunity:</span>
          <span className="text-xs font-bold text-emerald-600 truncate block">
            {recommendation.expectedImpact || 'Increase sales volume'}
          </span>
        </div>

        <button
          onClick={onAction}
          className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs shrink-0 transition-colors flex items-center gap-1"
        >
          <span>
            {recommendation.actionType === 'CREATE_OFFER' && 'Create Offer'}
            {recommendation.actionType === 'UPDATE_PRICE' && 'Test Price'}
            {recommendation.actionType === 'SET_COST' && 'Set Cost'}
            {recommendation.actionType === 'REVIEW_MENU' && 'View Idea'}
            {recommendation.actionType === 'ADJUST_INVENTORY' && 'Review Batch'}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUBCOMPONENT: SIMPLE INSIGHT ROW FOR CATEGORIES
// -------------------------------------------------------------
interface SimpleInsightRowProps {
  recommendation: GrowthRecommendation;
  onAction: () => void;
  onToggleDone: () => void;
}

const SimpleInsightRow: React.FC<SimpleInsightRowProps> = ({
  recommendation,
  onAction,
  onToggleDone
}) => {
  return (
    <div className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
      recommendation.implemented
        ? 'bg-emerald-50/40 border-emerald-200'
        : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-50'
    }`}>
      <div className="space-y-0.5 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-600">{recommendation.badge}</span>
          <p className="font-bold text-slate-800 truncate">{recommendation.title}</p>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">{recommendation.found}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button
          onClick={onToggleDone}
          className={`p-1 rounded-md text-[10px] font-medium flex items-center gap-1 ${
            recommendation.implemented ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Toggle completion"
        >
          <Check className="w-3 h-3" />
          <span>{recommendation.implemented ? 'Done' : ''}</span>
        </button>

        <button
          onClick={onAction}
          className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline px-1.5 py-0.5"
        >
          Try Idea →
        </button>
      </div>
    </div>
  );
};

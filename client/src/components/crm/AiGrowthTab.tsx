import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  TrendingUp,
  Bot,
  ArrowRight,
  ChevronRight,
  Filter,
  CheckCircle,
  Clock,
  Coins,
  ShieldCheck,
  Gift,
  Search,
  Send,
  Zap,
  Tag
} from 'lucide-react';
import { AiRecommendation, AiCrmDashboardData } from '../../types';

interface AiGrowthTabProps {
  dashboardData: AiCrmDashboardData | null;
  recommendations: AiRecommendation[];
  onOpenCampaignBuilder: (prefillPrompt?: string, prefillRec?: AiRecommendation) => void;
  onNavigateTab: (tab: any) => void;
  onDismissRec?: (recId: string) => void;
}

export const AiGrowthTab: React.FC<AiGrowthTabProps> = ({
  dashboardData,
  recommendations,
  onOpenCampaignBuilder,
  onNavigateTab,
  onDismissRec
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [quickPrompt, setQuickPrompt] = useState<string>('');
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    onOpenCampaignBuilder(quickPrompt.trim());
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
    if (onDismissRec) onDismissRec(id);
  };

  const categories = [
    { id: 'ALL', label: 'All Opportunities' },
    { id: 'WIN_BACK', label: '🔥 Win-Back' },
    { id: 'NEW_RETENTION', label: '🌱 New Retention' },
    { id: 'VIP_PROTECTION', label: '👑 VIP Protection' },
    { id: 'INCREASE_AOV', label: '📈 Increase AOV' },
    { id: 'PRODUCT_BASED', label: '🍕 Product-Based' },
    { id: 'NO_DISCOUNT', label: '❤️ No-Discount Margin Protection' },
    { id: 'BIRTHDAY', label: '🎂 Celebrations' }
  ];

  const visibleRecs = recommendations
    .filter(r => !dismissedIds.has(r.id))
    .filter(r => selectedCategory === 'ALL' || r.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* 1. HERO HEADER (Phase 1) */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-orange-950 text-white rounded-2xl p-6 sm:p-7 border border-stone-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>SwaadSevak AI Customer Growth</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>AI Customer Intelligence & Growth</span>
              <span className="text-xl">🤖</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1.5 max-w-2xl font-normal leading-relaxed">
              Your AI assistant is continuously monitoring guest ordering patterns, visit frequency, and Discount Coin activity to find actionable revenue opportunities.
            </p>
          </div>

          {/* Quick Natural Language Command Bar ("Ask SwaadSevak" - Phase 28) */}
          <div className="pt-2">
            <form onSubmit={handleQuickSubmit} className="relative max-w-3xl">
              <div className="relative flex items-center">
                <Bot className="w-5 h-5 text-orange-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ask SwaadSevak: e.g. Bring back customers who haven't visited in a month and give them a small reward..."
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-stone-800/90 border border-stone-700/80 text-white text-xs sm:text-sm placeholder-stone-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-inner transition-all"
                />
                <button
                  type="submit"
                  disabled={!quickPrompt.trim()}
                  className="absolute right-2 px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <span>Build</span>
                  <Zap className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clickable Quick Prompts */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[11px] text-stone-400 font-semibold mr-1">Quick prompts:</span>
                {[
                  'Win back inactive diners',
                  'VIP patron appreciation',
                  'First visit second order',
                  'Promote pizza lovers',
                  'Appreciation without discount'
                ].map((qp) => (
                  <button
                    key={qp}
                    type="button"
                    onClick={() => onOpenCampaignBuilder(qp)}
                    className="px-2.5 py-1 rounded-md bg-stone-800/80 hover:bg-stone-700/90 text-stone-300 text-[11px] font-medium border border-stone-700/50 transition-colors"
                  >
                    "{qp}"
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 2. FOUR PRIMARY METRIC CARDS (Phase 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Customers to Win Back */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" /> At-Risk Churn
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                Action Needed
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {dashboardData?.winBackCard.customerCount || 43} <span className="text-sm font-semibold text-slate-500">customers</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Potential revenue: <strong className="text-emerald-700 font-bold">₹{(dashboardData?.winBackCard.potentialRevenue || 31200).toLocaleString('en-IN')}</strong>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">30+ days without order</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onOpenCampaignBuilder('Win back inactive customers with ₹75 coins')}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Win Back</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('customers')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              View List
            </button>
          </div>
        </div>

        {/* Card 2: High-Value Customers */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" /> VIP Patrons
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                Top 15%
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {dashboardData?.vipCard.customerCount || 27} <span className="text-sm font-semibold text-slate-500">customers</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Lifetime spend: <strong className="text-slate-900 font-bold">₹{(dashboardData?.vipCard.lifetimeSpend || 48500).toLocaleString('en-IN')}</strong>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Generate 31% of total revenue</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onOpenCampaignBuilder('VIP customer appreciation with exclusive reward')}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Reward VIP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('segments')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              View Segment
            </button>
          </div>
        </div>

        {/* Card 3: Growth Opportunities */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" /> Opportunities
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                Active
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {dashboardData?.opportunitiesCard.count || 8} <span className="text-sm font-semibold text-slate-500">opportunities</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Derived from <strong className="text-slate-800 font-bold">actual order & menu history</strong>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Win-back, combos, celebrations</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                const el = document.getElementById('ai-recommendations-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('segments')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              AI Segments
            </button>
          </div>
        </div>

        {/* Card 4: Active Automations */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-emerald-600" /> Automations
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                🟢 Live
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {dashboardData?.automationsCard.activeCount || 5} <span className="text-sm font-semibold text-slate-500">running</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Attributed revenue: <strong className="text-emerald-700 font-bold">₹{(dashboardData?.automationsCard.totalAttributedRevenue || 31400).toLocaleString('en-IN')}</strong>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Governed by frequency limits</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('automations')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-500">Auto-piloting</span>
          </div>
        </div>
      </div>

      {/* 3. AI RECOMMENDATIONS SECTION (Phase 2 & 3) */}
      <div id="ai-recommendations-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>AI Campaign Recommendations</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data-backed proposals tailored to customer intervals, menu margins, and loyalty behaviors.
            </p>
          </div>

          <button
            onClick={() => onOpenCampaignBuilder()}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>+ Custom Campaign</span>
          </button>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200/80 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Recommendations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleRecs.length === 0 ? (
            <div className="col-span-2 p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold text-slate-700">All opportunities in this category reviewed!</p>
              <p className="text-xs text-slate-500 mt-1">Check other categories or create a custom campaign above.</p>
            </div>
          ) : (
            visibleRecs.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-orange-300 transition-all relative"
              >
                <div className="space-y-3">
                  {/* Badge & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                      {rec.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      {rec.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {rec.title}
                  </h4>

                  {/* 4-part breakdown per prompt spec */}
                  <div className="space-y-2 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Why this matters:
                      </span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{rec.explanation}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-orange-800 tracking-wider block">
                        Recommended Action:
                      </span>
                      <p className="text-slate-900 font-semibold mt-0.5 leading-relaxed">{rec.recommendedAction}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Target Audience:</span>
                        <strong className="text-slate-800">{rec.targetAudienceCount} customers</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Estimated Value:</span>
                        <strong className="text-emerald-700">{rec.estimatedValue}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons (Phase 2) */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDismiss(rec.id)}
                      className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-600 text-xs font-semibold transition-colors"
                      title="Dismiss recommendation"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => onOpenCampaignBuilder(rec.title, rec)}
                      className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
                    >
                      Customize
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenCampaignBuilder(undefined, rec)}
                    className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Create Campaign</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

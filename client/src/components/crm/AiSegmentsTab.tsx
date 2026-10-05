import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  TrendingUp,
  ShoppingBag,
  Coins,
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
  Flame,
  ShieldCheck,
  Coffee,
  Briefcase,
  Crown,
  Percent,
  Search
} from 'lucide-react';
import { AiSegment } from '../../types';

interface AiSegmentsTabProps {
  segments: AiSegment[];
  onOpenCampaignBuilder: (prefillPrompt?: string, prefillRec?: any, prefillSegment?: AiSegment) => void;
  onFilterCustomersBySegment?: (segmentId: string) => void;
}

export const AiSegmentsTab: React.FC<AiSegmentsTabProps> = ({
  segments,
  onOpenCampaignBuilder,
  onFilterCustomersBySegment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getSegmentIcon = (id: string) => {
    switch (id) {
      case 'weekend_families':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'office_lunch':
        return <Briefcase className="w-5 h-5 text-cyan-500" />;
      case 'coffee_regulars':
        return <Coffee className="w-5 h-5 text-amber-500" />;
      case 'deal_seekers':
        return <Percent className="w-5 h-5 text-emerald-500" />;
      case 'premium_vip':
        return <Crown className="w-5 h-5 text-purple-500" />;
      case 'at_risk':
        return <Flame className="w-5 h-5 text-rose-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-orange-500" />;
    }
  };

  const getSegmentBadgeColor = (id: string) => {
    switch (id) {
      case 'weekend_families':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'office_lunch':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'coffee_regulars':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'deal_seekers':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'premium_vip':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'at_risk':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  // Filter segments
  const filteredSegments = segments.filter(seg => {
    const matchesSearch = seg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seg.characteristics.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedTag === 'ALL') return matchesSearch;
    if (selectedTag === 'HIGH_VALUE') return matchesSearch && (seg.id === 'premium_vip' || seg.averageOrder > 600);
    if (selectedTag === 'AT_RISK') return matchesSearch && seg.id === 'at_risk';
    if (selectedTag === 'RECURRING') return matchesSearch && (seg.averageVisitsPerMonth >= 2 || seg.id === 'coffee_regulars' || seg.id === 'office_lunch');
    return matchesSearch;
  });

  const totalSegmentRevenue = segments.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalAudienceCount = segments.reduce((sum, s) => sum + s.customerCount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold mb-2">
            <Sparkles className="w-3 h-3 text-orange-600" />
            <span>AI Customer Clusters (Phase 4)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Autonomous Customer Segments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            SwaadSevak continuously groups diners by visiting patterns, time of day, item affinity, and Discount Coin sensitivity without manual tags.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Segments</span>
            <span className="text-lg font-black text-slate-900">{segments.length} Discoveries</span>
          </div>
          <div className="p-3 bg-orange-50/80 rounded-xl border border-orange-200 text-right">
            <span className="text-[10px] uppercase font-bold text-orange-700 block">Segmented Revenue</span>
            <span className="text-lg font-black text-orange-950">{formatCurrency(totalSegmentRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTag('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTag === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Segments ({segments.length})
          </button>
          <button
            onClick={() => setSelectedTag('HIGH_VALUE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTag === 'HIGH_VALUE'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            👑 High Value & VIP
          </button>
          <button
            onClick={() => setSelectedTag('RECURRING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTag === 'RECURRING'
                ? 'bg-cyan-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ☕ High Frequency Regulars
          </button>
          <button
            onClick={() => setSelectedTag('AT_RISK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTag === 'AT_RISK'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🔥 At Risk
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search segments, habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSegments.map((segment) => {
          return (
            <div
              key={segment.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-4">
                {/* Top Title & Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                      {getSegmentIcon(segment.id)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                        {segment.name}
                      </h3>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mt-0.5 ${getSegmentBadgeColor(segment.id)}`}>
                        {segment.customerCount} Customers identified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                  {segment.description}
                </p>

                {/* Characteristics Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {segment.characteristics.map((char, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/60"
                    >
                      • {char}
                    </span>
                  ))}
                </div>

                {/* Segment Metrics (from Phase 4 spec) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Avg Order</span>
                    <span className="font-black text-slate-900 text-sm mt-0.5 block">
                      {formatCurrency(segment.averageOrder)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Avg Visits</span>
                    <span className="font-black text-slate-900 text-sm mt-0.5 block">
                      {segment.averageVisitsPerMonth} <span className="text-[10px] font-normal text-slate-500">/mo</span>
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block uppercase">Segment Revenue</span>
                      <span className="font-black text-slate-900 text-sm mt-0.5 block">
                        {formatCurrency(segment.totalRevenue)}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      {totalSegmentRevenue > 0 ? `${Math.round((segment.totalRevenue / totalSegmentRevenue) * 100)}% of sales` : 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenCampaignBuilder(
                    `Create a campaign for our ${segment.name} segment to increase repeat visits and order value.`,
                    undefined,
                    segment
                  )}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Create Campaign</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSegments.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-slate-700">No segments match your filter</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting the search query or tag selection.</p>
        </div>
      )}
    </div>
  );
};

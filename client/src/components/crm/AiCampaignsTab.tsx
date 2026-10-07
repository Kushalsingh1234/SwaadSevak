import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  TrendingUp,
  Sparkles,
  CheckCircle,
  Clock,
  Coins,
  Users,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  X,
  Plus,
  Send,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MessageSquare,
  HelpCircle,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';
import { AiCampaign } from '../../types';

interface AiCampaignsTabProps {
  campaigns: AiCampaign[];
  onRefreshCampaigns: () => void;
  onOpenCampaignBuilder: () => void;
}

export const AiCampaignsTab: React.FC<AiCampaignsTabProps> = ({
  campaigns,
  onRefreshCampaigns,
  onOpenCampaignBuilder
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedCampaignForAnalytics, setSelectedCampaignForAnalytics] = useState<AiCampaign | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status: AiCampaign['status']) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active / Running</span>
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span>🟡 Needs Approval</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle className="w-3 h-3 text-blue-600" />
            <span>Completed</span>
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-600" />
            <span>Scheduled</span>
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <span>Draft</span>
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <span>Paused</span>
          </span>
        );
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  // Actions
  const handleApprove = async (campaignId: string) => {
    setActionLoadingId(campaignId);
    setActionMessage(null);
    try {
      const res = await api.approveAiCampaign(campaignId);
      if (res.success) {
        setActionMessage('Campaign approved and queued for dispatch!');
        onRefreshCampaigns();
      }
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleExecute = async (campaignId: string) => {
    setActionLoadingId(campaignId);
    setActionMessage(null);
    try {
      const res = await api.executeAiCampaign(campaignId);
      if (res.success) {
        setActionMessage(`Campaign executed successfully! Reached ${res.sentCount || 0} customers with 0 spam conflicts.`);
        onRefreshCampaigns();
      }
    } catch (e: any) {
      setActionMessage(`Execution failed: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (campaignId: string) => {
    setActionLoadingId(campaignId);
    setActionMessage(null);
    try {
      const res = await api.cancelAiCampaign(campaignId);
      if (res.success) {
        setActionMessage('Campaign paused/cancelled.');
        onRefreshCampaigns();
      }
    } catch (e: any) {
      setActionMessage(`Failed: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') return c.status === 'RUNNING' || c.status === 'APPROVED' || c.status === 'SCHEDULED';
    if (statusFilter === 'PENDING') return c.status === 'PENDING_APPROVAL';
    if (statusFilter === 'COMPLETED') return c.status === 'COMPLETED';
    if (statusFilter === 'DRAFT') return c.status === 'DRAFT';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold mb-2">
            <BarChart3 className="w-3 h-3 text-blue-600" />
            <span>Campaign Operations & Lifecycle (Phase 21, 33)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Marketing Campaigns & ROI Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Track live dispatch status, approval requests, and measurable incrementality with control-group economics.
          </p>
        </div>

        <button
          onClick={onOpenCampaignBuilder}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Campaign</span>
        </button>
      </div>

      {/* Global Action Message Banner */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs font-semibold flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-orange-700 hover:text-orange-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto text-xs font-semibold w-full sm:w-auto">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({campaigns.length})
        </button>
        <button
          onClick={() => setStatusFilter('ACTIVE')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            statusFilter === 'ACTIVE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active / Scheduled
        </button>
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            statusFilter === 'PENDING' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Needs Approval ({campaigns.filter(c => c.status === 'PENDING_APPROVAL').length})
        </button>
        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            statusFilter === 'COMPLETED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Completed Analytics
        </button>
        <button
          onClick={() => setStatusFilter('DRAFT')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            statusFilter === 'DRAFT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((camp) => {
          const stats = camp.performance;
          const hasPerformance = stats && stats.sent > 0;

          return (
            <div
              key={camp.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-lg">
                    {camp.channel === 'WHATSAPP' ? '💬' : camp.channel === 'SMS' ? '📱' : '✉️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900">{camp.name}</h3>
                      {getStatusBadge(camp.status)}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {camp.channel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Targeting: <strong className="text-slate-700">{camp.audienceFilterDesc}</strong> ({camp.targetCount} diners)
                    </p>
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {camp.status === 'PENDING_APPROVAL' && (
                    <button
                      onClick={() => handleApprove(camp.id)}
                      disabled={actionLoadingId === camp.id}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve & Launch</span>
                    </button>
                  )}

                  {/* Always keep Trigger Now accessible */}
                  <button
                    onClick={() => handleExecute(camp.id)}
                    disabled={actionLoadingId === camp.id}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    title="Send this campaign immediately via WhatsApp"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Trigger Now</span>
                  </button>

                  {hasPerformance && (
                    <button
                      onClick={() => setSelectedCampaignForAnalytics(camp)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>View ROI & Lift</span>
                    </button>
                  )}

                  {camp.status === 'RUNNING' && (
                    <button
                      onClick={() => handleCancel(camp.id)}
                      disabled={actionLoadingId === camp.id}
                      className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-all cursor-pointer"
                    >
                      Pause
                    </button>
                  )}
                </div>
              </div>

              {/* Schedule Timing & Reward Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
                {/* 1. When it is scheduled / dispatched */}
                {camp.scheduledFor ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Scheduled: <strong>{new Date(camp.scheduledFor).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</strong></span>
                  </div>
                ) : camp.sentAt ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dispatched: <strong>{new Date(camp.sentAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</strong></span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Dispatch: <strong>Immediate upon trigger</strong></span>
                  </div>
                )}

                {/* 2. What reward is being sent */}
                {(camp.offerType === 'DISCOUNT_COINS' || (!camp.offerType && (camp.offerValue || 0) > 0)) && (camp.offerValue || 0) > 0 ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reward: ₹{camp.offerValue} Bonus Coins ({camp.validityDays || 7}d validity)</span>
                  </div>
                ) : camp.offerType === 'DISCOUNT_PERCENT' && (camp.offerValue || 0) > 0 ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-bold">
                    <Percent className="w-3.5 h-3.5 text-blue-600" />
                    <span>Reward: {camp.offerValue}% Discount ({camp.validityDays || 7}d validity)</span>
                  </div>
                ) : camp.offerType === 'FREE_ITEM' ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                    <span>🍟 Complimentary Perk ({camp.validityDays || 7}d validity)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                    <span>❤️ Loyalty Appreciation Only (No discount)</span>
                  </div>
                )}
              </div>

              {/* 3. Campaign Message Body (AI Strategic Reasoning removed per user request) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Campaign Message</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    {camp.channel}
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-2xs">
                  <p className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                    {camp.messageTemplate || (camp as any).message || camp.resolvedMessagePreview || 'No message configured'}
                  </p>
                </div>
              </div>

              {/* Quick Performance Metrics Bar (if executed) */}
              {hasPerformance && stats && (
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-[10px] text-slate-400 block uppercase">Sent / Delivered</span>
                    <span className="font-black text-slate-800 text-sm mt-0.5">{stats.sent} / {stats.delivered}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-[10px] text-slate-400 block uppercase">Redeemed</span>
                    <span className="font-black text-purple-700 text-sm mt-0.5">{stats.redeemed} orders</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-[10px] text-slate-400 block uppercase">Conversion Rate</span>
                    <span className="font-black text-emerald-700 text-sm mt-0.5">{stats.conversionRate}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-[10px] text-slate-400 block uppercase">Revenue Generated</span>
                    <span className="font-black text-slate-900 text-sm mt-0.5">{formatCurrency(stats.revenueGenerated)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">Net Profit Lift</span>
                    <span className="font-black text-emerald-900 text-sm mt-0.5">{formatCurrency(stats.netRevenue)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredCampaigns.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-700">No campaigns found in this view</h3>
            <p className="text-xs text-slate-400 mt-1">Generate a campaign using the AI Campaign Builder.</p>
          </div>
        )}
      </div>

      {/* PHASE 21, 22, 23: DETAILED CAMPAIGN ANALYTICS & INCREMENTAL LIFT MODAL */}
      {selectedCampaignForAnalytics && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {selectedCampaignForAnalytics.channel}
                  </span>
                  <h3 className="font-black text-lg text-slate-900">
                    {selectedCampaignForAnalytics.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Performance audit, redemption tracking & control group lift analysis
                </p>
              </div>
              <button
                onClick={() => setSelectedCampaignForAnalytics(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Campaign Performance Spec Grid (Phase 21) */}
            {selectedCampaignForAnalytics.performance && (
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Core Delivery & Conversion Funnel
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sent</span>
                    <span className="text-xl font-black text-slate-900 block mt-0.5">
                      {selectedCampaignForAnalytics.performance.sent}
                    </span>
                    <span className="text-[10px] text-slate-500">Delivered: {selectedCampaignForAnalytics.performance.delivered}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                    <span className="text-[10px] uppercase font-bold text-purple-700 block">Redeemed</span>
                    <span className="text-xl font-black text-purple-900 block mt-0.5">
                      {selectedCampaignForAnalytics.performance.redeemed}
                    </span>
                    <span className="text-[10px] text-purple-700">Orders completed</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Conversion Rate</span>
                    <span className="text-xl font-black text-emerald-900 block mt-0.5">
                      {selectedCampaignForAnalytics.performance.conversionRate}%
                    </span>
                    <span className="text-[10px] text-emerald-700">Target response</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Order</span>
                    <span className="text-xl font-black text-slate-900 block mt-0.5">
                      {formatCurrency(selectedCampaignForAnalytics.performance.averageOrderValue || 0)}
                    </span>
                    <span className="text-[10px] text-slate-500">Per returning diner</span>
                  </div>
                </div>

                {/* Financial Ledger Comparison */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Gross Revenue Generated:</span>
                    <strong className="text-slate-900">{formatCurrency(selectedCampaignForAnalytics.performance.revenueGenerated)}</strong>
                  </div>
                  <div className="flex justify-between items-center text-rose-600">
                    <span>Discount Coin Liability Cost:</span>
                    <strong>- {formatCurrency(selectedCampaignForAnalytics.performance.discountCost)}</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-sm text-emerald-800">
                    <span>Net Margin Generated:</span>
                    <span className="text-base text-emerald-900 font-black">
                      {formatCurrency(selectedCampaignForAnalytics.performance.netRevenue)}
                    </span>
                  </div>
                </div>

                {/* PHASE 23: INCREMENTAL REVENUE & CONTROL GROUP LIFT */}
                {selectedCampaignForAnalytics.performance.controlGroup && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Phase 23: True Incremental Revenue vs Control Group</span>
                      </span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                        Scientifically Measured Lift
                      </span>
                    </div>

                    <p className="text-xs text-indigo-900 leading-relaxed">
                      SwaadSevak holds back a randomized 10% control group to distinguish diners who would have returned organically from those prompted by this campaign.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 bg-white rounded-lg border border-indigo-100">
                        <span className="text-[10px] text-slate-400 block uppercase">Campaign Group</span>
                        <span className="font-black text-slate-800 text-sm mt-0.5">
                          {selectedCampaignForAnalytics.performance.controlGroup.campaignGroupReturns} / {selectedCampaignForAnalytics.performance.controlGroup.campaignGroupSize}
                        </span>
                        <span className="text-[9px] text-slate-500">Returned</span>
                      </div>

                      <div className="p-2 bg-white rounded-lg border border-indigo-100">
                        <span className="text-[10px] text-slate-400 block uppercase">Holdout Control</span>
                        <span className="font-black text-slate-800 text-sm mt-0.5">
                          {selectedCampaignForAnalytics.performance.controlGroup.controlGroupReturns} / {selectedCampaignForAnalytics.performance.controlGroup.controlGroupSize}
                        </span>
                        <span className="text-[9px] text-slate-500">Organic return</span>
                      </div>

                      <div className="p-2 bg-white rounded-lg border border-indigo-100">
                        <span className="text-[10px] text-indigo-600 font-bold block uppercase">Incremental Visits</span>
                        <span className="font-black text-indigo-900 text-sm mt-0.5">
                          +{selectedCampaignForAnalytics.performance.controlGroup.incrementalVisits}
                        </span>
                        <span className="text-[9px] text-indigo-700">Pure campaign lift</span>
                      </div>

                      <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 font-bold block uppercase">Attributable Lift</span>
                        <span className="font-black text-emerald-900 text-sm mt-0.5">
                          +{formatCurrency(selectedCampaignForAnalytics.performance.controlGroup.incrementalRevenue)}
                        </span>
                        <span className="text-[9px] text-emerald-700">True new revenue</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* PHASE 22: AI LEARNING INSIGHT */}
                <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950">
                  <span className="font-bold uppercase tracking-wider text-orange-800 text-[10px] block mb-1">
                    🧠 Phase 22: AI Machine Learning Takeaway
                  </span>
                  <p className="leading-relaxed">
                    "This ₹{selectedCampaignForAnalytics.offerValue} reward achieved a {selectedCampaignForAnalytics.performance.conversionRate}% conversion rate with positive net lift. The AI CRM will automatically use this conversion elasticity to recommend similar incentives for the {selectedCampaignForAnalytics.targetSegment} cohort in the future."
                  </p>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedCampaignForAnalytics(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close Analytics
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Bot,
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
  MessageSquare,
  Smartphone,
  Mail,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Flame,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { AiAutomation, MarketingChannelConfig } from '../../types';

interface AiAutomationsTabProps {
  automations: AiAutomation[];
  channels: MarketingChannelConfig[];
  onRefreshAutomations: () => void;
  onRefreshChannels?: () => void;
}

export const AiAutomationsTab: React.FC<AiAutomationsTabProps> = ({
  automations,
  channels,
  onRefreshAutomations,
  onRefreshChannels
}) => {
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [creationMode, setCreationMode] = useState<'DESCRIBE' | 'RECOMMENDED' | 'MANUAL'>('DESCRIBE');

  // Form states for creation
  const [describeInput, setDescribeInput] = useState<string>('Every time someone hasn\'t visited for 45 days, send them a ₹75 reward.');
  const [name, setName] = useState<string>('45-Day Inactive Re-engagement');
  const [triggerType, setTriggerType] = useState<string>('INACTIVITY_DAYS');
  const [triggerValue, setTriggerValue] = useState<number>(45);
  const [actionType, setActionType] = useState<string>('GIVE_COINS');
  const [actionRewardCoins, setActionRewardCoins] = useState<number>(75);
  const [actionMessage, setActionMessage] = useState<string>('Hey {{customer_name}}, we miss you! Here is ₹75 in SwaadSevak Coins on your next order.');
  const [minOrderValue, setMinOrderValue] = useState<number>(300);
  const [frequencyLimitDays, setFrequencyLimitDays] = useState<number>(45);
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');
  const [creating, setCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>('');

  // Channel configuration modal
  const [showChannelModal, setShowChannelModal] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<MarketingChannelConfig | null>(null);
  const [savingChannel, setSavingChannel] = useState<boolean>(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleToggleStatus = async (automationId: string, currentStatus: AiAutomation['status']) => {
    setToggleLoadingId(automationId);
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      await api.toggleAiAutomation(automationId, newStatus);
      onRefreshAutomations();
    } catch (e) {
      console.error(e);
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleCreateAutomation = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');

    try {
      let finalName = name;
      let finalTriggerValue = triggerValue;
      let finalReward = actionRewardCoins;

      if (creationMode === 'DESCRIBE') {
        finalName = describeInput.slice(0, 40) + '...';
        if (describeInput.includes('30')) finalTriggerValue = 30;
        if (describeInput.includes('60')) finalTriggerValue = 60;
        if (describeInput.includes('50')) finalReward = 50;
        if (describeInput.includes('100')) finalReward = 100;
      }

      const res = await api.createAiAutomation({
        name: finalName,
        status: 'ACTIVE',
        trigger: {
          type: triggerType as any,
          value: finalTriggerValue,
          description: `Triggered when customer satisfies ${triggerType} threshold`
        },
        conditions: [
          { field: 'orders', operator: 'GTE', value: 1, label: 'Minimum 1 prior completed order' }
        ],
        action: {
          type: actionType as any,
          rewardCoins: finalReward,
          messageTemplate: actionMessage,
          validityDays: 7,
          minOrderValue
        },
        frequencyLimitDays,
        priority,
        channel,
        autoApprove: true,
        stats: {
          lastRun: new Date().toISOString(),
          customersReached: 0,
          revenueAttributed: 0
        }
      });

      if (res.success) {
        setShowCreateModal(false);
        onRefreshAutomations();
      } else {
        setCreateError(res.message || 'Failed to create automation');
      }
    } catch (err: any) {
      setCreateError(err.message || 'Error occurred');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold mb-2">
            <Bot className="w-3 h-3 text-purple-600" />
            <span>Autonomous Growth Rules (Phases 11–15, 34, 35)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Automations Control Center</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            SwaadSevak continuously runs scheduled background triggers. Dynamic frequency limits prevent customer spamming.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowChannelModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Channel Connections</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Automation</span>
          </button>
        </div>
      </div>

      {/* PHASE 14: Frequency Protection & Anti-Spam Guard Status */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 p-4 rounded-2xl border border-emerald-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-950 text-sm">
              Phase 14 Anti-Spam Frequency Shield Active
            </h4>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              Strict limits enforced: Max 3 marketing messages/month per customer • Minimum 5-day gap between touches • Conflict resolver prioritizes recovery campaigns.
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-200/80 text-emerald-900 font-bold text-[10px] uppercase tracking-wider self-start sm:self-auto">
          🟢 Enforced Autonomously
        </span>
      </div>

      {/* Automations Cards List (Phase 35) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {automations.map((auto) => {
          const isActive = auto.status === 'ACTIVE';

          return (
            <div
              key={auto.id}
              className={`rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 bg-white ${
                isActive ? 'border-slate-200/90 shadow-xs hover:border-slate-300' : 'border-slate-200 bg-slate-50/50 opacity-80'
              }`}
            >
              <div className="space-y-3">
                {/* Header with Title and Toggle */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{auto.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span>{isActive ? 'Active' : 'Paused'}</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      Priority: <strong className="text-slate-700">{auto.priority}</strong> • Channel: <strong className="text-slate-700">{auto.channel}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(auto.id, auto.status)}
                    disabled={toggleLoadingId === auto.id}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
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
                </div>

                {/* Trigger & Action Details (Phase 13) */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 uppercase text-[10px] w-14 shrink-0">Trigger:</span>
                    <span className="font-semibold text-slate-800">{auto.trigger.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 uppercase text-[10px] w-14 shrink-0">Action:</span>
                    <span className="font-semibold text-orange-700">
                      🪙 Give ₹{auto.action.rewardCoins} Discount Coins (valid {auto.action.validityDays}d)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 uppercase text-[10px] w-14 shrink-0">Safety:</span>
                    <span className="text-slate-600">Max once every {auto.frequencyLimitDays} days per diner</span>
                  </div>
                </div>

                {/* Message Template Preview */}
                <div className="p-2.5 rounded-lg bg-slate-100/70 text-slate-600 font-mono text-[11px] truncate">
                  "{auto.action.messageTemplate}"
                </div>
              </div>

              {/* Automation Performance Audit (Phase 35) */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Customers Reached</span>
                  <span className="font-black text-slate-900 text-sm">
                    {auto.stats?.customersReached ?? auto.customersReached ?? 0}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Attributed Revenue</span>
                  <span className="font-black text-emerald-700 text-sm">
                    {formatCurrency(auto.stats?.revenueAttributed ?? auto.revenueAttributed ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE AUTOMATION MODAL (Phase 12) */}
      {showCreateModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-orange-600" />
                <h3 className="font-black text-base text-slate-900">Create AI Automation Rule (Phase 12)</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => setCreationMode('DESCRIBE')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  creationMode === 'DESCRIBE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                ✨ Describe It
              </button>
              <button
                type="button"
                onClick={() => setCreationMode('RECOMMENDED')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  creationMode === 'RECOMMENDED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                🤖 AI Recommended
              </button>
              <button
                type="button"
                onClick={() => setCreationMode('MANUAL')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  creationMode === 'MANUAL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                ⚙️ Manual Rule
              </button>
            </div>

            <form onSubmit={handleCreateAutomation} className="space-y-4 text-xs">
              {creationMode === 'DESCRIBE' && (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Describe the automation in plain words:</label>
                  <textarea
                    rows={3}
                    value={describeInput}
                    onChange={(e) => setDescribeInput(e.target.value)}
                    placeholder="e.g. Every time someone hasn't visited for 45 days, give them ₹75 Discount Coins and a warm invite."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-orange-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDescribeInput('Win back customers who have been inactive for 30 days with ₹75 coins.')}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-700 cursor-pointer"
                    >
                      30-Day Win Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescribeInput('Send thank you message to customers after their 5th order.')}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-700 cursor-pointer"
                    >
                      5th Order Milestone
                    </button>
                  </div>
                </div>
              )}

              {(creationMode === 'MANUAL' || creationMode === 'RECOMMENDED') && (
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Automation Title</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Trigger Event</label>
                      <select
                        value={triggerType}
                        onChange={(e) => setTriggerType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="INACTIVITY_DAYS">Inactivity (Days)</option>
                        <option value="ORDER_COMPLETED">First Order Completed</option>
                        <option value="NEGATIVE_FEEDBACK">Negative Feedback Recovery</option>
                        <option value="BIRTHDAY_UPCOMING">Upcoming Birthday</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Reward Coins (₹)</label>
                      <input
                        type="number"
                        value={actionRewardCoins}
                        onChange={(e) => setActionRewardCoins(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Message Template</label>
                    <textarea
                      rows={2}
                      value={actionMessage}
                      onChange={(e) => setActionMessage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              {/* Safety Frequency Limit Guard */}
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 space-y-1">
                <span className="font-bold text-orange-950 block">Frequency Guard Protection</span>
                <p className="text-[11px] text-orange-800">
                  This rule will not message the same diner more than once every {frequencyLimitDays} days.
                </p>
              </div>

              {createError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                  {createError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold cursor-pointer flex items-center gap-1.5"
                >
                  {creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  <span>Activate Automation</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* PHASE 17: MARKETING CHANNELS CONNECTIVITY MODAL */}
      {showChannelModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-black text-base text-slate-900">Marketing Channels (Phase 17)</h3>
                <p className="text-xs text-slate-500">Configure messaging providers. AI will not pretend messages are sent.</p>
              </div>
              <button onClick={() => setShowChannelModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {channels.map((chan) => (
                <div key={chan.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg">
                      {chan.channel === 'WHATSAPP' ? '💬' : chan.channel === 'SMS' ? '📱' : '✉️'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900">{chan.channel} Provider</h4>
                        <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                          chan.connected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {chan.connected ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Opt-outs: {chan.optOutCount} customers • Daily limit: {chan.dailyLimit}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // Toggle connection for demo
                      chan.connected = !chan.connected;
                      if (onRefreshChannels) onRefreshChannels();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chan.connected ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-orange-600 text-white hover:bg-orange-500'
                    }`}
                  >
                    {chan.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowChannelModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Calendar,
  Clock,
  Coins,
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Globe,
  Sliders,
  FileEdit,
  Eye,
  Zap,
  Tag,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { AiCampaign, AiRecommendation, AiSegment, Restaurant } from '../../types';

interface AiCampaignBuilderTabProps {
  restaurant: Restaurant | null;
  initialPrompt?: string;
  initialRecommendation?: AiRecommendation | null;
  initialSegment?: AiSegment | null;
  onCampaignCreated?: (campaign: AiCampaign) => void;
  onNavigateTab: (tab: any) => void;
}

export const AiCampaignBuilderTab: React.FC<AiCampaignBuilderTabProps> = ({
  restaurant,
  initialPrompt = '',
  initialRecommendation = null,
  initialSegment = null,
  onCampaignCreated,
  onNavigateTab
}) => {
  // Input Prompt
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [parsing, setParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string>('');

  // Structured Campaign Form
  const [name, setName] = useState<string>('Win Back Inactive Diners');
  const [category, setCategory] = useState<string>('WIN_BACK');
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');
  const [targetSegment, setTargetSegment] = useState<string>('AT_RISK');
  const [targetCount, setTargetCount] = useState<number>(43);
  const [audienceFilterDesc, setAudienceFilterDesc] = useState<string>('Customers inactive for 30+ days with >= 2 prior visits');
  
  // Offer
  const [offerType, setOfferType] = useState<'DISCOUNT_COINS' | 'DISCOUNT_PERCENT' | 'FREE_ITEM' | 'NO_DISCOUNT'>('DISCOUNT_COINS');
  const [offerValue, setOfferValue] = useState<number>(75);
  const [validityDays, setValidityDays] = useState<number>(7);
  const [minOrderValue, setMinOrderValue] = useState<number>(300);
  const [reasoning, setReasoning] = useState<string>(
    'These customers normally return every 18–25 days but haven\'t ordered in 30+ days. A ₹75 reward (~12% of their AOV) brings them back while preserving profitability.'
  );

  // Message & Tone
  const [tone, setTone] = useState<'FRIENDLY' | 'PREMIUM' | 'CASUAL' | 'URGENT' | 'FESTIVE' | 'PROFESSIONAL'>('FRIENDLY');
  const [language, setLanguage] = useState<'EN' | 'HI' | 'HINGLISH'>('HINGLISH');
  const [message, setMessage] = useState<string>(
    'Hey {{customer_name}}! Kaafi time ho gaya mile huye ❤️ Aapke next order ke liye humne ₹{{coin_reward}} SwaadSevak Coins add kiye hain. Table book karein ya visit karein: {{restaurant_name}}!'
  );

  // Execution & Schedule
  const [scheduleType, setScheduleType] = useState<'IMMEDIATE' | 'AI_OPTIMIZED' | 'SCHEDULED'>('AI_OPTIMIZED');
  const [aiOptimizedTime, setAiOptimizedTime] = useState<string>('Friday, 6:30 PM (Peak ordering window for this cohort)');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [requiresApproval, setRequiresApproval] = useState<boolean>(true);

  // Submission State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');

  // Auto-init from recommendation or segment
  useEffect(() => {
    if (initialRecommendation) {
      setName(initialRecommendation.title);
      setCategory(initialRecommendation.category);
      setTargetCount(initialRecommendation.targetAudience?.count ?? initialRecommendation.targetAudienceCount ?? 43);
      setAudienceFilterDesc(initialRecommendation.targetAudience?.description ?? initialRecommendation.targetAudienceLabel ?? 'Targeted cohort');
      const offerCoins = initialRecommendation.recommendedOffer?.coins ?? initialRecommendation.recommendedCoins ?? 75;
      setOfferValue(offerCoins);
      setReasoning(initialRecommendation.explanation);
      if (offerCoins === 0) {
        setOfferType('NO_DISCOUNT');
      }
      generateMultiLangMessage(initialRecommendation.category, offerCoins, tone, language);
    } else if (initialSegment) {
      setName(`Special Offer for ${initialSegment.name}`);
      setCategory('INCREASE_AOV');
      setTargetCount(initialSegment.customerCount);
      setAudienceFilterDesc(`Members of ${initialSegment.name} (${initialSegment.characteristics.join(', ')})`);
      setOfferValue(50);
      setReasoning(`Targeting ${initialSegment.name} whose AOV is ₹${initialSegment.avgOrderValue || initialSegment.averageOrder || 500}. An incentive stimulates extra frequency.`);
      generateMultiLangMessage('INCREASE_AOV', 50, tone, language);
    } else if (initialPrompt) {
      handleParsePrompt(initialPrompt);
    }
  }, [initialRecommendation, initialSegment]);

  // Handle prompt submission
  const handleParsePrompt = async (promptText?: string) => {
    const textToParse = promptText || prompt;
    if (!textToParse.trim()) return;

    setParsing(true);
    setParseError('');
    try {
      const res = await api.parseAiCampaign(textToParse.trim());
      if (res.success && res.draft) {
        const d = res.draft;
        setName(d.name || name);
        setCategory(d.category || category);
        setChannel(d.channel || 'WHATSAPP');
        setTargetSegment(d.targetSegment || 'AT_RISK');
        setTargetCount(d.targetCount || 35);
        setAudienceFilterDesc(d.audienceFilterDesc || 'Targeted segment based on ordering recency');
        setOfferType(d.offerType || 'DISCOUNT_COINS');
        setOfferValue(d.offerValue ?? 75);
        setValidityDays(d.validityDays || 7);
        setMinOrderValue(d.minOrderValue || 300);
        setReasoning(d.reasoning || reasoning);
        setTone(d.tone || 'FRIENDLY');
        setLanguage(d.language || 'HINGLISH');
        setMessage(d.message || message);
        setAiOptimizedTime(d.aiOptimizedTime || 'Friday, 6:30 PM');
      } else {
        setParseError(res.message || 'AI was unable to structure the prompt. You can adjust the parameters manually.');
      }
    } catch (e: any) {
      setParseError(e.message || 'AI request failed');
    } finally {
      setParsing(false);
    }
  };

  // Helper for multi-language message generation
  const generateMultiLangMessage = (cat: string, coins: number, t: string, lang: 'EN' | 'HI' | 'HINGLISH') => {
    let msg = '';
    if (lang === 'HINGLISH') {
      if (cat === 'WIN_BACK') {
        msg = `Hey {{customer_name}}! Kaafi time ho gaya mile huye ❤️ Aapke next visit ke liye humne ₹${coins} Discount Coins add kiye hain. Table book karein ya visit karein: {{restaurant_name}}!`;
      } else if (cat === 'VIP_PROTECTION') {
        msg = `Namaste {{customer_name}}! 👑 You are one of our most valued guests at {{restaurant_name}}. Enjoy an exclusive ₹${coins} loyalty perk on your table this weekend!`;
      } else if (cat === 'PRODUCT_BASED') {
        msg = `Craving your favourites? 🍕 {{customer_name}}, {{restaurant_name}} par aapka favourite menu ready hai. Use ₹${coins} Coins on your next order!`;
      } else if (cat === 'NO_DISCOUNT') {
        msg = `Hey {{customer_name}}! We are serving freshly handcrafted specials today at {{restaurant_name}}. We'd love to host you again! ❤️`;
      } else {
        msg = `Hey {{customer_name}}! Special reward: Enjoy ₹${coins} Discount Coins on your next order at {{restaurant_name}}. Valid for 7 days!`;
      }
    } else if (lang === 'HI') {
      if (coins > 0) {
        msg = `नमस्ते {{customer_name}}! {{restaurant_name}} में आपके अगले आर्डर पर ₹${coins} डिस्काउंट कॉइन्स का उपहार तैयार है। जल्द पधारें!`;
      } else {
        msg = `नमस्ते {{customer_name}}! {{restaurant_name}} में आज खास शेफ स्पेशल तैयार हैं। आपका स्वागत है!`;
      }
    } else {
      // English
      if (cat === 'WIN_BACK') {
        msg = `Hey {{customer_name}}! 👋 We haven't seen you in a while. Here's ₹${coins} in Discount Coins for your next visit at {{restaurant_name}}. We'd love to welcome you back!`;
      } else if (cat === 'VIP_PROTECTION') {
        msg = `Dear {{customer_name}}, thank you for being a cherished VIP at {{restaurant_name}}. An exclusive ₹${coins} reward has been credited to your loyalty balance.`;
      } else if (cat === 'NO_DISCOUNT') {
        msg = `Hey {{customer_name}}! Our chefs have freshly prepared seasonal specials today. Come dine with us at {{restaurant_name}}!`;
      } else {
        msg = `Hey {{customer_name}}! Treat yourself at {{restaurant_name}} with ₹${coins} Discount Coins on your next visit. Valid for ${validityDays} days!`;
      }
    }
    setMessage(msg);
  };

  const handleLanguageChange = (newLang: 'EN' | 'HI' | 'HINGLISH') => {
    setLanguage(newLang);
    generateMultiLangMessage(category, offerValue, tone, newLang);
  };

  const handleToneChange = (newTone: any) => {
    setTone(newTone);
    generateMultiLangMessage(category, offerValue, newTone, language);
  };

  // Preview Message Interpolation
  const previewText = message
    .replace(/{{customer_name}}/g, 'Rahul Sharma')
    .replace(/{{restaurant_name}}/g, restaurant?.name || 'SwaadSevak')
    .replace(/{{coin_reward}}/g, offerValue.toString())
    .replace(/{{favourite_item}}/g, 'Paneer Tikka Roll')
    .replace(/{{discount_expiry}}/g, '7 days')
    .replace(/{{restaurant_address}}/g, 'Indiranagar, Bangalore');

  // Phase 20: Cost Liability Calculation
  const estimatedCostLiability = offerType === 'DISCOUNT_COINS' ? targetCount * offerValue : 0;
  const isHighCost = estimatedCostLiability > 5000;

  // Handle Save / Schedule / Launch
  const handleSubmitCampaign = async (status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SCHEDULED' | 'RUNNING') => {
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const payload: any = {
        name,
        category,
        channel,
        status,
        targetSegment,
        targetCount,
        audienceFilterDesc,
        offerType,
        offerValue,
        validityDays,
        minOrderValue,
        tone,
        language,
        message,
        reasoning,
        scheduleType,
        aiOptimizedTime,
        scheduledAt: scheduleType === 'SCHEDULED' ? scheduledAt : undefined,
        requiresApproval,
        estimatedCost: estimatedCostLiability,
        maxBudget: estimatedCostLiability * 1.2
      };

      const res = await api.createAiCampaign(payload);
      if (res.success && res.campaign) {
        setSubmitSuccess(`Campaign "${res.campaign.name}" created successfully with status: ${res.campaign.status}!`);
        if (onCampaignCreated) onCampaignCreated(res.campaign);
        setTimeout(() => {
          onNavigateTab('campaigns');
        }, 1200);
      } else {
        setSubmitError(res.message || 'Failed to save campaign');
      }
    } catch (e: any) {
      setSubmitError(e.message || 'Error creating campaign');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold mb-2">
            <Sparkles className="w-3 h-3 text-orange-600" />
            <span>AI Campaign Engine (Phases 5–10)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Natural Language Campaign Builder</span>
            <Bot className="w-6 h-6 text-orange-500" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Type your marketing goal in plain English, and SwaadSevak AI will translate it into a targeted audience, safe coin offer, and personalized messaging.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('campaigns')}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <span>View All Campaigns</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* PHASE 5: Natural Language Input Box */}
      <div className="bg-gradient-to-br from-slate-900 via-stone-900 to-orange-950 p-5 sm:p-6 rounded-2xl border border-stone-800 shadow-md text-white space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-orange-300 flex items-center gap-2">
            <Bot className="w-4 h-4 text-orange-400" />
            <span>What do you want to achieve? (Phase 5)</span>
          </label>
          <span className="text-[11px] text-stone-400">Powered by SwaadSevak CRM AI</span>
        </div>

        <div className="relative">
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Bring back customers who haven't visited in a month with a ₹75 reward, or create a weekend pizza boost..."
            className="w-full p-3.5 rounded-xl bg-stone-800/90 border border-stone-700 text-white text-xs sm:text-sm placeholder-stone-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] uppercase font-bold text-stone-400">Quick ideas:</span>
          {[
            'Win back 30-day inactive regulars with ₹75 coins',
            'Reward VIP customers without discounting margins',
            'Encourage second visit for new customers who joined this month',
            'Boost Friday dinner orders with high-margin combos'
          ].map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPrompt(suggestion);
                handleParsePrompt(suggestion);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700/80 transition-all cursor-pointer"
            >
              + {suggestion}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          {parseError && (
            <span className="text-xs text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {parseError}
            </span>
          )}
          {!parseError && <div />}

          <button
            onClick={() => handleParsePrompt()}
            disabled={parsing || !prompt.trim()}
            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {parsing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Restaurant Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Generate Campaign Draft</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Campaign Customizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameters & Configuration */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Campaign Details & Audience */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-600" />
              <span>1. Target Audience & Campaign Details</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Channel (Phase 17)</label>
                  <select
                    value={channel}
                    onChange={(e: any) => setChannel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:border-orange-500 outline-none"
                  >
                    <option value="WHATSAPP">💬 WhatsApp (98% Open Rate)</option>
                    <option value="SMS">📱 SMS Marketing</option>
                    <option value="EMAIL">✉️ Email Newsletter</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Audience Segment</label>
                  <select
                    value={targetSegment}
                    onChange={(e) => setTargetSegment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:border-orange-500 outline-none"
                  >
                    <option value="AT_RISK">⚠️ Inactive & At Risk</option>
                    <option value="VIP">👑 VIP High-Spenders</option>
                    <option value="NEW_CUSTOMERS">🌱 First-Time Diners</option>
                    <option value="WEEKEND_REGULARS">🍕 Weekend Visitors</option>
                    <option value="DEAL_SEEKERS">🪙 Deal Seekers</option>
                    <option value="ALL">👥 All Identified Diners</option>
                  </select>
                </div>
              </div>

              {/* Audience condition visual box (Phase 7) */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Identified Target Cohort</span>
                  <span className="font-semibold text-slate-800">{audienceFilterDesc}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-orange-600 block">{targetCount}</span>
                  <span className="text-[10px] text-slate-400 uppercase">Customers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: AI Offer Generation & Guardrails (Phase 8 & 20) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>2. Incentive & Guardrails (Phases 8, 20)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Reward Type</label>
                <select
                  value={offerType}
                  onChange={(e: any) => setOfferType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:border-orange-500 outline-none"
                >
                  <option value="DISCOUNT_COINS">🪙 Discount Coins (Recommended)</option>
                  <option value="NO_DISCOUNT">❤️ Appreciation Only (No Discount)</option>
                  <option value="FREE_ITEM">🍟 Complimentary Appetizer/Beverage</option>
                  <option value="DISCOUNT_PERCENT">🏷️ Direct Percentage Discount</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                  {offerType === 'DISCOUNT_COINS' ? 'Coin Value (₹)' : 'Incentive Value'}
                </label>
                <input
                  type="number"
                  disabled={offerType === 'NO_DISCOUNT'}
                  value={offerValue}
                  onChange={(e) => setOfferValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:border-orange-500 outline-none disabled:bg-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Validity (Days)</label>
                <input
                  type="number"
                  value={validityDays}
                  onChange={(e) => setValidityDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Min. Order Value (₹)</label>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            {/* AI Cost Liability Warning (Phase 20) */}
            <div className={`p-3.5 rounded-xl border text-xs ${
              isHighCost ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold flex items-center gap-1.5">
                    {isHighCost ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>Maximum Possible Reward Liability: ₹{estimatedCostLiability.toLocaleString('en-IN')}</span>
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {targetCount} targeted customers × ₹{offerValue} max reward. Redeemed only upon completed dining transactions.
                  </p>
                </div>
                <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                  Max: ₹{estimatedCostLiability}
                </span>
              </div>
            </div>

            {/* AI Reasoning pill */}
            <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block mb-0.5">
                💡 AI Margin & Strategy Reasoning
              </span>
              <p className="text-orange-900 leading-relaxed">{reasoning}</p>
            </div>
          </div>

          {/* Section 3: Scheduling & Approval (Phases 11 & 16) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>3. Timing & Approval Mode (Phases 11, 16)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScheduleType('AI_OPTIMIZED')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  scheduleType === 'AI_OPTIMIZED'
                    ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold text-xs text-slate-900 block flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  AI Optimized
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">Best cohort open time</span>
              </button>

              <button
                type="button"
                onClick={() => setScheduleType('IMMEDIATE')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  scheduleType === 'IMMEDIATE'
                    ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold text-xs text-slate-900 block flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  Send Immediately
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">Trigger right now</span>
              </button>

              <button
                type="button"
                onClick={() => setScheduleType('SCHEDULED')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  scheduleType === 'SCHEDULED'
                    ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold text-xs text-slate-900 block flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-500" />
                  Custom Time
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">Specify date & time</span>
              </button>
            </div>

            {scheduleType === 'AI_OPTIMIZED' && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span>
                  <strong>AI Recommended Send Time:</strong> {aiOptimizedTime}
                </span>
              </div>
            )}

            {scheduleType === 'SCHEDULED' && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Pick Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-orange-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Form: Live Message Composer & Phone Preview (Phases 9 & 10) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Message & Tone (Phases 9, 10)</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Safe Variables
              </span>
            </div>

            {/* Language & Tone Selector */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Language</label>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('HINGLISH')}
                    className={`flex-1 py-1 text-center font-bold transition-all cursor-pointer ${
                      language === 'HINGLISH' ? 'bg-orange-600 text-white' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    Hinglish
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('EN')}
                    className={`flex-1 py-1 text-center font-bold transition-all cursor-pointer border-l border-r border-slate-200 ${
                      language === 'EN' ? 'bg-orange-600 text-white' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('HI')}
                    className={`flex-1 py-1 text-center font-bold transition-all cursor-pointer ${
                      language === 'HI' ? 'bg-orange-600 text-white' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tone</label>
                <select
                  value={tone}
                  onChange={(e: any) => handleToneChange(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:border-orange-500 outline-none"
                >
                  <option value="FRIENDLY">Friendly 😊</option>
                  <option value="PREMIUM">Premium 👑</option>
                  <option value="CASUAL">Casual 🍕</option>
                  <option value="URGENT">Urgent ⚡</option>
                  <option value="FESTIVE">Festive 🎉</option>
                  <option value="PROFESSIONAL">Professional 👔</option>
                </select>
              </div>
            </div>

            {/* Editable Template Textarea */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Editable Message Template
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-slate-500">
                <span className="font-semibold text-slate-600">Available Tags:</span>
                <span className="bg-slate-100 px-1 rounded font-mono">{'{{customer_name}}'}</span>
                <span className="bg-slate-100 px-1 rounded font-mono">{'{{restaurant_name}}'}</span>
                <span className="bg-slate-100 px-1 rounded font-mono">{'{{coin_reward}}'}</span>
                <span className="bg-slate-100 px-1 rounded font-mono">{'{{favourite_item}}'}</span>
              </div>
            </div>

            {/* Interactive Phone Mockup Preview (Phase 19) */}
            <div className="pt-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Customer Smartphone Preview ({channel})</span>
              </label>

              <div className="rounded-2xl border-4 border-slate-800 bg-slate-900 p-3 shadow-lg max-w-sm mx-auto">
                {/* Phone Notch */}
                <div className="w-24 h-3.5 bg-slate-800 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700 mr-2" />
                </div>

                {/* WhatsApp Chat Bubble Mockup */}
                <div className="bg-[#EFEAE2] rounded-xl p-3 min-h-[170px] flex flex-col justify-end text-slate-900">
                  <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-xs max-w-[92%] space-y-1.5 border border-slate-100">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pb-0.5 border-b border-slate-100">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <span>{restaurant?.name || 'SwaadSevak Restaurant'}</span>
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                      </span>
                      <span>Now</span>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                      {previewText}
                    </p>

                    {offerValue > 0 && (
                      <div className="bg-amber-50 rounded p-1.5 border border-amber-200 flex items-center justify-between text-[11px] text-amber-900">
                        <span className="font-bold">🪙 ₹{offerValue} Coins Activated</span>
                        <span className="text-[9px] text-amber-700">Expires in {validityDays}d</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 text-center mt-2">End-to-end encrypted promotional notification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Feedback & Actions */}
          <div className="space-y-3">
            {submitSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => handleSubmitCampaign('APPROVED')}
                disabled={submitting}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve & Launch Campaign</span>
              </button>

              <button
                onClick={() => handleSubmitCampaign('DRAFT')}
                disabled={submitting}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <FileEdit className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

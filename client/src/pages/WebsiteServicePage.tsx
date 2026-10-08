import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SITE_CONTENT } from '../content/site';
import { submitLeadForm } from '../lib/submit';
import { trackEvent } from '../lib/analytics';
import { formatINR } from '../lib/utils';
import { SwaadSevakLogo } from '../components/ui/SwaadSevakLogo';
import {
  Clock,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Check,
  Globe,
  Sparkles,
  TrendingUp,
  Smartphone,
  Coins,
  MapPin,
  Lock,
  Flame,
  UtensilsCrossed,
} from 'lucide-react';

const websiteInquirySchema = z.object({
  restaurantName: z.string().min(2, 'Please enter your restaurant name'),
  ownerName: z.string().min(2, 'Please enter your name'),
  whatsappNumber: z
    .string()
    .min(10, 'Enter a valid 10-digit mobile number')
    .max(10, 'Enter a valid 10-digit mobile number')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9'),
  city: z.string().min(2, 'Please enter your city/town'),
  cuisine: z.string().min(1, 'Please select your cuisine style'),
  notes: z.string().optional(),
  honeypot: z.string().optional(),
});

type WebsiteInquiryData = z.infer<typeof websiteInquirySchema>;

interface WebsiteServicePageProps {
  onBackToLanding: () => void;
  onOpenLogin: () => void;
}

export const WebsiteServicePage: React.FC<WebsiteServicePageProps> = ({
  onBackToLanding,
  onOpenLogin,
}) => {
  const [selectedCuisineId, setSelectedCuisineId] = useState<string>('north-indian');
  const [selectedBrandColor, setSelectedBrandColor] = useState<string>('#F97316');
  const [menuFileName, setMenuFileName] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    status: boolean;
    whatsappUrl?: string;
  } | null>(null);

  const cuisines = SITE_CONTENT.websiteConfigurator.cuisines;
  const selectedCuisine = cuisines.find((c) => c.id === selectedCuisineId) || cuisines[0];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WebsiteInquiryData>({
    resolver: zodResolver(websiteInquirySchema),
    defaultValues: {
      restaurantName: '',
      ownerName: '',
      whatsappNumber: '',
      city: '',
      cuisine: 'north-indian',
      notes: '',
      honeypot: '',
    },
  });

  const handleCuisineSelect = (id: string) => {
    setSelectedCuisineId(id);
    setValue('cuisine', id);
    const match = cuisines.find((c) => c.id === id);
    if (match) setSelectedBrandColor(match.defaultColor);
    trackEvent('website_configurator_interact', { type: 'cuisine', cuisineId: id });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File exceeds 10MB limit. Please upload a smaller PDF or image.');
      return;
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFileError('Invalid file type. Please upload a PDF, PNG, or JPG file.');
      return;
    }

    setMenuFileName(file.name);
  };

  const onSubmit = async (data: WebsiteInquiryData) => {
    setIsSubmitting(true);
    trackEvent('website_form_submit', {
      restaurantName: data.restaurantName,
      cuisine: data.cuisine,
    });

    const result = await submitLeadForm({
      formType: 'website_24h_order',
      restaurantName: data.restaurantName,
      ownerName: data.ownerName,
      whatsappNumber: data.whatsappNumber,
      city: data.city,
      outletTypeOrCuisine: selectedCuisine.name,
      selectedColor: selectedBrandColor,
      interest: data.notes || 'Website Inquiry',
      menuFileName: menuFileName || undefined,
      honeypot: data.honeypot,
    });

    setIsSubmitting(false);
    setSubmissionSuccess({
      status: true,
      whatsappUrl: result.whatsappUrl,
    });
  };

  return (
    <div className="min-h-screen bg-[#1A0F0A] text-white font-sans selection:bg-orange-500 selection:text-stone-950 text-left">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#1A0F0A]/95 backdrop-blur-md border-b border-[#3D2519] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-stone-200 hover:text-white text-xs sm:text-sm font-bold border border-white/[0.1] active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="hidden sm:block h-5 w-[1px] bg-white/[0.1]" />
          <div className="hidden sm:block">
            <SwaadSevakLogo size="sm" lightText />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Guaranteed 24h Proposal</span>
          </span>
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 hover:from-orange-600 hover:to-amber-600 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            Platform Login
          </button>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="relative pt-8 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none -z-0" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs sm:text-sm font-bold shadow-sm">
            <Globe className="w-3.5 h-3.5" />
            <span>Custom Restaurant Website Service • 24h Response</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
            Your Own Branded Ordering Website.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500">
              Zero Commission.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Stop losing 25%–30% of your revenue on Swiggy and Zomato. Get a stunning, high-converting digital ordering website with 1-tap WhatsApp checkout and direct POS sync.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-stone-200">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>0% Commission Direct Orders</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Tap WhatsApp Checkout</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Google Maps Local SEO</span>
            </span>
          </div>
        </div>
      </section>

      {/* 4 Key Strategic Benefits */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Why Top Restaurants Choose a Direct Website
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Everything your food brand needs to dominate local direct orders
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Benefit 1 */}
          <div className="bg-[#2B1A12] border border-[#3D2519] rounded-2xl p-5 space-y-2.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">Keep 100% Profits</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Never pay 30% aggregator cuts on repeat neighbourhood diners. Save thousands every month.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-[#2B1A12] border border-[#3D2519] rounded-2xl p-5 space-y-2.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">1-Tap WhatsApp Flow</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Customers order effortlessly without downloading apps. Order summary goes directly to your WhatsApp.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-[#2B1A12] border border-[#3D2519] rounded-2xl p-5 space-y-2.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">Google Maps SEO</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Show up first on Google when nearby customers search for "restaurants near me" or your signature dishes.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-[#2B1A12] border border-[#3D2519] rounded-2xl p-5 space-y-2.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">Own Customer Data</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Build your own customer phone number list for automated WhatsApp festival broadcasts and loyalty rewards.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Simple Process & SLA */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-[#2B1A12] border border-[#3D2519] rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#3D2519]">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-orange-400 tracking-wider">
                How It Works
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Simple 3-Step Delivery Workflow
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-300 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>24 Hours Response Guarantee</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 bg-[#1A0F0A]/60 p-4 rounded-2xl border border-[#3D2519]">
              <span className="flex items-center justify-center w-7 h-7 rounded-xl font-mono font-black text-xs bg-orange-500 text-stone-950 shrink-0">
                01
              </span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Send Inquiry</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Fill in your restaurant details, preferred cuisine style, and optional menu card below.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#1A0F0A]/60 p-4 rounded-2xl border border-[#3D2519]">
              <span className="flex items-center justify-center w-7 h-7 rounded-xl font-mono font-black text-xs bg-orange-500 text-stone-950 shrink-0">
                02
              </span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Reply in 24 Hours</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  We send a tailored proposal with full scope, exact price quote, and mockup preview directly to your WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#1A0F0A]/60 p-4 rounded-2xl border border-[#3D2519]">
              <span className="flex items-center justify-center w-7 h-7 rounded-xl font-mono font-black text-xs bg-emerald-500 text-stone-950 shrink-0">
                03
              </span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Fast Launch</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Once you review and approve the proposal, our engineers launch your live custom website within days.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-start gap-2 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-mono text-[10.5px]">
              {SITE_CONTENT.websiteConfigurator.honestNote}
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Form & Deliverables Grid */}
      <section id="inquiry-form" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Scope & Deliverables (5 Cols) */}
          <div className="lg:col-span-5 bg-[#2B1A12] border border-[#3D2519] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D2519]">
              <div>
                <span className="text-[10px] uppercase font-mono font-extrabold text-orange-400 block">Starting From</span>
                <span className="text-2xl font-black text-white font-mono">{formatINR(SITE_CONTENT.websiteConfigurator.startingPrice)}</span>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-1 rounded-md bg-[#1A0F0A] border border-[#3D2519] text-stone-300">
                All-Inclusive Setup
              </span>
            </div>

            {/* Deliverables Checklist */}
            <div className="space-y-2">
              <span className="font-bold text-white uppercase text-[10px] font-mono block">What is Included:</span>
              {SITE_CONTENT.websiteConfigurator.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <span className="font-medium text-xs text-stone-200">{item}</span>
                </div>
              ))}
            </div>

            {/* Cuisine Selector */}
            <div className="pt-3 border-t border-[#3D2519]">
              <label className="block text-[10px] font-mono uppercase tracking-wider font-bold mb-2 text-stone-300">
                Select Cuisine Theme Preview
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {cuisines.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCuisineSelect(c.id)}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCuisineId === c.id
                        ? 'border-orange-500 bg-orange-500/20 text-orange-300 shadow-sm'
                        : 'border-[#3D2519] text-stone-300 hover:bg-[#1A0F0A]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#2B1A12] border border-[#3D2519] rounded-3xl p-5 sm:p-7 shadow-xl">
            <div className="mb-4 pb-3 border-b border-[#3D2519]">
              <h3 className="text-lg font-black text-white">
                Request Your Restaurant Website Proposal
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                We will reply on WhatsApp within 24 hours with mockup preview and exact quote.
              </p>
            </div>

            {submissionSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Inquiry Received! We'll reply within 24 hours.
                </h3>
                <p className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed text-stone-300">
                  Our web design team will review your menu and send a custom proposal with scope, mockup preview, and price quote directly to your WhatsApp.
                </p>
                {submissionSuccess.whatsappUrl && (
                  <div className="pt-2">
                    <a
                      href={submissionSuccess.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 hover:from-orange-600 hover:to-amber-600 shadow-lg active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Open Pre-filled WhatsApp Chat Now</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Honeypot anti-spam field */}
                <input
                  type="text"
                  {...register('honeypot')}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-stone-200">
                      Restaurant / Café Name *
                    </label>
                    <input
                      type="text"
                      {...register('restaurantName')}
                      placeholder="e.g. Kaveri Tiffin Room"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#1A0F0A] border border-[#3D2519] text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    {errors.restaurantName && (
                      <span className="text-[11px] text-orange-400 mt-0.5 block font-medium">{errors.restaurantName.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-stone-200">
                      Owner / Manager Name *
                    </label>
                    <input
                      type="text"
                      {...register('ownerName')}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#1A0F0A] border border-[#3D2519] text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    {errors.ownerName && (
                      <span className="text-[11px] text-orange-400 mt-0.5 block font-medium">{errors.ownerName.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-stone-200">
                      WhatsApp Number (+91) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs sm:text-sm font-mono font-bold text-stone-400">+91</span>
                      <input
                        type="tel"
                        {...register('whatsappNumber')}
                        placeholder="9876543210"
                        maxLength={10}
                        className="w-full pl-12 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#1A0F0A] border border-[#3D2519] text-white focus:outline-none focus:border-orange-500 font-mono font-medium transition-colors"
                      />
                    </div>
                    {errors.whatsappNumber && (
                      <span className="text-[11px] text-orange-400 mt-0.5 block font-medium">{errors.whatsappNumber.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-stone-200">
                      City / Area *
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="e.g. Indiranagar, Bengaluru"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#1A0F0A] border border-[#3D2519] text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    {errors.city && (
                      <span className="text-[11px] text-orange-400 mt-0.5 block font-medium">{errors.city.message}</span>
                    )}
                  </div>
                </div>

                {/* Optional Menu Upload */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-stone-200">
                    Upload Menu Card (Optional PDF / Image, max 10MB)
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#5A3A28] bg-[#1A0F0A] hover:bg-[#1A0F0A]/80 transition-colors cursor-pointer text-xs font-medium text-stone-300">
                    <Upload className="w-4 h-4 text-orange-400" />
                    <span className="text-xs truncate">{menuFileName || 'Click to upload menu card (PDF/JPG/PNG)'}</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {fileError && <span className="text-[11px] text-orange-400 mt-0.5 block font-medium">{fileError}</span>}
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-stone-200">
                    Special Requirements or Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    {...register('notes')}
                    placeholder="e.g. We need multi-branch delivery pickup, custom combo packs..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[#1A0F0A] border border-[#3D2519] text-white focus:outline-none focus:border-orange-500 resize-none transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-stone-950 shadow-lg active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Submitting Inquiry...' : 'Send Inquiry for 24h Quote'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center font-medium text-stone-400">
                  We reply via WhatsApp within 24 hours with exact scope and quote. No spam ever.
                </p>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-6 border-t border-[#3D2519] text-center text-xs text-stone-500">
        <p>© {new Date().getFullYear()} {SITE_CONTENT.brand.legalName}. All rights reserved.</p>
      </footer>
    </div>
  );
};

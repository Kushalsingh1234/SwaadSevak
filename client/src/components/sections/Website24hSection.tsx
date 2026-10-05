import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SITE_CONTENT } from '../../content/site';
import { submitLeadForm } from '../../lib/submit';
import { trackEvent } from '../../lib/analytics';
import { formatINR } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { ReceiptCard } from '../ui/ReceiptCard';
import {
  Sparkles,
  Smartphone,
  Monitor,
  Clock,
  CheckCircle2,
  Upload,
  ArrowRight,
  MessageCircle,
  Flame,
  ShieldCheck,
  Check,
} from 'lucide-react';

const websiteFormSchema = z.object({
  restaurantName: z.string().min(2, 'Please enter your restaurant name'),
  ownerName: z.string().min(2, 'Please enter your name'),
  whatsappNumber: z
    .string()
    .min(10, 'Enter a valid 10-digit mobile number')
    .max(10, 'Enter a valid 10-digit mobile number')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9'),
  city: z.string().min(2, 'Please enter your city/town'),
  cuisine: z.string().min(1, 'Please select your cuisine style'),
  honeypot: z.string().optional(),
});

type WebsiteFormData = z.infer<typeof websiteFormSchema>;

export const Website24hSection: React.FC = () => {
  const { t } = useTranslation();

  // Configurator Interactive State
  const [selectedCuisineId, setSelectedCuisineId] = useState<string>('north-indian');
  const [restaurantNameInput, setRestaurantNameInput] = useState<string>('The Royal Spice Cafe');
  const [selectedBrandColor, setSelectedBrandColor] = useState<string>('#E57A1F');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  // Form submission state
  const [menuFileName, setMenuFileName] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    status: boolean;
    whatsappUrl?: string;
  } | null>(null);

  const selectedCuisine =
    SITE_CONTENT.cuisines.find((c) => c.id === selectedCuisineId) || SITE_CONTENT.cuisines[0];

  const brandColors = ['#E57A1F', '#B8500D', '#1E7B4D', '#BC2C4E', '#1B1226', '#4A151B'];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WebsiteFormData>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: {
      restaurantName: 'The Royal Spice Cafe',
      ownerName: '',
      whatsappNumber: '',
      city: '',
      cuisine: 'north-indian',
      honeypot: '',
    },
  });

  const handleCuisineSelect = (id: string) => {
    setSelectedCuisineId(id);
    setValue('cuisine', id);
    trackEvent('website_configurator_interact', { type: 'cuisine', cuisineId: id });
  };

  const handleColorSelect = (color: string) => {
    setSelectedBrandColor(color);
    trackEvent('website_configurator_interact', { type: 'color', color });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File exceeds 10MB limit. Please upload a smaller PDF/Image.');
      return;
    }

    // Check type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFileError('Invalid file type. Please upload a PDF, PNG, or JPG menu file.');
      return;
    }

    setMenuFileName(file.name);
  };

  const onSubmit = async (data: WebsiteFormData) => {
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
    <section id="website-in-24h" className="py-20 sm:py-28 font-sans relative overflow-hidden bg-cream-50 dark:bg-maroon-950/40">
      {/* Decorative Warm Saffron Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-saffron-500/10 to-maroon-500/5 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="saffron" pulseDot className="mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.website24h.badge}</span>
          </Badge>
          <h2 className="h2-fluid font-serif font-bold text-maroon-950 dark:text-cream-50 mb-4">
            {t.website24h.title}
          </h2>
          <p className="text-base sm:text-lg text-maroon-900/80 dark:text-cream-200/80 leading-relaxed">
            {t.website24h.subtitle}
          </p>
        </div>

        {/* 3-Step Timeline with Decorative Countdown */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-paper dark:bg-paper-dark border-2 border-saffron-500/30 shadow-receipt">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-dashed border-receipt-divider dark:border-maroon-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-saffron-500 text-white">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-maroon-950 dark:text-cream-50">
                  Guaranteed 24-Hour Delivery Process
                </h3>
                <span className="text-xs text-maroon-800/70 dark:text-cream-300/70">
                  {SITE_CONTENT.websiteTermsNote}
                </span>
              </div>
            </div>

            {/* Decorative 24:00:00 Countdown Graphic */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-maroon-950 text-cream-50 border border-saffron-500/40 font-mono text-sm shadow-inner">
              <span className="text-[10px] text-saffron-400 font-bold uppercase mr-1">Turnaround:</span>
              <span className="bg-maroon-900 px-2 py-0.5 rounded font-bold text-saffron-400">24</span>
              <span>:</span>
              <span className="bg-maroon-900 px-2 py-0.5 rounded font-bold">00</span>
              <span>:</span>
              <span className="bg-maroon-900 px-2 py-0.5 rounded font-bold">00</span>
              <span className="text-xs text-cream-300/60 ml-1 font-sans">Hrs</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="flex items-start gap-3.5 text-left">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-saffron-100 dark:bg-saffron-950 text-saffron-700 font-bold text-xs shrink-0 mt-0.5">
                01
              </span>
              <div>
                <h4 className="font-bold text-sm text-maroon-950 dark:text-cream-50 mb-1">
                  {t.website24h.timelineStep1}
                </h4>
                <p className="text-xs text-maroon-800/70 dark:text-cream-300/70 leading-relaxed">
                  {t.website24h.timelineStep1Desc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-left">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-saffron-100 dark:bg-saffron-950 text-saffron-700 font-bold text-xs shrink-0 mt-0.5">
                02
              </span>
              <div>
                <h4 className="font-bold text-sm text-maroon-950 dark:text-cream-50 mb-1">
                  {t.website24h.timelineStep2}
                </h4>
                <p className="text-xs text-maroon-800/70 dark:text-cream-300/70 leading-relaxed">
                  {t.website24h.timelineStep2Desc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-left">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-curry-100 dark:bg-curry-950 text-curry-700 font-bold text-xs shrink-0 mt-0.5">
                03
              </span>
              <div>
                <h4 className="font-bold text-sm text-maroon-950 dark:text-cream-50 mb-1">
                  {t.website24h.timelineStep3}
                </h4>
                <p className="text-xs text-maroon-800/70 dark:text-cream-300/70 leading-relaxed">
                  {t.website24h.timelineStep3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Configurator & Live Frame Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Configurator Controls (Left 5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm space-y-6 text-left">
            <h3 className="font-serif font-bold text-xl text-maroon-950 dark:text-cream-50">
              {t.website24h.configuratorHeader}
            </h3>

            {/* 1. Cuisine Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-maroon-800/80 dark:text-cream-300/80 mb-2.5">
                {t.website24h.pickCuisine}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SITE_CONTENT.cuisines.map((cuisine) => (
                  <button
                    key={cuisine.id}
                    type="button"
                    onClick={() => handleCuisineSelect(cuisine.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left transition-all cursor-pointer focus-ring ${
                      selectedCuisineId === cuisine.id
                        ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-950/60 text-saffron-900 dark:text-saffron-200 font-bold shadow-sm'
                        : 'border-receipt-divider dark:border-maroon-800 text-maroon-900/80 dark:text-cream-200/80 hover:bg-cream-100'
                    }`}
                  >
                    {cuisine.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Brand Color Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-maroon-800/80 dark:text-cream-300/80 mb-2.5">
                {t.website24h.pickColor}
              </label>
              <div className="flex items-center gap-3">
                {brandColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    style={{ backgroundColor: color }}
                    aria-label={`Select brand color ${color}`}
                    className={`w-8 h-8 rounded-full transition-transform cursor-pointer focus-ring flex items-center justify-center text-white ${
                      selectedBrandColor === color ? 'scale-125 ring-2 ring-offset-2 ring-saffron-500 shadow-md' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {selectedBrandColor === color && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Restaurant Name Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-maroon-800/80 dark:text-cream-300/80 mb-2">
                {t.website24h.enterName}
              </label>
              <input
                type="text"
                value={restaurantNameInput}
                onChange={(e) => {
                  setRestaurantNameInput(e.target.value);
                  setValue('restaurantName', e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-receipt-divider dark:border-maroon-800 bg-cream-50 dark:bg-maroon-900/40 text-maroon-950 dark:text-cream-50 text-sm font-semibold focus-ring"
                placeholder="e.g. Punjabi Rasoi, Blue Tokai..."
              />
            </div>

            {/* Toggle Phone vs Desktop Preview */}
            <div className="flex items-center justify-between pt-2 border-t border-receipt-divider dark:border-maroon-800">
              <span className="text-xs font-semibold text-maroon-800/70 dark:text-cream-300/70">Preview Device:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-saffron-500 text-white' : 'text-maroon-800 hover:bg-cream-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-saffron-500 text-white' : 'text-maroon-800 hover:bg-cream-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Device Frame Preview (Right 7 Cols) */}
          <div className="lg:col-span-7 flex justify-center">
            {previewDevice === 'mobile' ? (
              /* Mobile Phone Mockup Frame */
              <div className="w-full max-w-[340px] rounded-[36px] p-3.5 bg-maroon-950 shadow-2xl border-4 border-maroon-900 relative">
                {/* Speaker Notch */}
                <div className="w-24 h-4 bg-maroon-900 rounded-full mx-auto mb-2" />
                
                {/* Screen Canvas */}
                <div className="rounded-[24px] overflow-hidden bg-white text-maroon-950 min-h-[460px] flex flex-col font-sans text-xs">
                  {/* Website Header */}
                  <div
                    style={{ backgroundColor: selectedBrandColor }}
                    className="p-4 text-white text-center space-y-1 transition-colors duration-300 shadow-sm"
                  >
                    <span className="text-[10px] uppercase tracking-widest font-mono opacity-80">Online Menu & Orders</span>
                    <h4 className="font-serif font-bold text-lg truncate">
                      {restaurantNameInput || 'Your Restaurant'}
                    </h4>
                    <p className="text-[11px] opacity-90">{selectedCuisine.name} • Indiranagar</p>
                  </div>

                  {/* Menu Category Pills */}
                  <div className="p-2.5 bg-cream-100 flex gap-2 overflow-x-auto text-[11px] font-semibold border-b">
                    <span className="px-2.5 py-1 rounded-full bg-white text-maroon-950 shadow-xs shrink-0">Bestsellers</span>
                    <span className="px-2.5 py-1 rounded-full text-maroon-800 shrink-0">Starters</span>
                    <span className="px-2.5 py-1 rounded-full text-maroon-800 shrink-0">Beverages</span>
                  </div>

                  {/* Sample Dishes */}
                  <div className="p-3 space-y-2.5 flex-1 overflow-y-auto">
                    <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/70 flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-green-600 inline-block" />
                          <span className="font-bold text-xs">{selectedCuisine.previewTag}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 block">Freshly prepared with authentic spices</span>
                        <span className="font-mono font-bold text-xs text-gray-900">₹320</span>
                      </div>
                      <button
                        style={{ borderColor: selectedBrandColor, color: selectedBrandColor }}
                        className="px-3 py-1 rounded-lg border font-bold text-xs uppercase bg-white shadow-xs"
                      >
                        ADD +
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/70 flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-red-600 inline-block" />
                          <span className="font-bold text-xs">Chef Special Feast Platter</span>
                        </div>
                        <span className="text-[10px] text-gray-500 block">Serves 2-3 guests</span>
                        <span className="font-mono font-bold text-xs text-gray-900">₹580</span>
                      </div>
                      <button
                        style={{ borderColor: selectedBrandColor, color: selectedBrandColor }}
                        className="px-3 py-1 rounded-lg border font-bold text-xs uppercase bg-white shadow-xs"
                      >
                        ADD +
                      </button>
                    </div>
                  </div>

                  {/* Sticky WhatsApp Floating Checkout */}
                  <div className="p-3 bg-white border-t space-y-2">
                    <div
                      style={{ backgroundColor: selectedBrandColor }}
                      className="w-full py-2.5 rounded-xl text-white font-bold text-center flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Order on WhatsApp (0% Fee)</span>
                    </div>
                    <span className="block text-center text-[9px] text-gray-400">
                      ⚡ Powered by SwaadSevak 24h Engine
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop Browser Frame */
              <div className="w-full rounded-2xl p-4 bg-maroon-950 shadow-2xl border-4 border-maroon-900 text-maroon-950">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-maroon-800 text-xs text-cream-200">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="font-mono text-[11px] bg-maroon-900 px-4 py-0.5 rounded text-cream-300">
                    https://{restaurantNameInput.toLowerCase().replace(/\s+/g, '') || 'yourrestaurant'}.in
                  </span>
                  <span className="text-[10px] font-bold text-curry-400">SSL SECURE</span>
                </div>

                <div className="bg-white rounded-xl overflow-hidden min-h-[380px] p-6 text-left space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h4 className="font-serif font-bold text-2xl" style={{ color: selectedBrandColor }}>
                        {restaurantNameInput || 'Your Restaurant Name'}
                      </h4>
                      <p className="text-xs text-gray-500">{selectedCuisine.name} • Dine-In & Direct Takeaway</p>
                    </div>
                    <div
                      style={{ backgroundColor: selectedBrandColor }}
                      className="px-4 py-2 rounded-xl text-white font-bold text-xs"
                    >
                      WhatsApp Direct Order
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-1">
                      <span className="font-bold text-sm">{selectedCuisine.previewTag}</span>
                      <p className="text-xs text-gray-500">Prepared fresh daily with traditional recipes.</p>
                      <span className="font-bold text-sm text-gray-900 font-mono block pt-2">₹320</span>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-1">
                      <span className="font-bold text-sm">Chef Signature Feast</span>
                      <p className="text-xs text-gray-500">Includes starter, main dish, breads, and dessert.</p>
                      <span className="font-bold text-sm text-gray-900 font-mono block pt-2">₹580</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Deliverables Checklist & Honest Pricing Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          
          {/* Deliverables Checklist (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm text-left">
            <h3 className="font-serif font-bold text-xl text-maroon-950 dark:text-cream-50 mb-4">
              {t.website24h.includedTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SITE_CONTENT.websiteDeliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-maroon-900/80 dark:text-cream-200/80 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-curry-600 dark:text-curry-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Honest Price Card (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-maroon-950 to-maroon-900 text-cream-50 border border-saffron-500/40 shadow-receipt flex flex-col justify-between text-left">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-saffron-400 block mb-1">
                Transparent 24h Pricing
              </span>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-serif font-bold text-3xl sm:text-4xl text-white">
                  {formatINR(SITE_CONTENT.websitePricing.standalonePrice)}
                </span>
                <span className="text-xs text-cream-300/70 font-sans">one-time launch setup</span>
              </div>
              <div className="p-3 rounded-xl bg-saffron-500/20 border border-saffron-500/40 text-saffron-200 text-xs font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-saffron-400 shrink-0" />
                <span>INCLUDED 100% FREE with SwaadSevak Growth Plan!</span>
              </div>
              <p className="text-xs text-cream-200/80 leading-relaxed">
                No monthly website maintenance lock-in. You own your customer data and WhatsApp order relationships.
              </p>
            </div>

            <div className="pt-6 border-t border-maroon-800/80 mt-6">
              <span className="text-[11px] font-mono text-saffron-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                2 Revisions included within 7 days of delivery
              </span>
            </div>
          </div>

        </div>

        {/* 24-Hour Website Order Form (Zod + React Hook Form + Honeypot) */}
        <div className="max-w-2xl mx-auto">
          <ReceiptCard
            sawtooth="both"
            ticketNumber="ORDER #WEB-24H"
            ticketType="FAST TRACK LAUNCH"
            ticketTime="24h SLA Guarantee"
            className="p-6 sm:p-10 shadow-receipt-lg border-2 border-saffron-500/40"
          >
            {submissionSuccess ? (
              <div className="py-8 text-center space-y-4 animate-ticket-drop">
                <div className="w-14 h-14 rounded-full bg-curry-100 text-curry-600 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-maroon-950 dark:text-cream-50">
                  {t.website24h.successMessage}
                </h3>
                <p className="text-sm text-maroon-900/80 dark:text-cream-200/80 max-w-md mx-auto">
                  Our website team has received your configuration for <strong>{restaurantNameInput}</strong>. We have prepared your fast-track queue.
                </p>

                {submissionSuccess.whatsappUrl && (
                  <div className="pt-4">
                    <a
                      href={submissionSuccess.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button variant="curry" size="lg" icon={<MessageCircle className="w-5 h-5 fill-current" />}>
                        Confirm on WhatsApp Now
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                <div className="text-center mb-6">
                  <h3 className="font-serif font-bold text-2xl text-maroon-950 dark:text-cream-50 mb-1">
                    {t.website24h.formTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-maroon-900/70 dark:text-cream-200/70">
                    {t.website24h.formSubtitle}
                  </p>
                </div>

                {/* Honeypot anti-spam field (hidden) */}
                <input
                  type="text"
                  {...register('honeypot')}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t.website24h.formOwnerLabel}
                    placeholder="e.g. Ramesh Sharma"
                    required
                    {...register('ownerName')}
                    error={errors.ownerName?.message}
                  />

                  <Input
                    label={t.website24h.formRestLabel}
                    placeholder="e.g. The Chai & Chaat Co."
                    required
                    {...register('restaurantName')}
                    error={errors.restaurantName?.message}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t.website24h.formPhoneLabel}
                    placeholder="9876543210"
                    prefixElement="+91"
                    type="tel"
                    required
                    {...register('whatsappNumber')}
                    error={errors.whatsappNumber?.message}
                    helperText="We will send your initial website draft to this WhatsApp number"
                  />

                  <Input
                    label={t.website24h.formCityLabel}
                    placeholder="e.g. Bengaluru, Mumbai, Jaipur"
                    required
                    {...register('city')}
                    error={errors.city?.message}
                  />
                </div>

                {/* Optional Menu File Upload */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-maroon-950 dark:text-cream-100 mb-1.5">
                    {t.website24h.formUploadLabel}
                  </label>
                  <div className="border-2 border-dashed border-receipt-divider dark:border-maroon-800 rounded-2xl p-4 text-center hover:bg-cream-100/50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5 text-xs text-maroon-800 dark:text-cream-200">
                      <Upload className="w-5 h-5 text-saffron-500" />
                      {menuFileName ? (
                        <span className="font-bold text-curry-600 dark:text-curry-400">
                          ✓ File Selected: {menuFileName}
                        </span>
                      ) : (
                        <span>
                          Drag & drop menu PDF / Photo or <span className="text-saffron-600 font-bold underline">Browse File</span>
                        </span>
                      )}
                      <span className="text-[10px] text-receipt-faint">Max 10MB (PDF, PNG, JPG)</span>
                    </div>
                  </div>
                  {fileError && <span className="text-xs text-red-600 block mt-1">{fileError}</span>}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="saffron"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    analyticsEvent="website_form_submit"
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    {isSubmitting ? 'Processing Request...' : t.website24h.formSubmitBtn}
                  </Button>
                </div>
              </form>
            )}
          </ReceiptCard>
        </div>

      </div>
    </section>
  );
};

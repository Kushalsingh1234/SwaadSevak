import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SITE_CONTENT } from '../../content/site';
import { submitLeadForm } from '../../lib/submit';
import { trackEvent } from '../../lib/analytics';
import { formatINR } from '../../lib/utils';
import {
  Clock,
  CheckCircle2,
  Upload,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Check,
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

export const WebsiteInquirySection: React.FC = () => {
  const { t } = useTranslation();

  // Configurator Preview State
  const [selectedCuisineId, setSelectedCuisineId] = useState<string>('north-indian');
  const [selectedBrandColor, setSelectedBrandColor] = useState<string>('#F97316');

  // Form State
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
      restaurantName: 'The Royal Spice Kitchen',
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
    <section id="website-inquiry" className="py-20 sm:py-28 font-sans bg-espresso text-white border-b border-walnut relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-orange-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cocoa border border-walnut text-xs font-bold text-orange-400 mb-4 shadow-soft">
            <Clock className="w-3.5 h-3.5" />
            <span>Guaranteed 24-Hour Inquiry Response</span>
          </div>

          <h2 className="h2-fluid font-extrabold text-white tracking-tight mb-4">
            Need a Website for Your Restaurant? Tell Us, We Reply Within 24 Hours.
          </h2>

          <p className="text-base sm:text-lg text-sand-100 leading-relaxed font-medium">
            Launch your branded online ordering portal with 1-tap WhatsApp checkout and 0% commission on direct neighbourhood orders.
          </p>
        </div>

        {/* 3-Step Process & Explicit 24h Response SLA */}
        <div className="mb-14 p-6 sm:p-8 rounded-card-lg bg-cocoa border border-walnut shadow-elevated">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-walnut text-left">
            <div className="flex items-start gap-3.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500 text-espresso font-mono font-extrabold text-xs shrink-0 mt-0.5">
                01
              </span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Send inquiry</h4>
                <p className="text-xs text-sand-100 leading-relaxed">Share your restaurant name, cuisine style, and optional menu PDF.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500 text-espresso font-mono font-extrabold text-xs shrink-0 mt-0.5">
                02
              </span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">We reply within 24 hours</h4>
                <p className="text-xs text-sand-100 leading-relaxed">We send a tailored proposal with full scope, exact price quote, and delivery timeline directly to your WhatsApp.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-success text-white font-mono font-extrabold text-xs shrink-0 mt-0.5">
                03
              </span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Build starts after you approve</h4>
                <p className="text-xs text-sand-100 leading-relaxed">Once you review and approve the proposal, our design engineers begin development.</p>
              </div>
            </div>
          </div>

          {/* Explicit Visible Fine Print */}
          <div className="pt-4 flex items-start gap-2.5 text-xs text-sand-100 text-left">
            <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-mono text-[11px] text-sand-100">
              {SITE_CONTENT.websiteConfigurator.honestNote}
            </p>
          </div>
        </div>

        {/* 2-Column: Configurator Controls Left, Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Configurator & Deliverables (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-card-lg bg-cocoa border border-walnut text-left space-y-6 shadow-card">
            <div className="flex items-center justify-between border-b border-walnut pb-4">
              <div>
                <span className="text-xs uppercase font-mono font-extrabold text-orange-400 block">Starting From</span>
                <span className="text-3xl font-extrabold text-white font-mono">{formatINR(SITE_CONTENT.websiteConfigurator.startingPrice)}</span>
              </div>
              <span className="text-[10px] font-mono text-sand-100 font-bold uppercase bg-espresso px-2.5 py-1 rounded-lg border border-walnut">
                Scope Advisory
              </span>
            </div>

            {/* Deliverables Checklist */}
            <div className="space-y-2.5 text-xs text-sand-100">
              <span className="font-bold text-white uppercase text-[11px] font-mono block mb-2">What is Included:</span>
              {SITE_CONTENT.websiteConfigurator.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <span className="text-sand-100 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Cuisine Selector for preview */}
            <div className="pt-2 border-t border-walnut">
              <label className="block text-xs font-mono uppercase tracking-wider text-sand-100 font-bold mb-2">
                Select Cuisine Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {cuisines.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCuisineSelect(c.id)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCuisineId === c.id
                        ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                        : 'border-walnut text-sand-100 hover:bg-espresso'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-card-lg bg-cocoa border border-walnut text-left shadow-card">
            {submissionSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/20 border border-success/30 flex items-center justify-center text-success mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Thanks. We'll reply on WhatsApp within 24 hours.
                </h3>
                <p className="text-sm text-sand-100 max-w-md mx-auto leading-relaxed">
                  Our website team will review your details and send you a custom proposal with scope, mockup preview, and price quote.
                </p>
                {submissionSuccess.whatsappUrl && (
                  <div className="pt-4">
                    <a
                      href={submissionSuccess.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-espresso font-extrabold text-sm hover:bg-orange-600 transition-colors shadow-soft"
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
                    <label className="block text-xs font-bold text-sand-50 mb-1">
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      {...register('restaurantName')}
                      placeholder="e.g. Kaveri Tiffin Room"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-espresso border border-walnut text-sm text-white placeholder:text-sand-300 focus:border-orange-500 focus:outline-none"
                    />
                    {errors.restaurantName && (
                      <span className="text-xs text-orange-400 mt-1 block font-medium">{errors.restaurantName.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-sand-50 mb-1">
                      Owner / Manager Name *
                    </label>
                    <input
                      type="text"
                      {...register('ownerName')}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-espresso border border-walnut text-sm text-white placeholder:text-sand-300 focus:border-orange-500 focus:outline-none"
                    />
                    {errors.ownerName && (
                      <span className="text-xs text-orange-400 mt-1 block font-medium">{errors.ownerName.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-sand-50 mb-1">
                      WhatsApp Number (+91 default) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm font-mono text-sand-200 font-bold">+91</span>
                      <input
                        type="tel"
                        {...register('whatsappNumber')}
                        placeholder="9876543210"
                        maxLength={10}
                        className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-espresso border border-walnut text-sm text-white placeholder:text-sand-300 focus:border-orange-500 focus:outline-none font-mono font-medium"
                      />
                    </div>
                    {errors.whatsappNumber && (
                      <span className="text-xs text-orange-400 mt-1 block font-medium">{errors.whatsappNumber.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-sand-50 mb-1">
                      City / Area *
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="e.g. Indiranagar, Bengaluru"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-espresso border border-walnut text-sm text-white placeholder:text-sand-300 focus:border-orange-500 focus:outline-none"
                    />
                    {errors.city && (
                      <span className="text-xs text-orange-400 mt-1 block font-medium">{errors.city.message}</span>
                    )}
                  </div>
                </div>

                {/* Optional Menu Upload */}
                <div>
                  <label className="block text-xs font-bold text-sand-50 mb-1">
                    Upload Menu Card (Optional PDF or Image, max 10MB)
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-walnut bg-espresso hover:border-orange-500 transition-colors cursor-pointer text-xs text-sand-100 font-medium">
                    <Upload className="w-4 h-4 text-orange-400" />
                    <span>{menuFileName || 'Click to upload menu card (PDF/JPG/PNG)'}</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {fileError && <span className="text-xs text-orange-400 mt-1 block font-medium">{fileError}</span>}
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-bold text-sand-50 mb-1">
                    Special Requirements / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    {...register('notes')}
                    placeholder="e.g. We need multi-branch delivery pickup, custom combo packs..."
                    className="w-full px-3.5 py-2 rounded-xl bg-espresso border border-walnut text-sm text-white placeholder:text-sand-300 focus:border-orange-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-shine w-full py-3.5 rounded-xl font-extrabold text-sm bg-orange-500 text-espresso hover:bg-orange-600 transition-all duration-200 shadow-soft cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Send Inquiry for 24h Quote'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-sand-100 text-center font-medium">
                  We reply via WhatsApp within 24 hours with scope and quote. No spam ever.
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

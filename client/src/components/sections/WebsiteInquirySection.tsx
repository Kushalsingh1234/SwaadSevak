import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SITE_CONTENT } from '../../content/site';
import { submitLeadForm } from '../../lib/submit';
import { trackEvent } from '../../lib/analytics';
import { formatINR } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { WebsitePreviewMockup } from '../mockups/WebsitePreviewMockup';
import {
  Clock,
  CheckCircle2,
  Upload,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Check,
  Sparkles,
  Smartphone,
  Monitor,
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
  const [restaurantNameInput, setRestaurantNameInput] = useState<string>('The Royal Spice Kitchen');
  const [selectedBrandColor, setSelectedBrandColor] = useState<string>('#FF7A1A');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

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
  const brandColors = ['#FF7A1A', '#16A34A', '#4F46E5', '#DC2626', '#0B1220', '#F59E0B'];

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
      setFileError('File exceeds 10MB limit. Please upload a smaller PDF/Image.');
      return;
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFileError('Invalid file type. Please upload a PDF, PNG, or JPG menu file.');
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
    <section id="website-inquiry" className="py-20 sm:py-28 font-sans bg-ink-950 text-white relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-ember-500/10 via-indigo-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember-950/80 border border-ember-800/80 text-xs font-semibold text-ember-400 mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>24-Hour Inquiry Response</span>
          </div>

          <h2 className="h2-fluid font-bold text-white mb-4">
            {t.website24h.title}
          </h2>

          <p className="text-base sm:text-lg text-ink-300 leading-relaxed">
            {t.website24h.subtitle}
          </p>
        </div>

        {/* 3-Step Process & Honest Fine Print */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-ink-900/80 border border-ink-800 shadow-elevated">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-ink-800 text-left">
            <div className="flex items-start gap-3.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-ember-500 text-ink-950 font-mono font-bold text-xs shrink-0 mt-0.5">
                01
              </span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">{t.website24h.timelineStep1}</h4>
                <p className="text-xs text-ink-400 leading-relaxed">{t.website24h.timelineStep1Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500 text-white font-mono font-bold text-xs shrink-0 mt-0.5">
                02
              </span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">{t.website24h.timelineStep2}</h4>
                <p className="text-xs text-ink-400 leading-relaxed">{t.website24h.timelineStep2Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-success-500 text-white font-mono font-bold text-xs shrink-0 mt-0.5">
                03
              </span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">{t.website24h.timelineStep3}</h4>
                <p className="text-xs text-ink-400 leading-relaxed">{t.website24h.timelineStep3Desc}</p>
              </div>
            </div>
          </div>

          {/* Explicit Visible Fine Print */}
          <div className="pt-4 flex items-start gap-2.5 text-xs text-ink-400 text-left">
            <ShieldCheck className="w-4 h-4 text-ember-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-mono text-[11px]">
              {SITE_CONTENT.websiteConfigurator.honestNote}
            </p>
          </div>
        </div>

        {/* Interactive Configurator & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Configurator Controls (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-ink-900 border border-ink-800 text-left space-y-6 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">
                {t.website24h.configuratorHeader}
              </h3>
              <span className="text-[10px] font-mono text-ink-400 uppercase bg-ink-950 px-2 py-0.5 rounded">
                Live Renderer
              </span>
            </div>

            {/* 1. Pick Cuisine */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-400 mb-2">
                {t.website24h.pickCuisine}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {cuisines.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCuisineSelect(c.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCuisineId === c.id
                        ? 'border-ember-500 bg-ember-950/60 text-ember-300 font-bold'
                        : 'border-ink-800 text-ink-300 hover:bg-ink-800'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Pick Brand Color */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-400 mb-2">
                {t.website24h.pickColor}
              </label>
              <div className="flex items-center gap-3">
                {brandColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedBrandColor(color)}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center text-white ${
                      selectedBrandColor === color ? 'scale-125 ring-2 ring-offset-2 ring-offset-ink-900 ring-white' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {selectedBrandColor === color && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Restaurant Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-400 mb-2">
                {t.website24h.enterName}
              </label>
              <input
                type="text"
                value={restaurantNameInput}
                onChange={(e) => {
                  setRestaurantNameInput(e.target.value);
                  setValue('restaurantName', e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-ink-800 bg-ink-950 text-white text-xs font-semibold focus-ring"
                placeholder="e.g. Spice Symphony Bistro"
              />
            </div>

            {/* Device Switcher */}
            <div className="flex items-center justify-between pt-2 border-t border-ink-800">
              <span className="text-xs text-ink-400 font-mono">Preview Frame:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-ember-500 text-ink-950 font-bold' : 'text-ink-400 hover:bg-ink-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-ember-500 text-ink-950 font-bold' : 'text-ink-400 hover:bg-ink-800'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Live Device Mockup (7 Cols) */}
          <div className="lg:col-span-7">
            <WebsitePreviewMockup
              restaurantName={restaurantNameInput}
              cuisineName={selectedCuisine.name}
              sampleDish={selectedCuisine.sampleDish}
              samplePrice={selectedCuisine.samplePrice}
              brandColor={selectedBrandColor}
              device={previewDevice}
            />
          </div>

        </div>

        {/* Deliverables Checklist & Honest Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-ink-900 border border-ink-800 text-left">
            <h3 className="font-bold text-lg text-white mb-4">
              {t.website24h.includedTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SITE_CONTENT.websiteConfigurator.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-ink-300">
                  <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-ink-900 border border-ink-800 flex flex-col justify-between text-left">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-ember-400 block mb-1">
                Typical Scope & Cost
              </span>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-mono font-bold text-3xl text-white">
                  {formatINR(SITE_CONTENT.websiteConfigurator.startingPrice)}
                </span>
                <span className="text-xs text-ink-400">starting from, final quote in our reply</span>
              </div>
              <p className="text-xs text-ink-400 leading-relaxed">
                Direct WhatsApp ordering setup with zero aggregator commission fees. You own your domain and customer records.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-ink-800">
              <span className="text-[11px] font-mono text-ink-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-ember-400" />
                <span>Response guarantee: &lt; 24 hours on WhatsApp</span>
              </span>
            </div>
          </div>

        </div>

        {/* Website Inquiry Form (Zod + React Hook Form + Honeypot) */}
        <div className="max-w-2xl mx-auto">
          <div className="p-6 sm:p-10 rounded-3xl bg-ink-900 border border-ink-800 shadow-elevated text-left">
            {submissionSuccess ? (
              <div className="py-8 text-center space-y-4 animate-order-drop">
                <div className="w-14 h-14 rounded-full bg-success-500/20 text-success-400 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="font-bold text-xl text-white">
                  {t.website24h.successMessage}
                </h3>
                <p className="text-xs sm:text-sm text-ink-300 max-w-md mx-auto">
                  Our website team has received your inquiry for <strong>{restaurantNameInput}</strong>. We will share the scope, timeline, and exact quotation on WhatsApp within 24 hours.
                </p>

                {submissionSuccess.whatsappUrl && (
                  <div className="pt-4">
                    <a
                      href={submissionSuccess.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button variant="ember" size="md" icon={<MessageCircle className="w-4 h-4 fill-current" />}>
                        Open WhatsApp Conversation
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="font-bold text-xl text-white mb-1">
                    {t.website24h.formTitle}
                  </h3>
                  <p className="text-xs text-ink-400">
                    {t.website24h.formSubtitle}
                  </p>
                </div>

                {/* Honeypot field */}
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
                    helperText="We send the project scope and quote to this WhatsApp number"
                  />

                  <Input
                    label={t.website24h.formCityLabel}
                    placeholder="e.g. Bengaluru, Mumbai"
                    required
                    {...register('city')}
                    error={errors.city?.message}
                  />
                </div>

                {/* Optional Menu File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-ink-200 mb-1.5">
                    {t.website24h.formUploadLabel}
                  </label>
                  <div className="border border-dashed border-ink-700 rounded-xl p-3.5 text-center hover:bg-ink-800/50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex items-center justify-center gap-2 text-xs text-ink-400">
                      <Upload className="w-4 h-4 text-ember-500" />
                      {menuFileName ? (
                        <span className="font-bold text-success-400">
                          ✓ File: {menuFileName}
                        </span>
                      ) : (
                        <span>
                          Attach menu PDF/Photo or <span className="text-ember-400 font-bold underline">Browse</span> (Max 10MB)
                        </span>
                      )}
                    </div>
                  </div>
                  {fileError && <span className="text-xs text-danger-400 block mt-1">{fileError}</span>}
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    variant="ember"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    analyticsEvent="website_form_submit"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {isSubmitting ? 'Sending Request...' : t.website24h.formSubmitBtn}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

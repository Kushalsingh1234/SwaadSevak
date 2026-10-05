import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SITE_CONTENT } from '../../content/site';
import { submitLeadForm } from '../../lib/submit';
import { trackEvent } from '../../lib/analytics';
import {
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const bookDemoSchema = z.object({
  ownerName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  whatsappNumber: z
    .string()
    .min(10, 'Enter a valid 10-digit mobile number')
    .max(10, 'Enter a valid 10-digit mobile number')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9'),
  city: z.string().min(2, 'Please enter your city/town'),
  businessName: z.string().min(2, 'Please enter your restaurant/business name'),
  interest: z.string().min(1, 'Please select your interest'),
  honeypot: z.string().optional(),
});

type BookDemoFormData = z.infer<typeof bookDemoSchema>;

const INTEREST_OPTIONS = [
  { id: 'pos', label: 'POS & KOT Billing' },
  { id: 'online', label: 'Online Orders Hub' },
  { id: 'inventory', label: 'Inventory & Stock' },
  { id: 'website', label: 'Restaurant Website' },
];

export const BookDemoSection: React.FC = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['pos']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    status: boolean;
    whatsappUrl?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookDemoFormData>({
    resolver: zodResolver(bookDemoSchema),
    defaultValues: {
      ownerName: '',
      email: '',
      whatsappNumber: '',
      city: '',
      businessName: '',
      interest: 'pos',
      honeypot: '',
    },
  });

  const toggleInterest = (id: string) => {
    let next: string[];
    if (selectedInterests.includes(id)) {
      next = selectedInterests.filter((i) => i !== id);
      if (next.length === 0) next = ['pos'];
    } else {
      next = [...selectedInterests, id];
    }
    setSelectedInterests(next);
    setValue('interest', next.join(', '));
  };

  const onSubmit = async (data: BookDemoFormData) => {
    setIsSubmitting(true);
    trackEvent('demo_cta_submit', {
      businessName: data.businessName,
      interest: selectedInterests.join(','),
    });

    const result = await submitLeadForm({
      formType: 'demo_booking',
      restaurantName: data.businessName,
      ownerName: data.ownerName,
      whatsappNumber: data.whatsappNumber,
      city: data.city,
      outletTypeOrCuisine: 'Restaurant/Food Outlet',
      interest: selectedInterests.join(', '),
      honeypot: data.honeypot,
    });

    setIsSubmitting(false);
    setSubmissionSuccess({
      status: true,
      whatsappUrl: result.whatsappUrl,
    });
  };

  return (
    <section id="book-demo" className="py-20 sm:py-28 font-sans bg-white text-espresso border-b border-sand-200">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Large Cream Rounded Panel */}
        <div className="rounded-card-lg bg-cream border border-sand-200 p-8 sm:p-12 lg:p-16 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Title & One Line on Left (5 cols) */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-100 border border-sand-200 text-xs font-semibold text-espresso shadow-soft">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Zero Commitment 1-on-1 Walkthrough</span>
              </div>

              <h2 className="h2-fluid font-extrabold text-espresso tracking-tight">
                Book a Free Interactive Product Demo
              </h2>

              <p className="text-base sm:text-lg text-bodyText leading-relaxed">
                See how SwaadSevak runs on your existing devices with your actual menu and billing format in under 20 minutes.
              </p>

              <div className="pt-4 space-y-3 text-xs font-medium text-bodyText">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>Interactive simulation tailored to your outlet format</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>Complete menu migration assistance included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>No proprietary hardware required</span>
                </div>
              </div>
            </div>

            {/* Form on the Right (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-sand-200 shadow-soft text-left">
              {submissionSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-success/20 border border-success/30 flex items-center justify-center text-success mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-espresso">
                    Demo Request Received!
                  </h3>
                  <p className="text-sm text-bodyText max-w-md mx-auto leading-relaxed">
                    Our onboarding specialist will reach out to schedule a screen share at your preferred time.
                  </p>
                  {submissionSuccess.whatsappUrl && (
                    <div className="pt-4">
                      <a
                        href={submissionSuccess.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-espresso font-bold text-sm hover:bg-orange-600 transition-colors shadow-soft"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Confirm via WhatsApp Now</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Honeypot */}
                  <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-espresso mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register('ownerName')}
                        placeholder="e.g. Vikram Mehta"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-sm text-espresso placeholder:text-sand-300 focus:border-orange-500 focus:outline-none"
                      />
                      {errors.ownerName && (
                        <span className="text-xs text-orange-dark mt-1 block">{errors.ownerName.message}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-espresso mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="vikram@restaurant.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-sm text-espresso placeholder:text-sand-300 focus:border-orange-500 focus:outline-none"
                      />
                      {errors.email && (
                        <span className="text-xs text-orange-dark mt-1 block">{errors.email.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Phone & Business Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-espresso mb-1">
                        WhatsApp Number (+91 default) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-sm font-mono text-bodyText">+91</span>
                        <input
                          type="tel"
                          {...register('whatsappNumber')}
                          placeholder="9876543210"
                          maxLength={10}
                          className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-sm text-espresso placeholder:text-sand-300 focus:border-orange-500 focus:outline-none font-mono"
                        />
                      </div>
                      {errors.whatsappNumber && (
                        <span className="text-xs text-orange-dark mt-1 block">{errors.whatsappNumber.message}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-espresso mb-1">
                        Restaurant / Business Name *
                      </label>
                      <input
                        type="text"
                        {...register('businessName')}
                        placeholder="e.g. The Urban Bistro"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-sm text-espresso placeholder:text-sand-300 focus:border-orange-500 focus:outline-none"
                      />
                      {errors.businessName && (
                        <span className="text-xs text-orange-dark mt-1 block">{errors.businessName.message}</span>
                      )}
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-espresso mb-1">
                      City / Location *
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="e.g. Bengaluru, Karnataka"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-200 text-sm text-espresso placeholder:text-sand-300 focus:border-orange-500 focus:outline-none"
                    />
                    {errors.city && (
                      <span className="text-xs text-orange-dark mt-1 block">{errors.city.message}</span>
                    )}
                  </div>

                  {/* Pill-Style Choice Chips for Interest */}
                  <div>
                    <label className="block text-xs font-bold text-espresso mb-2">
                      I'm interested in: (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INTEREST_OPTIONS.map((opt) => {
                        const isSelected = selectedInterests.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleInterest(opt.id)}
                            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-espresso text-white border-espresso shadow-soft'
                                : 'bg-sand-50 text-bodyText border-sand-200 hover:border-sand-300'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-shine w-full py-3.5 rounded-xl font-bold text-sm bg-orange-500 text-espresso hover:bg-orange-600 transition-all shadow-soft cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{isSubmitting ? 'Scheduling...' : 'Book My Free 20-Minute Demo'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Privacy Line */}
                  <p className="text-[11px] text-bodyText text-center pt-1">
                    We respect your privacy. No spam or aggressive sales calls.
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

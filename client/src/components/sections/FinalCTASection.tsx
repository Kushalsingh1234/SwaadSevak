import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '../../i18n';
import { SITE_CONTENT } from '../../content/site';
import { submitLeadForm } from '../../lib/submit';
import { trackEvent } from '../../lib/analytics';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { ReceiptCard } from '../ui/ReceiptCard';
import {
  CalendarCheck,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

const demoFormSchema = z.object({
  ownerName: z.string().min(2, 'Please enter your full name'),
  restaurantName: z.string().min(2, 'Please enter your restaurant/cafe name'),
  whatsappNumber: z
    .string()
    .min(10, 'Enter a valid 10-digit mobile number')
    .max(10, 'Enter a valid 10-digit mobile number')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9'),
  city: z.string().min(2, 'Please enter your city/town'),
  outletType: z.string().min(1, 'Please select your outlet type'),
  interest: z.string().min(1, 'Please select what you are interested in'),
  honeypot: z.string().optional(),
});

type DemoFormData = z.infer<typeof demoFormSchema>;

export const FinalCTASection: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    status: boolean;
    whatsappUrl?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      ownerName: '',
      restaurantName: '',
      whatsappNumber: '',
      city: '',
      outletType: 'cafe',
      interest: 'both',
      honeypot: '',
    },
  });

  const onSubmit = async (data: DemoFormData) => {
    setIsSubmitting(true);
    trackEvent('demo_cta_click', {
      restaurantName: data.restaurantName,
      outletType: data.outletType,
      interest: data.interest,
    });

    const result = await submitLeadForm({
      formType: 'demo_booking',
      restaurantName: data.restaurantName,
      ownerName: data.ownerName,
      whatsappNumber: data.whatsappNumber,
      city: data.city,
      outletTypeOrCuisine: data.outletType,
      interest: data.interest,
      honeypot: data.honeypot,
    });

    setIsSubmitting(false);
    setSubmissionSuccess({
      status: true,
      whatsappUrl: result.whatsappUrl,
    });
  };

  const outletOptions = [
    { value: 'cafe', label: 'Café & Bistro' },
    { value: 'qsr', label: 'Quick Service Restaurant (QSR)' },
    { value: 'cloud', label: 'Cloud Kitchen (Multi-brand)' },
    { value: 'finedine', label: 'Fine Dine & Restro-Bar' },
    { value: 'bakery', label: 'Bakery & Confectionery' },
    { value: 'foodcourt', label: 'Food Court / Stall' },
    { value: 'chain', label: 'Multi-Outlet Food Chain' },
  ];

  const interestOptions = [
    { value: 'both', label: 'Both: POS System + 24h Website' },
    { value: 'pos', label: 'Only Restaurant POS & KOT Billing' },
    { value: 'website', label: 'Only 24-Hour Custom Website' },
  ];

  return (
    <section id="book-demo" className="py-20 sm:py-28 font-sans relative bg-cream-50 dark:bg-maroon-950">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          
          <ReceiptCard
            sawtooth="both"
            ticketNumber="DEMO #RESERVATION"
            ticketType="PRIORITY INVITATION"
            ticketTime="10-Min Live Walkthrough"
            className="p-6 sm:p-12 border-2 border-saffron-500/40 shadow-receipt-lg"
          >
            {submissionSuccess ? (
              <div className="py-8 text-center space-y-4 animate-ticket-drop font-sans">
                <div className="w-16 h-16 rounded-full bg-curry-100 text-curry-600 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-9 h-9 stroke-[3]" />
                </div>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-maroon-950 dark:text-cream-50">
                  Demo Request Confirmed!
                </h3>
                <p className="text-sm text-maroon-900/80 dark:text-cream-200/80 max-w-md mx-auto leading-relaxed">
                  Namaste! Our restaurant growth specialist will connect with you on WhatsApp within 15 minutes to schedule your live 10-minute POS tour.
                </p>

                {submissionSuccess.whatsappUrl && (
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={submissionSuccess.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button variant="curry" size="lg" fullWidth icon={<MessageCircle className="w-5 h-5 fill-current" />}>
                        {t.finalCta.whatsappDirect}
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                <div className="text-center mb-8">
                  <Badge variant="saffron" className="mb-3">
                    {t.finalCta.badge}
                  </Badge>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-maroon-950 dark:text-cream-50 mb-2">
                    {t.finalCta.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-maroon-900/70 dark:text-cream-200/70 max-w-lg mx-auto">
                    {t.finalCta.subtitle}
                  </p>
                </div>

                {/* Honeypot */}
                <input
                  type="text"
                  {...register('honeypot')}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Full Name"
                    placeholder="e.g. Alok Verma"
                    required
                    {...register('ownerName')}
                    error={errors.ownerName?.message}
                  />

                  <Input
                    label="Restaurant / Brand Name"
                    placeholder="e.g. Spice Route Bistro"
                    required
                    {...register('restaurantName')}
                    error={errors.restaurantName?.message}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="WhatsApp Mobile Number"
                    placeholder="9876543210"
                    prefixElement="+91"
                    type="tel"
                    required
                    {...register('whatsappNumber')}
                    error={errors.whatsappNumber?.message}
                    helperText="We will send your demo link to this WhatsApp number"
                  />

                  <Input
                    label="City / Location"
                    placeholder="e.g. Bengaluru, Hyderabad, Delhi NCR"
                    required
                    {...register('city')}
                    error={errors.city?.message}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Outlet Format"
                    options={outletOptions}
                    required
                    {...register('outletType')}
                    error={errors.outletType?.message}
                  />

                  <Select
                    label="Primary Interest"
                    options={interestOptions}
                    required
                    {...register('interest')}
                    error={errors.interest?.message}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="saffron"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    analyticsEvent="demo_cta_click"
                    eventPayload={{ location: 'final_cta_form' }}
                    icon={<CalendarCheck className="w-5 h-5" />}
                  >
                    {isSubmitting ? 'Reserving Your Demo...' : t.finalCta.submitButton}
                  </Button>
                </div>

                <div className="pt-4 border-t border-dashed border-receipt-divider dark:border-maroon-800 flex flex-wrap items-center justify-between gap-3 text-xs text-maroon-800/70 dark:text-cream-300/70">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-curry-600" />
                    <span>No credit card required. No spam guarantee.</span>
                  </span>
                  <a
                    href={`https://wa.me/${SITE_CONTENT.brand.whatsappNumber}?text=${encodeURIComponent('Namaste SwaadSevak! I want a quick demo.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-saffron-600 dark:text-saffron-400 hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Prefer WhatsApp? Chat now</span>
                  </a>
                </div>
              </form>
            )}
          </ReceiptCard>

        </div>
      </div>
    </section>
  );
};

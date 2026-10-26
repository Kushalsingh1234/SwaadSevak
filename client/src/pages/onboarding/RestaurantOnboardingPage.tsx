import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Utensils,
  MapPin,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Store,
  Phone,
  Mail,
  User,
  FileText,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { RestaurantOnboardingData, RestaurantType } from '../../types/auth';
import { useAuthOnboarding } from '../../context/AuthOnboardingContext';
import { SwaadSevakLogo } from '../../components/ui/SwaadSevakLogo';

interface RestaurantOnboardingPageProps {
  onComplete: (restaurant: any) => void;
  onBackToPlans: () => void;
  onBackToLanding: () => void;
}

export const RestaurantOnboardingPage: React.FC<RestaurantOnboardingPageProps> = ({
  onComplete,
  onBackToPlans,
  onBackToLanding,
}) => {
  const { currentUser, selectedPlan, submitRestaurantOnboarding } = useAuthOnboarding();

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdRestaurant, setCreatedRestaurant] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState<RestaurantOnboardingData>({
    ownerName: currentUser?.displayName || '',
    phone: '',
    email: currentUser?.email || 'owner@restaurant.com',
    altPhone: '',
    restaurantName: '',
    restaurantType: 'Restaurant',
    category: 'Casual Dine-in',
    description: '',
    address: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '',
    landmark: '',
    logoUrl: '',
    coverImageUrl: '',
    gstNumber: '',
    fssaiNumber: '',
    selectedPlanId: selectedPlan?.id || 'plan_6m',
  });

  // Image upload refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const restaurantTypes: RestaurantType[] = [
    'Restaurant',
    'Cafe',
    'Cloud Kitchen',
    'Bakery',
    'Fast Food',
    'Other',
  ];

  const restaurantCategories = [
    'Casual Dine-in',
    'Fine Dining',
    'Quick Service Restaurant (QSR)',
    'Cafe & Bistro',
    'Rooftop Lounge & Bar',
    'Dessert & Bakery',
    'Street Food & Chaat Counter',
    'Dhaba & Regional Specialty',
    'Multi-Cuisine Family Diner',
  ];

  const indianStates = [
    'Delhi',
    'Karnataka',
    'Maharashtra',
    'Tamil Nadu',
    'Telangana',
    'Gujarat',
    'Rajasthan',
    'Uttar Pradesh',
    'West Bengal',
    'Punjab',
    'Haryana',
    'Kerala',
    'Goa',
    'Madhya Pradesh',
    'Other',
  ];

  const updateField = (field: keyof RestaurantOnboardingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  // Image Upload Handlers with FileReader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Logo file size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField('logoUrl', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('Cover image file size must be under 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField('coverImageUrl', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    // Owner validation
    if (!formData.ownerName.trim()) {
      setErrorMsg('Please enter the Owner Full Name.');
      return false;
    }
    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return false;
    }

    // Restaurant validation
    if (!formData.restaurantName.trim()) {
      setErrorMsg('Please enter your Restaurant or Cafe name.');
      return false;
    }
    if (!formData.restaurantType) {
      setErrorMsg('Please select your restaurant type.');
      return false;
    }

    // Location validation
    if (!formData.address.trim()) {
      setErrorMsg('Please enter complete street address.');
      return false;
    }
    if (!formData.city.trim()) {
      setErrorMsg('Please specify the city.');
      return false;
    }
    const cleanPincode = formData.pincode.trim().replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await submitRestaurantOnboarding(formData);
      if (res.success) {
        setCreatedRestaurant(res.restaurant);
        setIsSuccess(true);

        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.55 },
          });
        } catch {}
      } else {
        setErrorMsg(res.message || 'Failed to complete registration.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving restaurant.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#1A0F0A] text-[#FFF7ED] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none -z-0" />

        <div className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 mb-6">
          <SwaadSevakLogo size="md" lightText />
        </div>

        <div className="w-full max-w-2xl mx-auto z-10 my-auto text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Setup Complete
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Your Restaurant Profile Has Been Created!
            </h1>
            <p className="text-sm sm:text-base text-stone-300 max-w-md mx-auto">
              Welcome to the SwaadSevak network! Your digital kitchen POS, QR ordering codes, and live bills are fully configured.
            </p>
          </div>

          {/* Profile Summary Card */}
          <div className="bg-[#251A12] border border-white/[0.12] rounded-3xl p-6 sm:p-8 text-left shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-4 border-b border-white/[0.08] pb-4">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt="Logo"
                  className="w-16 h-16 rounded-2xl object-cover border border-white/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center font-black text-2xl">
                  {formData.restaurantName.charAt(0) || 'R'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-black text-white truncate">{formData.restaurantName}</h3>
                <p className="text-xs text-orange-400 font-semibold">{formData.category} • {formData.restaurantType}</p>
                <p className="text-xs text-stone-400 truncate mt-0.5">{formData.address}, {formData.city}, {formData.state}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#140D08] border border-white/[0.06]">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Owner</span>
                <span className="text-white font-semibold truncate block">{formData.ownerName}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#140D08] border border-white/[0.06]">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Plan</span>
                <span className="text-orange-400 font-bold block">{selectedPlan?.durationLabel || '6 Months'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#140D08] border border-white/[0.06] col-span-2 sm:col-span-1">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Tables Generated</span>
                <span className="text-emerald-400 font-bold block">8 Tables Ready</span>
              </div>
            </div>
          </div>

          {/* Go to Dashboard CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onComplete(createdRestaurant)}
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-stone-950 font-black text-base shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto text-center text-xs text-stone-400 border-t border-white/[0.08] pt-4 z-10">
          Ready to serve customer orders with high-speed POS, live thermal KOT, and automated GST billing.
        </div>
      </div>
    );
  }

  // MAIN ONBOARDING FORM
  return (
    <div className="min-h-screen bg-[#1A0F0A] text-[#FFF7ED] flex flex-col justify-between py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans selection:bg-brand-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Lights */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[600px] h-[450px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* Top Header */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 mb-6 sm:mb-8">
        <a
          href="#landing"
          onClick={(e) => {
            if (onBackToLanding) {
              e.preventDefault();
              onBackToLanding();
            }
          }}
          className="focus-ring rounded-lg shrink-0 flex items-center gap-3"
        >
          <SwaadSevakLogo size="md" lightText />
        </a>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToPlans}
            className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Plan</span>
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-4xl mx-auto z-10 space-y-6">
        {/* Title & Subtitle */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-orange-500/15 border border-orange-500/30 text-orange-400">
            <Sparkles className="w-3 h-3 text-orange-400" />
            Step 3 of 3 • Restaurant Profile
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Let&apos;s Set Up Your Restaurant
          </h1>

          <p className="text-xs sm:text-sm text-stone-300">
            Tell us a little about your restaurant to get started.
          </p>

          {/* Active Plan Pill */}
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#251A12] border border-white/[0.12] text-xs text-stone-300">
              Selected Plan: <strong className="text-orange-400">{selectedPlan?.durationLabel}</strong> (₹{selectedPlan?.price})
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: OWNER INFORMATION */}
          <div className="bg-[#251A12]/90 border border-white/[0.12] rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <div className="border-b border-white/[0.08] pb-3 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">Owner Information</h3>
                <p className="text-[11px] text-stone-400">Primary contact for business verification and billing</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  Owner Full Name <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={formData.ownerName}
                    onChange={(e) => updateField('ownerName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  Mobile Number (WhatsApp) <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={13}
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  Email Address (Pre-filled) <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="owner@restaurant.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  Alternate Mobile Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Backup manager contact"
                    value={formData.altPhone}
                    onChange={(e) => updateField('altPhone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: RESTAURANT INFORMATION */}
          <div className="bg-[#251A12]/90 border border-white/[0.12] rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <div className="border-b border-white/[0.08] pb-3 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">Restaurant Information</h3>
                <p className="text-[11px] text-stone-400">Brand identity displayed to diners and staff</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  Restaurant / Cafe Name <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Store className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Punjab Bistro or Café Nirvana"
                    value={formData.restaurantName}
                    onChange={(e) => updateField('restaurantName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  Restaurant Type <span className="text-orange-400">*</span>
                </label>
                <select
                  value={formData.restaurantType}
                  onChange={(e) => updateField('restaurantType', e.target.value as RestaurantType)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs focus:border-brand-500 outline-none transition-colors"
                >
                  {restaurantTypes.map((t) => (
                    <option key={t} value={t} className="bg-[#140D08] text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  Restaurant Category <span className="text-orange-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs focus:border-brand-500 outline-none transition-colors"
                >
                  {restaurantCategories.map((c) => (
                    <option key={c} value={c} className="bg-[#140D08] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  Restaurant Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short tagline or specialties (e.g. Authentic North Indian curries, artisanal sourdough pizzas, wood-fired delights)"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: LOCATION DETAILS */}
          <div className="bg-[#251A12]/90 border border-white/[0.12] rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <div className="border-b border-white/[0.08] pb-3 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">Location Details</h3>
                <p className="text-[11px] text-stone-400">Appears on guest printed bills and GST invoices</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  Complete Street Address <span className="text-orange-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Shop 14, Ground Floor, Defence Colony Main Market"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                    City <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Delhi"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                    State <span className="text-orange-400">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs focus:border-brand-500 outline-none transition-colors"
                  >
                    {indianStates.map((s) => (
                      <option key={s} value={s} className="bg-[#140D08] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                    Pincode <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 110024"
                    value={formData.pincode}
                    onChange={(e) => updateField('pincode', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Near Metro Gate 2"
                    value={formData.landmark}
                    onChange={(e) => updateField('landmark', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: ADDITIONAL DETAILS & LOGO/COVER UPLOADS */}
          <div className="bg-[#251A12]/90 border border-white/[0.12] rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <div className="border-b border-white/[0.08] pb-3 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">Media &amp; Regulatory Compliance</h3>
                <p className="text-[11px] text-stone-400">Upload your visual assets and optional business registrations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Logo Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  Restaurant Logo
                </label>
                <input
                  type="file"
                  ref={logoInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                {formData.logoUrl ? (
                  <div className="relative p-3 rounded-2xl bg-[#140D08] border border-white/[0.12] flex items-center gap-3">
                    <img
                      src={formData.logoUrl}
                      alt="Logo preview"
                      className="w-14 h-14 rounded-xl object-cover border border-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">Logo Uploaded</p>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="text-[11px] text-orange-400 hover:underline block"
                      >
                        Change Image
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField('logoUrl', '')}
                      className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="p-4 rounded-2xl border-2 border-dashed border-white/[0.15] hover:border-orange-500/50 bg-[#140D08]/50 hover:bg-[#140D08] transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Click to upload Restaurant Logo</p>
                      <p className="text-[10px] text-stone-400">PNG, JPG, SVG up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cover Image Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  Restaurant Cover Image
                </label>
                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />

                {formData.coverImageUrl ? (
                  <div className="relative p-3 rounded-2xl bg-[#140D08] border border-white/[0.12] flex items-center gap-3">
                    <img
                      src={formData.coverImageUrl}
                      alt="Cover preview"
                      className="w-14 h-14 rounded-xl object-cover border border-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">Cover Banner Uploaded</p>
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="text-[11px] text-orange-400 hover:underline block"
                      >
                        Change Image
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField('coverImageUrl', '')}
                      className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="p-4 rounded-2xl border-2 border-dashed border-white/[0.15] hover:border-orange-500/50 bg-[#140D08]/50 hover:bg-[#140D08] transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Upload Hero Cover Banner</p>
                      <p className="text-[10px] text-stone-400">Wide banner for customer QR menu</p>
                    </div>
                  </div>
                )}
              </div>

              {/* GST Number */}
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  GST Number (Optional)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  value={formData.gstNumber}
                  onChange={(e) => updateField('gstNumber', e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none uppercase font-mono tracking-wider transition-colors"
                />
                <p className="mt-1 text-[10px] text-stone-400">15-digit GSTIN for customer tax invoices</p>
              </div>

              {/* FSSAI Number */}
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                  FSSAI License Number (Optional)
                </label>
                <input
                  type="text"
                  maxLength={14}
                  placeholder="e.g. 10019011000123"
                  value={formData.fssaiNumber}
                  onChange={(e) => updateField('fssaiNumber', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none font-mono tracking-wider transition-colors"
                />
                <p className="mt-1 text-[10px] text-stone-400">14-digit food safety registration number</p>
              </div>
            </div>
          </div>

          {/* Submission Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBackToPlans}
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors py-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Plans</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-stone-950 font-black text-sm shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering Restaurant...</span>
              ) : (
                <>
                  <span>Save and Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-4xl mx-auto mt-8 text-center text-xs text-stone-400 border-t border-white/[0.08] pt-4 z-10 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Your data is securely stored and protected according to Indian FSSAI and IT guidelines.</span>
      </div>
    </div>
  );
};

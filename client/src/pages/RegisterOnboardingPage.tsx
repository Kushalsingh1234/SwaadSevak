import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Utensils,
  MapPin,
  Grid,
  Lock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Store,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

interface RegisterOnboardingPageProps {
  onSuccess: (data: { token: string; restaurant: any; manager: any }) => void;
  onBackToLanding: () => void;
  onGoToLogin: () => void;
}

export const RegisterOnboardingPage: React.FC<RegisterOnboardingPageProps> = ({
  onSuccess,
  onBackToLanding,
  onGoToLogin,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Restaurant Info
    restaurantName: '',
    ownerName: '',
    phone: '',
    email: '',
    restaurantType: 'Café & Bistro',

    // Step 2: Location
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',

    // Step 3: Tables
    tableCount: 8,

    // Step 4: Manager Account
    username: '',
    pin: '',
    confirmPin: ''
  });

  const restaurantTypes = [
    'Café & Bistro',
    'Casual Dine-In',
    'Fine Dining',
    'Fast Food & QSR',
    'Bakery & Dessert Parlour',
    'Cloud Kitchen',
    'Bar & Brewery',
    'Food Court Stall'
  ];

  const indianStates = [
    'Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana',
    'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Punjab',
    'Kerala', 'Haryana', 'Madhya Pradesh', 'Goa'
  ];

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const handleNext = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!formData.restaurantName.trim()) {
        setErrorMsg('Please enter your restaurant name.');
        return;
      }
      if (!formData.ownerName.trim()) {
        setErrorMsg('Please enter the owner or manager name.');
        return;
      }
      if (!formData.phone.trim()) {
        setErrorMsg('Please enter your phone number.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.address.trim()) {
        setErrorMsg('Please enter your restaurant address.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (formData.tableCount < 1) {
        setErrorMsg('Please add at least 1 dining table.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    if (!formData.username.trim()) {
      setErrorMsg('Please choose a manager username.');
      return;
    }
    if (!formData.pin || formData.pin.length < 4) {
      setErrorMsg('Manager PIN must be at least 4 digits.');
      return;
    }
    if (formData.pin !== formData.confirmPin) {
      setErrorMsg('PIN and Confirm PIN do not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await api.register({
        restaurantName: formData.restaurantName.trim(),
        ownerName: formData.ownerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        restaurantType: formData.restaurantType,
        address: formData.address.trim(),
        city: formData.city,
        state: formData.state,
        tableCount: formData.tableCount,
        username: formData.username.trim(),
        pin: formData.pin
      });

      if (res.success) {
        localStorage.setItem('swaad_token', res.token);
        // Fire celebration confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}

        setCurrentStep(5);
        // Pass result up
        setTimeout(() => {
          onSuccess({
            token: res.token,
            restaurant: res.restaurant,
            manager: res.manager
          });
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B120C] text-[#FFF7ED] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-brand-500 selection:text-white">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-3xl shadow-glow mx-auto mb-3">
          🍛
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Swaad Sevak
        </h2>
        <p className="text-xs text-[#FF9E58] font-bold uppercase tracking-widest mt-0.5">
          Restaurant Registration & Setup
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-[#251A12] border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Step Progress Indicators */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: 'Restaurant', icon: Utensils },
                { step: 2, label: 'Location', icon: MapPin },
                { step: 3, label: 'Tables', icon: Grid },
                { step: 4, label: 'Account', icon: Lock },
                { step: 5, label: 'Finish', icon: CheckCircle }
              ].map((s) => {
                const isCurrent = currentStep === s.step;
                const isPassed = currentStep > s.step;
                const Icon = s.icon;
                return (
                  <div key={s.step} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-brand-500 text-white shadow-glow scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/[0.06] border border-white/[0.08] text-stone-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] mt-1.5 font-semibold hidden sm:block ${
                      isCurrent ? 'text-[#FF9E58] font-bold' : isPassed ? 'text-emerald-400' : 'text-stone-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Progress bar line */}
            <div className="mt-4 h-1.5 bg-[#140D08] rounded-full overflow-hidden border border-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-amber-500 transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Restaurant Info */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-white/[0.08] pb-3">
                <h3 className="text-lg font-bold text-white">Step 1 — Restaurant Profile</h3>
                <p className="text-xs text-[#D4C3B3]">Tell us basic details about your food establishment.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Punjab Bistro or Café Nirvana"
                  value={formData.restaurantName}
                  onChange={(e) => updateField('restaurantName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">Owner / Manager Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={formData.ownerName}
                    onChange={(e) => updateField('ownerName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="contact@restaurant.in"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">Establishment Type</label>
                  <select
                    value={formData.restaurantType}
                    onChange={(e) => updateField('restaurantType', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs focus:border-brand-500 outline-none"
                  >
                    {restaurantTypes.map((t) => (
                      <option key={t} value={t} className="bg-[#140D08] text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-white/[0.08] pb-3">
                <h3 className="text-lg font-bold text-white">Step 2 — Location & Address</h3>
                <p className="text-xs text-[#D4C3B3]">Where are you located? This will appear on your customer receipts.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Shop / Building / Street Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Shop 12, Ground Floor, 100ft Road, Indiranagar"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs focus:border-brand-500 outline-none"
                  >
                    {indianStates.map((s) => (
                      <option key={s} value={s} className="bg-[#140D08] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Tables */}
          {currentStep === 3 && (
            <div className="space-y-6 text-center animate-in fade-in duration-200">
              <div className="border-b border-white/[0.08] pb-3 text-left">
                <h3 className="text-lg font-bold text-white">Step 3 — Dining Tables</h3>
                <p className="text-xs text-[#D4C3B3]">How many dine-in tables does your restaurant have?</p>
              </div>

              <div className="py-4">
                <p className="text-xs text-stone-300 mb-4 font-semibold uppercase tracking-wider">
                  Initial Dining Tables To Generate
                </p>

                {/* [-] Count [+] selector */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={() => updateField('tableCount', Math.max(1, formData.tableCount - 1))}
                    className="w-14 h-14 rounded-2xl bg-[#140D08] hover:bg-[#1a110a] text-white text-2xl font-bold border border-white/[0.12] transition-all flex items-center justify-center active:scale-95"
                  >
                    -
                  </button>

                  <div className="w-28 text-center">
                    <span className="text-5xl font-black text-white tracking-tight">
                      {formData.tableCount}
                    </span>
                    <span className="block text-[11px] text-[#FF9E58] font-bold uppercase mt-1">
                      Tables
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => updateField('tableCount', Math.min(50, formData.tableCount + 1))}
                    className="w-14 h-14 rounded-2xl bg-[#140D08] hover:bg-[#1a110a] text-white text-2xl font-bold border border-white/[0.12] transition-all flex items-center justify-center active:scale-95"
                  >
                    +
                  </button>
                </div>

                <p className="text-xs text-[#D4C3B3] mt-6 max-w-sm mx-auto">
                  Swaad Sevak will instantly generate unique, high-resolution QR codes for Table 01 through Table {formData.tableCount < 10 ? `0${formData.tableCount}` : formData.tableCount}. You can always add or rename tables later.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Manager Account */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-white/[0.08] pb-3">
                <h3 className="text-lg font-bold text-white">Step 4 — Manager Account</h3>
                <p className="text-xs text-[#D4C3B3]">
                  Create your manager username and secure 4-digit PIN for daily restaurant login.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. vikram_owner"
                  value={formData.username}
                  onChange={(e) => updateField('username', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs placeholder:text-stone-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">4-Digit Login PIN *</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••"
                    value={formData.pin}
                    onChange={(e) => updateField('pin', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs tracking-widest placeholder:text-stone-500 focus:border-brand-500 outline-none text-center font-bold text-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">Confirm PIN *</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••"
                    value={formData.confirmPin}
                    onChange={(e) => updateField('confirmPin', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-white/[0.12] text-white text-xs tracking-widest placeholder:text-stone-500 focus:border-brand-500 outline-none text-center font-bold text-lg"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#140D08] border border-white/[0.08] text-[11px] text-[#D4C3B3]">
                🔒 Your PIN is securely hashed and protected. You will use this Username and PIN whenever signing into the manager dashboard or tablet POS.
              </div>
            </div>
          )}

          {/* STEP 5: Finish */}
          {currentStep === 5 && (
            <div className="py-8 text-center space-y-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white">
                Your restaurant is ready for Swaad Sevak!
              </h3>
              <p className="text-xs text-stone-300 max-w-sm mx-auto">
                <strong className="text-[#FF9E58]">{formData.restaurantName}</strong> has been registered with {formData.tableCount} tables and manager account <strong className="text-white">@{formData.username}</strong>.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => onSuccess({ token: localStorage.getItem('swaad_token') || '', restaurant: null, manager: null })}
                  className="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-glow transition-all"
                >
                  Go to Dashboard Setup →
                </button>
              </div>
            </div>
          )}

          {/* Nav Buttons (Steps 1 to 4) */}
          {currentStep < 5 && (
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onBackToLanding}
                  className="text-xs text-stone-400 hover:text-white font-semibold"
                >
                  ← Back to Home
                </button>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Creating Account...</span>
                ) : currentStep === 4 ? (
                  <>
                    <span>Finish Setup</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Existing account prompt */}
        <p className="mt-6 text-center text-xs text-stone-400">
          Already registered your restaurant?{' '}
          <button
            onClick={onGoToLogin}
            className="text-[#FF9E58] font-bold hover:underline"
          >
            Sign in with Username & PIN
          </button>
        </p>
      </div>
    </div>
  );
};

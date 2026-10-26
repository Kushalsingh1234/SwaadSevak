import React from 'react';
import { SwaadSevakLogo } from '../ui/SwaadSevakLogo';
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  onBackToLanding?: () => void;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
  showStepIndicator?: boolean;
  currentStep?: number;
  totalSteps?: number;
  steps?: { label: string; icon?: React.ElementType }[];
  withHeroImage?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  badge,
  onBackToLanding,
  children,
  maxWidth = 'md',
  showStepIndicator = false,
  currentStep = 1,
  totalSteps = 4,
  steps = [],
  withHeroImage = true,
}) => {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
  }[maxWidth];

  return (
    <div className="min-h-[100dvh] bg-[#1A0F0A] text-[#FFF7ED] flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6 lg:px-12 font-sans selection:bg-brand-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Lighting & Luxury Glows */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[550px] h-[450px] bg-orange-500/15 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[450px] bg-amber-500/12 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* Subtle Warm Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header / Nav */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 mb-4 sm:mb-6">
        <a
          href="#landing"
          onClick={(e) => {
            if (onBackToLanding) {
              e.preventDefault();
              onBackToLanding();
            }
          }}
          className="focus-ring rounded-lg shrink-0 flex items-center gap-3 group"
        >
          <SwaadSevakLogo size="md" lightText />
        </a>

        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF9E58]" />
            <span>Back to Home</span>
          </button>
        )}
      </div>

      {withHeroImage ? (
        /* 2-Column Main Layout: Card on Left, Brand Illustration on Right */
        <div className="w-full max-w-7xl mx-auto z-10 my-auto py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
            
            {/* LEFT COLUMN: Clean, Focused Auth Card */}
            <div className="lg:col-span-5 xl:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
              {/* Header info */}
              {(title || subtitle) && (
                <div className="text-left mb-6">
                  {title && (
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="mt-2 text-sm text-stone-400 leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Step Progress Indicator (if applicable) */}
              {showStepIndicator && steps.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    {steps.map((s, idx) => {
                      const stepNum = idx + 1;
                      const isCurrent = currentStep === stepNum;
                      const isPassed = currentStep > stepNum;
                      const Icon = s.icon;
                      return (
                        <div key={idx} className="flex flex-col items-center flex-1">
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-glow-orange scale-105'
                                : isPassed
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white/[0.06] border border-white/[0.1] text-stone-400'
                            }`}
                          >
                            {Icon ? <Icon className="w-3.5 h-3.5" /> : stepNum}
                          </div>
                          <span
                            className={`text-[10px] mt-1 font-semibold text-center hidden sm:block ${
                              isCurrent
                                ? 'text-orange-400 font-bold'
                                : isPassed
                                ? 'text-emerald-400'
                                : 'text-stone-400'
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Progress line */}
                  <div className="mt-2.5 h-1.5 bg-[#140D08] rounded-full overflow-hidden border border-white/[0.08]">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${Math.min(100, (currentStep / totalSteps) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* The Main Card Container */}
              <div className="bg-[#1C120C]/90 border border-white/[0.1] rounded-3xl p-7 sm:p-9 shadow-[0_24px_50px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-2xl relative overflow-hidden">
                {/* Subtle top edge glow highlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent pointer-events-none" />
                {children}
              </div>
            </div>

            {/* RIGHT COLUMN: Brand Illustration (Seamless without box / border, exact same as Landing Page) */}
            <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 flex-col justify-center items-center relative pl-4">
              {/* Ambient warm luxury glow behind characters */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/25 via-amber-500/15 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

              {/* Transparent Character Illustration */}
              <div className="relative w-full flex items-center justify-center transition-transform hover:scale-[1.02] duration-500">
                <img
                  src="/brand/hero-characters-transparent.png"
                  alt="SwaadSevak Restaurant Team & Characters"
                  className="w-full max-h-[380px] xl:max-h-[460px] 2xl:max-h-[500px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                />
              </div>

              {/* Under-Image Trust Points */}
              <div className="mt-5 w-full flex items-center justify-center gap-3 text-xs font-semibold px-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md text-stone-200 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Live Kitchen KOT</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md text-stone-200 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Zero Commission Direct</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md text-stone-200 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>5-Minute Setup</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Single Column Centered Layout fallback */
        <div className={`w-full mx-auto ${maxWidthClass} z-10 my-auto`}>
          {showStepIndicator && steps.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between">
                {steps.map((s, idx) => {
                  const stepNum = idx + 1;
                  const isCurrent = currentStep === stepNum;
                  const isPassed = currentStep > stepNum;
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-glow-orange scale-105'
                            : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/[0.06] border border-white/[0.1] text-stone-400'
                        }`}
                      >
                        {Icon ? <Icon className="w-4 h-4" /> : stepNum}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs mt-1.5 font-semibold text-center hidden sm:block ${
                          isCurrent
                            ? 'text-orange-400 font-bold'
                            : isPassed
                            ? 'text-emerald-400'
                            : 'text-stone-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 h-1.5 bg-[#140D08] rounded-full overflow-hidden border border-white/[0.08]">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (currentStep / totalSteps) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {(title || subtitle || badge) && (
            <div className="text-center mb-6 sm:mb-8">
              {badge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-orange-500/15 border border-orange-500/30 text-orange-400 mb-3 shadow-inner">
                  <Sparkles className="w-3 h-3 text-orange-400" />
                  {badge}
                </span>
              )}
              {title && (
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="bg-[#251A12]/90 border border-white/[0.12] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl relative">
            {children}
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <div className="w-full max-w-7xl mx-auto mt-6 text-center text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.08] pt-4 z-10">
        <div className="flex items-center gap-2 text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-bit Bank Grade Encrypted • Built for Indian Hospitality</span>
        </div>
        <p className="text-stone-400">
          © {new Date().getFullYear()} SwaadSevak Technologies. All rights reserved.
        </p>
      </div>
    </div>
  );
};


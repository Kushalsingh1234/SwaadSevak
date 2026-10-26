import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuthOnboarding } from '../../context/AuthOnboardingContext';
import { SwaadSevakLogo } from '../../components/ui/SwaadSevakLogo';

interface LoginPageProps {
  onLoginSuccess: (data: { token: string; restaurant: any; manager: any }) => void;
  onGoToSignup: () => void;
  onGoToForgotPassword: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoToSignup,
  onGoToForgotPassword,
  onBackToLanding,
}) => {
  const { loginWithCredentials } = useAuthOnboarding();

  const [identifier, setIdentifier] = useState('demo_manager');
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter both username/email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await loginWithCredentials(identifier, password, rememberMe);
      if (res.success) {
        const savedToken = localStorage.getItem('swaad_token') || 'token_demo';
        const savedRest = JSON.parse(localStorage.getItem('swaad_restaurant') || '{}');
        const savedMgr = JSON.parse(localStorage.getItem('swaad_manager') || '{}');
        onLoginSuccess({
          token: savedToken,
          restaurant: savedRest,
          manager: savedMgr,
        });
      } else {
        setErrorMsg(res.message || 'Invalid credentials. Please verify and try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Top Header */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 mb-4 sm:mb-6">
        <a
          href="#landing"
          onClick={(e) => {
            e.preventDefault();
            onBackToLanding();
          }}
          className="focus-ring rounded-lg shrink-0 flex items-center gap-3 group"
        >
          <SwaadSevakLogo size="md" lightText />
        </a>

        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF9E58]" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* 2-Column Main Layout: Card on Left, Brand Illustration on Right */}
      <div className="w-full max-w-7xl mx-auto z-10 my-auto py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* LEFT COLUMN: Clean, Focused Sign-In Card */}
          <div className="lg:col-span-5 xl:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            {/* Header info */}
            <div className="text-left mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-stone-400 leading-relaxed">
                Sign in to your restaurant dashboard to manage orders, live bills, and growth.
              </p>
            </div>

            {/* The Main Card Container */}
            <div className="bg-[#1C120C]/90 border border-white/[0.1] rounded-3xl p-7 sm:p-9 shadow-[0_24px_50px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-2xl relative overflow-hidden">
              {/* Subtle top edge glow highlight */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent pointer-events-none" />

              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email or Username Input */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">
                    Email or Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder="e.g. demo_manager"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm placeholder:text-stone-600 focus:border-brand-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Input with Visibility Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-stone-300 tracking-wide">Password</label>
                    <button
                      type="button"
                      onClick={onGoToForgotPassword}
                      className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm placeholder:text-stone-600 focus:border-brand-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-brand-500/20 outline-none transition-all font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-300 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-white/[0.05] border border-white/[0.2] accent-brand-500 text-brand-500 cursor-pointer"
                    />
                    <span>Remember me for 30 days</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-sm shadow-[0_4px_24px_rgba(242,92,5,0.35)] hover:shadow-[0_6px_32px_rgba(242,92,5,0.5)] transition-all disabled:opacity-50 active:scale-[0.99] cursor-pointer"
                  >
                    {isLoading ? (
                      <span>Signing In...</span>
                    ) : (
                      <>
                        <span>Sign In to Restaurant</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Demo quick-access helper */}
              <div className="mt-6 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div>
                    <p className="text-[11px] text-stone-400">Demo Quick Access:</p>
                    <p className="text-xs font-mono font-bold text-orange-400">demo_manager / 1234</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('demo_manager');
                    setPassword('1234');
                  }}
                  className="text-[11px] font-bold text-stone-200 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] transition-all cursor-pointer"
                >
                  Auto Fill
                </button>
              </div>

              {/* Link to Create Account */}
              <div className="mt-6 pt-5 border-t border-white/[0.08] text-center text-xs text-stone-400">
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={onGoToSignup}
                  className="text-orange-400 font-extrabold hover:underline transition-colors ml-1 cursor-pointer"
                >
                  Create New Account
                </button>
              </div>
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

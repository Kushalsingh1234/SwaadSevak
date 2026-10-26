import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuthOnboarding } from '../../context/AuthOnboardingContext';

interface SignupPageProps {
  onGoogleSuccess: () => void;
  onGoToLogin: () => void;
  onBackToLanding: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onGoogleSuccess,
  onGoToLogin,
  onBackToLanding,
}) => {
  const { loginWithGoogleMock } = useAuthOnboarding();
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated Google accounts for mock picker
  const mockGoogleAccounts = [
    {
      name: 'Vikram Sharma',
      email: 'vikram.sharma.restaurant@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Priya Patel',
      email: 'priya.bistro@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Custom Google Account',
      email: 'owner@gmail.com',
      avatar: '',
    },
  ];

  const handleSelectGoogleAccount = async (account: { name: string; email: string }) => {
    setIsLoading(true);
    try {
      await loginWithGoogleMock(account);
      setIsGoogleModalOpen(false);
      onGoogleSuccess();
    } catch (e) {
      console.error('Google registration error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Register with your verified Google account to unlock live KOT, smart POS, and automated billing."
      onBackToLanding={onBackToLanding}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Sleek Value Highlights */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 text-sm">
              ⚡
            </div>
            <div>
              <p className="text-xs font-bold text-white">5-Minute Live Setup</p>
              <p className="text-[11px] text-stone-400">Zero hardware lock-in. Works on any tablet, iPad, or phone.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-sm">
              🛡️
            </div>
            <div>
              <p className="text-xs font-bold text-white">Verified Restaurant Ownership</p>
              <p className="text-[11px] text-stone-400">1-click Google authorization &amp; instant recovery.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-sm">
              🍽️
            </div>
            <div>
              <p className="text-xs font-bold text-white">Zero Commission Operations</p>
              <p className="text-[11px] text-stone-400">Direct QR orders, kitchen display, and automated GST bills.</p>
            </div>
          </div>
        </div>

        {/* Primary CTA: Continue with Google */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-sm shadow-[0_4px_24px_rgba(255,255,255,0.12)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.22)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer group"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="tracking-wide">Continue with Google</span>
            <ArrowRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Subtle Security Footnote */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Google Identity verified • No credit card required</span>
        </div>

        {/* Existing account prompt */}
        <div className="pt-4 border-t border-white/[0.08] text-center text-xs text-stone-400">
          Already have a restaurant account?{' '}
          <button
            type="button"
            onClick={onGoToLogin}
            className="text-orange-400 font-extrabold hover:underline transition-colors ml-1 cursor-pointer"
          >
            Sign In with Username &amp; Password
          </button>
        </div>
      </div>

      {/* Simulated Google Account Picker Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white text-stone-900 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="font-bold text-sm text-stone-900">Sign in with Google</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Choose a Google account to continue to <strong>SwaadSevak</strong>:
            </p>

            <div className="space-y-2">
              {mockGoogleAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectGoogleAccount(acc)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-100 transition-colors text-left border border-stone-200 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0">
                    {acc.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-stone-900 truncate">{acc.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{acc.email}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-stone-500 flex items-center justify-center gap-1.5 border-t border-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulated Google Identity Services</span>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

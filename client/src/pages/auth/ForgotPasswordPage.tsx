import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuthOnboarding } from '../../context/AuthOnboardingContext';

interface ForgotPasswordPageProps {
  onGoToLogin: () => void;
  onBackToLanding: () => void;
}

type ForgotStep = 'enter_email' | 'verifying' | 'verified_success' | 'new_password' | 'success';

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onGoToLogin,
  onBackToLanding,
}) => {
  const { sendForgotPasswordVerification, resetPassword } = useAuthOnboarding();

  const [step, setStep] = useState<ForgotStep>('enter_email');
  const [googleEmail, setGoogleEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password checklist
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasNumber && hasUppercase && hasSpecialChar;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmNewPassword;

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const mockGoogleAccounts = [
    {
      name: 'Vikram Sharma',
      email: 'vikram.sharma.restaurant@gmail.com',
    },
    {
      name: 'Priya Patel',
      email: 'priya.bistro@gmail.com',
    },
    {
      name: 'Restaurant Owner',
      email: 'owner@gmail.com',
    },
  ];

  const handleSelectGoogleAccount = (acc: { name: string; email: string }) => {
    setGoogleEmail(acc.email);
    setIsGoogleModalOpen(false);
    setStep('verifying');
    setTimeout(() => {
      setStep('verified_success');
    }, 800);
  };

  // Step 1 -> 2 -> 3: Send verification
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid registered Google email address.');
      return;
    }

    setErrorMsg('');
    setStep('verifying');

    try {
      await sendForgotPasswordVerification(cleanEmail);
      setTimeout(() => {
        setStep('verified_success');
      }, 1000);
    } catch (err: any) {
      setStep('enter_email');
      setErrorMsg(err.message || 'Failed to verify account.');
    }
  };

  // Step 4 & 5 -> 6: Set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setErrorMsg('Please ensure all password security criteria are met.');
      return;
    }
    if (!passwordsMatch) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await resetPassword(newPassword);
      if (res.success) {
        setStep('success');
      } else {
        setErrorMsg(res.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={
        step === 'success'
          ? 'Password Reset Complete'
          : step === 'new_password'
          ? 'Set New Password'
          : 'Reset Your Password'
      }
      subtitle={
        step === 'success'
          ? 'Your manager password has been securely updated. You can now log into your restaurant.'
          : step === 'new_password'
          ? 'Create a secure new password for your restaurant manager account.'
          : 'Verify your registered Google account to recover your login access.'
      }
      onBackToLanding={onBackToLanding}
      maxWidth="md"
    >
      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Google Verification or Email Input */}
      {step === 'enter_email' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Continue with Google for Password Reset */}
          <div>
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
              <span>Continue with Google to Verify</span>
            </button>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-white/[0.08] w-full" />
            <span className="bg-[#1C120C] px-3 text-[11px] font-semibold text-stone-500 uppercase tracking-widest absolute">
              Or Enter Registered Google Email
            </span>
          </div>

          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">
                Registered Google Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="e.g. owner@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm placeholder:text-stone-600 focus:border-brand-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-sm shadow-[0_4px_24px_rgba(242,92,5,0.35)] hover:shadow-[0_6px_32px_rgba(242,92,5,0.5)] transition-all cursor-pointer active:scale-[0.99]"
            >
              <span>Verify Registered Email</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-white/[0.08] text-center">
            <button
              type="button"
              onClick={onGoToLogin}
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </div>
      )}

      {/* Google Modal Picker for Forgot Password */}
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
                <h3 className="font-bold text-sm text-stone-900">Verify Registered Google ID</h3>
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
              Select your registered Google account to confirm identity:
            </p>

            <div className="space-y-2">
              {mockGoogleAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectGoogleAccount(acc)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-100 transition-colors text-left border border-stone-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0 text-xs">
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
              <span>Simulated Google Account Identity Verification</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Verifying Google Account Loader */}
      {step === 'verifying' && (
        <div className="py-8 text-center space-y-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400 shadow-inner">
            <RefreshCw className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Verifying Account Identity</h3>
            <p className="text-xs text-stone-400 mt-1">
              Checking registered Google OAuth records for <strong className="text-orange-300">{googleEmail}</strong>...
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: Verification Success UI State */}
      {step === 'verified_success' && (
        <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-glow">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Identity Confirmed
            </span>
            <h3 className="text-lg font-black text-white mt-2">
              Google Account Verified!
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
              Your registered email <strong className="text-white">{googleEmail}</strong> has been successfully authorized for password reset.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStep('new_password')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer active:scale-98"
            >
              <span>Enter New Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 & 5: Enter & Confirm New Password */}
      {step === 'new_password' && (
        <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">
              New Password <span className="text-orange-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm placeholder:text-stone-600 focus:border-brand-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-brand-500/20 outline-none transition-all font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Checklist */}
            <div className="mt-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] grid grid-cols-2 gap-2 text-[11px]">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-stone-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Min. 8 characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-stone-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>At least 1 number</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-400' : 'text-stone-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>1 uppercase letter</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasSpecialChar ? 'text-emerald-400' : 'text-stone-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>1 special symbol</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-300 tracking-wide">
                Confirm New Password <span className="text-orange-400">*</span>
              </label>
              {confirmNewPassword && (
                <span className={`text-[11px] font-bold ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✗ Do not match'}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border text-white text-sm placeholder:text-stone-600 outline-none transition-all font-mono tracking-wider ${
                  confirmNewPassword && !passwordsMatch
                    ? 'border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-white/[0.1] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-sm shadow-[0_4px_24px_rgba(242,92,5,0.35)] hover:shadow-[0_6px_32px_rgba(242,92,5,0.5)] transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 6 & 7: Password Reset Successful Screen & Return to Login */}
      {step === 'success' && (
        <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-glow">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-black text-white">
              Password Reset Complete!
            </h3>
            <p className="text-xs text-stone-300 mt-2 max-w-sm mx-auto">
              Your new password is now active. You can immediately log into the SwaadSevak platform.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onGoToLogin}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-sm shadow-[0_4px_24px_rgba(242,92,5,0.35)] hover:shadow-[0_6px_32px_rgba(242,92,5,0.5)] transition-all cursor-pointer active:scale-[0.99]"
            >
              <span>Return to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

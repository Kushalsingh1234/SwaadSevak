import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, Check, X, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuthOnboarding } from '../../context/AuthOnboardingContext';

interface CreateAccountPageProps {
  onAccountCreated: () => void;
  onBackToSignup: () => void;
  onBackToLanding: () => void;
}

export const CreateAccountPage: React.FC<CreateAccountPageProps> = ({
  onAccountCreated,
  onBackToSignup,
  onBackToLanding,
}) => {
  const { currentUser, checkUsernameAvailability, createAccountWithUsernameAndPassword } = useAuthOnboarding();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [usernameMessage, setUsernameMessage] = useState('');

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password requirements real-time checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasNumber && hasUppercase && hasSpecialChar;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // Debounced username check
  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus('idle');
      setUsernameMessage('');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const res = await checkUsernameAvailability(username);
      if (res.available) {
        setUsernameStatus('available');
        setUsernameMessage(res.message);
      } else {
        setUsernameStatus('unavailable');
        setUsernameMessage(res.message);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (usernameStatus !== 'available') {
      setErrorMsg('Please choose an available username.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg('Please satisfy all password security requirements.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createAccountWithUsernameAndPassword(username, password);
      if (res.success) {
        onAccountCreated();
      } else {
        setErrorMsg(res.message || 'Failed to create account.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Choose your unique manager handle and a secure password for daily restaurant access."
      onBackToLanding={onBackToLanding}
      maxWidth="md"
    >
      {/* Google User Verification Banner */}
      <div className="mb-6 p-3.5 rounded-2xl bg-white/[0.03] border border-emerald-500/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Google Verified Account
            </span>
            <p className="text-xs font-semibold text-white truncate">
              {currentUser?.email || 'vikram.sharma.restaurant@gmail.com'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBackToSignup}
          className="text-[11px] text-stone-400 hover:text-stone-200 underline shrink-0 cursor-pointer"
        >
          Change
        </button>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Unique Username Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-stone-300 tracking-wide">
              Manager Username <span className="text-orange-400">*</span>
            </label>
            {usernameStatus === 'checking' && (
              <span className="text-[11px] text-stone-400 animate-pulse">Checking availability...</span>
            )}
            {usernameStatus === 'available' && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {usernameMessage}
              </span>
            )}
            {usernameStatus === 'unavailable' && (
              <span className="text-[11px] font-bold text-red-400 flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> {usernameMessage}
              </span>
            )}
          </div>
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
              placeholder="e.g. vikram_bistro or royal_punjab"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border text-white text-sm placeholder:text-stone-600 outline-none transition-all ${
                usernameStatus === 'available'
                  ? 'border-emerald-500/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                  : usernameStatus === 'unavailable'
                  ? 'border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                  : 'border-white/[0.1] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              }`}
            />
          </div>
          <p className="mt-1 text-[11px] text-stone-400">
            Lowercase letters, numbers, and underscores only.
          </p>
        </div>

        {/* Password Input with Visibility Toggle */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">
            Create Password <span className="text-orange-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm placeholder:text-stone-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all font-mono tracking-wider"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Validation Checklist */}
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

        {/* Confirm Password Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-stone-300 tracking-wide">
              Confirm Password <span className="text-orange-400">*</span>
            </label>
            {confirmPassword && (
              <span className={`text-[11px] font-bold ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
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
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border text-white text-sm placeholder:text-stone-600 outline-none transition-all font-mono tracking-wider ${
                confirmPassword && !passwordsMatch
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

        {/* Create Account Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || usernameStatus !== 'available' || !isPasswordValid || !passwordsMatch}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-sm shadow-[0_4px_24px_rgba(242,92,5,0.35)] hover:shadow-[0_6px_32px_rgba(242,92,5,0.5)] transition-all disabled:opacity-50 active:scale-[0.99] cursor-pointer"
          >
            {isSubmitting ? (
              <span>Creating Your Credentials...</span>
            ) : (
              <>
                <span>Continue to Subscription Plans</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

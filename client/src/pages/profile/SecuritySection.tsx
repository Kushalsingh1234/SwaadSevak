import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Smartphone,
  Globe,
  Clock,
  Laptop,
  Save,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

export const SecuritySection: React.FC = () => {
  const { profile, changePassword } = useProfile();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Strength Calculations
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasNumber && hasUppercase && hasSpecialChar;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const getStrengthScore = () => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasNumber) score++;
    if (hasUppercase) score++;
    if (hasSpecialChar) score++;
    return score;
  };

  const strengthScore = getStrengthScore();
  const getStrengthLabel = () => {
    if (!newPassword) return { label: 'Empty', color: 'bg-stone-700', text: 'text-stone-500' };
    if (strengthScore <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-400' };
    if (strengthScore <= 3) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const strengthInfo = getStrengthLabel();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsUpdating(true);
    setStatusMsg(null);

    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message || 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Failed to update password.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'An error occurred.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-7">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Security &amp; Authentication
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Manage your manager password, connected Google authorization, and account security audit.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>SOC-2 &amp; AES-256 Protected</span>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border border-red-500/30 text-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          )}
          <span className="text-xs font-semibold">{statusMsg.text}</span>
        </div>
      )}

      {/* Grid: Change Password & Account Security Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column (Span 7): Change Password Form */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#1C120C]/90 border border-white/[0.1] shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <KeyRound className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="text-base font-bold text-white">Change Manager Password</h3>
              <p className="text-xs text-stone-400">Used for counter tablet logins and manager overrides.</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">
                Current Password <span className="text-orange-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  placeholder="Enter current password (demo: 1234)"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm placeholder:text-stone-600 focus:border-brand-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-brand-500/20 outline-none transition-all font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-300 tracking-wide">
                  New Password <span className="text-orange-400">*</span>
                </label>
                {newPassword && (
                  <span className={`text-[11px] font-bold ${strengthInfo.text}`}>
                    Strength: {strengthInfo.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  placeholder="Enter secure new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm placeholder:text-stone-600 focus:border-brand-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-brand-500/20 outline-none transition-all font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter Bar */}
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-colors ${
                      step <= strengthScore ? strengthInfo.color : 'bg-white/[0.08]'
                    }`}
                  />
                ))}
              </div>

              {/* Real-time Checklist */}
              <div className="mt-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] grid grid-cols-2 gap-2 text-[11px]">
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

            {/* Confirm New Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-300 tracking-wide">
                  Confirm New Password <span className="text-orange-400">*</span>
                </label>
                {confirmPassword && (
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
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Re-type new password"
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
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdating || !isPasswordValid || !passwordsMatch}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-xs shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isUpdating ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>

          <p className="text-[10px] text-stone-500 text-center pt-1">
            Firebase Architecture Ready: In production, password modification re-authenticates the current token with Firebase Auth before persistence.
          </p>
        </div>

        {/* Right Column (Span 5): Account Security & Verification Badges */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-[#1C120C]/90 border border-white/[0.1] shadow-xl space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-300 pb-2 border-b border-white/[0.08]">
              Account Verification Status
            </h3>

            {/* Google Account */}
            <div className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-white block">Google Identity</span>
                  <p className="text-[10px] text-stone-400 truncate">{profile.googleEmail}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                Connected
              </span>
            </div>

            {/* Email Verification */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
              <div>
                <span className="font-bold text-white block">Email Status</span>
                <span className="text-[10px] text-stone-400">{profile.email}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>

            {/* Phone Verification */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
              <div>
                <span className="font-bold text-white block">Phone Status</span>
                <span className="text-[10px] text-stone-400">{profile.phone}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                SMS Verified
              </span>
            </div>

            {/* Account KYC */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
              <div>
                <span className="font-bold text-white block">Hospitality KYC</span>
                <span className="text-[10px] text-stone-400">GST &amp; FSSAI Validated</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                Approved
              </span>
            </div>
          </div>

          {/* Active Session & Last Login */}
          <div className="p-6 rounded-3xl bg-[#1C120C]/90 border border-white/[0.1] shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-300 pb-2 border-b border-white/[0.08]">
              Active Shift Session
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Laptop className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Current POS Terminal</span>
                  <p className="text-[11px] text-stone-400">Chrome on macOS (Live Orders Active)</p>
                  <p className="text-[10px] text-stone-500 font-mono">IP: 49.37.182.41 (Bengaluru, IN)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-white/[0.06]">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Last Shift Login</span>
                  <p className="text-[11px] text-stone-400">{formatDate(profile.lastLogin)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

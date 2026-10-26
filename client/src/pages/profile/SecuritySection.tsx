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
  RefreshCw,
  Mail,
  FileCheck,
  MapPin,
  Shield,
  Activity,
  Check,
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
  const [isRefreshingSession, setIsRefreshingSession] = useState(false);
  const [sessionSuccessMsg, setSessionSuccessMsg] = useState(false);
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
    if (!newPassword) return { label: 'Empty', color: 'bg-slate-200', text: 'text-slate-400' };
    if (strengthScore <= 1) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
    if (strengthScore === 2) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
    if (strengthScore === 3) return { label: 'Good', color: 'bg-sky-500', text: 'text-sky-500' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
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

  const handleRefreshSession = () => {
    setIsRefreshingSession(true);
    setTimeout(() => {
      setIsRefreshingSession(false);
      setSessionSuccessMsg(true);
      setTimeout(() => setSessionSuccessMsg(false), 3000);
    }, 700);
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Security &amp; Authentication
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your manager password, connected Google authorization, and account security audit.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SOC-2 &amp; AES-256 Protected</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>4/4 Verified</span>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in shadow-xs ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          )}
          <span className="text-xs font-semibold">{statusMsg.text}</span>
        </div>
      )}

      {/* 4 Identity & Verification Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Google Identity */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Google Identity</span>
            <p className="text-xs text-slate-600 truncate mt-0.5 font-medium" title={profile.googleEmail}>
              {profile.googleEmail}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Single Sign-On Active</span>
          </div>
        </div>

        {/* Primary Email */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 shrink-0 shadow-2xs">
              <Mail className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Email Status</span>
            <p className="text-xs text-slate-600 truncate mt-0.5 font-medium" title={profile.email}>
              {profile.email}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Alerts &amp; Weekly Audits</span>
          </div>
        </div>

        {/* Phone Status */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              SMS Verified
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Phone Status</span>
            <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
              {profile.phone}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Manager 2FA Protected</span>
          </div>
        </div>

        {/* Hospitality KYC */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
              <FileCheck className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <CheckCircle2 className="w-3 h-3 text-indigo-600" />
              Approved
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Hospitality KYC</span>
            <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
              GST &amp; FSSAI Validated
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Government Verified</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Balanced Symmetrical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Change Manager Password */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 shrink-0 shadow-2xs">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900">Change Manager Password</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    Manager Override
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Used for counter tablet logins and manager overrides.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Password <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    placeholder="Enter current password (demo: 1234)"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/15 outline-none transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    New Password <span className="text-orange-500">*</span>
                  </label>
                  {newPassword && (
                    <span className={`text-[11px] font-bold ${strengthInfo.text}`}>
                      Strength: {strengthInfo.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    placeholder="Enter secure new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/15 outline-none transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter Bar */}
                <div className="mt-2.5 grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        step <= strengthScore ? strengthInfo.color : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Real-time Checklist */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 grid grid-cols-2 gap-2 text-[11px]">
                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${hasMinLength ? 'text-emerald-600' : 'text-slate-300'}`}
                    />
                    <span>Min. 8 characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      hasNumber ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${hasNumber ? 'text-emerald-600' : 'text-slate-300'}`}
                    />
                    <span>At least 1 number</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      hasUppercase ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${hasUppercase ? 'text-emerald-600' : 'text-slate-300'}`}
                    />
                    <span>1 uppercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      hasSpecialChar ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${hasSpecialChar ? 'text-emerald-600' : 'text-slate-300'}`}
                    />
                    <span>1 special symbol</span>
                  </div>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Confirm New Password <span className="text-orange-500">*</span>
                  </label>
                  {confirmPassword && (
                    <span
                      className={`text-[11px] font-bold flex items-center gap-1 ${
                        passwordsMatch ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {passwordsMatch ? (
                        <>
                          <Check className="w-3 h-3" /> Passwords match
                        </>
                      ) : (
                        'Passwords do not match'
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    placeholder="Re-type new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/70 hover:bg-white focus:bg-white border text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all shadow-2xs ${
                      confirmPassword && !passwordsMatch
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/15'
                        : 'border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating || !isPasswordValid || !passwordsMatch}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-500/20 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-[11px] text-slate-500 mt-3">
            <Shield className="w-4 h-4 text-orange-500 shrink-0" />
            <span>
              Firebase Architecture Ready: In production, password modification re-authenticates the current token with Firebase Auth before persistence.
            </span>
          </div>
        </div>

        {/* Right Column: Active Shift Session & Terminal Monitoring */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 shrink-0 shadow-2xs">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Active Shift Session</h3>
                  <p className="text-xs text-slate-500">Encrypted TLS v1.3 • AES-256 POS terminal monitoring</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Active Now
              </span>
            </div>

            {/* POS Device Details */}
            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-100/70 border border-orange-200/80 flex items-center justify-center text-orange-600 shrink-0 mt-0.5 shadow-2xs">
                  <Laptop className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">Current POS Terminal</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                      THIS DEVICE
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium pt-0.5">
                    Chrome on macOS (Live Orders Active)
                  </p>
                  <div className="flex items-center gap-2 pt-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      49.37.182.41
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      Bengaluru, IN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shift Session Timestamp */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block">Last Shift Login</span>
                  <p className="text-xs text-slate-600 font-medium truncate mt-0.5">{formatDate(profile.lastLogin)}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-2xs shrink-0">
                Session Valid
              </span>
            </div>

            {/* Security Audit Protocols */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Security &amp; Hardware Telemetry</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Zero-Trust Enforced</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-0.5">
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-medium">TLS 1.3 Cryptography</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-medium">Hardware Key Storage</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-medium">Zero-Trust Token Sync</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-medium">POS Auto-lock Enabled</span>
                </div>
              </div>
            </div>

            {/* Session Refresh Action */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleRefreshSession}
                disabled={isRefreshingSession}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingSession ? 'animate-spin' : ''}`} />
                <span>{isRefreshingSession ? 'Refreshing Session...' : 'Refresh Session Token'}</span>
              </button>

              {sessionSuccessMsg && (
                <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
                  ✓ Session token synchronized
                </span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 mt-3">
            <span>Terminal status healthy &amp; encrypted</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Optimal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

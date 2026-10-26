import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Crown,
  ChefHat,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

const MANAGER_SYMBOLS = [
  { id: 'shield', label: 'Verified Manager', icon: ShieldCheck, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  { id: 'crown', label: 'Executive Owner', icon: Crown, color: 'from-amber-500 to-yellow-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { id: 'chef', label: 'Culinary Lead', icon: ChefHat, color: 'from-rose-500 to-orange-500', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  { id: 'sparkles', label: 'Hospitality Lead', icon: Sparkles, color: 'from-purple-500 to-indigo-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { id: 'user', label: 'Shift Supervisor', icon: UserCheck, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { id: 'zap', label: 'Operations Lead', icon: Zap, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
];

export const PersonalInfoSection: React.FC = () => {
  const { profile, updateUserProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [altPhone, setAltPhone] = useState(profile.altPhone);
  const [selectedSymbol, setSelectedSymbol] = useState(profile.photoUrl || 'shield');

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentSymbol = MANAGER_SYMBOLS.find(s => s.id === selectedSymbol) || MANAGER_SYMBOLS[0];
  const CurrentIcon = currentSymbol.icon;

  const handleCancel = () => {
    setFullName(profile.fullName);
    setUsername(profile.username);
    setEmail(profile.email);
    setPhone(profile.phone);
    setAltPhone(profile.altPhone);
    setSelectedSymbol(profile.photoUrl || 'shield');
    setIsEditing(false);
    setStatusMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await updateUserProfile({
        fullName,
        username,
        email,
        phone,
        altPhone,
        photoUrl: selectedSymbol,
      });

      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message || 'Personal details updated successfully!' });
        setIsEditing(false);
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Validation error.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save changes.' });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Personal Information
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal profile details, contact info, and account credentials.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setStatusMsg(null);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-105 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in ${
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

      {/* Premium Profile Emblem Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            <div className={`w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-br ${currentSymbol.color} text-white flex items-center justify-center shadow-lg ring-4 ring-orange-500/10`}>
              <CurrentIcon className="w-10 h-10 sm:w-11 sm:h-11 text-white drop-shadow-xs" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{fullName}</h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentSymbol.bg} ${currentSymbol.text} ${currentSymbol.border}`}>
                <CurrentIcon className="w-3.5 h-3.5" />
                {currentSymbol.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">@{username}</p>
            <p className="text-[11px] text-slate-400">
              Verified Manager Profile • Secure Restaurant Session
            </p>
          </div>
        </div>

        {/* When in editing mode: Premium Symbol Selector Toggle */}
        {isEditing && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Profile Symbol
              </span>
              <span className="text-xs font-bold text-orange-600">
                {currentSymbol.label}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {MANAGER_SYMBOLS.map((sym) => {
                const SymIcon = sym.icon;
                const isSelected = selectedSymbol === sym.id;
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => setSelectedSymbol(sym.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/90 border-orange-500 text-orange-950 ring-2 ring-orange-500/20 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${sym.color} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                      <SymIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[11px] leading-tight truncate">{sym.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Profile Details Form / View */}
      <form onSubmit={handleSave} className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
              Full Name <span className="text-orange-500">*</span>
            </label>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900">
                {profile.fullName}
              </div>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
              Manager Username <span className="text-orange-500">*</span>
            </label>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="text-xs font-mono text-slate-400">@</span>
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-mono placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-orange-600 font-semibold">
                @{profile.username}
              </div>
            )}
          </div>

          {/* Email Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide">
                Email Address <span className="text-orange-500">*</span>
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800">
                {profile.email}
              </div>
            )}
            <p className="mt-1 text-[11px] text-slate-400">
              Future Firebase Integration: Email changes will dispatch a verification link before updating.
            </p>
          </div>

          {/* Primary Mobile */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide">
                Primary Mobile Number <span className="text-orange-500">*</span>
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                SMS Verified
              </span>
            </div>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900">
                {profile.phone}
              </div>
            )}
          </div>

          {/* Alternate Mobile */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
              Alternate Mobile Number
            </label>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                {profile.altPhone || 'Not specified'}
              </div>
            )}
          </div>

          {/* Account Creation Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
              Account Registration Date
            </label>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatDate(profile.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Save button in edit mode */}
        {isEditing && (
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

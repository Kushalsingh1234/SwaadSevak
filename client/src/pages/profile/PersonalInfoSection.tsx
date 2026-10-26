import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Camera,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Upload,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

export const PersonalInfoSection: React.FC = () => {
  const { profile, updateUserProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [altPhone, setAltPhone] = useState(profile.altPhone);
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl);

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setStatusMsg({ type: 'error', text: 'Image size must be less than 3MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setFullName(profile.fullName);
    setUsername(profile.username);
    setEmail(profile.email);
    setPhone(profile.phone);
    setAltPhone(profile.altPhone);
    setPhotoUrl(profile.photoUrl);
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
        photoUrl,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Personal Information
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
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
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-white/[0.1] text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
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

      {/* Profile Avatar Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1C120C]/90 border border-white/[0.1] shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-orange-500/40 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 text-stone-950 font-black text-3xl flex items-center justify-center shadow-xl">
                {fullName.charAt(0)}
              </div>
            )}

            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-stone-950 shadow-lg cursor-pointer transition-transform hover:scale-105"
                title="Upload Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">{fullName}</h3>
            <p className="text-xs text-stone-400 font-mono">@{username}</p>
            {isEditing && (
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-stone-200 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-orange-400" />
                  <span>Upload New Picture</span>
                </button>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-400 hover:text-red-400 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
            <p className="text-[11px] text-stone-500 pt-1">
              Recommended: JPG or PNG square image, at least 400x400 pixels.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Details Form / View */}
      <form onSubmit={handleSave} className="p-6 sm:p-7 rounded-3xl bg-[#1C120C]/90 border border-white/[0.1] shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">
              Full Name <span className="text-orange-400">*</span>
            </label>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm placeholder:text-stone-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm font-semibold text-white">
                {profile.fullName}
              </div>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">
              Manager Username <span className="text-orange-400">*</span>
            </label>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <span className="text-xs font-mono text-stone-500">@</span>
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm font-mono placeholder:text-stone-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm font-mono text-orange-400 font-semibold">
                @{profile.username}
              </div>
            )}
          </div>

          {/* Email Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-300 tracking-wide">
                Email Address <span className="text-orange-400">*</span>
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm placeholder:text-stone-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-stone-200">
                {profile.email}
              </div>
            )}
            <p className="mt-1 text-[11px] text-stone-500">
              Future Firebase Integration: Email changes will dispatch a verification link before updating.
            </p>
          </div>

          {/* Primary Mobile */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-300 tracking-wide">
                Primary Mobile Number <span className="text-orange-400">*</span>
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                SMS Verified
              </span>
            </div>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm placeholder:text-stone-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm font-semibold text-white">
                {profile.phone}
              </div>
            )}
          </div>

          {/* Alternate Mobile */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">
              Alternate Mobile Number
            </label>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white text-sm placeholder:text-stone-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-stone-300">
                {profile.altPhone || 'Not specified'}
              </div>
            )}
          </div>

          {/* Account Creation Date */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 tracking-wide">
              Account Registration Date
            </label>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-stone-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>{formatDate(profile.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Save button in edit mode */}
        {isEditing && (
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl border border-white/[0.1] text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

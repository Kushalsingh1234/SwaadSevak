import React, { useState, useRef } from 'react';
import {
  Store,
  MapPin,
  FileText,
  Phone,
  Mail,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Camera,
  RefreshCw,
  Building2,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

export const RestaurantDetailsSection: React.FC = () => {
  const { restaurantProfile, updateRestaurantProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...restaurantProfile });
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, coverImageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setFormData({ ...restaurantProfile });
    setIsEditing(false);
    setStatusMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await updateRestaurantProfile(formData);
      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message || 'Restaurant information updated successfully!' });
        setIsEditing(false);
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Validation error.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save restaurant details.' });
    } finally {
      setIsSaving(false);
    }
  };

  const restaurantTypes = [
    'Restaurant',
    'Cafe & Quick Service',
    'Cloud Kitchen',
    'Bakery & Dessert Parlour',
    'Fast Food & Chaat',
    'Bar & Brewery',
    'Dine-in Family Restaurant',
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Restaurant Information
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Display and manage your restaurant profile, GST credentials, location, and brand assets.
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
            Edit Restaurant Details
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

      {/* Brand Visual Assets: Cover Image & Logo */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-sm">
        {/* Cover Image */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-100 overflow-hidden">
          {formData.coverImageUrl ? (
            <img
              src={formData.coverImageUrl}
              alt="Restaurant Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 flex items-center justify-center text-slate-400 text-xs">
              No Cover Image Selected
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {isEditing && (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Cover</span>
            </button>
          )}

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />
        </div>

        {/* Logo overlapping Cover */}
        <div className="p-6 sm:p-7 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
          <div className="flex items-end gap-4">
            <div className="relative">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt={formData.restaurantName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover border-4 border-white shadow-md bg-slate-100"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center border-4 border-white shadow-md">
                  {formData.restaurantName.charAt(0)}
                </div>
              )}

              {isEditing && (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md cursor-pointer transition-transform hover:scale-105"
                  title="Upload Logo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            <div className="space-y-0.5 pb-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {formData.restaurantName}
              </h3>
              <p className="text-xs text-orange-600 font-semibold">
                {formData.restaurantType} • {formData.category}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Information */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Restaurant Identity &amp; Classification
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Restaurant Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                Restaurant / Café Name <span className="text-orange-500">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900">
                  {restaurantProfile.restaurantName}
                </div>
              )}
            </div>

            {/* Restaurant Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                Establishment Type <span className="text-orange-500">*</span>
              </label>
              {isEditing ? (
                <select
                  value={formData.restaurantType}
                  onChange={(e) => setFormData({ ...formData, restaurantType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all cursor-pointer shadow-xs"
                >
                  {restaurantTypes.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800">
                  {restaurantProfile.restaurantType}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                Cuisine / Category
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. South Indian, Chinese, North Indian"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800">
                  {restaurantProfile.category}
                </div>
              )}
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                Owner Name <span className="text-orange-500">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900">
                  {restaurantProfile.ownerName}
                </div>
              )}
            </div>

            {/* Description (Full Width) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                Restaurant Description
              </label>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief story or tagline displayed on your customer QR menu..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
                  {restaurantProfile.description || 'No description added yet.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Phone className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Restaurant Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                Restaurant Mobile <span className="text-orange-500">*</span>
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-semibold">
                  {restaurantProfile.phone}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                Alternate Mobile
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.altPhone}
                  onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                  placeholder="+91 98000 00000"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                  {restaurantProfile.altPhone || 'Not specified'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                Official Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                  {restaurantProfile.email}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Physical Address & Location */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Physical Location &amp; Address
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                Complete Address <span className="text-orange-500">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800">
                  {restaurantProfile.address}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                City <span className="text-orange-500">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800">
                  {restaurantProfile.city}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                State <span className="text-orange-500">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800">
                  {restaurantProfile.state}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                Pincode
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="560038"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800">
                  {restaurantProfile.pincode || '560038'}
                </div>
              )}
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                Nearby Landmark
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="e.g. Opposite Metro Pillar 114"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                  {restaurantProfile.landmark || 'None specified'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Compliance & Legal Identifiers */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Receipt className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Taxation &amp; Food Safety Compliance
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                GSTIN / GST Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                  placeholder="29ABCDE1234F1Z5"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-mono placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-emerald-700 font-bold">
                  {restaurantProfile.gstNumber || 'Not registered / Composite'}
                </div>
              )}
              <p className="mt-1 text-[11px] text-slate-400">
                Printed on customer tax receipts and automated daily sales reports.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
                FSSAI License Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fssaiNumber}
                  onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                  placeholder="11223344556677"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-mono placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-800 font-medium">
                  {restaurantProfile.fssaiNumber || '11223344556677'}
                </div>
              )}
              <p className="mt-1 text-[11px] text-slate-400">
                Mandatory for display on QR digital food menus under FSSAI regulations.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar in Edit Mode */}
        {isEditing && (
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 flex items-center justify-end gap-3 sticky bottom-4 shadow-xl z-20">
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
              {isSaving ? 'Saving Changes...' : 'Save Restaurant Details'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

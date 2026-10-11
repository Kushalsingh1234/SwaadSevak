import React, { useState, useEffect } from 'react';
import {
  Settings,
  Percent,
  Building2,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Save,
  Info,
  Printer,
  ShieldCheck,
  Sparkles,
  Store,
  Phone,
  Mail,
  MapPin,
  Check
} from 'lucide-react';
import { Restaurant } from '../types';
import { api } from '../services/api';
import { parseGstTier, GstTier, calculateGst } from '../utils/gst';

interface SettingsPageProps {
  restaurant: Restaurant | null;
  onUpdateRestaurant: (updated: Restaurant) => void;
  onNavigateTab?: (tab: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  restaurant,
  onUpdateRestaurant,
  onNavigateTab
}) => {
  // Form State
  const [gstTier, setGstTier] = useState<GstTier>(() => parseGstTier(restaurant?.gstTier));
  const [gstNumber, setGstNumber] = useState<string>(restaurant?.gstNumber || '');
  const [name, setName] = useState<string>(restaurant?.name || '');
  const [ownerName, setOwnerName] = useState<string>(restaurant?.ownerName || '');
  const [phone, setPhone] = useState<string>(restaurant?.phone || '');
  const [email, setEmail] = useState<string>(restaurant?.email || '');
  const [address, setAddress] = useState<string>(restaurant?.address || '');
  const [city, setCity] = useState<string>(restaurant?.city || '');
  const [state, setState] = useState<string>(restaurant?.state || '');
  const [restaurantType, setRestaurantType] = useState<string>(restaurant?.restaurantType || 'Café & Bistro');

  // UI state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state if restaurant prop updates
  useEffect(() => {
    if (restaurant) {
      setGstTier(parseGstTier(restaurant.gstTier));
      setGstNumber(restaurant.gstNumber || '');
      setName(restaurant.name || '');
      setOwnerName(restaurant.ownerName || '');
      setPhone(restaurant.phone || '');
      setEmail(restaurant.email || '');
      setAddress(restaurant.address || '');
      setCity(restaurant.city || '');
      setState(restaurant.state || '');
      setRestaurantType(restaurant.restaurantType || 'Café & Bistro');
    }
  }, [restaurant]);

  // Sample order simulation for live receipt preview
  const sampleSubtotal = 450; // e.g., Paneer Tikka (₹240) + Garlic Naan x2 (₹120) + Lassi (₹90)
  const previewCalc = calculateGst(sampleSubtotal, gstTier);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(null);

    try {
      const payload: Partial<Restaurant> = {
        name: name.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        restaurantType: restaurantType.trim(),
        gstNumber: gstNumber.trim() ? gstNumber.trim().toUpperCase() : undefined,
        gstTier
      };

      const res = await api.updateRestaurant(payload);
      if (res.success && res.restaurant) {
        onUpdateRestaurant(res.restaurant);
        setSaveSuccess('Restaurant settings & GST tier updated successfully! Changes are active immediately.');
        setTimeout(() => setSaveSuccess(null), 5000);
      } else {
        throw new Error(res.message || 'Failed to update settings');
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setErrorMsg(err.message || 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Settings & Tax Slabs
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Configuration
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure your GST pricing slab, digital invoices, and restaurant profile details
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-semibold text-xs shadow-md shadow-orange-600/20 transition-all disabled:opacity-60 cursor-pointer self-start sm:self-auto"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Success / Error Alerts */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{saveSuccess}</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: GST & TAX CONFIGURATION (Primary Requested Feature) */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-stone-200/80 bg-stone-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">GST Slab & Tax Calculation Mode</h2>
                <p className="text-xs text-slate-500">
                  Select how GST is calculated across customer QR orders, KOT cards, and digital tax invoices.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* 3 GST Slab Choices */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Choose GST Tier / Pricing Policy
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Option 1: Inclusive of Taxes */}
                <div
                  onClick={() => setGstTier('inclusive')}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                    gstTier === 'inclusive'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Exact Item Prices
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          gstTier === 'inclusive' ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                        }`}
                      >
                        {gstTier === 'inclusive' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      Item Prices Inclusive of Taxes
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Dishes already include all taxes. Diners see and pay the <strong>exact sum of their items</strong> with zero added taxes.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Best for:</span> Cafés, Bakeries, Sweet Shops, Quick Service Restaurants
                  </div>
                </div>

                {/* Option 2: 5% GST */}
                <div
                  onClick={() => setGstTier('5%')}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                    gstTier === '5%'
                      ? 'border-orange-500 bg-orange-50/40 shadow-xs ring-2 ring-orange-500/20'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                        2.5% CGST + 2.5% SGST
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          gstTier === '5%' ? 'bg-orange-500 text-white' : 'border border-stone-300'
                        }`}
                      >
                        {gstTier === '5%' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      5% Standard Restaurant GST
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Standard food tax slab. 5% tax (2.5% CGST + 2.5% SGST) is applied to the net subtotal and itemized on customer receipts.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Best for:</span> Standalone dining, Cloud kitchens, Casual eateries
                  </div>
                </div>

                {/* Option 3: 18% GST */}
                <div
                  onClick={() => setGstTier('18%')}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                    gstTier === '18%'
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        9% CGST + 9% SGST
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          gstTier === '18%' ? 'bg-indigo-600 text-white' : 'border border-stone-300'
                        }`}
                      >
                        {gstTier === '18%' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      18% AC & Commercial GST
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      18% tax (9% CGST + 9% SGST) is calculated and added to the customer food bill and itemized on the digital tax invoice.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Best for:</span> Hotels, Fine Dining, Air-conditioned/Bar restaurants
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Simulator / Live Bill Preview */}
            <div className="bg-gradient-to-r from-stone-50 to-amber-50/30 rounded-xl border border-stone-200 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Live Calculation Preview for a ₹{sampleSubtotal} Order
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  Active Tier: <strong className="text-slate-900 uppercase">{previewCalc.tier}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sample items */}
                <div className="bg-white rounded-lg p-3.5 border border-stone-200/80 text-xs space-y-1.5 shadow-2xs">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sample Cart Items</p>
                  <div className="flex justify-between text-slate-700">
                    <span>1x Paneer Tikka</span>
                    <span className="font-medium">₹240.00</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>2x Garlic Naan</span>
                    <span className="font-medium">₹120.00</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>1x Mango Lassi</span>
                    <span className="font-medium">₹90.00</span>
                  </div>
                  <div className="pt-2 border-t border-stone-100 flex justify-between font-semibold text-slate-900">
                    <span>Item Subtotal:</span>
                    <span>₹{sampleSubtotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Output breakdown */}
                <div className="bg-white rounded-lg p-3.5 border border-stone-200/80 text-xs space-y-1.5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Customer Invoice Breakdown</p>
                    <div className="flex justify-between text-slate-600">
                      <span>Item Subtotal:</span>
                      <span>₹{sampleSubtotal.toFixed(2)}</span>
                    </div>

                    {previewCalc.isInclusive ? (
                      <div className="flex justify-between text-emerald-700 font-medium pt-1">
                        <span>GST & Taxes:</span>
                        <span>Included in item prices (₹0.00)</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-slate-600 pt-0.5">
                          <span>{previewCalc.tier === '18%' ? 'CGST (9%)' : 'CGST (2.5%)'}:</span>
                          <span>₹{previewCalc.cgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>{previewCalc.tier === '18%' ? 'SGST (9%)' : 'SGST (2.5%)'}:</span>
                          <span>₹{previewCalc.sgst.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-2 mt-2 border-t border-stone-200 flex justify-between items-baseline font-black text-slate-900 text-sm">
                    <span>Customer Total Payable:</span>
                    <span className="text-orange-600 text-base tabular-nums">
                      ₹{previewCalc.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {previewCalc.isInclusive ? (
                  <span>
                    When diners scan the table QR, they are shown the exact sum of items (<strong>₹{sampleSubtotal}</strong>). No extra taxes are added.
                  </span>
                ) : (
                  <span>
                    When diners order, <strong>{previewCalc.label}</strong> (₹{previewCalc.tax.toFixed(2)}) is calculated on their order and itemized on thermal receipts and PDF invoices.
                  </span>
                )}
              </p>
            </div>

            {/* GST Number Field */}
            <div className="pt-2">
              <label htmlFor="gstin-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                GSTIN (Goods and Services Tax Identification Number)
              </label>
              <div className="relative max-w-md">
                <input
                  id="gstin-input"
                  type="text"
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  value={gstNumber}
                  maxLength={15}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  className="w-full pl-3 pr-24 py-2.5 text-xs font-mono font-semibold rounded-xl bg-stone-50 border border-stone-200 text-slate-900 uppercase placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  {gstNumber.length}/15 CHARS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Optional. If provided, GSTIN is displayed on the header of all printed thermal bills and downloadable digital PDF receipts.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: RESTAURANT PROFILE & OUTLET INFORMATION */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-stone-200/80 bg-stone-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-200 text-slate-700 flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Outlet Profile & Invoicing Details</h2>
                <p className="text-xs text-slate-500">
                  These details appear on your diner menu title, order confirmations, and customer bills.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Restaurant / Outlet Name *
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold"
                    placeholder="The Chai & Chaat Co."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner / Manager Name *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
                  placeholder="Vikram Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
                    placeholder="contact@restaurant.com"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Outlet Address
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
                    placeholder="Shop 14, 100ft Road, Indiranagar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
                  placeholder="Bengaluru"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
                  placeholder="Karnataka"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Restaurant Establishment Type
                </label>
                <select
                  value={restaurantType}
                  onChange={(e) => setRestaurantType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
                >
                  <option value="Café & Bistro">Café & Bistro</option>
                  <option value="Casual Dining">Casual Dining</option>
                  <option value="Fine Dining">Fine Dining</option>
                  <option value="Fast Food / QSR">Fast Food / Quick Service (QSR)</option>
                  <option value="Cloud Kitchen / Delivery">Cloud Kitchen / Delivery Only</option>
                  <option value="Sweet Shop / Mithai & Chaat">Sweet Shop / Mithai & Chaat</option>
                  <option value="Bar & Brewery">Bar & Brewery</option>
                  <option value="Family Restaurant">Family Restaurant</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: HARDWARE & PRINTER QUICK LINK */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kitchen KOT & Receipt Printer</h3>
              <p className="text-xs text-slate-500">
                Configure auto-print on new orders, 80mm/58mm thermal paper width, and network printer IP address.
              </p>
            </div>
          </div>

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('printer')}
              className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-slate-700 text-xs font-semibold transition-all shrink-0 cursor-pointer text-center"
            >
              Configure Printer →
            </button>
          )}
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

import React from 'react';
import { Smartphone, Monitor, MessageSquare, MapPin, Search } from 'lucide-react';
import { formatINR } from '../../lib/utils';

interface WebsitePreviewProps {
  restaurantName: string;
  cuisineName: string;
  sampleDish: string;
  samplePrice: number;
  brandColor: string;
  device: 'mobile' | 'desktop';
}

export const WebsitePreviewMockup: React.FC<WebsitePreviewProps> = ({
  restaurantName,
  cuisineName,
  sampleDish,
  samplePrice,
  brandColor,
  device,
}) => {
  return (
    <div className="w-full flex justify-center font-sans select-none">
      {device === 'mobile' ? (
        /* Mobile Frame */
        <div className="w-full max-w-[320px] rounded-[32px] p-3 bg-ink-950 shadow-2xl border-4 border-ink-800 relative">
          {/* Phone Top Speaker */}
          <div className="w-20 h-3.5 bg-ink-900 rounded-full mx-auto mb-2" />

          {/* Screen Content */}
          <div className="rounded-[22px] overflow-hidden bg-white text-ink-950 min-h-[440px] flex flex-col text-xs text-left">
            {/* Header with Dynamic Brand Color */}
            <div
              style={{ backgroundColor: brandColor }}
              className="p-4 text-white text-center transition-colors duration-300 shadow-sm"
            >
              <span className="text-[9px] uppercase font-mono tracking-widest opacity-80 block">
                Direct Kitchen Menu
              </span>
              <h4 className="font-bold text-base truncate mt-0.5">
                {restaurantName || 'Your Restaurant Name'}
              </h4>
              <p className="text-[10px] opacity-90">{cuisineName} • 100% Commission-Free</p>
            </div>

            {/* Category Filter Pills */}
            <div className="p-2 bg-slate-100 flex gap-1.5 overflow-x-auto text-[10px] font-semibold border-b border-slate-200">
              <span className="px-2.5 py-1 rounded-full bg-white text-slate-900 shadow-xs shrink-0">
                Recommended
              </span>
              <span className="px-2.5 py-1 rounded-full text-slate-600 shrink-0">Main Courses</span>
              <span className="px-2.5 py-1 rounded-full text-slate-600 shrink-0">Beverages</span>
            </div>

            {/* Sample Dish Cards */}
            <div className="p-3 space-y-2 flex-1 overflow-y-auto">
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success-600 inline-block" />
                    <span className="font-bold text-xs text-slate-900">{sampleDish}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Freshly prepared with authentic ingredients</span>
                  <span className="font-mono font-bold text-xs text-slate-900">{formatINR(samplePrice)}</span>
                </div>
                <button
                  style={{ borderColor: brandColor, color: brandColor }}
                  className="px-2.5 py-1 rounded-lg border font-bold text-[10px] uppercase bg-white shadow-xs"
                >
                  ADD +
                </button>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success-600 inline-block" />
                    <span className="font-bold text-xs">Chef Special Thali</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Complete meal for 2 guests</span>
                  <span className="font-mono font-bold text-xs text-slate-900">₹450</span>
                </div>
                <button
                  style={{ borderColor: brandColor, color: brandColor }}
                  className="px-2.5 py-1 rounded-lg border font-bold text-[10px] uppercase bg-white shadow-xs"
                >
                  ADD +
                </button>
              </div>
            </div>

            {/* Bottom Floating WhatsApp Checkout */}
            <div className="p-3 bg-white border-t border-slate-100 space-y-1.5">
              <div
                style={{ backgroundColor: brandColor }}
                className="w-full py-2.5 rounded-xl text-white font-bold text-center flex items-center justify-center gap-2 shadow-sm text-xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>Order on WhatsApp (0% Fee)</span>
              </div>
              <span className="block text-center text-[9px] text-slate-400 font-mono">
                Sample preview, not your final design
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Browser Frame */
        <div className="w-full rounded-2xl p-4 bg-ink-950 shadow-2xl border-4 border-ink-800 text-ink-950">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink-800 text-xs text-ink-300">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="font-mono text-[11px] bg-ink-900 px-4 py-0.5 rounded text-ink-300">
              https://{restaurantName.toLowerCase().replace(/\s+/g, '') || 'yourrestaurant'}.in
            </span>
            <span className="text-[10px] font-mono text-success-400 font-bold">SSL ACTIVE</span>
          </div>

          <div className="bg-white rounded-xl overflow-hidden min-h-[350px] p-6 text-left space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h4 className="font-bold text-2xl" style={{ color: brandColor }}>
                  {restaurantName || 'Your Restaurant Name'}
                </h4>
                <p className="text-xs text-slate-500">{cuisineName} • Dine-In & Direct Takeaway</p>
              </div>
              <div
                style={{ backgroundColor: brandColor }}
                className="px-4 py-2 rounded-xl text-white font-bold text-xs"
              >
                Order Direct on WhatsApp
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-sm text-slate-900">{sampleDish}</span>
                <p className="text-xs text-slate-500">Freshly prepared with chef special recipes.</p>
                <span className="font-bold text-sm text-slate-900 font-mono block pt-2">{formatINR(samplePrice)}</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-sm text-slate-900">Chef Signature Platter</span>
                <p className="text-xs text-slate-500">Includes main dishes, starters, and bread assortment.</p>
                <span className="font-bold text-sm text-slate-900 font-mono block pt-2">₹580</span>
              </div>
            </div>

            <div className="pt-2 text-center text-[11px] text-slate-400 font-mono">
              Sample preview, not your final design
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

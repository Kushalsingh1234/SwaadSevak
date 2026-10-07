import React from 'react';
import { MessageSquare } from 'lucide-react';
import { formatINR } from '../../lib/utils';

interface WebsitePreviewProps {
  restaurantName?: string;
  cuisineName?: string;
  sampleDish?: string;
  samplePrice?: number;
  brandColor?: string;
  device?: 'mobile' | 'desktop';
}

export const WebsitePreviewMockup: React.FC<WebsitePreviewProps> = ({
  restaurantName = 'The Royal Spice Kitchen',
  cuisineName = 'North Indian & Mughlai',
  sampleDish = 'Paneer Butter Masala',
  samplePrice = 340,
  brandColor = '#F97316',
  device = 'mobile',
}) => {
  return (
    <div className="w-full flex justify-center font-sans select-none">
      {device === 'mobile' ? (
        /* Mobile Frame */
        <div className="w-full max-w-[320px] rounded-[32px] p-3 bg-espresso shadow-2xl border-4 border-walnut relative">
          {/* Phone Top Speaker */}
          <div className="w-20 h-3.5 bg-cocoa rounded-full mx-auto mb-2" />

          {/* Screen Content */}
          <div className="rounded-[22px] overflow-hidden bg-white text-espresso min-h-[440px] flex flex-col text-xs text-left border border-sand-200">
            {/* Header with Dynamic Brand Color */}
            <div
              style={{ backgroundColor: brandColor }}
              className="p-4 text-white text-center transition-colors duration-300 shadow-sm"
            >
              <span className="text-[9px] uppercase font-mono tracking-widest font-extrabold opacity-95 block">
                Direct Kitchen Menu
              </span>
              <h4 className="font-extrabold text-base truncate mt-0.5 text-white">
                {restaurantName || 'Your Restaurant Name'}
              </h4>
              <p className="text-[10px] font-medium text-white/90">{cuisineName} • 100% Commission-Free</p>
            </div>

            {/* Category Filter Pills */}
            <div className="p-2 bg-sand-50 flex gap-1.5 overflow-x-auto text-[10px] font-bold border-b border-sand-200">
              <span className="px-2.5 py-1 rounded-full bg-white text-espresso shadow-soft shrink-0 border border-sand-200">
                Recommended
              </span>
              <span className="px-2.5 py-1 rounded-full text-walnut shrink-0">Main Courses</span>
              <span className="px-2.5 py-1 rounded-full text-walnut shrink-0">Breads</span>
            </div>

            {/* Sample Dish Cards */}
            <div className="p-3 space-y-2 flex-1 overflow-y-auto bg-cream/40">
              <div className="p-2.5 rounded-xl border border-sand-200 bg-white shadow-soft flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-success inline-block" />
                    <span className="font-extrabold text-espresso text-[11px]">{sampleDish}</span>
                  </div>
                  <p className="text-[9px] text-walnut font-medium">Fresh cottage cheese in velvety makhani gravy</p>
                  <span className="font-mono font-extrabold text-orange-dark text-[11px] block">
                    {formatINR(samplePrice)}
                  </span>
                </div>
                <button
                  type="button"
                  style={{ backgroundColor: brandColor }}
                  className="px-3 py-1 rounded-lg text-espresso font-extrabold text-[10px] shrink-0 shadow-soft cursor-pointer"
                >
                  + ADD
                </button>
              </div>

              <div className="p-2.5 rounded-xl border border-sand-200 bg-white shadow-soft flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-success inline-block" />
                    <span className="font-extrabold text-espresso text-[11px]">Butter Garlic Naan</span>
                  </div>
                  <p className="text-[9px] text-walnut font-medium">Crispy tandoori naan with roasted garlic</p>
                  <span className="font-mono font-extrabold text-orange-dark text-[11px] block">₹80</span>
                </div>
                <button
                  type="button"
                  style={{ backgroundColor: brandColor }}
                  className="px-3 py-1 rounded-lg text-espresso font-extrabold text-[10px] shrink-0 shadow-soft cursor-pointer"
                >
                  + ADD
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Sticky Checkout Button */}
            <div className="p-3 bg-white border-t border-sand-200">
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#25D366] text-white font-extrabold text-xs shadow-md">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Order via WhatsApp (0% Fee)</span>
                </div>
                <span className="font-mono text-[11px] bg-black/20 px-2 py-0.5 rounded font-bold">
                  {formatINR(samplePrice + 80)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Frame */
        <div className="w-full max-w-xl rounded-2xl p-3 bg-espresso shadow-2xl border-4 border-walnut text-xs">
          <div className="rounded-xl overflow-hidden bg-white text-espresso min-h-[300px] flex flex-col border border-sand-200">
            <div style={{ backgroundColor: brandColor }} className="p-4 text-white flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-sm">{restaurantName}</h4>
                <p className="text-[10px] opacity-90 font-medium">{cuisineName}</p>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded font-mono font-bold">0% Commission Direct Menu</span>
            </div>
            <div className="p-4 flex-1">
              <span className="text-xs text-bodyText font-medium">Full desktop website preview with table booking &amp; menu.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

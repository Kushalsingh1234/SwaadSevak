import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { Badge } from '../ui/Badge';
import { ReceiptCard } from '../ui/ReceiptCard';
import {
  Sunrise,
  Utensils,
  Smartphone,
  Moon,
  AlertCircle,
  Plus,
  Printer,
  Check,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { formatINR } from '../../lib/utils';

export const DayStorySection: React.FC = () => {
  const { t } = useTranslation();
  const [activeMoment, setActiveMoment] = useState<number>(0);

  const moments = [
    {
      id: 'morning',
      time: '09:00 AM',
      icon: <Sunrise className="w-5 h-5 text-amber-500" />,
      title: t.dayStory.moment1Title,
      desc: t.dayStory.moment1Desc,
      screenTag: 'Smart Inventory & Prep Engine',
    },
    {
      id: 'lunch',
      time: '01:30 PM',
      icon: <Utensils className="w-5 h-5 text-saffron-500" />,
      title: t.dayStory.moment2Title,
      desc: t.dayStory.moment2Desc,
      screenTag: '3-Touch POS Billing & KOT',
    },
    {
      id: 'evening',
      time: '08:15 PM',
      icon: <Smartphone className="w-5 h-5 text-curry-500" />,
      title: t.dayStory.moment3Title,
      desc: t.dayStory.moment3Desc,
      screenTag: 'Zomato + Swiggy + Dine-in Sync',
    },
    {
      id: 'night',
      time: '11:45 PM',
      icon: <Moon className="w-5 h-5 text-purple-400" />,
      title: t.dayStory.moment4Title,
      desc: t.dayStory.moment4Desc,
      screenTag: 'End-of-Day Z-Report & Tax Audit',
    },
  ];

  return (
    <section className="py-16 sm:py-24 font-sans relative">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="maroon" className="mb-3">
            {t.dayStory.badge}
          </Badge>
          <h2 className="h2-fluid font-serif font-bold text-maroon-950 dark:text-cream-50 mb-4">
            {t.dayStory.title}
          </h2>
          <p className="text-base text-maroon-900/80 dark:text-cream-200/80 leading-relaxed">
            {t.dayStory.subtitle}
          </p>
        </div>

        {/* Story Grid: Left Step Buttons, Right Dynamic React Screen Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Timeline Moments List */}
          <div className="lg:col-span-5 space-y-4">
            {moments.map((moment, idx) => {
              const isActive = activeMoment === idx;
              return (
                <button
                  key={moment.id}
                  onClick={() => setActiveMoment(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer focus-ring flex items-start gap-4 ${
                    isActive
                      ? 'bg-paper dark:bg-paper-dark border-saffron-500 shadow-md ring-1 ring-saffron-500/30'
                      : 'bg-cream-100/60 dark:bg-maroon-900/20 border-receipt-divider dark:border-maroon-800/60 hover:bg-cream-200/50'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isActive
                        ? 'bg-saffron-100 dark:bg-saffron-950/80 text-saffron-600'
                        : 'bg-cream-200 dark:bg-maroon-900 text-maroon-700'
                    }`}
                  >
                    {moment.icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-saffron-600 dark:text-saffron-400">
                        {moment.time}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-saffron-500 text-white">
                          Viewing
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-maroon-950 dark:text-cream-50">
                      {moment.title.split('—')[1]?.trim() || moment.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-maroon-900/70 dark:text-cream-200/70 leading-relaxed">
                      {moment.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Dynamic Screen Component Mockup */}
          <div className="lg:col-span-7">
            <div className="p-4 sm:p-6 rounded-3xl bg-maroon-950 border-4 border-maroon-900 shadow-2xl text-cream-50">
              
              {/* Screen Browser Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-maroon-800/80 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-cream-300/60 ml-2 font-sans">SwaadSevak POS</span>
                </div>
                <span className="text-saffron-400 font-semibold">{moments[activeMoment].screenTag}</span>
              </div>

              {/* Dynamic Screen Content Based on Active Moment */}
              <div className="min-h-[360px] flex flex-col justify-center">
                
                {/* Moment 0: Morning Stock */}
                {activeMoment === 0 && (
                  <div className="space-y-4 animate-ticket-drop">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-200 text-xs">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>3 Ingredients predicted low before lunch rush</span>
                      </div>
                      <button className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold">
                        1-Click PO
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-maroon-900/60 border border-maroon-800">
                        <span className="text-cream-300/70 block mb-1">Paneer Block</span>
                        <span className="text-lg font-bold text-red-400 font-mono">2.4 kg</span>
                        <span className="text-[10px] text-red-300 block">Min req: 8.0 kg</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-maroon-900/60 border border-maroon-800">
                        <span className="text-cream-300/70 block mb-1">Fresh Cream</span>
                        <span className="text-lg font-bold text-amber-400 font-mono">3.0 L</span>
                        <span className="text-[10px] text-amber-300 block">Min req: 5.0 L</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-maroon-900/60 border border-maroon-800">
                        <span className="text-cream-300/70 block mb-1">Biryani Rice</span>
                        <span className="text-lg font-bold text-curry-400 font-mono">42 kg</span>
                        <span className="text-[10px] text-curry-300 block">Stock healthy</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-maroon-900/40 border border-maroon-800/60 flex items-center justify-between text-xs">
                      <span className="text-cream-200">Suggested vendor delivery: "Indiranagar Dairy Farm"</span>
                      <span className="text-saffron-400 font-mono font-bold">₹4,250 Est.</span>
                    </div>
                  </div>
                )}

                {/* Moment 1: Lunch Rush */}
                {activeMoment === 1 && (
                  <div className="space-y-4 animate-ticket-drop font-sans">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-3 rounded-xl bg-saffron-900/40 border border-saffron-700/60 text-saffron-200">
                        <span className="block font-bold text-lg text-white">Table 05</span>
                        <span>4 Guests • Seated</span>
                      </div>
                      <div className="p-3 rounded-xl bg-curry-950/40 border border-curry-800/60 text-curry-200">
                        <span className="block font-bold text-lg text-white">3 Touch</span>
                        <span>Rapid Item Entry</span>
                      </div>
                      <div className="p-3 rounded-xl bg-maroon-900/60 border border-maroon-800 text-cream-200">
                        <span className="block font-bold text-lg text-white">12 Sec</span>
                        <span>Avg Ticket Punch</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-paper text-maroon-950 border border-receipt-divider font-mono text-xs space-y-2">
                      <div className="flex justify-between font-bold border-b border-dashed pb-1.5">
                        <span>KOT #0988 — TABLE 05</span>
                        <span className="text-curry-600">SENT TO TANDOOR & CURRY</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2x Dal Makhani (Less Spicy)</span>
                        <span>₹460</span>
                      </div>
                      <div className="flex justify-between">
                        <span>4x Butter Garlic Naan</span>
                        <span>₹240</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1x Jeera Rice</span>
                        <span>₹180</span>
                      </div>
                      <div className="pt-2 border-t border-dashed flex justify-between font-bold text-sm text-maroon-950">
                        <span>Subtotal + 5% GST</span>
                        <span>₹924.00</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Moment 2: Evening Aggregators */}
                {activeMoment === 2 && (
                  <div className="space-y-3 animate-ticket-drop text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-maroon-900/60 border border-maroon-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-curry-400 animate-pulse" />
                        <span className="font-bold">Unified Delivery Stream</span>
                      </div>
                      <span className="text-curry-400 font-bold">Auto-Accept ON</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 space-y-1.5">
                        <div className="flex justify-between font-bold">
                          <span>Zomato #142</span>
                          <span className="text-white font-mono">₹640</span>
                        </div>
                        <p className="text-[11px] text-red-100">1x Chicken Tikka, 2x Roomali Roti</p>
                        <span className="text-[10px] bg-red-800/80 px-2 py-0.5 rounded font-mono">Rider: Rajesh (Arriving 4m)</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-orange-950/40 border border-orange-800/60 text-orange-200 space-y-1.5">
                        <div className="flex justify-between font-bold">
                          <span>Swiggy #809</span>
                          <span className="text-white font-mono">₹520</span>
                        </div>
                        <p className="text-[11px] text-orange-100">2x Paneer Biryani, 1x Gulab Jamun</p>
                        <span className="text-[10px] bg-orange-800/80 px-2 py-0.5 rounded font-mono">Rider: Arvind (Assigned)</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-maroon-900/40 border border-maroon-800 flex items-center justify-between text-[11px]">
                      <span>1-Click Toggle: Paneer Butter Masala</span>
                      <button className="px-2 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded font-bold">
                        Toggle 86 (Out of Stock)
                      </button>
                    </div>
                  </div>
                )}

                {/* Moment 3: Night Close-out */}
                {activeMoment === 3 && (
                  <div className="space-y-4 animate-ticket-drop text-xs">
                    <div className="p-4 rounded-xl bg-curry-950/40 border border-curry-800/60 text-curry-200 flex items-center justify-between">
                      <div>
                        <span className="block font-mono text-[10px] uppercase">Today's Net Sales</span>
                        <span className="text-2xl font-bold font-serif text-white">₹68,450.00</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-curry-400 font-bold block">142 Bills</span>
                        <span className="text-[10px] text-cream-300">GST Collected: ₹3,422.50</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-center">
                      <div className="p-2.5 rounded-lg bg-maroon-900/60 border border-maroon-800">
                        <span className="text-[10px] text-cream-300 block">UPI</span>
                        <span className="font-bold text-white">₹44,200</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-maroon-900/60 border border-maroon-800">
                        <span className="text-[10px] text-cream-300 block">Cards</span>
                        <span className="font-bold text-white">₹16,150</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-maroon-900/60 border border-maroon-800">
                        <span className="text-[10px] text-cream-300 block">Cash</span>
                        <span className="font-bold text-white">₹8,100</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-maroon-900/50 border border-maroon-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-cream-200">
                        <Share2 className="w-4 h-4 text-saffron-400" />
                        <span>Daily WhatsApp Z-Report sent to Owner</span>
                      </div>
                      <span className="text-curry-400 font-mono font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Delivered
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

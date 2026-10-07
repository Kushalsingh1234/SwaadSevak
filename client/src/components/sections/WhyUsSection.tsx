import React from 'react';
import { CheckCircle2, Megaphone, Layers, FileX, Lock } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  return (
    <section
      id="why-us"
      className="py-6 sm:py-8 font-sans relative overflow-hidden"
      style={{ backgroundColor: '#2B1A12', color: '#FFFFFF' }}
    >
      {/* Background glow & subtle patterns */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Centered Header */}
        <div className="text-center max-w-lg mx-auto mb-5 sm:mb-7">
          <div
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-bold shadow-soft mb-2.5"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FAF4ED' }}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
            <span>Why SwaadSevak</span>
          </div>
          <h2 className="h2-fluid font-extrabold tracking-tight mb-1.5" style={{ color: '#FFFFFF' }}>
            Built for the Reality of Indian Restaurant Rush Hours
          </h2>
          <p className="text-[11px] sm:text-xs leading-relaxed font-medium" style={{ color: '#F5E9DD' }}>
            No proprietary hardware locks, no hidden maintenance fees, and no complicated menus. Just dependable software that runs smoothly through your busiest shifts.
          </p>
        </div>

        {/* 4 Cards in One Line (4-Column Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
          
          {/* Card 1: Kitchen Chaos */}
          <div
            className="rounded-card-lg p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-card hover:shadow-elevated group min-h-[220px]"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FFFFFF' }}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400">
                  <Megaphone className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] uppercase font-mono font-extrabold tracking-wider" style={{ color: '#FB923C' }}>
                  01 • Kitchen Chaos
                </span>
              </div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: '#FFFFFF' }}>
                Orders shouted across the counter
              </h3>
              <p className="text-[11px] leading-relaxed font-normal mb-3" style={{ color: '#F5E9DD' }}>
                Paper slips get lost, food is delayed, and the wrong dishes end up on customer tables during the peak rush.
              </p>
            </div>
            <div className="flex items-start gap-1.5 text-[10.5px] font-medium pt-2.5" style={{ borderTop: '1px solid #5A3A28', color: '#FAF4ED' }}>
              <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />
              <span className="leading-snug">Solved with automated thermal KOT routing &amp; live screen sync</span>
            </div>
          </div>

          {/* Card 2: Delivery Overload */}
          <div
            className="rounded-card-lg p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-card hover:shadow-elevated group min-h-[220px]"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FFFFFF' }}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] uppercase font-mono font-extrabold tracking-wider" style={{ color: '#FB923C' }}>
                  02 • Delivery Overload
                </span>
              </div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: '#FFFFFF' }}>
                Multiple screens and a notebook
              </h3>
              <p className="text-[11px] leading-relaxed font-normal mb-3" style={{ color: '#F5E9DD' }}>
                Dine-in tokens on paper, Swiggy on one tablet, Zomato on another. Your kitchen staff is overwhelmed switching screens.
              </p>
            </div>
            <div className="flex items-start gap-1.5 text-[10.5px] font-medium pt-2.5" style={{ borderTop: '1px solid #5A3A28', color: '#FAF4ED' }}>
              <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />
              <span className="leading-snug">Solved with unified single-screen Swiggy, Zomato &amp; QR hub</span>
            </div>
          </div>

          {/* Card 3: Revenue Leakage */}
          <div
            className="rounded-card-lg p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-card hover:shadow-elevated group min-h-[220px]"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FFFFFF' }}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400">
                  <FileX className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] uppercase font-mono font-extrabold tracking-wider" style={{ color: '#FB923C' }}>
                  03 • Revenue Leakage
                </span>
              </div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: '#FFFFFF' }}>
                Handwritten bills that don't tally
              </h3>
              <p className="text-[11px] leading-relaxed font-normal mb-3" style={{ color: '#F5E9DD' }}>
                Staff calculate totals in a hurry, discounts aren't recorded, and end-of-day register cash never matches your actual sales.
              </p>
            </div>
            <div className="flex items-start gap-1.5 text-[10.5px] font-medium pt-2.5" style={{ borderTop: '1px solid #5A3A28', color: '#FAF4ED' }}>
              <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />
              <span className="leading-snug">Solved with 3-touch GST billing &amp; automated register audits</span>
            </div>
          </div>

          {/* Card 4: Owner Burnout */}
          <div
            className="rounded-card-lg p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-card hover:shadow-elevated group min-h-[220px]"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FFFFFF' }}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] uppercase font-mono font-extrabold tracking-wider" style={{ color: '#FB923C' }}>
                  04 • Owner Burnout
                </span>
              </div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: '#FFFFFF' }}>
                Stuck behind the billing counter
              </h3>
              <p className="text-[11px] leading-relaxed font-normal mb-3" style={{ color: '#F5E9DD' }}>
                Instead of talking to guests, training staff, and growing the brand, you spend all evening resolving billing mistakes.
              </p>
            </div>
            <div className="flex items-start gap-1.5 text-[10.5px] font-medium pt-2.5" style={{ borderTop: '1px solid #5A3A28', color: '#FAF4ED' }}>
              <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />
              <span className="leading-snug">Solved with hands-free cashier workflows &amp; live mobile reports</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

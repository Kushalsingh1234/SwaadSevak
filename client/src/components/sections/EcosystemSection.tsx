import React from 'react';
import { ArrowRight, Monitor, ShoppingBag, Boxes, Globe, Check } from 'lucide-react';
import { SITE_CONTENT } from '../../content/site';

export const EcosystemSection: React.FC = () => {
  return (
    <section id="ecosystem" className="py-12 sm:py-16 bg-white text-espresso font-sans border-b border-sand-200">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-100 border border-sand-200 text-xs font-semibold text-espresso shadow-soft mb-3">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Complete Ecosystem</span>
          </div>
          <h2 className="h2-fluid font-extrabold text-espresso tracking-tight mb-3">
            Four Modular Engines to Run Your Entire Food Business
          </h2>
          <p className="text-sm sm:text-base text-bodyText leading-relaxed">
            Everything connects seamlessly. Use one module or use them all without messy third-party integrations.
          </p>
        </div>

        {/* 2x2 Grid of Sand-Tinted Product Cards with layered mini-UI collages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Card 1: SwaadSevak POS (KOT and bill) */}
          <div className="bg-sand-100/70 border border-sand-200 rounded-card-lg p-5 sm:p-6 flex flex-col justify-between hover:shadow-card transition-all duration-200 group">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8.5 h-8.5 rounded-xl bg-orange-500 text-espresso-950 flex items-center justify-center font-bold">
                  <Monitor className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-espresso">SwaadSevak POS</h3>
                  <span className="text-[11px] font-mono text-orange-dark font-bold">Fast Counter Billing &amp; KOT</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-bodyText leading-relaxed mb-4">
                3-touch checkout, dynamic table floor plans, split payments, and thermal KOT routing by kitchen station.
              </p>
            </div>

            {/* Mini UI Collage: Bill & KOT Tickets */}
            <div className="bg-white rounded-2xl p-4 border border-sand-200 shadow-soft relative overflow-hidden flex flex-col sm:flex-row gap-4 items-center">
              {/* Receipt slip left */}
              <div className="w-full sm:w-1/2 bg-cream rounded-xl p-3 border border-sand-200 text-left text-xs font-mono space-y-1">
                <div className="flex justify-between font-bold text-espresso border-b border-sand-200 pb-1">
                  <span>TAX INVOICE</span>
                  <span>#1042</span>
                </div>
                <div className="text-[11px] text-bodyText flex justify-between pt-1">
                  <span>1x Paneer Butter Masala</span>
                  <span>₹340</span>
                </div>
                <div className="text-[11px] text-bodyText flex justify-between">
                  <span>2x Butter Garlic Naan</span>
                  <span>₹160</span>
                </div>
                <div className="text-[11px] text-espresso font-bold flex justify-between border-t border-sand-200 pt-1">
                  <span>Total (incl. 5% GST)</span>
                  <span className="text-orange-dark">₹525</span>
                </div>
              </div>

              {/* KOT slip right */}
              <div className="w-full sm:w-1/2 bg-espresso text-white rounded-xl p-3 text-left text-xs font-mono space-y-1">
                <div className="flex justify-between font-bold text-orange-400 border-b border-walnut pb-1">
                  <span>KOT: T-04</span>
                  <span>19:42 PM</span>
                </div>
                <div className="text-[11px] text-sand-100 pt-1">
                  <span className="font-bold text-white">2x</span> Butter Garlic Naan [Crispy]
                </div>
                <div className="text-[11px] text-sand-100">
                  <span className="font-bold text-white">1x</span> Paneer Butter Masala [Medium]
                </div>
                <div className="text-[9px] text-success pt-1 font-sans font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Fired to Tandoor Station
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Online Orders Hub */}
          <div className="bg-sand-100/70 border border-sand-200 rounded-card-lg p-5 sm:p-6 flex flex-col justify-between hover:shadow-card transition-all duration-200 group">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8.5 h-8.5 rounded-xl bg-orange-500 text-espresso-950 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-espresso">Online Orders Hub</h3>
                  <span className="text-[11px] font-mono text-orange-dark font-bold">Zomato, Swiggy &amp; ONDC Sync</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-bodyText leading-relaxed mb-4">
                Auto-accept food orders on one kitchen screen without juggling five separate aggregator tablets.
              </p>
            </div>

            {/* Mini UI Collage: Aggregator Cards */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-sand-200 shadow-soft space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-cream border border-sand-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  <span className="font-bold text-espresso text-[11px] sm:text-xs">Zomato Order #892</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-dark font-bold">AUTO-ACCEPTED</span>
                </div>
                <span className="font-mono font-bold text-espresso text-xs">₹680</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-cream border border-sand-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span className="font-bold text-espresso text-[11px] sm:text-xs">Swiggy Order #410</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-success/20 text-success font-bold">FOOD READY</span>
                </div>
                <span className="font-mono font-bold text-espresso text-xs">₹495</span>
              </div>
            </div>
          </div>

          {/* Card 3: Inventory and Stock */}
          <div className="bg-sand-100/70 border border-sand-200 rounded-card-lg p-5 sm:p-6 flex flex-col justify-between hover:shadow-card transition-all duration-200 group">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8.5 h-8.5 rounded-xl bg-orange-500 text-espresso-950 flex items-center justify-center font-bold">
                  <Boxes className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-espresso">Inventory &amp; Stock</h3>
                  <span className="text-[11px] font-mono text-orange-dark font-bold">Automated Recipe Deductions</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-bodyText leading-relaxed mb-4">
                Prevent kitchen pilferage and stockouts with automated recipe-level consumption tracking and purchase alerts.
              </p>
            </div>

            {/* Mini UI Collage: Stock deduction bars */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-sand-200 shadow-soft space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-medium text-espresso mb-1 text-[11px]">
                  <span>Paneer Blocks (Fresh Dairy)</span>
                  <span className="font-mono font-bold text-orange-dark">4.2 kg left (Low Stock)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-sand-200 overflow-hidden">
                  <div className="w-[30%] h-full bg-orange-500 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-medium text-espresso mb-1 text-[11px]">
                  <span>Basmati Rice (Daily Raw)</span>
                  <span className="font-mono font-bold text-success">38 kg left</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-sand-200 overflow-hidden">
                  <div className="w-[75%] h-full bg-success rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Restaurant Website */}
          <div className="bg-sand-100/70 border border-sand-200 rounded-card-lg p-5 sm:p-6 flex flex-col justify-between hover:shadow-card transition-all duration-200 group">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8.5 h-8.5 rounded-xl bg-orange-500 text-espresso-950 flex items-center justify-center font-bold">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-espresso">Restaurant Website</h3>
                  <span className="text-[11px] font-mono text-orange-dark font-bold">0% Commission Direct Orders</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-bodyText leading-relaxed mb-4">
                Custom branded digital menu with 1-tap WhatsApp ordering. We provide custom scope, quote and timeline within 24 hours.
              </p>
            </div>

            {/* Mini UI Collage: Phone Preview with WhatsApp button */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-sand-200 shadow-soft flex items-center justify-between gap-3">
              <div className="text-left text-xs space-y-0.5">
                <span className="font-bold text-espresso block text-xs">yourbrand.com</span>
                <span className="text-bodyText text-[10px] block">Digital Menu • SEO • Direct UPI</span>
                <span className="text-[9px] font-mono text-success font-bold">0% Aggregator Commission</span>
              </div>
              <a
                href={SITE_CONTENT.links.websiteInquiry}
                className="px-3.5 py-1.5 rounded-xl bg-espresso text-white text-xs font-bold hover:bg-orange-500 hover:text-espresso-950 transition-colors shrink-0"
              >
                Get 24h Quote
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

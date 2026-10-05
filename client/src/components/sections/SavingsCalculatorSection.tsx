import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { SITE_CONTENT } from '../../content/site';
import { formatINR } from '../../lib/utils';
import { trackEvent } from '../../lib/analytics';
import { Calculator, ArrowRight, TrendingUp } from 'lucide-react';

export const SavingsCalculatorSection: React.FC = () => {
  const { t } = useTranslation();
  const defaults = SITE_CONTENT.calculatorDefaults;

  const [outlets, setOutlets] = useState<number>(defaults.outlets);
  const [monthlyOrders, setMonthlyOrders] = useState<number>(defaults.monthlyOrders);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(defaults.averageOrderValue);
  const [commissionPct, setCommissionPct] = useState<number>(defaults.aggregatorCommissionPct);
  const [wastagePct, setWastagePct] = useState<number>(defaults.wastagePct);

  // Formula Calculation
  // 1. Total monthly gross volume
  const totalGrossVolume = outlets * monthlyOrders * avgOrderValue;

  // 2. Direct channel shift: assuming 25% of aggregator orders shift to direct WhatsApp / QR (0% commission)
  const directShiftPct = 0.25;
  const directShiftOrders = monthlyOrders * (defaults.aggregatorSharePct / 100) * directShiftPct;
  const monthlyCommissionSavings = outlets * directShiftOrders * avgOrderValue * (commissionPct / 100);

  // 3. Raw ingredient recipe auto-deduction savings: 45% recovery of food wastage loss (assuming 35% food cost)
  const wastageRecoveryPct = wastagePct * 0.45;
  const monthlyInventorySavings = totalGrossVolume * 0.35 * (wastageRecoveryPct / 100);

  const totalMonthlySavings = Math.round(monthlyCommissionSavings + monthlyInventorySavings);
  const totalAnnualSavings = totalMonthlySavings * 12;

  const handleSliderChange = (name: string, value: number) => {
    trackEvent('savings_calculator_slide', { slider: name, value });
  };

  return (
    <section id="savings-calculator" className="py-20 sm:py-28 font-sans bg-white text-espresso border-b border-sand-200">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-100 border border-sand-200 text-xs font-semibold text-espresso shadow-soft mb-4">
            <Calculator className="w-3.5 h-3.5 text-orange-500" />
            <span>ROI Calculator</span>
          </div>
          <h2 className="h2-fluid font-extrabold text-espresso tracking-tight mb-4">
            Estimate Your Monthly Bottom-Line Savings
          </h2>
          <p className="text-base sm:text-lg text-bodyText leading-relaxed">
            See how much you recover by reducing aggregator commission cuts and tracking recipe-level ingredient pilferage.
          </p>
        </div>

        {/* 2-Column Grid: Sliders Left (7 Cols), Result Card Right (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
          
          {/* Sliders Container (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-card-lg bg-sand-50/70 border border-sand-200 shadow-soft space-y-6 flex flex-col justify-between">
            
            {/* Outlets */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="outlets-slider" className="text-xs sm:text-sm font-bold text-espresso">
                  Number of Outlets / Kitchens
                </label>
                <span className="font-mono font-bold text-sm sm:text-base text-orange-dark">
                  {outlets} {outlets === 1 ? 'Outlet' : 'Outlets'}
                </span>
              </div>
              <input
                id="outlets-slider"
                type="range"
                min="1"
                max="15"
                step="1"
                value={outlets}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setOutlets(val);
                  handleSliderChange('outlets', val);
                }}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-sand-200 rounded-lg"
              />
            </div>

            {/* Monthly Online Orders */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="orders-slider" className="text-xs sm:text-sm font-bold text-espresso">
                  Monthly Online &amp; Delivery Orders per Outlet
                </label>
                <span className="font-mono font-bold text-sm sm:text-base text-orange-dark">
                  {monthlyOrders.toLocaleString()} orders
                </span>
              </div>
              <input
                id="orders-slider"
                type="range"
                min="300"
                max="8000"
                step="100"
                value={monthlyOrders}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMonthlyOrders(val);
                  handleSliderChange('monthlyOrders', val);
                }}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-sand-200 rounded-lg"
              />
            </div>

            {/* Average Order Value */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="aov-slider" className="text-xs sm:text-sm font-bold text-espresso">
                  Average Order Value (AOV)
                </label>
                <span className="font-mono font-bold text-sm sm:text-base text-orange-dark">
                  {formatINR(avgOrderValue)}
                </span>
              </div>
              <input
                id="aov-slider"
                type="range"
                min="150"
                max="1500"
                step="25"
                value={avgOrderValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAvgOrderValue(val);
                  handleSliderChange('avgOrderValue', val);
                }}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-sand-200 rounded-lg"
              />
            </div>

            {/* Average Aggregator Commission % */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="commission-slider" className="text-xs sm:text-sm font-bold text-espresso">
                  Average Aggregator Commission %
                </label>
                <span className="font-mono font-bold text-sm sm:text-base text-orange-dark">
                  {commissionPct}%
                </span>
              </div>
              <input
                id="commission-slider"
                type="range"
                min="15"
                max="32"
                step="1"
                value={commissionPct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCommissionPct(val);
                  handleSliderChange('commissionPct', val);
                }}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-sand-200 rounded-lg"
              />
            </div>

            {/* Estimated Stock Wastage % */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="wastage-slider" className="text-xs sm:text-sm font-bold text-espresso">
                  Estimated Food &amp; Recipe Wastage %
                </label>
                <span className="font-mono font-bold text-sm sm:text-base text-orange-dark">
                  {wastagePct}%
                </span>
              </div>
              <input
                id="wastage-slider"
                type="range"
                min="2"
                max="15"
                step="1"
                value={wastagePct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWastagePct(val);
                  handleSliderChange('wastagePct', val);
                }}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-sand-200 rounded-lg"
              />
            </div>

          </div>

          {/* Result Card (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-card-lg bg-espresso text-white flex flex-col justify-between shadow-elevated border border-walnut">
            <div>
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-orange-400 block mb-2">
                Estimated Monthly Bottom-Line Gain
              </span>
              <div className="font-mono font-extrabold text-4xl sm:text-5xl text-white tracking-tight mb-2">
                {formatINR(totalMonthlySavings)}
                <span className="text-base text-sand-300 font-sans font-normal"> / mo</span>
              </div>
              <div className="font-mono text-sm text-sand-200 font-semibold mb-6">
                ≈ {formatINR(totalAnnualSavings)} estimated per year
              </div>

              {/* Savings Breakdown */}
              <div className="space-y-3 pt-6 border-t border-walnut text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-sand-200">Direct ordering commission recovered:</span>
                  <span className="font-mono font-bold text-orange-400">+{formatINR(Math.round(monthlyCommissionSavings))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sand-200">Recipe deduction shrinkage prevented:</span>
                  <span className="font-mono font-bold text-success">+{formatINR(Math.round(monthlyInventorySavings))}</span>
                </div>
              </div>
            </div>

            {/* Visible Formula Explanation */}
            <div className="pt-6 mt-6 border-t border-walnut">
              <div className="text-[11px] text-sand-300 leading-relaxed font-mono">
                <span className="font-bold text-sand-100 block mb-1">Formula &amp; Assumptions:</span>
                • Assumes 25% delivery volume shifted to direct 0% commission channels.
                • Assumes 45% reduction in raw material shrinkage via auto recipe deduction.
              </div>
              <div className="pt-4">
                <a
                  href={SITE_CONTENT.links.demo}
                  className="btn-shine w-full py-3 rounded-xl bg-orange-500 text-espresso font-bold text-xs hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                >
                  <span>Claim Your Free Demo &amp; Setup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

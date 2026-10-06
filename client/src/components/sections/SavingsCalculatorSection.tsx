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
    <section id="calculator" className="py-8 sm:py-12 font-sans text-espresso relative overflow-hidden" style={{ backgroundColor: '#FFF8F1' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-5 sm:mb-7">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-espresso shadow-soft mb-2"
            style={{ backgroundColor: '#EFE2D3', border: '1px solid #D8C2AC' }}
          >
            <Calculator className="w-3.5 h-3.5 text-orange-600" />
            <span>ROI Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-espresso tracking-tight mb-2">
            Estimate Your Monthly Bottom-Line Savings
          </h2>
          <p className="text-xs sm:text-[13px] text-[#5A3A28] leading-relaxed">
            See how much you recover by reducing aggregator commission cuts and tracking recipe-level ingredient pilferage.
          </p>
        </div>

        {/* 2-Column Grid: Sliders Left (7 Cols), Result Card Right (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4.5 sm:gap-5 items-stretch text-left">
          
          {/* Sliders Container (7 Cols) */}
          <div
            className="lg:col-span-7 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-[0_12px_36px_-6px_rgba(43,26,18,0.08)] space-y-3.5 flex flex-col justify-between"
            style={{ backgroundColor: '#FAF4ED', border: '1px solid #D8C2AC' }}
          >
            {/* Outlets */}
            <div>
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="outlets-slider" className="text-xs font-bold text-espresso">
                  Number of Outlets / Kitchens
                </label>
                <span className="font-mono font-bold text-xs text-orange-dark">
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
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-sand-200 rounded-lg"
              />
            </div>

            {/* Monthly Online Orders */}
            <div>
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="orders-slider" className="text-xs font-bold text-espresso">
                  Monthly Online &amp; Delivery Orders per Outlet
                </label>
                <span className="font-mono font-bold text-xs text-orange-dark">
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
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-sand-200 rounded-lg"
              />
            </div>

            {/* Average Order Value */}
            <div>
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="aov-slider" className="text-xs font-bold text-espresso">
                  Average Order Value (AOV)
                </label>
                <span className="font-mono font-bold text-xs text-orange-dark">
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
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-sand-200 rounded-lg"
              />
            </div>

            {/* Average Aggregator Commission % */}
            <div>
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="commission-slider" className="text-xs font-bold text-espresso">
                  Average Aggregator Commission %
                </label>
                <span className="font-mono font-bold text-xs text-orange-dark">
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
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-sand-200 rounded-lg"
              />
            </div>

            {/* Estimated Stock Wastage % */}
            <div>
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="wastage-slider" className="text-xs font-bold text-espresso">
                  Estimated Food &amp; Recipe Wastage %
                </label>
                <span className="font-mono font-bold text-xs text-orange-dark">
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
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-sand-200 rounded-lg"
              />
            </div>

          </div>

          {/* Result Card (5 Cols) with Curved Corners */}
          <div
            className="lg:col-span-5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-white flex flex-col justify-between shadow-[0_16px_40px_-8px_rgba(43,26,18,0.35)] relative overflow-hidden"
            style={{ backgroundColor: '#2B1A12', border: '1px solid #5A3A28' }}
          >
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-orange-400 block mb-1">
                Estimated Monthly Bottom-Line Gain
              </span>
              <div className="font-mono font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-0.5">
                {formatINR(totalMonthlySavings)}
                <span className="text-xs text-[#F5E9DD]/80 font-sans font-medium"> / mo</span>
              </div>
              <div className="font-mono text-[11px] text-[#C4A895] font-semibold mb-3">
                ≈ {formatINR(totalAnnualSavings)} estimated per year
              </div>

              {/* Savings Breakdown */}
              <div className="space-y-1.5 pt-3 border-t border-[#5A3A28] text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#E8D5C4] font-medium">Direct ordering commission:</span>
                  <span className="font-mono font-bold text-orange-400">+{formatINR(Math.round(monthlyCommissionSavings))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#E8D5C4] font-medium">Recipe shrinkage prevented:</span>
                  <span className="font-mono font-bold text-emerald-400">+{formatINR(Math.round(monthlyInventorySavings))}</span>
                </div>
              </div>
            </div>

            {/* Visible Formula Explanation */}
            <div className="pt-3 mt-3 border-t border-[#5A3A28]">
              <div className="text-[9.5px] sm:text-[10.5px] text-[#C4A895] leading-relaxed font-mono font-medium">
                <span className="font-bold text-white block mb-0.5">Formula &amp; Assumptions:</span>
                • Assumes 25% delivery volume shifted to direct 0% commission channels.
                • Assumes 45% reduction in raw material shrinkage via auto recipe deduction.
              </div>
              <div className="pt-3">
                <a
                  href={SITE_CONTENT.links.demo}
                  className="btn-shine w-full py-2.5 rounded-xl sm:rounded-2xl bg-orange-500 text-espresso font-extrabold text-xs sm:text-sm hover:bg-orange-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(249,115,22,0.4)] hover:scale-[1.02] active:scale-[0.98]"
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

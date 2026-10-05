import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { SITE_CONTENT } from '../../content/site';
import { formatINR } from '../../lib/utils';
import { trackEvent } from '../../lib/analytics';
import { Badge } from '../ui/Badge';
import { ReceiptCard } from '../ui/ReceiptCard';
import { Calculator, TrendingUp, Info, HelpCircle } from 'lucide-react';

export const SavingsCalculatorSection: React.FC = () => {
  const { t } = useTranslation();

  const defaults = SITE_CONTENT.calculatorDefaults;

  const [outlets, setOutlets] = useState<number>(defaults.outlets);
  const [monthlyOrders, setMonthlyOrders] = useState<number>(defaults.monthlyOrders);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(defaults.averageOrderValue);
  const [commissionPct, setCommissionPct] = useState<number>(defaults.aggregatorCommissionPct);
  const [wastagePct, setWastagePct] = useState<number>(defaults.wastagePct);

  // Mathematical Calculation Logic
  // 1. Total monthly gross revenue across outlets = outlets * monthlyOrders * avgOrderValue
  const totalMonthlyRevenue = outlets * monthlyOrders * avgOrderValue;

  // 2. Direct order commission savings:
  // Assuming 25% of aggregator orders shift to direct 24h website / WhatsApp / table QR ordering
  const directShiftPct = 0.25;
  const directShiftOrders = (monthlyOrders * (defaults.aggregatorSharePct / 100)) * directShiftPct;
  const commissionSavedMonthly = outlets * directShiftOrders * avgOrderValue * (commissionPct / 100);

  // 3. Raw ingredient recipe auto-deduction savings:
  // SwaadSevak typically reduces food shrinkage and ingredient pilferage by ~50% of the wastage rate
  const wastageRecoveredPct = wastagePct * 0.45; // 45% recovery of food waste
  const inventorySavedMonthly = (totalMonthlyRevenue * 0.35) * (wastageRecoveredPct / 100); // 35% assumed food cost

  const totalMonthlySavings = Math.round(commissionSavedMonthly + inventorySavedMonthly);
  const totalAnnualSavings = totalMonthlySavings * 12;

  const handleSliderChange = (name: string, value: number) => {
    trackEvent('savings_calculator_slide', { slider: name, value });
  };

  return (
    <section id="savings-calculator" className="py-16 sm:py-24 font-sans bg-cream-50 dark:bg-maroon-950/30">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="curry" className="mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.calculator.badge}</span>
          </Badge>
          <h2 className="h2-fluid font-serif font-bold text-maroon-950 dark:text-cream-50 mb-4">
            {t.calculator.title}
          </h2>
          <p className="text-sm sm:text-base text-maroon-900/80 dark:text-cream-200/80 leading-relaxed">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* Calculator Grid: Sliders on Left, Dynamic Output Receipt on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Container (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm space-y-6 text-left">
            
            {/* Slider 1: Outlets */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="outlets-slider" className="text-xs sm:text-sm font-bold text-maroon-950 dark:text-cream-50">
                  {t.calculator.outletsLabel}
                </label>
                <span className="font-mono font-bold text-base text-saffron-600 dark:text-saffron-400">
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
                className="w-full accent-saffron-500 cursor-pointer h-2 bg-cream-200 dark:bg-maroon-900 rounded-lg"
              />
            </div>

            {/* Slider 2: Monthly Orders per outlet */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="orders-slider" className="text-xs sm:text-sm font-bold text-maroon-950 dark:text-cream-50">
                  {t.calculator.ordersLabel} (per outlet)
                </label>
                <span className="font-mono font-bold text-base text-saffron-600 dark:text-saffron-400">
                  {monthlyOrders.toLocaleString()} orders
                </span>
              </div>
              <input
                id="orders-slider"
                type="range"
                min="300"
                max="6000"
                step="100"
                value={monthlyOrders}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMonthlyOrders(val);
                  handleSliderChange('monthlyOrders', val);
                }}
                className="w-full accent-saffron-500 cursor-pointer h-2 bg-cream-200 dark:bg-maroon-900 rounded-lg"
              />
            </div>

            {/* Slider 3: Average Order Value */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="aov-slider" className="text-xs sm:text-sm font-bold text-maroon-950 dark:text-cream-50">
                  Average Order Value (AOV)
                </label>
                <span className="font-mono font-bold text-base text-saffron-600 dark:text-saffron-400">
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
                className="w-full accent-saffron-500 cursor-pointer h-2 bg-cream-200 dark:bg-maroon-900 rounded-lg"
              />
            </div>

            {/* Slider 4: Aggregator Commission % */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="commission-slider" className="text-xs sm:text-sm font-bold text-maroon-950 dark:text-cream-50">
                  {t.calculator.commissionLabel}
                </label>
                <span className="font-mono font-bold text-base text-saffron-600 dark:text-saffron-400">
                  {commissionPct}%
                </span>
              </div>
              <input
                id="commission-slider"
                type="range"
                min="16"
                max="32"
                step="1"
                value={commissionPct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCommissionPct(val);
                  handleSliderChange('commissionPct', val);
                }}
                className="w-full accent-saffron-500 cursor-pointer h-2 bg-cream-200 dark:bg-maroon-900 rounded-lg"
              />
            </div>

            {/* Slider 5: Food Wastage % */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="wastage-slider" className="text-xs sm:text-sm font-bold text-maroon-950 dark:text-cream-50">
                  {t.calculator.wastageLabel}
                </label>
                <span className="font-mono font-bold text-base text-saffron-600 dark:text-saffron-400">
                  {wastagePct}%
                </span>
              </div>
              <input
                id="wastage-slider"
                type="range"
                min="2"
                max="12"
                step="1"
                value={wastagePct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWastagePct(val);
                  handleSliderChange('wastagePct', val);
                }}
                className="w-full accent-saffron-500 cursor-pointer h-2 bg-cream-200 dark:bg-maroon-900 rounded-lg"
              />
            </div>

          </div>

          {/* Dynamic Savings Output Receipt (Right 5 Cols) */}
          <div className="lg:col-span-5">
            <ReceiptCard
              sawtooth="both"
              ticketNumber="SIMULATION #ROI"
              ticketType="ESTIMATED SAVINGS"
              ticketTime="Formula Verified"
              className="p-6 sm:p-8 border-2 border-curry-500/40 shadow-receipt-lg text-left"
            >
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-receipt-faint uppercase tracking-wider block mb-1">
                    {t.calculator.estimatedSavings}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif font-bold text-3xl sm:text-4xl text-curry-600 dark:text-curry-400">
                      {formatINR(totalMonthlySavings)}
                    </span>
                    <span className="text-xs text-maroon-800/80 dark:text-cream-300 font-sans">
                      {t.calculator.perMonth}
                    </span>
                  </div>
                  <span className="block text-xs font-semibold text-saffron-700 dark:text-saffron-300 mt-1">
                    ≈ {formatINR(totalAnnualSavings)} {t.calculator.perYear}
                  </span>
                </div>

                <div className="receipt-tear-line w-full" />

                {/* Breakdown Items */}
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span>Direct WhatsApp & 24h Web Shift:</span>
                    <span className="font-bold text-curry-600">+{formatINR(Math.round(commissionSavedMonthly))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recipe Inventory Loss Reduction:</span>
                    <span className="font-bold text-curry-600">+{formatINR(Math.round(inventorySavedMonthly))}</span>
                  </div>
                  <div className="flex justify-between text-receipt-faint pt-1 border-t border-dashed">
                    <span>Monthly Software Subscription Cost:</span>
                    <span className="text-red-500 font-bold">-₹2,199 (Growth)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cream-100 dark:bg-maroon-900/40 text-[10px] font-sans leading-relaxed text-maroon-800/80 dark:text-cream-300">
                  <span className="font-bold block mb-0.5">{t.calculator.formulaTitle}</span>
                  Calculated based on a 25% shift of aggregator traffic to direct channels (0% commission) + 45% reduction in recipe food wastage. Illustrative estimate based on user-adjusted inputs.
                </div>
              </div>
            </ReceiptCard>
          </div>

        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { SITE_CONTENT } from '../../content/site';
import { formatINR } from '../../lib/utils';
import { trackEvent } from '../../lib/analytics';
import { Badge } from '../ui/Badge';
import { Calculator, HelpCircle } from 'lucide-react';

export const SavingsCalculatorSection: React.FC = () => {
  const { t } = useTranslation();
  const defaults = SITE_CONTENT.calculatorDefaults;

  const [outlets, setOutlets] = useState<number>(defaults.outlets);
  const [monthlyOrders, setMonthlyOrders] = useState<number>(defaults.monthlyOrders);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(defaults.averageOrderValue);
  const [commissionPct, setCommissionPct] = useState<number>(defaults.aggregatorCommissionPct);
  const [wastagePct, setWastagePct] = useState<number>(defaults.wastagePct);

  // Formula Calculation
  // 1. Total monthly gross order volume
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
    <section id="savings-calculator" className="py-16 sm:py-24 font-sans bg-white dark:bg-ink-950">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="indigo" className="mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.calculator.badge}</span>
          </Badge>
          <h2 className="h2-fluid font-bold text-ink-950 dark:text-ink-50 mb-3">
            {t.calculator.title}
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          {/* Sliders (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-ink-50/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-soft space-y-6">
            
            {/* Outlets */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="outlets-slider" className="text-xs sm:text-sm font-bold text-ink-900 dark:text-ink-100">
                  {t.calculator.outletsLabel}
                </label>
                <span className="font-mono font-bold text-sm sm:text-base text-ember-600 dark:text-ember-400">
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
                className="w-full accent-ember-500 cursor-pointer h-2 bg-ink-200 dark:bg-ink-800 rounded-lg"
              />
            </div>

            {/* Monthly Online Orders */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="orders-slider" className="text-xs sm:text-sm font-bold text-ink-900 dark:text-ink-100">
                  {t.calculator.ordersLabel}
                </label>
                <span className="font-mono font-bold text-sm sm:text-base text-ember-600 dark:text-ember-400">
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
                className="w-full accent-ember-500 cursor-pointer h-2 bg-ink-200 dark:bg-ink-800 rounded-lg"
              />
            </div>

            {/* Average Order Value */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="aov-slider" className="text-xs sm:text-sm font-bold text-ink-900 dark:text-ink-100">
                  Average Order Value (AOV)
                </label>
                <span className="font-mono font-bold text-sm sm:text-base text-ember-600 dark:text-ember-400">
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
                className="w-full accent-ember-500 cursor-pointer h-2 bg-ink-200 dark:bg-ink-800 rounded-lg"
              />
            </div>

            {/* Aggregator Commission */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="commission-slider" className="text-xs sm:text-sm font-bold text-ink-900 dark:text-ink-100">
                  {t.calculator.commissionLabel}
                </label>
                <span className="font-mono font-bold text-sm sm:text-base text-ember-600 dark:text-ember-400">
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
                className="w-full accent-ember-500 cursor-pointer h-2 bg-ink-200 dark:bg-ink-800 rounded-lg"
              />
            </div>

            {/* Food Wastage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="wastage-slider" className="text-xs sm:text-sm font-bold text-ink-900 dark:text-ink-100">
                  {t.calculator.wastageLabel}
                </label>
                <span className="font-mono font-bold text-sm sm:text-base text-ember-600 dark:text-ember-400">
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
                className="w-full accent-ember-500 cursor-pointer h-2 bg-ink-200 dark:bg-ink-800 rounded-lg"
              />
            </div>

          </div>

          {/* Dynamic Savings Card (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-ink-400 block mb-1">
                  {t.calculator.estimatedSavings}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-bold text-3xl sm:text-4xl text-ink-950 dark:text-ink-50">
                    {formatINR(totalMonthlySavings)}
                  </span>
                  <span className="text-xs text-ink-500 font-mono">
                    {t.calculator.perMonth}
                  </span>
                </div>
                <span className="block text-xs font-semibold text-ember-600 dark:text-ember-400 mt-1">
                  ≈ {formatINR(totalAnnualSavings)} {t.calculator.perYear}
                </span>
              </div>

              <div className="pt-4 border-t border-ink-100 dark:border-ink-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-ink-500">Direct WhatsApp & QR Shift:</span>
                  <span className="font-bold text-success-600">+{formatINR(Math.round(monthlyCommissionSavings))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Recipe Inventory Shrinkage Cut:</span>
                  <span className="font-bold text-success-600">+{formatINR(Math.round(monthlyInventorySavings))}</span>
                </div>
                <div className="flex justify-between text-ink-400 pt-1 border-t border-ink-100 dark:border-ink-800">
                  <span>Growth Plan Cost:</span>
                  <span className="text-danger-600 font-bold">-₹2,199 / mo</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950/60 text-[10px] font-mono leading-relaxed text-ink-500">
                <span className="font-bold block mb-0.5">{t.calculator.formulaTitle}</span>
                Estimated based on a 25% shift of aggregator volume to direct 0% commission channels + 45% reduction in recipe food wastage. Illustrative estimate based on user-selected inputs.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

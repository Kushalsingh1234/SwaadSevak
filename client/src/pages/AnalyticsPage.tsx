import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  IndianRupee,
  UtensilsCrossed,
  Clock,
  Calendar,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  RefreshCw,
  QrCode,
  Flame,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  Layers,
  Award
} from 'lucide-react';
import { Restaurant, Manager, AnalyticsData, AnalyticsQueryOptions } from '../types';
import { api } from '../services/api';
import { downloadAnalyticsPdf } from '../utils/analyticsPdf';
import { VegIcon } from '../components/VegIcon';

interface AnalyticsPageProps {
  restaurant: Restaurant | null;
  manager: Manager | null;
  onNavigateTab?: (tab: string) => void;
}

type RangeOption = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'custom';

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  restaurant,
  manager,
  onNavigateTab
}) => {
  const [selectedRange, setSelectedRange] = useState<RangeOption>('last7days');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [isCustomPickerOpen, setIsCustomPickerOpen] = useState<boolean>(false);

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // View toggles
  const [trendMetric, setTrendMetric] = useState<'sales' | 'orders'>('sales');
  const [topItemsTab, setTopItemsTab] = useState<'quantity' | 'revenue'>('quantity');
  const [isDetailedTableOpen, setIsDetailedTableOpen] = useState<boolean>(false);
  const [tableSortBy, setTableSortBy] = useState<'quantity' | 'revenue' | 'name'>('quantity');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingCsv, setIsExportingCsv] = useState<boolean>(false);

  // Hover state for interactive SVG trend chart
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedRange]);

  const fetchAnalytics = async (customOptions?: { startDate?: string; endDate?: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      const params: AnalyticsQueryOptions = {
        range: selectedRange,
        startDate: customOptions?.startDate || (selectedRange === 'custom' ? customStartDate : undefined),
        endDate: customOptions?.endDate || (selectedRange === 'custom' ? customEndDate : undefined)
      };

      const res = await api.getAnalytics(params);
      if (res.success && res.analytics) {
        setAnalytics(res.analytics);
      } else {
        setError('Could not retrieve analytics data.');
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err?.message || 'Failed to load restaurant analytics.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalytics();
  };

  const handleApplyCustomRange = async () => {
    if (!customStartDate || !customEndDate) {
      alert('Please select both Start Date and End Date.');
      return;
    }
    if (new Date(customStartDate) > new Date(customEndDate)) {
      alert('Start Date cannot be after End Date.');
      return;
    }
    setSelectedRange('custom');
    setIsCustomPickerOpen(false);
    await fetchAnalytics({ startDate: customStartDate, endDate: customEndDate });
  };

  const handleExportPdf = async () => {
    if (!analytics) return;
    try {
      setIsExportingPdf(true);
      setIsExportMenuOpen(false);
      await downloadAnalyticsPdf(analytics, restaurant);
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Failed to generate PDF report.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setIsExportingCsv(true);
      setIsExportMenuOpen(false);
      await api.downloadAnalyticsCsv({
        range: selectedRange,
        startDate: selectedRange === 'custom' ? customStartDate : undefined,
        endDate: selectedRange === 'custom' ? customEndDate : undefined
      });
    } catch (e) {
      console.error('CSV export error:', e);
      alert('Failed to export CSV.');
    } finally {
      setIsExportingCsv(false);
    }
  };

  const formatCurrency = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  // Helper for trend chart coordinates
  const trendPoints = useMemo(() => {
    if (!analytics || !analytics.salesTrend.data.length) return [];
    const data = analytics.salesTrend.data;
    const maxVal = Math.max(1, ...data.map(d => trendMetric === 'sales' ? d.sales : d.orders));
    return data.map((d, index) => {
      const val = trendMetric === 'sales' ? d.sales : d.orders;
      const xPercent = (index / (data.length - 1 || 1)) * 100;
      const yPercent = 100 - (val / maxVal) * 85 - 8; // Leave margin top/bottom
      return { xPercent, yPercent, val, item: d, index };
    });
  }, [analytics, trendMetric]);

  // Max peak hour
  const maxPeakHour = useMemo(() => {
    if (!analytics || !analytics.peakHours.hourlyData.length) return 1;
    return Math.max(1, ...analytics.peakHours.hourlyData.map(h => h.orders));
  }, [analytics]);

  // Sorted items for detailed table
  const sortedDetailedItems = useMemo(() => {
    if (!analytics) return [];
    const items = [...analytics.itemPerformance.items];
    if (tableSortBy === 'quantity') return items.sort((a, b) => b.quantitySold - a.quantitySold);
    if (tableSortBy === 'revenue') return items.sort((a, b) => b.revenue - a.revenue);
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [analytics, tableSortBy]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Header & Controls */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-brand-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analytics</h1>
              <p className="text-xs text-slate-500">
                Understand your restaurant's performance, sales and customer ordering patterns.
              </p>
            </div>
          </div>
        </div>

        {/* Date Selector & Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons for Quick Switching */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => { setSelectedRange('today'); setIsCustomPickerOpen(false); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${selectedRange === 'today' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              Today
            </button>
            <button
              onClick={() => { setSelectedRange('yesterday'); setIsCustomPickerOpen(false); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${selectedRange === 'yesterday' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              Yesterday
            </button>
            <button
              onClick={() => { setSelectedRange('last7days'); setIsCustomPickerOpen(false); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${selectedRange === 'last7days' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => { setSelectedRange('last30days'); setIsCustomPickerOpen(false); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${selectedRange === 'last30days' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => { setSelectedRange('thisMonth'); setIsCustomPickerOpen(false); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${selectedRange === 'thisMonth' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              This Month
            </button>
            <button
              onClick={() => setIsCustomPickerOpen(!isCustomPickerOpen)}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap shrink-0 cursor-pointer ${selectedRange === 'custom' || isCustomPickerOpen ? 'bg-white text-brand-600 shadow-xs font-bold' : 'hover:text-slate-900'}`}
            >
              <span>{selectedRange === 'custom' ? 'Custom' : 'More'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || isLoading}
            title="Refresh analytics data"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-600' : ''}`} />
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-30 p-1.5 space-y-1 animate-fade-in">
                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
                </button>
                <button
                  onClick={handleExportCsv}
                  disabled={isExportingCsv}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>{isExportingCsv ? 'Exporting CSV...' : 'Export Raw CSV'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Custom Date Range Popover */}
      {isCustomPickerOpen && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md flex flex-wrap items-center gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Calendar className="w-4 h-4 text-brand-500" />
            <span className="font-semibold">Custom Period:</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">From:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-brand-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">To:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-brand-500"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => { setSelectedRange('lastMonth'); setIsCustomPickerOpen(false); }}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Select Last Month
            </button>
            <button
              onClick={handleApplyCustomRange}
              className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Calculating restaurant business metrics...</p>
          <p className="text-xs text-slate-400 mt-1">Aggregating orders across dine-in and delivery channels</p>
        </div>
      )}

      {/* Error Banner */}
      {error && !isLoading && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
          <div className="text-xs">
            <p className="font-bold">Unable to load analytics</p>
            <p className="text-rose-700">{error}</p>
          </div>
          <button
            onClick={() => fetchAnalytics()}
            className="ml-auto px-3 py-1 bg-white border border-rose-300 rounded-lg text-xs font-semibold text-rose-800 hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* Analytics Loaded Content */}
      {analytics && !isLoading && (
        <>
          {/* 2. Executive "Morning Report" Summary Banner */}
          <section className="bg-linear-to-r from-orange-50 via-white to-amber-50/40 p-5 rounded-2xl border border-orange-200/70 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-brand-700">
                    Executive Brief • {analytics.period.label}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
                    {analytics.period.comparisonLabel}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 leading-snug">
                  {analytics.executiveReport.headline}
                </h2>
                <ul className="mt-2.5 space-y-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                  {analytics.executiveReport.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 3. 6 Key KPI Cards */}
          <section className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* 1. Total Sales */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between group hover:border-brand-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Total Sales
                  <span title="Total revenue from all valid and completed orders in this period." className="cursor-help text-slate-400 hover:text-slate-600">
                    <HelpCircle className="w-3 h-3" />
                  </span>
                </span>
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-brand-600">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {formatCurrency(analytics.summary.totalSales)}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold">
                  {analytics.summary.salesChangePercent >= 0 ? (
                    <span className="text-emerald-600 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      {analytics.summary.salesChangePercent}%
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      {Math.abs(analytics.summary.salesChangePercent)}%
                    </span>
                  )}
                  <span className="text-slate-400 font-normal text-[10px]">vs prev</span>
                </div>
              </div>
            </div>

            {/* 2. Total Orders */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between group hover:border-brand-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Orders
                  <span title="Total number of valid completed/active orders." className="cursor-help text-slate-400 hover:text-slate-600">
                    <HelpCircle className="w-3 h-3" />
                  </span>
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {analytics.summary.totalOrders}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold">
                  {analytics.summary.ordersChangePercent >= 0 ? (
                    <span className="text-emerald-600 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      {analytics.summary.ordersChangePercent}%
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      {Math.abs(analytics.summary.ordersChangePercent)}%
                    </span>
                  )}
                  <span className="text-slate-400 font-normal text-[10px]">vs prev</span>
                </div>
              </div>
            </div>

            {/* 3. Average Order Value (AOV) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between group hover:border-brand-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Avg Order (AOV)
                  <span title="Average revenue generated per completed order (Total Sales / Total Orders)." className="cursor-help text-slate-400 hover:text-slate-600">
                    <HelpCircle className="w-3 h-3" />
                  </span>
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {formatCurrency(analytics.summary.averageOrderValue)}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold">
                  {analytics.summary.aovChangePercent >= 0 ? (
                    <span className="text-emerald-600 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      {analytics.summary.aovChangePercent}%
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      {Math.abs(analytics.summary.aovChangePercent)}%
                    </span>
                  )}
                  <span className="text-slate-400 font-normal text-[10px]">vs prev</span>
                </div>
              </div>
            </div>

            {/* 4. Dine-in Sales */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between group hover:border-brand-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Dine-in Sales
                  <span title="Sales generated via table QR dine-in ordering." className="cursor-help text-slate-400 hover:text-slate-600">
                    <HelpCircle className="w-3 h-3" />
                  </span>
                </span>
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-brand-600">
                  <QrCode className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-lg sm:text-xl font-extrabold text-brand-600">
                  {formatCurrency(analytics.summary.dineInSales)}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">
                    {analytics.summary.totalSales > 0 ? Math.round((analytics.summary.dineInSales / analytics.summary.totalSales) * 100) : 0}%
                  </span>
                  <span>of revenue</span>
                </div>
              </div>
            </div>

            {/* 5. Online Sales */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between group hover:border-brand-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Online Sales
                  <span title="Combined sales from Swiggy, Zomato and other online delivery orders." className="cursor-help text-slate-400 hover:text-slate-600">
                    <HelpCircle className="w-3 h-3" />
                  </span>
                </span>
                <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-lg sm:text-xl font-extrabold text-sky-600">
                  {formatCurrency(analytics.summary.onlineSales)}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">
                    {analytics.summary.totalSales > 0 ? Math.round((analytics.summary.onlineSales / analytics.summary.totalSales) * 100) : 0}%
                  </span>
                  <span>of revenue</span>
                </div>
              </div>
            </div>

            {/* 6. Rejection Rate */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between group hover:border-brand-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Rejection Rate
                  <span title="Percentage of orders rejected or cancelled during this period. Lower is better." className="cursor-help text-slate-400 hover:text-slate-600">
                    <HelpCircle className="w-3 h-3" />
                  </span>
                </span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${analytics.summary.rejectionRate > 4 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
                  <XCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className={`text-lg sm:text-xl font-extrabold ${analytics.summary.rejectionRate > 4 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {analytics.summary.rejectionRate}%
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold">
                  {analytics.summary.rejectionRateChangeDiff > 0 ? (
                    <span className="text-rose-600 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      +{analytics.summary.rejectionRateChangeDiff}%
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      {analytics.summary.rejectionRateChangeDiff}%
                    </span>
                  )}
                  <span className="text-slate-400 font-normal text-[10px]">vs prev</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Sales & Orders Trend (Interactive SVG Chart) */}
          <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Sales Trend</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({analytics.salesTrend.granularity === 'hour' ? 'Hour-by-hour' : 'Day-by-day'})
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  {trendMetric === 'sales' ? 'Revenue flow over the selected timeframe' : 'Order volume counts over the selected timeframe'}
                </p>
              </div>

              {/* Metric Toggle [ Sales ] [ Orders ] */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 self-start sm:self-auto">
                <button
                  onClick={() => setTrendMetric('sales')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${trendMetric === 'sales' ? 'bg-white text-brand-600 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  Sales (₹)
                </button>
                <button
                  onClick={() => setTrendMetric('orders')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${trendMetric === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  Orders (Count)
                </button>
              </div>
            </div>

            {/* Interactive SVG Line & Area Chart */}
            <div className="mt-4 relative">
              {analytics.summary.totalSales === 0 && analytics.summary.totalOrders === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-center text-slate-400">
                  <ShoppingBag className="w-8 h-8 mb-2 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">No orders recorded during this period.</p>
                  <p className="text-xs text-slate-400 mt-0.5">Try selecting a broader date range above.</p>
                </div>
              ) : (
                <>
                  {/* SVG Chart Container */}
                  <div className="h-64 sm:h-72 w-full relative">
                    <svg
                      viewBox="0 0 1000 300"
                      preserveAspectRatio="none"
                      className="w-full h-full overflow-visible"
                    >
                      <defs>
                        <linearGradient id="swaadTrendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EA580C" stopOpacity="0.25" />
                          <stop offset="90%" stopColor="#EA580C" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="0" y1="30" x2="1000" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="105" x2="1000" y2="105" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="180" x2="1000" y2="180" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="255" x2="1000" y2="255" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

                      {/* Area Fill */}
                      {trendPoints.length > 1 && (
                        <polygon
                          points={`
                            ${trendPoints.map(p => `${(p.xPercent / 100) * 1000},${(p.yPercent / 100) * 300}`).join(' ')}
                            1000,285 0,285
                          `}
                          fill="url(#swaadTrendGradient)"
                        />
                      )}

                      {/* Line Curve */}
                      {trendPoints.length > 1 && (
                        <polyline
                          points={trendPoints.map(p => `${(p.xPercent / 100) * 1000},${(p.yPercent / 100) * 300}`).join(' ')}
                          fill="none"
                          stroke="#EA580C"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}

                      {/* Data Dots & Hover Crosshair */}
                      {trendPoints.map((p, i) => {
                        const isHovered = hoveredTrendIndex === i;
                        const cx = (p.xPercent / 100) * 1000;
                        const cy = (p.yPercent / 100) * 300;
                        return (
                          <g key={i}>
                            {isHovered && (
                              <line
                                x1={cx}
                                y1="10"
                                x2={cx}
                                y2="285"
                                stroke="#EA580C"
                                strokeWidth="1.5"
                                strokeDasharray="3 3"
                                opacity="0.6"
                              />
                            )}
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isHovered ? 6 : 3.5}
                              fill="#ffffff"
                              stroke="#EA580C"
                              strokeWidth={isHovered ? 3 : 2}
                              className="transition-all cursor-pointer"
                            />
                            {/* Transparent wider touch/hover trigger */}
                            <circle
                              cx={cx}
                              cy={cy}
                              r={18}
                              fill="transparent"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredTrendIndex(i)}
                              onTouchStart={() => setHoveredTrendIndex(i)}
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Hover Tooltip Card */}
                    {hoveredTrendIndex !== null && trendPoints[hoveredTrendIndex] && (
                      <div
                        className="absolute z-20 pointer-events-none bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs -translate-x-1/2 -translate-y-full border border-slate-700/60 animate-fade-in"
                        style={{
                          left: `${trendPoints[hoveredTrendIndex].xPercent}%`,
                          top: `${Math.max(10, trendPoints[hoveredTrendIndex].yPercent - 6)}%`
                        }}
                      >
                        <p className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">
                          {trendPoints[hoveredTrendIndex].item.fullDate}
                        </p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-base font-extrabold text-orange-400">
                            {trendMetric === 'sales' ? formatCurrency(trendPoints[hoveredTrendIndex].item.sales) : `${trendPoints[hoveredTrendIndex].item.orders} Orders`}
                          </span>
                        </div>
                        <div className="mt-1 pt-1 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between gap-3">
                          <span>Dine-in: {formatCurrency(trendPoints[hoveredTrendIndex].item.dineInSales)}</span>
                          <span>Online: {formatCurrency(trendPoints[hoveredTrendIndex].item.onlineSales)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* X-Axis Labels */}
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400 px-1 pt-2 overflow-x-hidden">
                    {analytics.salesTrend.data.map((d, idx) => {
                      // Filter displayed labels for neat spacing
                      const step = Math.ceil(analytics.salesTrend.data.length / 8);
                      if (idx % step !== 0 && idx !== analytics.salesTrend.data.length - 1) return null;
                      return (
                        <span key={idx} className="truncate">
                          {d.label}
                        </span>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* 5. Where Your Sales Come From & Channel Performance */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Channel Share Bar */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Where Your Sales Come From
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between Dine-in QR and online delivery aggregators
                </p>

                {/* Horizontal Progress Bars */}
                <div className="mt-5 space-y-4">
                  {analytics.channelBreakdown.channels.map((ch) => {
                    const barColor =
                      ch.source === 'DINE_IN' ? 'bg-orange-500' :
                      ch.source === 'SWIGGY' ? 'bg-amber-500' :
                      ch.source === 'ZOMATO' ? 'bg-rose-500' : 'bg-slate-400';

                    return (
                      <div key={ch.source} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${barColor}`} />
                            {ch.displayName}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900">{formatCurrency(ch.sales)}</span>
                            <span className="text-xs font-semibold text-slate-500">({ch.shareOfSales}%)</span>
                          </div>
                        </div>

                        {/* Bar */}
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${barColor} rounded-full transition-all duration-500`}
                            style={{ width: `${Math.max(ch.sales > 0 ? 3 : 0, ch.shareOfSales)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Plain English Insight */}
              <div className="mt-6 p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  {analytics.channelBreakdown.plainEnglishInsight}
                </p>
              </div>
            </div>

            {/* Detailed Channel Table */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Channel Performance Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed breakdown of orders, sales and average basket sizes per channel
                </p>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-2.5 font-bold">Channel</th>
                        <th className="pb-2.5 text-center font-bold">Orders</th>
                        <th className="pb-2.5 text-right font-bold">Sales (₹)</th>
                        <th className="pb-2.5 text-right font-bold">Avg Order (AOV)</th>
                        <th className="pb-2.5 text-right font-bold">Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analytics.channelBreakdown.channels.map((ch) => (
                        <tr key={ch.source} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 font-bold text-slate-900">
                            {ch.displayName}
                            {!ch.hasData && (
                              <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                                {ch.statusNote}
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-center font-semibold text-slate-700">
                            {ch.orders}
                          </td>
                          <td className="py-3 text-right font-extrabold text-slate-900">
                            {ch.hasData ? formatCurrency(ch.sales) : '—'}
                          </td>
                          <td className="py-3 text-right text-slate-600">
                            {ch.hasData ? formatCurrency(ch.aov) : '—'}
                          </td>
                          <td className="py-3 text-right font-bold text-brand-600">
                            {ch.hasData ? `${ch.shareOfSales}%` : '0%'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Online vs Dine-in Order Volume Note */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Dine-in: <strong>{analytics.channelBreakdown.channels.find(c => c.source === 'DINE_IN')?.orders || 0}</strong> orders</span>
                <span>Swiggy: <strong>{analytics.onlineAnalytics.swiggy.orders}</strong> orders</span>
                <span>Zomato: <strong>{analytics.onlineAnalytics.zomato.orders}</strong> orders</span>
              </div>
            </div>
          </section>

          {/* 6. Online Orders Section (Swiggy vs Zomato Dedicated Cards) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Swiggy Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center">
                    S
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Swiggy Delivery</h4>
                    <span className="text-[10px] text-slate-400">Aggregator Channel</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${analytics.onlineAnalytics.swiggy.hasOrders ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                  {analytics.onlineAnalytics.swiggy.hasOrders ? 'Active Orders' : 'No connected orders yet'}
                </span>
              </div>

              {analytics.onlineAnalytics.swiggy.hasOrders ? (
                <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Orders</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{analytics.onlineAnalytics.swiggy.orders}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sales</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{formatCurrency(analytics.onlineAnalytics.swiggy.sales)}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">AOV</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{formatCurrency(analytics.onlineAnalytics.swiggy.aov)}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Share</p>
                    <p className="text-sm font-extrabold text-brand-600 mt-1">{analytics.onlineAnalytics.swiggy.shareOfSales}%</p>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-slate-500 text-xs">
                  <p className="font-semibold text-slate-700">No connected orders yet.</p>
                  <p className="text-slate-400 text-[11px] mt-1">Connect Swiggy to start tracking your online performance.</p>
                </div>
              )}
            </div>

            {/* Zomato Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white font-extrabold text-sm flex items-center justify-center">
                    Z
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Zomato Delivery</h4>
                    <span className="text-[10px] text-slate-400">Aggregator Channel</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${analytics.onlineAnalytics.zomato.hasOrders ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                  {analytics.onlineAnalytics.zomato.hasOrders ? 'Active Orders' : 'No connected orders yet'}
                </span>
              </div>

              {analytics.onlineAnalytics.zomato.hasOrders ? (
                <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Orders</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{analytics.onlineAnalytics.zomato.orders}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sales</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{formatCurrency(analytics.onlineAnalytics.zomato.sales)}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">AOV</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{formatCurrency(analytics.onlineAnalytics.zomato.aov)}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Share</p>
                    <p className="text-sm font-extrabold text-brand-600 mt-1">{analytics.onlineAnalytics.zomato.shareOfSales}%</p>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-slate-500 text-xs">
                  <p className="font-semibold text-slate-700">No connected orders yet.</p>
                  <p className="text-slate-400 text-[11px] mt-1">Connect Zomato to start tracking your online performance.</p>
                </div>
              )}
            </div>
          </section>

          {/* 7. Menu Performance & Top Selling Dishes */}
          <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Menu & Item Performance</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </h3>
                <p className="text-xs text-slate-500">
                  Identify your bestsellers and top revenue-generating menu offerings
                </p>
              </div>

              {/* Tabs: Most Sold vs Highest Revenue */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                  <button
                    onClick={() => setTopItemsTab('quantity')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${topItemsTab === 'quantity' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
                  >
                    Most Sold (Qty)
                  </button>
                  <button
                    onClick={() => setTopItemsTab('revenue')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${topItemsTab === 'revenue' ? 'bg-white text-brand-600 shadow-xs' : 'hover:text-slate-900'}`}
                  >
                    Highest Revenue (₹)
                  </button>
                </div>

                <button
                  onClick={() => setIsDetailedTableOpen(!isDetailedTableOpen)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {isDetailedTableOpen ? 'Hide Full Table' : 'View Full Table'}
                </button>
              </div>
            </div>

            {/* Quick Hero Badges: Most Sold vs Highest Revenue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Most Ordered Item</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {analytics.itemPerformance.mostSoldItem?.name || 'N/A'}
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-900 bg-amber-200/60 px-2.5 py-1 rounded-lg">
                  {analytics.itemPerformance.mostSoldItem?.quantity || 0} portions sold
                </span>
              </div>

              <div className="p-3 bg-orange-50/70 border border-orange-200/60 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800">Highest Revenue Dish</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {analytics.itemPerformance.highestRevenueItem?.name || 'N/A'}
                  </p>
                </div>
                <span className="text-xs font-bold text-brand-900 bg-orange-200/60 px-2.5 py-1 rounded-lg">
                  {formatCurrency(analytics.itemPerformance.highestRevenueItem?.revenue || 0)}
                </span>
              </div>
            </div>

            {/* Top Items Cards / Rows */}
            <div className="divide-y divide-slate-100">
              {(topItemsTab === 'quantity'
                ? [...analytics.itemPerformance.items].sort((a, b) => b.quantitySold - a.quantitySold)
                : [...analytics.itemPerformance.items].sort((a, b) => b.revenue - a.revenue)
              ).slice(0, 6).map((item, idx) => (
                <div key={item.itemId || idx} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${idx === 0 ? 'bg-amber-400 text-slate-950 shadow-xs' : idx === 1 ? 'bg-slate-200 text-slate-800' : 'text-slate-400 bg-slate-100'}`}>
                      {idx + 1}
                    </span>
                    <VegIcon isVeg={item.isVeg} size="sm" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.name}</h4>
                      <span className="text-[10px] text-slate-400">{item.category} • ₹{item.averagePrice} avg</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {topItemsTab === 'quantity' ? `${item.quantitySold} sold` : formatCurrency(item.revenue)}
                    </div>
                    <span className="text-[10px] font-semibold text-brand-600">
                      {topItemsTab === 'quantity' ? formatCurrency(item.revenue) : `${item.quantitySold} portions`} ({item.shareOfSales}% share)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Table (Collapsible) */}
            {isDetailedTableOpen && (
              <div className="mt-5 pt-4 border-t border-slate-200 animate-fade-in">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-slate-700">Complete Dish Breakdown ({sortedDetailedItems.length} items)</span>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>Sort by:</span>
                    <button
                      onClick={() => setTableSortBy('quantity')}
                      className={`font-semibold ${tableSortBy === 'quantity' ? 'text-brand-600 underline' : 'hover:text-slate-800'}`}
                    >
                      Quantity
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setTableSortBy('revenue')}
                      className={`font-semibold ${tableSortBy === 'revenue' ? 'text-brand-600 underline' : 'hover:text-slate-800'}`}
                    >
                      Revenue
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setTableSortBy('name')}
                      className={`font-semibold ${tableSortBy === 'name' ? 'text-brand-600 underline' : 'hover:text-slate-800'}`}
                    >
                      Name
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                        <th className="pb-2">Dish</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2 text-center">Qty Sold</th>
                        <th className="pb-2 text-right">Avg Price</th>
                        <th className="pb-2 text-right">Revenue (₹)</th>
                        <th className="pb-2 text-right">% of Sales</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedDetailedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 font-bold text-slate-900 flex items-center gap-2">
                            <VegIcon isVeg={item.isVeg} size="sm" />
                            <span>{item.name}</span>
                          </td>
                          <td className="py-2.5 text-slate-500">{item.category}</td>
                          <td className="py-2.5 text-center font-semibold text-slate-800">{item.quantitySold}</td>
                          <td className="py-2.5 text-right text-slate-600">₹{item.averagePrice}</td>
                          <td className="py-2.5 text-right font-extrabold text-slate-900">{formatCurrency(item.revenue)}</td>
                          <td className="py-2.5 text-right font-semibold text-brand-600">{item.shareOfSales}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* 8. Category Performance */}
          <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900">
              Category Performance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menu categories driving the largest sales volume
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.categoryPerformance.map((cat) => (
                <div key={cat.categoryId} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{cat.categoryName}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{formatCurrency(cat.sales)}</span>
                      <span className="text-xs font-semibold text-brand-600">({cat.shareOfSales}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all"
                      style={{ width: `${Math.max(2, cat.shareOfSales)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 9. Peak Hours & Peak Days */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Peak Hours Chart */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Busiest Hours</span>
                    <Clock className="w-4 h-4 text-brand-600" />
                  </h3>
                  <p className="text-xs text-slate-500">Order traffic volume across the clock</p>
                </div>
                <div className="px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-[11px] font-extrabold text-brand-700">
                  Peak: {analytics.peakHours.busiestPeriodLabel}
                </div>
              </div>

              {/* Hourly Bar Chart */}
              <div className="mt-5">
                <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-6">
                  {analytics.peakHours.hourlyData.map((h) => {
                    const heightPercent = maxPeakHour > 0 ? (h.orders / maxPeakHour) * 100 : 0;
                    const isPeakWindow = h.orders >= maxPeakHour * 0.7 && h.orders > 0;

                    return (
                      <div key={h.hour} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                        {/* Tooltip on bar hover */}
                        <div className="absolute -top-7 hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold py-0.5 px-1.5 rounded-sm whitespace-nowrap z-10 pointer-events-none shadow-md">
                          {h.label}: {h.orders} orders
                        </div>

                        {/* Bar */}
                        <div
                          className={`w-full rounded-t-sm transition-all ${isPeakWindow ? 'bg-brand-500 group-hover:bg-brand-600' : 'bg-slate-200 group-hover:bg-slate-300'}`}
                          style={{ height: `${Math.max(h.orders > 0 ? 8 : 2, heightPercent)}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* X-axis labels (Sampled for clean display) */}
                <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2 px-1">
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                  <span>11 PM</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-700 font-medium">
                <strong>Insight:</strong> Your busiest period is <strong>{analytics.peakHours.busiestPeriodLabel}</strong>, accounting for <strong>{analytics.peakHours.busiestPeriodShare}%</strong> of overall orders.
              </div>
            </div>

            {/* Peak Days Chart */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Day-of-Week Pattern</span>
                  <Calendar className="w-4 h-4 text-slate-600" />
                </h3>
                <p className="text-xs text-slate-500">Weekly sales distribution</p>

                <div className="mt-4 space-y-2.5">
                  {analytics.peakDays.dayData.map((d) => {
                    const isBest = d.dayName === analytics.peakDays.bestDayName && d.sales > 0;
                    return (
                      <div key={d.dayName} className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className={`font-bold ${isBest ? 'text-brand-600 flex items-center gap-1.5' : 'text-slate-700'}`}>
                          {isBest && <Flame className="w-3.5 h-3.5 text-brand-500" />}
                          {d.dayName}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-[11px]">{d.orders} orders</span>
                          <span className={`font-extrabold ${isBest ? 'text-brand-600' : 'text-slate-900'}`}>
                            {formatCurrency(d.sales)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <strong>{analytics.peakDays.bestDayName}</strong> is your strongest sales day, while <strong>{analytics.peakDays.slowestDayName}</strong> is typically quieter.
              </div>
            </div>
          </section>

          {/* 10. Table Performance & Order Outcomes */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Table Performance */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Order Activity by Table</span>
                    <QrCode className="w-4 h-4 text-brand-600" />
                  </h3>
                  <p className="text-xs text-slate-500">QR dine-in performance and volume per table</p>
                </div>
                {analytics.tablePerformance.mostActiveTable && (
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Top: {analytics.tablePerformance.mostActiveTable}
                  </span>
                )}
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="pb-2">Table</th>
                      <th className="pb-2 text-center">Orders</th>
                      <th className="pb-2 text-right">Total Sales</th>
                      <th className="pb-2 text-right">Avg Ticket (AOV)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analytics.tablePerformance.tables.length > 0 ? (
                      analytics.tablePerformance.tables.map((tbl) => (
                        <tr key={tbl.tableNumber} className="hover:bg-slate-50/70">
                          <td className="py-2.5 font-bold text-slate-900">{tbl.tableNumber}</td>
                          <td className="py-2.5 text-center font-semibold text-slate-800">{tbl.orders}</td>
                          <td className="py-2.5 text-right font-extrabold text-slate-900">{formatCurrency(tbl.sales)}</td>
                          <td className="py-2.5 text-right text-slate-600">{formatCurrency(tbl.aov)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-slate-400">
                          No table dine-in orders recorded for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Outcomes & Operational Health */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Order Outcomes & Health</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </h3>
                <p className="text-xs text-slate-500">Fulfillment reliability and rejection analysis</p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-emerald-900">Completed Orders</span>
                      <p className="text-[10px] text-emerald-700 mt-0.5">Successfully served and billed</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-emerald-900">{analytics.orderOutcomes.completed}</span>
                      <span className="block text-[10px] font-bold text-emerald-600">{analytics.orderOutcomes.completionRate}% rate</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-slate-900">In Preparation / Ready</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Currently active kitchen tickets</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-slate-900">
                        {analytics.orderOutcomes.acceptedPreparing + analytics.orderOutcomes.ready}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-rose-50/60 border border-rose-200/60 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-rose-900">Rejected / Cancelled</span>
                      <p className="text-[10px] text-rose-700 mt-0.5">Missed orders during rush</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-rose-900">{analytics.orderOutcomes.rejected}</span>
                      <span className="block text-[10px] font-bold text-rose-600">{analytics.orderOutcomes.rejectionRate}% rate</span>
                    </div>
                  </div>
                </div>

                {/* Rejection Reasons if any */}
                {analytics.orderOutcomes.rejectedReasons && analytics.orderOutcomes.rejectedReasons.length > 0 && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs space-y-1.5">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                      Common Rejection Drivers:
                    </span>
                    {analytics.orderOutcomes.rejectedReasons.map((r, i) => (
                      <div key={i} className="flex justify-between text-slate-600 text-[11px]">
                        <span>• {r.reason}</span>
                        <strong className="text-slate-800">{r.count}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 11. Business Insights ("What Swaad Sevak Noticed") */}
          <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>What Swaad Sevak Noticed</span>
                  <Sparkles className="w-4 h-4 text-brand-600" />
                </h3>
                <p className="text-xs text-slate-500">
                  Data-driven observations to guide menu pricing, inventory prep and shift scheduling
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {analytics.insights.map((ins) => {
                const badgeColor =
                  ins.type === 'positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  ins.type === 'warning' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  ins.type === 'channel' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  ins.type === 'timing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-orange-50 text-brand-700 border-orange-200';

                return (
                  <div key={ins.id} className="p-4 bg-slate-50/80 border border-slate-200/70 rounded-xl space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} capitalize`}>
                          {ins.type}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-2">{ins.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ins.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 12. Bottom Export Footer */}
          <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-100 rounded-2xl text-xs text-slate-500">
            <span>Period: <strong>{analytics.period.label}</strong> ({analytics.exportOrders.length} raw order records)</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
              </button>
              <button
                onClick={handleExportCsv}
                disabled={isExportingCsv}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isExportingCsv ? 'Exporting CSV...' : 'Download CSV'}</span>
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

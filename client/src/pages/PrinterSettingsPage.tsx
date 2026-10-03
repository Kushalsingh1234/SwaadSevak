import React, { useState } from 'react';
import { Printer, Check, Settings, Save, FileText, CheckCircle2, Wifi, Zap, Receipt } from 'lucide-react';
import { PrinterConfig, Restaurant } from '../types';
import { api } from '../services/api';

interface PrinterSettingsPageProps {
  restaurant: Restaurant | null;
  config?: PrinterConfig;
  onUpdateConfig: (config: any) => Promise<void>;
}

export const PrinterSettingsPage: React.FC<PrinterSettingsPageProps> = ({
  restaurant,
  config,
  onUpdateConfig,
}) => {
  const [printerName, setPrinterName] = useState(config?.printerName || 'Kitchen POS-80 Thermal Printer');
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>(config?.paperWidth || '80mm');
  const [autoPrintKot, setAutoPrintKot] = useState<boolean>(config?.autoPrintKot ?? true);
  const [printerType, setPrinterType] = useState<string>(config?.printerType || 'BROWSER');
  const [printerIp, setPrinterIp] = useState<string>(config?.printerIp || '192.168.1.100');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    try {
      await onUpdateConfig({
        printerName,
        paperWidth,
        autoPrintKot,
        printerType,
        printerIp: printerType === 'NETWORK' ? printerIp : undefined
      });
      setSuccessMsg('Printer settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      console.error('Failed to save printer config:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Kitchen Thermal Printer
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Browser Driver Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure thermal receipt and kitchen order tickets (KOT) for table dispatch.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestPrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold transition-colors shadow-xs shrink-0"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Test Print Thermal Slip</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Settings Form (Left 2 Columns) */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 space-y-5">
          {/* Paper Width Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Thermal Paper Roll Width
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaperWidth('80mm')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  paperWidth === '80mm'
                    ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-500'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900">80mm (Standard POS)</span>
                  {paperWidth === '80mm' && <Check className="w-4 h-4 text-brand-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Most common for kitchen order tickets (KOT) & cashier tax receipts.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaperWidth('58mm')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  paperWidth === '58mm'
                    ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-500'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900">58mm (Mobile Roll)</span>
                  {paperWidth === '58mm' && <Check className="w-4 h-4 text-brand-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Hand-held bluetooth and compact thermal counter printers.
                </p>
              </button>
            </div>
          </div>

          {/* Printer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Printer Name / Location
            </label>
            <input
              type="text"
              value={printerName}
              onChange={(e) => setPrinterName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 text-slate-900 focus:bg-white focus:border-brand-500 outline-none transition-all"
              placeholder="e.g. Main Kitchen Line POS 80mm"
            />
          </div>

          {/* Connection Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Connection Driver
            </label>
            <select
              value={printerType}
              onChange={(e) => setPrinterType(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 text-slate-900 focus:bg-white focus:border-brand-500 outline-none transition-all"
            >
              <option value="BROWSER">Direct Browser Thermal Driver (Universal & Recommended)</option>
              <option value="NETWORK">Network Ethernet / Wi-Fi IP Thermal Printer</option>
              <option value="USB">Direct USB ESC/POS Printer</option>
            </select>
          </div>

          {printerType === 'NETWORK' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Static IP Address
              </label>
              <input
                type="text"
                value={printerIp}
                onChange={(e) => setPrinterIp(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 text-slate-900 focus:bg-white focus:border-brand-500 outline-none font-mono transition-all"
                placeholder="192.168.1.100"
              />
            </div>
          )}

          {/* Auto Print KOT Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-200/80 gap-3">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Auto-Trigger Print Dialog on Order Acceptance
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                When checked, clicking "Accept Order" immediately pops the formatted thermal ticket for the kitchen.
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoPrintKot}
              onChange={(e) => setAutoPrintKot(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-stone-300 focus:ring-brand-500 cursor-pointer shrink-0"
            />
          </div>

          {/* Save Button */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Printer Settings'}</span>
            </button>
          </div>
        </form>

        {/* Live KOT Preview (Right Column) */}
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 flex flex-col">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-brand-500" />
            <span>KOT Thermal Slip Preview</span>
          </h2>

          <div className="flex-1 bg-stone-50 p-4 rounded-xl border border-dashed border-stone-300 font-mono text-[11px] text-slate-800 leading-relaxed flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-center pb-2 border-b border-dashed border-stone-300">
                <p className="font-bold text-xs uppercase">{restaurant?.name || 'SWAAD SEVAK'}</p>
                <p className="text-[10px] text-slate-500">*** KITCHEN ORDER TICKET ***</p>
                <p className="text-[10px] text-slate-500">KOT #102 • Table 01</p>
              </div>

              <div className="space-y-1.5 py-1">
                <div className="flex justify-between font-bold">
                  <span>2x PANEER BUTTER MASALA</span>
                  <span>(STD)</span>
                </div>
                <div className="text-[10px] text-slate-500 pl-4">- Note: Less spicy</div>
                <div className="flex justify-between font-bold">
                  <span>4x BUTTER NAAN</span>
                  <span></span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-stone-300 text-center text-[10px] text-slate-400">
              <p>Format: {paperWidth}</p>
              <p>Printed via Swaad Sevak POS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

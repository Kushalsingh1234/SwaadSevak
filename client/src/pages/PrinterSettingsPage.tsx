import React, { useState } from 'react';
import { Printer, Check, Settings, Save, FileText, CheckCircle2 } from 'lucide-react';
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
  const [printerName, setPrinterName] = useState(config?.printerName || 'POS-80 Thermal Kitchen Printer');
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
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Kitchen Printer Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Configure thermal receipt printers commonly used in Indian restaurant kitchens.
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6">
        {/* Paper Width (Section 22: 58mm vs 80mm) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Thermal Paper Roll Width *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaperWidth('80mm')}
              className={`p-4 rounded-xl border text-left transition-all ${
                paperWidth === '80mm'
                  ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm text-slate-900">80mm (Standard POS)</span>
                {paperWidth === '80mm' && <Check className="w-4 h-4 text-orange-600" />}
              </div>
              <p className="text-xs text-slate-500">
                Most common for kitchen order tickets (KOT) & cashier tax receipts.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPaperWidth('58mm')}
              className={`p-4 rounded-xl border text-left transition-all ${
                paperWidth === '58mm'
                  ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm text-slate-900">58mm (Compact Mobile)</span>
                {paperWidth === '58mm' && <Check className="w-4 h-4 text-orange-600" />}
              </div>
              <p className="text-xs text-slate-500">
                Compact hand-held bluetooth and mobile thermal slip printers.
              </p>
            </button>
          </div>
        </div>

        {/* Printer Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Printer Friendly Name
          </label>
          <input
            type="text"
            value={printerName}
            onChange={(e) => setPrinterName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-orange-500 outline-none"
            placeholder="e.g. Kitchen Line POS 80mm"
          />
        </div>

        {/* Connection Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Printing Driver / Connection
          </label>
          <select
            value={printerType}
            onChange={(e) => setPrinterType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-orange-500 outline-none bg-white"
          >
            <option value="BROWSER">Direct Browser Thermal Driver (Standard & Universal)</option>
            <option value="NETWORK">Network Ethernet / Wi-Fi IP Thermal Printer</option>
            <option value="USB">Direct USB ESC/POS Printer</option>
          </select>
        </div>

        {printerType === 'NETWORK' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Printer Static IP Address
            </label>
            <input
              type="text"
              value={printerIp}
              onChange={(e) => setPrinterIp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-orange-500 outline-none font-mono"
              placeholder="192.168.1.100"
            />
          </div>
        )}

        {/* Auto Print KOT Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Auto-Trigger Print Dialog on Order Acceptance
            </span>
            <span className="text-[11px] text-slate-500">
              When checked, accepting an order immediately launches the formatted thermal print ticket.
            </span>
          </div>
          <input
            type="checkbox"
            checked={autoPrintKot}
            onChange={(e) => setAutoPrintKot(e.target.checked)}
            className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestPrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Test Print Thermal Slip</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

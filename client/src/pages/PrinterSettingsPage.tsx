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
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Kitchen Printer
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure thermal receipt and KOT printers for kitchen order tickets.
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
        {/* Paper Width */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Thermal Paper Roll Width
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setPaperWidth('80mm')}
              className={`p-4 rounded-lg border text-left transition-all ${
                paperWidth === '80mm'
                  ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-gray-900">80mm (Standard POS)</span>
                {paperWidth === '80mm' && <Check className="w-4 h-4 text-orange-600" />}
              </div>
              <p className="text-xs text-gray-500">
                Most common for kitchen order tickets (KOT) & cashier tax receipts.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPaperWidth('58mm')}
              className={`p-4 rounded-lg border text-left transition-all ${
                paperWidth === '58mm'
                  ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-gray-900">58mm (Compact Mobile)</span>
                {paperWidth === '58mm' && <Check className="w-4 h-4 text-orange-600" />}
              </div>
              <p className="text-xs text-gray-500">
                Compact hand-held bluetooth and mobile thermal slip printers.
              </p>
            </button>
          </div>
        </div>

        {/* Printer Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Printer Name
          </label>
          <input
            type="text"
            value={printerName}
            onChange={(e) => setPrinterName(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
            placeholder="e.g. Kitchen Line POS 80mm"
          />
        </div>

        {/* Connection Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Connection Type
          </label>
          <select
            value={printerType}
            onChange={(e) => setPrinterType(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
          >
            <option value="BROWSER">Direct Browser Thermal Driver (Standard & Universal)</option>
            <option value="NETWORK">Network Ethernet / Wi-Fi IP Thermal Printer</option>
            <option value="USB">Direct USB ESC/POS Printer</option>
          </select>
        </div>

        {printerType === 'NETWORK' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Printer Static IP Address
            </label>
            <input
              type="text"
              value={printerIp}
              onChange={(e) => setPrinterIp(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-orange-500 outline-none font-mono transition-all"
              placeholder="192.168.1.100"
            />
          </div>
        )}

        {/* Auto Print KOT Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200 gap-3">
          <div>
            <span className="text-xs font-semibold text-gray-900 block">
              Auto-Trigger Print Dialog on Order Acceptance
            </span>
            <span className="text-[11px] text-gray-500 mt-0.5 block">
              When checked, accepting an order immediately launches the formatted thermal print ticket.
            </span>
          </div>
          <input
            type="checkbox"
            checked={autoPrintKot}
            onChange={(e) => setAutoPrintKot(e.target.checked)}
            className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer shrink-0"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestPrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Test Print Thermal Slip</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

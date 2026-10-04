import React, { useState, useEffect } from 'react';
import {
  Printer,
  Check,
  Settings,
  Save,
  FileText,
  CheckCircle2,
  Zap,
  Receipt,
  Usb,
  Cpu,
  RefreshCw,
  Sliders,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PrinterConfig, Restaurant } from '../types';
import { kotPrinter } from '../utils/kotPrinter';

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
  const [previewTab, setPreviewTab] = useState<'REGULAR' | 'ADDITION'>('REGULAR');

  // USB Printer Connection State
  const [usbStatus, setUsbStatus] = useState(kotPrinter.getConnectedUsbDevice());
  const [usbLoading, setUsbLoading] = useState(false);
  const [usbMsg, setUsbMsg] = useState('');

  const handlePairUsb = async () => {
    setUsbLoading(true);
    setUsbMsg('');
    try {
      const res = await kotPrinter.pairUsbPrinter();
      if (res.success) {
        setUsbStatus({ isConnected: true, deviceName: res.deviceName });
        setUsbMsg(`Connected to ${res.deviceName}!`);
      } else {
        setUsbMsg(res.error || 'Pairing was cancelled.');
      }
    } catch (e: any) {
      setUsbMsg(e.message || 'Error connecting to USB device.');
    } finally {
      setUsbLoading(false);
    }
  };

  const handleDisconnectUsb = () => {
    kotPrinter.disconnectUsbPrinter();
    setUsbStatus({ isConnected: false });
    setUsbMsg('USB device disconnected. Using internal app thermal driver.');
  };

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

  const handleTestPrintRegular = () => {
    kotPrinter.testPrint(restaurant, paperWidth, false);
  };

  const handleTestPrintAddition = () => {
    kotPrinter.testPrint(restaurant, paperWidth, true);
  };

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Header Bar with Internal Driver Active Badge */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Kitchen Thermal KOT System
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Internal Driver Ready (No Wi-Fi/Bluetooth needed)</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect your kitchen thermal printer internally directly from the app. Automatically dispatches KOTs upon accepting orders &amp; table additions.
            </p>
          </div>
        </div>

        {/* Quick Test Print Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleTestPrintRegular}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
            title="Test prints a regular kitchen ticket"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Test Regular KOT</span>
          </button>
          <button
            type="button"
            onClick={handleTestPrintAddition}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-semibold border border-orange-200 transition-colors shadow-xs"
            title="Test prints a table add-on ticket reading 'New Addition'"
          >
            <Zap className="w-3.5 h-3.5 text-orange-600" />
            <span>Test Add-on KOT</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Internal In-App Connection Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-100">
              Direct Internal In-App Printer Driver
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Your printer connects <strong>internally from the app</strong>. There is no need for external Wi-Fi setup or Bluetooth pairing. Prints are formatted and dispatched directly to your connected thermal receipt hardware.
          </p>
          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Check className="w-3.5 h-3.5" /> Zero Wi-Fi/Bluetooth setup required
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Check className="w-3.5 h-3.5" /> Instant print on order acceptance
            </span>
          </div>
        </div>

        {/* WebUSB 1-Click Hardware Pairing */}
        <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {usbStatus.isConnected ? (
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs">
              <Usb className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-emerald-300 font-semibold block">{usbStatus.deviceName || 'USB POS Printer'}</span>
                <span className="text-[10px] text-emerald-400/80">Direct USB Hardware Connected</span>
              </div>
              <button
                type="button"
                onClick={handleDisconnectUsb}
                className="ml-2 px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px]"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handlePairUsb}
              disabled={usbLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Usb className="w-4 h-4" />
              <span>{usbLoading ? 'Selecting Device...' : 'Pair USB Printer Directly'}</span>
            </button>
          )}
        </div>
      </div>

      {usbMsg && (
        <div className="p-3 rounded-lg bg-slate-100 border border-stone-200 text-xs text-slate-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
          <span>{usbMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Settings Form (Left 2 Columns) */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 space-y-5">
          {/* Thermal Paper Roll Width Selection */}
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
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900">80mm (Standard POS)</span>
                  {paperWidth === '80mm' && <Check className="w-4 h-4 text-orange-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Recommended for kitchen order tickets (KOT) &amp; full counter order bills.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaperWidth('58mm')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  paperWidth === '58mm'
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900">58mm (Compact Roll)</span>
                  {paperWidth === '58mm' && <Check className="w-4 h-4 text-orange-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Compact 2-inch roll thermal printers for fast kitchen tickets.
                </p>
              </button>
            </div>
          </div>

          {/* Printer Station Label */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Printer Station / Location Name
            </label>
            <input
              type="text"
              value={printerName}
              onChange={(e) => setPrinterName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
              placeholder="e.g. Main Kitchen Line Thermal POS"
            />
          </div>

          {/* Connection Mode Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Internal Connection Driver
            </label>
            <select
              value={printerType}
              onChange={(e) => setPrinterType(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
            >
              <option value="BROWSER">Direct Internal Thermal Spooler (Recommended — No Wi-Fi or Bluetooth)</option>
              <option value="USB">Direct In-App WebUSB Port</option>
              <option value="NETWORK">Network Ethernet Socket (Optional legacy fallback)</option>
            </select>
          </div>

          {printerType === 'NETWORK' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Thermal Printer IP Address
              </label>
              <input
                type="text"
                value={printerIp}
                onChange={(e) => setPrinterIp(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none font-mono transition-all"
                placeholder="192.168.1.100"
              />
            </div>
          )}

          {/* Automatic Print Rule: As soon as an order is accepted, send to printer */}
          <div className="space-y-3">
            <div className="flex items-start justify-between p-4 rounded-xl bg-orange-50/50 border border-orange-200/80 gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-orange-600" />
                  <span>Automatic KOT Dispatch on Acceptance</span>
                </span>
                <span className="text-[11px] text-slate-600 mt-1 block leading-relaxed">
                  As soon as you click <strong>"Accept Order"</strong> or <strong>"Accept Addition"</strong> on the live board, the formatted KOT is immediately sent to the connected printer automatically.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoPrintKot}
                onChange={(e) => setAutoPrintKot(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded border-stone-300 focus:ring-orange-500 cursor-pointer shrink-0 mt-0.5"
              />
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-slate-600 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">New Addition KOT Formatting:</strong> When a dining table adds more dishes, the system automatically marks the ticket as <em>"*** TABLE ADD-ON KOT (NEW ADDITION) ***"</em> with table reference, so kitchen chefs know exactly what new dishes to prepare.
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Printer Settings'}</span>
            </button>
          </div>
        </form>

        {/* Live KOT Preview (Right Column) */}
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-orange-600" />
              <span>Thermal Slip Preview</span>
            </h2>

            {/* Toggle Preview between Regular and New Addition */}
            <div className="flex rounded-md bg-stone-100 p-0.5 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setPreviewTab('REGULAR')}
                className={`px-2 py-0.5 rounded transition-all ${
                  previewTab === 'REGULAR' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Standard KOT
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('ADDITION')}
                className={`px-2 py-0.5 rounded transition-all ${
                  previewTab === 'ADDITION' ? 'bg-white text-orange-700 shadow-xs font-bold' : 'text-slate-500'
                }`}
              >
                Add-on KOT
              </button>
            </div>
          </div>

          <div className="flex-1 bg-stone-50 p-4 rounded-xl border border-dashed border-stone-300 font-mono text-[11px] text-slate-800 leading-relaxed flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-center pb-2 border-b border-dashed border-stone-300">
                <p className="font-bold text-xs uppercase">{restaurant?.name || 'SWAAD SEVAK'}</p>
                {previewTab === 'ADDITION' ? (
                  <>
                    <div className="bg-slate-900 text-white text-[10px] font-bold py-0.5 px-1.5 rounded my-1 inline-block">
                      *** TABLE ADD-ON KOT ***
                    </div>
                    <p className="text-[11px] font-bold text-orange-700">&gt;&gt;&gt; NEW ADDITION &lt;&lt;&lt;</p>
                    <p className="text-[10px] text-slate-600 font-bold">Add-on #1 | REF ORD #101</p>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] text-slate-500 font-semibold tracking-wider">*** KITCHEN ORDER TICKET ***</p>
                    <p className="text-[10px] text-slate-500">KOT-1042 • Table 01</p>
                  </>
                )}
              </div>

              <div className="flex justify-between text-[10px] font-semibold">
                <span>TABLE: Table 01</span>
                <span>12:45 AM</span>
              </div>
              <div className="text-[10px] text-slate-500">
                TYPE: DINE_IN {previewTab === 'ADDITION' ? '• (TABLE ADD-ON)' : ''}
              </div>

              <div className="border-t border-dashed border-stone-300 pt-1 space-y-1.5">
                {previewTab === 'ADDITION' ? (
                  <>
                    <div className="flex justify-between font-bold">
                      <span>1x MASALA DOSA</span>
                      <span>(STD)</span>
                    </div>
                    <div className="text-[10px] text-slate-500 pl-4">- Note: Extra crispy</div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between font-bold">
                      <span>2x PANEER BUTTER MASALA</span>
                      <span>(STD)</span>
                    </div>
                    <div className="text-[10px] text-slate-500 pl-4">- Note: Medium spicy</div>
                    <div className="flex justify-between font-bold">
                      <span>4x BUTTER NAAN</span>
                      <span></span>
                    </div>
                  </>
                )}
              </div>

              {previewTab === 'ADDITION' && (
                <div className="mt-2 p-1 rounded bg-amber-100/70 border border-amber-300 text-center text-[9px] font-bold text-amber-900">
                  PREPARE &amp; DELIVER TO ACTIVE TABLE
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-dashed border-stone-300 text-center text-[10px] text-slate-400">
              <p>Roll Size: {paperWidth}</p>
              <p>Internal In-App Thermal Spooler</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

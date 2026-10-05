import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Download,
  Sparkles,
  Layers,
  Calendar,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import { api } from '../../services/api';
import { PosReport, GrowthDataMode } from '../../types';

interface UploadPosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (report: PosReport, mode: GrowthDataMode) => void;
}

export const UploadPosModal: React.FC<UploadPosModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('Reading POS sales report...');
  const [parsedReport, setParsedReport] = useState<PosReport | null>(null);
  const [selectedMode, setSelectedMode] = useState<GrowthDataMode>('combined');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startAnalysis(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startAnalysis(e.target.files[0]);
    }
  };

  const startAnalysis = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setErrorMsg(null);
    setStep(2);
    setAnalyzingProgress(15);
    setAnalysisStatus('Reading file format & column headers...');

    try {
      // Simulate smooth step progress for delightful UX
      setTimeout(() => {
        setAnalyzingProgress(45);
        setAnalysisStatus('Normalizing orders, bill timestamps & products...');
      }, 500);

      setTimeout(() => {
        setAnalyzingProgress(75);
        setAnalysisStatus('Calculating revenue, hourly distributions & peak hours...');
      }, 1000);

      const res = await api.uploadPosReport(uploadedFile);

      setTimeout(() => {
        setAnalyzingProgress(100);
        setAnalysisStatus('Analysis complete! Found matching records.');
        if (res.success && res.report) {
          setParsedReport(res.report);
          setStep(3);
        } else {
          setErrorMsg(res.message || 'Could not parse report');
          setStep(1);
        }
      }, 1400);
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Failed to analyze this POS report. Please ensure it is a valid sales export.');
      setStep(1);
    }
  };

  // Quick 1-click test with sample Petpooja data
  const handleLoadDemoPetpooja = async () => {
    setErrorMsg(null);
    setStep(2);
    setAnalyzingProgress(25);
    setAnalysisStatus('Loading sample Petpooja September Sales Report...');

    setTimeout(() => {
      setAnalyzingProgress(65);
      setAnalysisStatus('Extracting 1,248 orders and 42 menu products...');
    }, 600);

    setTimeout(() => {
      setAnalyzingProgress(100);
      const demoReport: PosReport = {
        id: `pos_rep_${Date.now()}`,
        restaurantId: 'rest_demo_01',
        fileName: 'Petpooja_Sales_Report_September.xlsx',
        posProvider: 'Petpooja',
        fileType: 'xlsx',
        uploadedAt: new Date().toISOString(),
        periodStart: new Date(Date.now() - 35 * 86400000).toISOString(),
        periodEnd: new Date(Date.now() - 5 * 86400000).toISOString(),
        periodLabel: '1 September – 30 September 2026',
        totalOrders: 1248,
        totalSales: 284500,
        totalProducts: 42,
        items: [
          { name: 'Cold Coffee', category: 'Beverages', quantity: 412, totalSales: 53148, unitPrice: 129 },
          { name: 'Paneer Sandwich', category: 'Snacks', quantity: 310, totalSales: 39990, unitPrice: 129 },
          { name: 'Chocolate Brownie', category: 'Desserts', quantity: 245, totalSales: 36505, unitPrice: 149 },
          { name: 'Kulhad Masala Chai', category: 'Beverages', quantity: 560, totalSales: 38640, unitPrice: 69 },
          { name: 'Amritsari Paneer Tikka', category: 'Starters', quantity: 180, totalSales: 50220, unitPrice: 279 },
          { name: 'Butter Croissant', category: 'Bakery', quantity: 140, totalSales: 16660, unitPrice: 119 }
        ],
        hourlyDistribution: {
          12: 24000, 13: 38000, 14: 29000,
          15: 12000, 16: 14000, 17: 15500,
          18: 26000, 19: 42000, 20: 51000, 21: 33000
        },
        dowDistribution: {
          0: 48000, 1: 31000, 2: 26000, 3: 32000, 4: 37000, 5: 56000, 6: 54500
        }
      };
      setParsedReport(demoReport);
      setStep(3);
    }, 1200);
  };

  const handleConfirmReport = async () => {
    if (!parsedReport) return;
    try {
      await api.confirmPosReport(parsedReport, true, selectedMode);
      onSuccess(parsedReport, selectedMode);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save confirmed report.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                {step === 1 && '+ Add Sales Report'}
                {step === 2 && 'Analyzing your report...'}
                {step === 3 && 'Report Confirmed!'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {step === 1 && 'Upload sales report from Petpooja or another POS'}
                {step === 2 && 'Our engine is normalizing your data'}
                {step === 3 && 'Review the extracted business summary'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[75vh]">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to process report</p>
                <p className="text-[11px] text-red-600 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* STEP 1: Upload Dropzone */}
          {step === 1 && (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-orange-500 bg-orange-50/50 scale-[1.01]'
                    : 'border-slate-300 hover:border-orange-400 bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3 shadow-inner">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <p className="text-xs font-semibold text-slate-800">
                  Click to select file or drag & drop here
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supported: <span className="font-semibold text-slate-700">CSV · Excel (XLSX) · PDF</span>
                </p>

                <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white border border-slate-200 text-slate-600 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Petpooja, Posist, DotPe & Generic POS exports</span>
                </div>
              </div>

              {/* Sample file buttons for effortless testing */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => api.downloadSamplePosReport('xlsx')}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-orange-600 transition-colors font-medium"
                    title="Download a pre-formatted Petpooja Excel file to test"
                  >
                    <Download className="w-3 h-3 text-slate-400" />
                    <span>Download sample .xlsx</span>
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    onClick={() => api.downloadSamplePosReport('csv')}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-orange-600 transition-colors font-medium"
                    title="Download a pre-formatted Petpooja CSV file to test"
                  >
                    <Download className="w-3 h-3 text-slate-400" />
                    <span>sample .csv</span>
                  </button>
                </div>

                <button
                  onClick={handleLoadDemoPetpooja}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold border border-orange-200 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>⚡ Try with Sample Report</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Analyzing Progress */}
          {step === 2 && (
            <div className="py-8 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-orange-100 animate-pulse" />
                <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800">Analyzing your report...</h3>
                <p className="text-xs text-slate-500 mt-1">{analysisStatus}</p>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${analyzingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Confirmation Screen */}
          {step === 3 && parsedReport && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  We found:
                </p>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/60 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-medium">Orders</span>
                    <p className="text-base font-extrabold text-slate-800 mt-0.5">
                      {parsedReport.totalOrders.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/60 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-medium">Sales</span>
                    <p className="text-base font-extrabold text-emerald-600 mt-0.5">
                      ₹{parsedReport.totalSales.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/60 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-medium">Products</span>
                    <p className="text-base font-extrabold text-slate-800 mt-0.5">
                      {parsedReport.totalProducts}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/60 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-medium">Period</span>
                    <p className="text-xs font-bold text-slate-800 mt-1 truncate" title={parsedReport.periodLabel}>
                      {parsedReport.periodLabel}
                    </p>
                  </div>
                </div>

                {/* Top dishes preview */}
                {parsedReport.items && parsedReport.items.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60">
                    <p className="text-[10px] font-semibold text-slate-500 mb-1.5">
                      Top dishes detected:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedReport.items.slice(0, 4).map((it, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                        >
                          {it.name} ({it.quantity})
                        </span>
                      ))}
                      {parsedReport.items.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{parsedReport.items.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Data combination selector */}
              <div>
                <p className="text-xs font-bold text-slate-800 mb-2">
                  Analyze with:
                </p>
                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedMode === 'combined'
                      ? 'border-orange-500 bg-orange-50/50 text-slate-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="dataMode"
                        checked={selectedMode === 'combined'}
                        onChange={() => setSelectedMode('combined')}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span>SwaadSevak + Uploaded Report (Combined)</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-200/60 text-orange-800 font-bold">
                      Recommended
                    </span>
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedMode === 'pos'
                      ? 'border-orange-500 bg-orange-50/50 text-slate-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="dataMode"
                        checked={selectedMode === 'pos'}
                        onChange={() => setSelectedMode('pos')}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span>Uploaded Report only</span>
                    </div>
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedMode === 'swaad'
                      ? 'border-orange-500 bg-orange-50/50 text-slate-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="dataMode"
                        checked={selectedMode === 'swaad'}
                        onChange={() => setSelectedMode('swaad')}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span>SwaadSevak only (save report for later)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2 justify-end">
                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Upload Another File
                </button>
                <button
                  onClick={handleConfirmReport}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Use This Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

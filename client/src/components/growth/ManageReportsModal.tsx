import React from 'react';
import {
  FileSpreadsheet,
  Trash2,
  CheckCircle2,
  X,
  Plus,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';

interface ManageReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: {
    id: string;
    fileName: string;
    posProvider: string;
    periodLabel: string;
    totalOrders: number;
    totalSales: number;
    uploadedAt: string;
  }[];
  activeReportId?: string;
  onSelectReport: (reportId: string) => void;
  onOpenUpload: () => void;
  onRefresh: () => void;
}

export const ManageReportsModal: React.FC<ManageReportsModalProps> = ({
  isOpen,
  onClose,
  reports,
  activeReportId,
  onSelectReport,
  onOpenUpload,
  onRefresh
}) => {
  if (!isOpen) return null;

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Remove this saved report from Growth Engine?')) return;
    try {
      await api.deletePosReport(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to remove report');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold text-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Data Sources & Reports</h2>
              <p className="text-[11px] text-slate-500">Manage external POS reports uploaded to SwaadSevak</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Reports */}
        <div className="p-5 overflow-y-auto max-h-[60vh] space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">No POS reports uploaded yet</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Upload monthly sales exports from Petpooja or another POS.</p>
              <button
                onClick={() => {
                  onClose();
                  onOpenUpload();
                }}
                className="mt-4 px-3.5 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-md hover:bg-orange-500 transition-colors"
              >
                + Add First Report
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {reports.map((rep) => {
                const isActive = activeReportId === rep.id;
                return (
                  <div
                    key={rep.id}
                    onClick={() => {
                      onSelectReport(rep.id);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-800 truncate">{rep.fileName}</p>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600 shrink-0">
                            {rep.posProvider}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          <span>{rep.periodLabel}</span>
                          <span>·</span>
                          <span className="font-semibold text-slate-700">{rep.totalOrders} orders</span>
                          <span>·</span>
                          <span className="font-bold text-emerald-600">₹{rep.totalSales.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 px-2 py-1 rounded-md bg-orange-100/60">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectReport(rep.id);
                            onClose();
                          }}
                          className="text-[11px] font-semibold text-slate-600 hover:text-orange-600 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          Select
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(rep.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete this report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
          <p className="text-[11px] text-slate-500">
            {reports.length} report{reports.length === 1 ? '' : 's'} stored
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenUpload();
              }}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add POS Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

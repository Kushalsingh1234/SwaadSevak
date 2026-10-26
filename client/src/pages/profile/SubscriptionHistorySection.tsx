import React, { useState } from 'react';
import {
  Receipt,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

export const SubscriptionHistorySection: React.FC = () => {
  const { subscriptionHistory } = useProfile();
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    setDownloadNotice(`Downloading official GST invoice ${invoiceNumber} (PDF)...`);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 2800);
  };

  const getStatusBadge = (status: 'ACTIVE' | 'RENEWED' | 'EXPIRED') => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ACTIVE
          </span>
        );
      case 'RENEWED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            RENEWED
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            EXPIRED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Subscription History &amp; Invoices
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track past payment records, plan renewals, and download tax invoices for business accounting.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>GST Tax Invoices with SAC 998313</span>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Responsive Table Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-5">Plan Name</th>
                <th className="py-4 px-4">Duration</th>
                <th className="py-4 px-4">Amount Paid</th>
                <th className="py-4 px-4">Purchase Date</th>
                <th className="py-4 px-4">Expiry Date</th>
                <th className="py-4 px-4">Payment Status</th>
                <th className="py-4 px-4">Transaction ID</th>
                <th className="py-4 px-5 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {subscriptionHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                        <Receipt className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.planName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-700 whitespace-nowrap">
                    {item.duration}
                  </td>
                  <td className="py-4 px-4 font-black text-slate-900 whitespace-nowrap">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(item.purchaseDate)}
                  </td>
                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(item.expiryDate)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {item.transactionId}
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(item.invoiceNumber)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                      title={`Download Invoice ${item.invoiceNumber}`}
                    >
                      <Download className="w-3 h-3 text-orange-500" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
        <span>Need custom corporate tax invoicing or TDS credit certificates?</span>
        <a
          href="mailto:billing@swaadsevak.in"
          className="text-orange-600 hover:underline font-semibold"
        >
          Contact Billing Support →
        </a>
      </div>
    </div>
  );
};

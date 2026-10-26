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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ACTIVE
          </span>
        );
      case 'RENEWED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            RENEWED
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-500/15 text-stone-400 border border-stone-500/30">
            EXPIRED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Subscription History &amp; Invoices
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Track past payment records, plan renewals, and download tax invoices for business accounting.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>GST Tax Invoices with SAC 998313</span>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Responsive Table Card */}
      <div className="rounded-3xl bg-[#1C120C]/90 border border-white/[0.1] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/[0.08] text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-white/[0.06] text-stone-200">
              {subscriptionHistory.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-5 font-bold text-white whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
                        <Receipt className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.planName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-stone-300 whitespace-nowrap">
                    {item.duration}
                  </td>
                  <td className="py-4 px-4 font-black text-white whitespace-nowrap">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4 text-stone-400 whitespace-nowrap">
                    {formatDate(item.purchaseDate)}
                  </td>
                  <td className="py-4 px-4 text-stone-400 whitespace-nowrap">
                    {formatDate(item.expiryDate)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-stone-400 whitespace-nowrap">
                    {item.transactionId}
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(item.invoiceNumber)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-stone-200 text-xs font-semibold transition-all cursor-pointer hover:text-white"
                      title={`Download Invoice ${item.invoiceNumber}`}
                    >
                      <Download className="w-3 h-3 text-orange-400" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#140C07] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
        <span>Need custom corporate tax invoicing or TDS credit certificates?</span>
        <a
          href="mailto:billing@swaadsevak.in"
          className="text-orange-400 hover:underline font-semibold"
        >
          Contact Billing Support →
        </a>
      </div>
    </div>
  );
};

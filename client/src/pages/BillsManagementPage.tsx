import React, { useState } from 'react';
import { Receipt, Check, CreditCard, Banknote, Smartphone, Printer, Search, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Bill, Restaurant } from '../types';
import { api } from '../services/api';
import { InvoiceModal } from '../components/InvoiceModal';

interface BillsManagementPageProps {
  restaurant: Restaurant | null;
  bills: Bill[];
  onRefreshBills: () => void;
}

export const BillsManagementPage: React.FC<BillsManagementPageProps> = ({
  restaurant,
  bills,
  onRefreshBills,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'UNPAID'>('ALL');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const filteredBills = bills.filter((b) => {
    const isPaid = b.paymentStatus.startsWith('PAID');
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PAID' && isPaid) ||
      (statusFilter === 'UNPAID' && !isPaid);

    const matchesSearch =
      b.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleSettle = async (billId: string, paymentStatus: string) => {
    try {
      await api.settleBill(billId, paymentStatus);
      onRefreshBills();
    } catch (err) {
      console.error('Failed to settle bill:', err);
    }
  };

  const totalCollected = bills
    .filter(b => b.paymentStatus.startsWith('PAID'))
    .reduce((sum, b) => sum + (b.grandTotal || 0), 0);

  const totalTax = bills
    .filter(b => b.paymentStatus.startsWith('PAID'))
    .reduce((sum, b) => sum + (b.tax || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Bills & Digital Invoices
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-slate-700">
              {bills.length} invoices
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            5% GST Ready • Total Settled: <span className="font-bold text-slate-900 tabular-nums">₹{totalCollected.toFixed(0)}</span> (GST: ₹{totalTax.toFixed(0)})
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by table or bill #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
        {[
          { id: 'ALL', label: `All Invoices (${bills.length})` },
          { id: 'PAID', label: `Settled / Paid (${bills.filter(b => b.paymentStatus.startsWith('PAID')).length})` },
          { id: 'UNPAID', label: `Unpaid / Open (${bills.filter(b => !b.paymentStatus.startsWith('PAID')).length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bills Table Card */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Table</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">5% GST</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400 text-xs">
                    No bills found matching your filter. Bills are generated automatically upon order settlement.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => {
                  const billDate = new Date(bill.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short'
                  });
                  const billTime = new Date(bill.createdAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });

                  const isPaid = bill.paymentStatus.startsWith('PAID');

                  return (
                    <tr key={bill.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {bill.billNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-xs text-slate-900 bg-stone-100 px-2 py-0.5 rounded">
                          {bill.tableNumber || 'Counter'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        #{bill.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {billDate}, {billTime}
                      </td>
                      <td className="py-3 px-4 text-slate-600 tabular-nums">
                        ₹{bill.subtotal.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-slate-600 tabular-nums">
                        ₹{bill.tax.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 tabular-nums text-sm">
                        ₹{bill.grandTotal.toFixed(2)}
                      </td>

                      {/* Payment Status & Fast Settlement */}
                      <td className="py-3 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{bill.paymentStatus.replace('PAID_', '')}</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSettle(bill.id, 'PAID_UPI')}
                              title="Settle with UPI"
                              className="px-2 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-[11px] font-bold"
                            >
                              UPI
                            </button>
                            <button
                              onClick={() => handleSettle(bill.id, 'PAID_CASH')}
                              title="Settle with Cash"
                              className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold"
                            >
                              Cash
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Print / View Receipt Modal */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedBill(bill)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
                          title="Print tax invoice"
                        >
                          <Receipt className="w-3.5 h-3.5 text-slate-500" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal Preview & Thermal Print */}
      {selectedBill && (
        <InvoiceModal
          order={null}
          bill={selectedBill}
          restaurant={restaurant}
          isOpen={Boolean(selectedBill)}
          onClose={() => setSelectedBill(null)}
        />
      )}
    </div>
  );
};

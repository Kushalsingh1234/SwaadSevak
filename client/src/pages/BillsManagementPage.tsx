import React, { useState } from 'react';
import { Receipt, Check, CreditCard, Banknote, Smartphone, Printer, Search, Download } from 'lucide-react';
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
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const filteredBills = bills.filter(
    (b) =>
      b.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSettle = async (billId: string, paymentStatus: string) => {
    try {
      await api.settleBill(billId, paymentStatus);
      onRefreshBills();
    } catch (err) {
      console.error('Failed to settle bill:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bills & Digital Invoices
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View completed table bills, record payments (Cash, UPI, Card), and reprint receipts.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by table or bill #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Table</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">Tax (5%)</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No bills generated yet. Bills are automatically generated when guests request the bill or an order is completed.
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
                    <tr key={bill.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {bill.billNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {bill.tableNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {bill.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {billDate}, {billTime}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        ₹{bill.subtotal.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        ₹{bill.tax.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">
                        ₹{bill.grandTotal.toFixed(2)}
                      </td>

                      {/* Payment Status & Settlement */}
                      <td className="py-3 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <Check className="w-3 h-3" />
                            <span>{bill.paymentStatus.replace('PAID_', '')}</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSettle(bill.id, 'PAID_UPI')}
                              title="Settle with UPI"
                              className="px-2 py-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 text-[10px] font-bold"
                            >
                              UPI
                            </button>
                            <button
                              onClick={() => handleSettle(bill.id, 'PAID_CASH')}
                              title="Settle with Cash"
                              className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold"
                            >
                              Cash
                            </button>
                            <button
                              onClick={() => handleSettle(bill.id, 'PAID_CARD')}
                              title="Settle with Card"
                              className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold"
                            >
                              Card
                            </button>
                          </div>
                        )}
                      </td>

                      {/* View Invoice */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedBill(bill)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                          title="View / Print Tax Invoice"
                        >
                          <Printer className="w-4 h-4" />
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

      {/* Invoice Modal for selected bill */}
      {selectedBill && (
        <InvoiceModal
          order={{
            id: selectedBill.orderId,
            restaurantId: selectedBill.restaurantId,
            tableId: '',
            tableNumber: selectedBill.tableNumber,
            orderNumber: selectedBill.orderNumber,
            source: 'DINE_IN',
            status: 'COMPLETED',
            subtotal: selectedBill.subtotal,
            tax: selectedBill.tax,
            total: selectedBill.grandTotal,
            kotGenerated: true,
            billRequested: false,
            createdAt: selectedBill.createdAt,
            updatedAt: selectedBill.createdAt,
            items: selectedBill.items
          }}
          bill={selectedBill}
          restaurant={restaurant}
          isOpen={Boolean(selectedBill)}
          onClose={() => setSelectedBill(null)}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Utensils,
  Printer,
  Receipt,
  Send,
  Search,
  User,
  Phone,
  CreditCard,
  Banknote,
  QrCode,
  Loader2,
  CheckCircle2,
  ShoppingBag,
  Bike,
  Check,
  RotateCcw
} from 'lucide-react';
import { MenuItem, MenuCategory, TableItem, Restaurant, PrinterConfig, Order, Bill } from '../types';
import { api } from '../services/api';
import { kotPrinter } from '../utils/kotPrinter';
import { sendInvoicePdfWhatsApp } from '../utils/invoicePdf';

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
  printerConfig?: PrinterConfig;
  onOrderCreated: (order: Order, bill?: Bill | null) => void;
  onTriggerKot?: (order: Order) => void;
  onTriggerInvoice?: (order: Order, bill?: Bill | null) => void;
}

interface CartItem {
  id: string;
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  portion?: string;
  notes?: string;
  isCustom?: boolean;
}

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  printerConfig,
  onOrderCreated,
  onTriggerKot,
  onTriggerInvoice
}) => {
  // Modal Step State: 'FORM' for punching order, 'POST_KOT' for finalizing & sending receipts
  const [modalStep, setModalStep] = useState<'FORM' | 'POST_KOT'>('FORM');
  const [activeCreatedOrder, setActiveCreatedOrder] = useState<Order | null>(null);
  const [activeCreatedBill, setActiveCreatedBill] = useState<Bill | null>(null);

  // Data state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Order meta state
  const [orderSource, setOrderSource] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('DINE_IN');
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [customTableNumber, setCustomTableNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');

  // Cart & items state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Custom off-menu item state
  const [showCustomItemRow, setShowCustomItemRow] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [customItemQty, setCustomItemQty] = useState(1);

  // Payment settlement state
  const [isPaidNow, setIsPaidNow] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'CARD'>('UPI');

  // Submission / Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Post-KOT Settlement & WhatsApp states
  const [postKotSettleMode, setPostKotSettleMode] = useState<'CASH' | 'UPI' | 'CARD'>('UPI');
  const [isSettlingBill, setIsSettlingBill] = useState(false);
  const [postKotWaPhone, setPostKotWaPhone] = useState('');
  const [isSendingPostKotWa, setIsSendingPostKotWa] = useState(false);
  const [postKotFeedback, setPostKotFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load menu items, categories, and tables on open
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    let isMounted = true;
    setIsLoadingData(true);

    Promise.all([
      api.getMenuItems().catch(() => ({ items: [] })),
      api.getCategories().catch(() => ({ categories: [] })),
      api.getTables().catch(() => ({ tables: [] }))
    ])
      .then(([itemsRes, catsRes, tablesRes]) => {
        if (!isMounted) return;
        const items = itemsRes?.items || itemsRes || [];
        const cats = catsRes?.categories || catsRes || [];
        const tbls = tablesRes?.tables || tablesRes || [];

        setMenuItems(Array.isArray(items) ? items : []);
        setCategories(Array.isArray(cats) ? cats : []);
        setTables(Array.isArray(tbls) ? tbls : []);

        if (Array.isArray(tbls) && tbls.length > 0 && !selectedTableId) {
          setSelectedTableId(tbls[0].id);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingData(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const resetForm = () => {
    setModalStep('FORM');
    setActiveCreatedOrder(null);
    setActiveCreatedBill(null);
    setCartItems([]);
    setSearchQuery('');
    setSelectedCategory('ALL');
    setShowCustomItemRow(false);
    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemQty(1);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerNotes('');
    setIsPaidNow(false);
    setPaymentMode('UPI');
    setIsSubmitting(false);
    setActionInProgress(null);
    setStatusMessage(null);
    setIsSettlingBill(false);
    setIsSendingPostKotWa(false);
    setPostKotFeedback(null);
  };

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    let list = menuItems.filter(i => i.isAvailable !== false);
    if (selectedCategory !== 'ALL') {
      list = list.filter(i => i.categoryId === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(i => i.name.toLowerCase().includes(q));
    }
    return list;
  }, [menuItems, selectedCategory, searchQuery]);

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const gstTier = restaurant?.gstTier || '5%';
  const isGstInclusive = gstTier === 'inclusive' || gstTier === '0%' || gstTier === '0';

  const tax = useMemo(() => {
    if (isGstInclusive) return 0;
    if (gstTier === '18%') return Math.round(subtotal * 0.18 * 100) / 100;
    return Math.round(subtotal * 0.05 * 100) / 100;
  }, [subtotal, gstTier, isGstInclusive]);

  const grandTotal = Math.round((subtotal + tax) * 100) / 100;

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => (i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          portion: item.portion || 'Standard'
        }
      ];
    });
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCartItems(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, idx) => idx !== index);
      }
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddCustomOffMenuItem = () => {
    const trimmed = customItemName.trim();
    const priceNum = parseFloat(customItemPrice);
    if (!trimmed || isNaN(priceNum) || priceNum < 0) {
      alert('Please enter a valid item name and price.');
      return;
    }
    const qty = customItemQty > 0 ? customItemQty : 1;

    setCartItems(prev => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        name: trimmed,
        price: priceNum,
        quantity: qty,
        portion: 'Special',
        isCustom: true
      }
    ]);

    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemQty(1);
    setShowCustomItemRow(false);
  };

  // Submit Order Logic with Target Action
  const handleProcessOrder = async (targetAction: 'DISPATCH' | 'PRINT_KOT' | 'PRINT_RECEIPT' | 'WHATSAPP_RECEIPT') => {
    if (cartItems.length === 0) {
      setStatusMessage({ type: 'error', text: 'Please add at least one item to the order.' });
      return;
    }

    if (targetAction === 'WHATSAPP_RECEIPT' && (!customerPhone || customerPhone.trim().length < 10)) {
      setStatusMessage({ type: 'error', text: 'Please provide a valid 10-digit WhatsApp number for e-receipt delivery.' });
      return;
    }

    setIsSubmitting(true);
    setActionInProgress(targetAction);
    setStatusMessage(null);

    try {
      // Determine table number
      let resolvedTableNumber = 'Takeaway';
      let resolvedTableId = selectedTableId;

      if (orderSource === 'DINE_IN') {
        if (customTableNumber.trim()) {
          resolvedTableNumber = customTableNumber.trim();
        } else {
          const matchedTable = tables.find(t => t.id === selectedTableId);
          resolvedTableNumber = matchedTable ? matchedTable.tableNumber : 'Table 1';
        }
      } else if (orderSource === 'TAKEAWAY') {
        resolvedTableNumber = 'Takeaway / Counter';
        resolvedTableId = '';
      } else if (orderSource === 'DELIVERY') {
        resolvedTableNumber = 'Direct Delivery';
        resolvedTableId = '';
      }

      // Check if order should be paid immediately
      const shouldBePaid = isPaidNow || targetAction === 'PRINT_RECEIPT' || targetAction === 'WHATSAPP_RECEIPT';

      const payload = {
        tableId: resolvedTableId || undefined,
        tableNumber: resolvedTableNumber,
        source: orderSource === 'DINE_IN' ? 'DINE_IN' : 'OTHER',
        items: cartItems.map(it => ({
          menuItemId: it.menuItemId,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          portion: it.portion,
          notes: it.notes
        })),
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        customerNotes: customerNotes.trim() || undefined,
        status: 'PREPARING',
        paymentStatus: shouldBePaid ? 'PAID' : 'PENDING',
        paymentMode: shouldBePaid ? paymentMode : undefined
      };

      const res = await api.createCustomOrder(payload);

      if (!res.success || !res.order) {
        throw new Error(res.message || 'Failed to create custom order');
      }

      const createdOrder: Order = res.order;
      const createdBill: Bill | null = res.bill || null;

      // Notify parent to immediately refresh live orders in background
      onOrderCreated(createdOrder, createdBill);

      // Handle Post-Creation action
      if (targetAction === 'PRINT_KOT') {
        kotPrinter.printOrderKot(
          restaurant,
          createdOrder,
          printerConfig || {
            id: 'default',
            printerName: 'KOT Printer',
            paperWidth: '80mm',
            autoPrintKot: true,
            printerType: 'BROWSER'
          },
          { interactiveModal: true }
        );
        if (onTriggerKot) {
          onTriggerKot(createdOrder);
        }

        // KEEP DRAWER OPEN & SWITCH TO FINALIZATION VIEW
        setActiveCreatedOrder(createdOrder);
        setActiveCreatedBill(createdBill);
        setPostKotWaPhone(createdOrder.customerPhone || customerPhone || '');
        setModalStep('POST_KOT');
        setPostKotFeedback({
          type: 'success',
          text: `✓ KOT #${createdOrder.kotNumber || createdOrder.orderNumber} printed & sent to kitchen! Order is now cooking.`
        });
      } else if (targetAction === 'PRINT_RECEIPT') {
        setActiveCreatedOrder(createdOrder);
        setActiveCreatedBill(createdBill);
        setPostKotWaPhone(createdOrder.customerPhone || customerPhone || '');
        setModalStep('POST_KOT');
        if (onTriggerInvoice) {
          onTriggerInvoice(createdOrder, createdBill);
        }
      } else if (targetAction === 'WHATSAPP_RECEIPT') {
        setActiveCreatedOrder(createdOrder);
        setActiveCreatedBill(createdBill);
        setPostKotWaPhone(customerPhone.trim());
        setModalStep('POST_KOT');

        const waRes = await sendInvoicePdfWhatsApp(
          createdOrder,
          createdBill,
          restaurant,
          customerPhone.trim()
        );
        if (waRes.success) {
          setPostKotFeedback({ type: 'success', text: '✓ Official PDF E-Receipt sent to customer WhatsApp!' });
        } else {
          setPostKotFeedback({ type: 'error', text: `Order created, but WhatsApp dispatch noted: ${waRes.message}` });
        }
      } else if (targetAction === 'DISPATCH') {
        // Plain kitchen dispatch: close drawer as requested
        onClose();
      }
    } catch (err: any) {
      console.error('Custom order creation failed:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Could not create order. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setActionInProgress(null);
    }
  };

  // Settle Bill from Post-KOT Step
  const handleSettleActiveBill = async () => {
    if (!activeCreatedOrder) return;
    setIsSettlingBill(true);
    setPostKotFeedback(null);
    try {
      let billId = activeCreatedBill?.id;
      if (!billId) {
        const genRes = await api.generateBill(activeCreatedOrder.id);
        if (genRes?.success && genRes.bill) {
          billId = genRes.bill.id;
        }
      }

      if (billId) {
        const payStatus = postKotSettleMode === 'CARD' ? 'PAID_CARD' : postKotSettleMode === 'UPI' ? 'PAID_UPI' : 'PAID_CASH';
        const res = await api.settleBill(billId, payStatus);
        if (res.success && res.bill) {
          setActiveCreatedBill(res.bill);
          onOrderCreated(activeCreatedOrder, res.bill);
          setPostKotFeedback({
            type: 'success',
            text: `✓ Bill settled via ${postKotSettleMode}! Receipt is ready to print or send.`
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to settle bill:', err);
      setPostKotFeedback({ type: 'error', text: err.message || 'Failed to settle bill' });
    } finally {
      setIsSettlingBill(false);
    }
  };

  // Send WhatsApp PDF from Post-KOT Step
  const handleSendPostKotWhatsApp = async () => {
    if (!activeCreatedOrder) return;
    const phone = postKotWaPhone.trim();
    if (!phone || phone.length < 10) {
      setPostKotFeedback({ type: 'error', text: 'Please enter a valid 10-digit customer WhatsApp number.' });
      return;
    }

    setIsSendingPostKotWa(true);
    setPostKotFeedback(null);
    try {
      const waRes = await sendInvoicePdfWhatsApp(
        activeCreatedOrder,
        activeCreatedBill,
        restaurant,
        phone
      );
      if (waRes.success) {
        setPostKotFeedback({ type: 'success', text: `✓ Official PDF E-Receipt successfully delivered to ${phone} on WhatsApp!` });
      } else {
        setPostKotFeedback({ type: 'error', text: waRes.message || 'Failed to send PDF receipt' });
      }
    } catch (err: any) {
      setPostKotFeedback({ type: 'error', text: err.message || 'WhatsApp sending error' });
    } finally {
      setIsSendingPostKotWa(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto no-scrollbar"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[92vh]">
        
        {/* STEP 2: POST-KOT FINALIZATION & RECEIPT VIEW */}
        {modalStep === 'POST_KOT' && activeCreatedOrder ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      Order #{activeCreatedOrder.orderNumber} • {activeCreatedOrder.tableNumber}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      👨‍🍳 KOT Active & Cooking
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    KOT dispatched to kitchen. Finalize payment settlement and dispatch e-receipt below.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
              {postKotFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in duration-150 ${
                    postKotFeedback.type === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <span>{postKotFeedback.text}</span>
                  <button onClick={() => setPostKotFeedback(null)} className="ml-2 font-bold hover:underline">×</button>
                </div>
              )}

              {/* Order Meta Snapshot Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Table / Ref:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{activeCreatedOrder.tableNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Order Number:</span>
                    <span className="font-extrabold text-slate-900 text-sm">#{activeCreatedOrder.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Customer:</span>
                    <span className="font-bold text-slate-800">
                      {activeCreatedOrder.customerName || 'Walk-in'} {activeCreatedOrder.customerPhone ? `(${activeCreatedOrder.customerPhone})` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Payment Status:</span>
                    {activeCreatedBill?.paymentStatus && activeCreatedBill.paymentStatus.startsWith('PAID') ? (
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ✓ {activeCreatedBill.paymentStatus.replace('PAID_', 'Paid via ')}
                      </span>
                    ) : (
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Pending Settlement
                      </span>
                    )}
                  </div>
                </div>

                {/* Items Mini List */}
                <div className="border-t border-stone-200/80 pt-3">
                  <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mb-1">
                    <span>Items Ordered ({activeCreatedOrder.items.length})</span>
                    <span>Total Amount</span>
                  </div>
                  <div className="space-y-1">
                    {activeCreatedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-800">
                        <span>{it.quantity}× {it.name} {it.portion ? `(${it.portion})` : ''}</span>
                        <span className="font-mono font-medium">₹{(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-baseline pt-2 mt-2 border-t border-stone-200 font-extrabold text-sm text-slate-900">
                    <span>Grand Total:</span>
                    <span className="text-base text-brand-600 font-mono">
                      ₹{(activeCreatedBill?.grandTotal || activeCreatedOrder.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Settlement Section (if Unpaid) */}
              {(!activeCreatedBill || !activeCreatedBill.paymentStatus?.startsWith('PAID')) && (
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                      <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                      <span>Finalize Payment & Settle Bill</span>
                    </h3>
                    <span className="text-[11px] font-semibold text-amber-800">
                      Amount Due: ₹{(activeCreatedBill?.grandTotal || activeCreatedOrder.total).toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                      { id: 'CASH', label: 'Cash', icon: Banknote },
                      { id: 'CARD', label: 'Card / POS', icon: CreditCard }
                    ].map(m => {
                      const Icon = m.icon;
                      const isModeActive = postKotSettleMode === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPostKotSettleMode(m.id as any)}
                          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                            isModeActive
                              ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                              : 'bg-white text-slate-700 border-amber-300 hover:bg-amber-100/50'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={isSettlingBill}
                    onClick={handleSettleActiveBill}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
                  >
                    {isSettlingBill ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Mark Paid via {postKotSettleMode} & Settle Bill (₹{(activeCreatedBill?.grandTotal || activeCreatedOrder.total).toFixed(2)})</span>
                  </button>
                </div>
              )}

              {/* WhatsApp E-Receipt & Print Section */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Send Official PDF E-Receipt to Customer</span>
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Direct PDF Attachment
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="Customer WhatsApp Number (e.g. 9876543210)"
                      value={postKotWaPhone}
                      onChange={e => setPostKotWaPhone(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-emerald-300 rounded-lg text-slate-800 font-mono focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={isSendingPostKotWa || !postKotWaPhone.trim()}
                    onClick={handleSendPostKotWhatsApp}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {isSendingPostKotWa ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Send WhatsApp PDF</span>
                  </button>
                </div>
              </div>

              {/* Direct Thermal Print Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onTriggerInvoice) {
                      onTriggerInvoice(activeCreatedOrder, activeCreatedBill);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>🧾 Print Tax Receipt / Bill</span>
                </button>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-brand-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>+ Punch Another Custom Order</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
              >
                ✓ Done • View on Live Board
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1: INITIAL PUNCH ORDER FORM */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0 border border-brand-500/20">
                  <Utensils className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">Manual Custom Order</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Manager Quick-Punch
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Punch dine-in, takeaway, or direct orders with instant KOT & WhatsApp e-receipt
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two column layout on desktop */}
            <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
              {/* Left Column: Order Setup & Menu Selection (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-5 space-y-4 overflow-y-auto no-scrollbar">
                {/* 1. Channel Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Order Channel</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'DINE_IN', label: 'Dine-In', icon: Utensils },
                      { id: 'TAKEAWAY', label: 'Takeaway / Counter', icon: ShoppingBag },
                      { id: 'DELIVERY', label: 'Direct Delivery', icon: Bike }
                    ].map(opt => {
                      const Icon = opt.icon;
                      const isActive = orderSource === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setOrderSource(opt.id as any)}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                            isActive
                              ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                              : 'bg-white text-slate-600 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="truncate">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Table Selection (if Dine-In) */}
                {orderSource === 'DINE_IN' && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Assign Table</label>
                      <span className="text-[11px] text-slate-500">Select or type custom</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={selectedTableId}
                        onChange={e => {
                          setSelectedTableId(e.target.value);
                          setCustomTableNumber('');
                        }}
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-hidden focus:border-brand-500"
                      >
                        {tables.map(tbl => (
                          <option key={tbl.id} value={tbl.id}>
                            {tbl.tableNumber} {(tbl as any).capacity ? `(${(tbl as any).capacity} Pax)` : ''}
                          </option>
                        ))}
                        {tables.length === 0 && <option value="">No pre-saved tables</option>}
                      </select>
                      <input
                        type="text"
                        placeholder="Or type custom (e.g. T-12)"
                        value={customTableNumber}
                        onChange={e => setCustomTableNumber(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-brand-500"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Customer Info (For CRM & WhatsApp PDF) */}
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Customer & WhatsApp Details</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      For WhatsApp PDF Receipt
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Customer Name (Optional)"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full text-xs pl-8 pr-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="10-digit WhatsApp Number"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        className="w-full text-xs pl-8 pr-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Menu Item Browser */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Menu Items ({filteredMenuItems.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCustomItemRow(!showCustomItemRow)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Off-Menu Custom Item</span>
                    </button>
                  </div>

                  {/* Off-Menu Custom Item Quick Form */}
                  {showCustomItemRow && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 animate-in fade-in duration-150">
                      <p className="text-[11px] font-bold text-amber-900">Add Off-Menu Dish or Special Request:</p>
                      <div className="grid grid-cols-12 gap-2">
                        <input
                          type="text"
                          placeholder="Item name (e.g. Extra Butter Naan)"
                          value={customItemName}
                          onChange={e => setCustomItemName(e.target.value)}
                          className="col-span-6 text-xs bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                        />
                        <input
                          type="number"
                          placeholder="₹ Price"
                          value={customItemPrice}
                          onChange={e => setCustomItemPrice(e.target.value)}
                          className="col-span-3 text-xs bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomOffMenuItem}
                          className="col-span-3 text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg px-2 py-1.5 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Search & Categories Bar */}
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-brand-500"
                      />
                    </div>

                    {/* Category Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('ALL')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                          selectedCategory === 'ALL'
                            ? 'bg-slate-800 text-white'
                            : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                        }`}
                      >
                        All
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                            selectedCategory === cat.id
                              ? 'bg-slate-800 text-white'
                              : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Items Grid */}
                  <div className="max-h-56 overflow-y-auto no-scrollbar space-y-1.5 pr-1">
                    {isLoadingData ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1 text-brand-500" />
                        Loading menu catalog...
                      </div>
                    ) : filteredMenuItems.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-stone-200 rounded-xl">
                        No items match search. Use &quot;+ Off-Menu Custom Item&quot; to add manually.
                      </div>
                    ) : (
                      filteredMenuItems.map(item => {
                        const inCart = cartItems.find(c => c.menuItemId === item.id);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200/80 hover:border-brand-300 hover:bg-stone-50/50 transition-colors"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                                <span className="font-semibold text-slate-900 font-mono">₹{item.price}</span>
                                {item.portion && <span>• {item.portion}</span>}
                              </div>
                            </div>

                            {inCart ? (
                              <div className="flex items-center gap-1 bg-brand-50 border border-brand-200 rounded-lg p-0.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const idx = cartItems.findIndex(c => c.menuItemId === item.id);
                                    if (idx !== -1) handleUpdateQuantity(idx, -1);
                                  }}
                                  className="w-6 h-6 rounded flex items-center justify-center text-brand-700 hover:bg-brand-100"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold text-brand-800 px-1 font-mono">{inCart.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const idx = cartItems.findIndex(c => c.menuItemId === item.id);
                                    if (idx !== -1) handleUpdateQuantity(idx, 1);
                                  }}
                                  className="w-6 h-6 rounded flex items-center justify-center text-brand-700 hover:bg-brand-100"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddToCart(item)}
                                className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-brand-500 hover:text-white text-slate-700 rounded-lg text-xs font-bold transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add</span>
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Order Cart, Totals & Quick Actions (5 cols) */}
              <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-stone-50/40">
                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-brand-600" />
                      <span>Order Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
                    </h3>
                    {cartItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setCartItems([])}
                        className="text-[11px] font-semibold text-rose-600 hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="text-center py-10 px-4 border border-dashed border-stone-200 rounded-2xl bg-white text-slate-400">
                      <Utensils className="w-7 h-7 mx-auto mb-2 text-stone-300" />
                      <p className="text-xs font-bold text-slate-600">Cart is empty</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Click + on items or add a custom item to start</p>
                    </div>
                  ) : (
                    <div className="max-h-56 overflow-y-auto no-scrollbar space-y-1.5 pr-1">
                      {cartItems.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-800 truncate">{item.name}</span>
                              {item.isCustom && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-100 text-amber-800">
                                  Custom
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">₹{item.price} each</p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(idx, -1)}
                                className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-stone-200"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-xs font-bold px-1.5 font-mono text-slate-800">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(idx, 1)}
                                className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-stone-200"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                            <span className="text-xs font-bold text-slate-900 font-mono min-w-[50px] text-right">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kitchen Notes Input */}
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="Special instructions (e.g. Less spicy, extra sauce)"
                      value={customerNotes}
                      onChange={e => setCustomerNotes(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-brand-500"
                    />
                  </div>

                  {/* Settlement / Immediate Payment Option */}
                  <div className="p-2.5 bg-white border border-stone-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-brand-600" />
                        <span>Payment Status</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPaidNow}
                          onChange={e => setIsPaidNow(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-xs font-semibold text-slate-700">Mark Paid Now</span>
                      </label>
                    </div>

                    {isPaidNow && (
                      <div className="grid grid-cols-3 gap-1.5 pt-1 animate-in fade-in duration-150">
                        {[
                          { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                          { id: 'CASH', label: 'Cash', icon: Banknote },
                          { id: 'CARD', label: 'Card / POS', icon: CreditCard }
                        ].map(m => {
                          const Icon = m.icon;
                          const isModeActive = paymentMode === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setPaymentMode(m.id as any)}
                              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-colors ${
                                isModeActive
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                  : 'bg-stone-50 text-slate-600 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              <Icon className="w-3 h-3" />
                              <span>{m.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Bill Totals Breakdown */}
                  <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold font-mono text-slate-800">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>GST ({gstTier})</span>
                      <span className="font-semibold font-mono text-slate-800">
                        {isGstInclusive ? 'Included in prices' : `₹${tax.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-stone-200">
                      <span>Grand Total</span>
                      <span className="font-mono text-brand-600">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Error / Feedback Message */}
                {statusMessage && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-semibold ${
                      statusMessage.type === 'error'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {statusMessage.text}
                  </div>
                )}

                {/* Action Buttons Matrix */}
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <div className="grid grid-cols-2 gap-2">
                    {/* 1. Generate KOT */}
                    <button
                      type="button"
                      disabled={isSubmitting || cartItems.length === 0}
                      onClick={() => handleProcessOrder('PRINT_KOT')}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold shadow-xs transition-colors active:scale-95 disabled:opacity-50"
                      title="Create order, send KOT to kitchen, and finalize bill/receipt"
                    >
                      {isSubmitting && actionInProgress === 'PRINT_KOT' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Printer className="w-3.5 h-3.5" />
                      )}
                      <span>👨‍🍳 KOT & Finalize</span>
                    </button>

                    {/* 2. Print Thermal Receipt */}
                    <button
                      type="button"
                      disabled={isSubmitting || cartItems.length === 0}
                      onClick={() => handleProcessOrder('PRINT_RECEIPT')}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors active:scale-95 disabled:opacity-50"
                      title="Create order, settle payment, and print receipt"
                    >
                      {isSubmitting && actionInProgress === 'PRINT_RECEIPT' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Receipt className="w-3.5 h-3.5" />
                      )}
                      <span>Print Receipt</span>
                    </button>
                  </div>

                  {/* 3. Send WhatsApp PDF E-Receipt */}
                  <button
                    type="button"
                    disabled={isSubmitting || cartItems.length === 0}
                    onClick={() => handleProcessOrder('WHATSAPP_RECEIPT')}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors active:scale-95 disabled:opacity-50"
                    title="Send the official PDF e-receipt to customer WhatsApp"
                  >
                    {isSubmitting && actionInProgress === 'WHATSAPP_RECEIPT' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Send WhatsApp PDF E-Receipt</span>
                  </button>

                  {/* 4. Just Save & Dispatch Order */}
                  <button
                    type="button"
                    disabled={isSubmitting || cartItems.length === 0}
                    onClick={() => handleProcessOrder('DISPATCH')}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting && actionInProgress === 'DISPATCH' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>Dispatch to Live Kitchen Only</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

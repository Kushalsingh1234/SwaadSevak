import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Utensils,
  ChefHat,
  Search,
  Loader2,
  CheckCircle2,
  ShoppingBag,
  Bike,
  Sparkles
} from 'lucide-react';
import { MenuItem, MenuCategory, TableItem, Restaurant, PrinterConfig, Order } from '../types';
import { api } from '../services/api';
import { kotPrinter } from '../utils/kotPrinter';

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
  printerConfig?: PrinterConfig;
  onOrderCreated: (order: Order) => void;
  onTriggerKot?: (order: Order) => void;
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
  onTriggerKot
}) => {
  // Data state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Order meta state
  const [orderSource, setOrderSource] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('DINE_IN');
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [customTableNumber, setCustomTableNumber] = useState<string>('');
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

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setCartItems([]);
    setSearchQuery('');
    setSelectedCategory('ALL');
    setShowCustomItemRow(false);
    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemQty(1);
    setCustomerNotes('');
    setIsSubmitting(false);
    setErrorMessage(null);
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

  // Submit Order: Send directly to kitchen and trigger KOT
  const handleSendToKitchen = async () => {
    if (cartItems.length === 0) {
      setErrorMessage('Please add at least one item before sending to kitchen.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
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
        customerNotes: customerNotes.trim() || undefined,
        status: 'PREPARING',
        isCustomOrder: true
      };

      const res = await api.createCustomOrder(payload);
      if (!res.success || !res.order) {
        throw new Error(res.message || 'Failed to dispatch custom order to kitchen.');
      }

      const createdOrder: Order = res.order;

      // Automatically trigger KOT print
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

      // Notify parent to refresh orders board
      onOrderCreated(createdOrder);

      // Cleanly close drawer
      onClose();
    } catch (err: any) {
      console.error('Failed to dispatch custom order to kitchen:', err);
      setErrorMessage(err.message || 'Failed to dispatch order to kitchen.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-stone-200">
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">New Custom Order</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-brand-500 text-white">
                  Kitchen Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sends order directly to kitchen with KOT. Finalize bill and customer receipt once cooked!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Switch & Table Selection */}
        <div className="px-6 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-4 flex-wrap shrink-0">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 shadow-xs">
            <button
              type="button"
              onClick={() => setOrderSource('DINE_IN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                orderSource === 'DINE_IN'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Dine-In</span>
            </button>
            <button
              type="button"
              onClick={() => setOrderSource('TAKEAWAY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                orderSource === 'TAKEAWAY'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Takeaway / Counter</span>
            </button>
            <button
              type="button"
              onClick={() => setOrderSource('DELIVERY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                orderSource === 'DELIVERY'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Direct Delivery</span>
            </button>
          </div>

          {orderSource === 'DINE_IN' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Table:</span>
              {tables.length > 0 ? (
                <select
                  value={selectedTableId}
                  onChange={e => {
                    setSelectedTableId(e.target.value);
                    setCustomTableNumber('');
                  }}
                  className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {tables.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.tableNumber} ({t.status === 'OCCUPIED' ? 'Occupied' : 'Available'})
                    </option>
                  ))}
                  <option value="">Other / Custom Table</option>
                </select>
              ) : null}

              {(!selectedTableId || tables.length === 0) && (
                <input
                  type="text"
                  placeholder="e.g. Table 12"
                  value={customTableNumber}
                  onChange={e => setCustomTableNumber(e.target.value)}
                  className="w-28 px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              )}
            </div>
          )}
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mx-6 mt-3 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main 2-column layout: Left Menu Explorer / Right Kitchen Tray */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Left Column: Menu items picker */}
          <div className="flex-1 flex flex-col border-r border-stone-200 overflow-hidden bg-stone-50/50">
            {/* Search & Categories */}
            <div className="p-4 border-b border-stone-200 bg-white space-y-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dishes, drinks, appetizers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0 transition-colors ${
                    selectedCategory === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  All ({menuItems.length})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Item Cards */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {isLoadingData ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-500 mb-2" />
                  <p className="text-xs">Loading restaurant menu...</p>
                </div>
              ) : filteredMenuItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Utensils className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-semibold">No dishes match your search</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try another keyword or add a custom dish below.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredMenuItems.map(item => {
                    const cartEntry = cartItems.find(i => i.menuItemId === item.id);
                    return (
                      <div
                        key={item.id}
                        className="bg-white p-3 rounded-xl border border-stone-200 hover:border-brand-300 hover:shadow-xs transition-all flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                item.isVeg ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-rose-500 ring-2 ring-rose-200'
                              }`}
                            />
                            <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-slate-700">₹{item.price}</span>
                            {item.portion && (
                              <span className="text-[10px] text-slate-400 bg-stone-100 px-1.5 py-0.2 rounded">
                                {item.portion}
                              </span>
                            )}
                          </div>
                        </div>

                        {cartEntry ? (
                          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                            <button
                              type="button"
                              onClick={() => {
                                const idx = cartItems.findIndex(i => i.menuItemId === item.id);
                                if (idx !== -1) handleUpdateQuantity(idx, -1);
                              }}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-slate-900">
                              {cartEntry.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const idx = cartItems.findIndex(i => i.menuItemId === item.id);
                                if (idx !== -1) handleUpdateQuantity(idx, 1);
                              }}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-brand-500 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Custom Off-Menu Item Button & Expandable Row */}
              <div className="pt-2">
                {!showCustomItemRow ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomItemRow(true)}
                    className="w-full py-2.5 px-3 rounded-xl border border-dashed border-stone-300 hover:border-brand-400 hover:bg-brand-50/50 text-xs font-semibold text-slate-600 hover:text-brand-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    <span>+ Add Custom Off-Menu Dish</span>
                  </button>
                ) : (
                  <div className="bg-white p-3 rounded-xl border border-brand-300 ring-2 ring-brand-400/20 space-y-2.5 animate-slide-up">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                        Custom Special Dish
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCustomItemRow(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Item name (e.g. Garlic Naan)"
                        value={customItemName}
                        onChange={e => setCustomItemName(e.target.value)}
                        className="sm:col-span-2 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={customItemPrice}
                          onChange={e => setCustomItemPrice(e.target.value)}
                          className="w-full pl-6 pr-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-semibold">Qty:</span>
                        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                          <button
                            type="button"
                            onClick={() => setCustomItemQty(q => Math.max(1, q - 1))}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-700 hover:bg-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center text-xs font-bold text-slate-900">{customItemQty}</span>
                          <button
                            type="button"
                            onClick={() => setCustomItemQty(q => q + 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-700 hover:bg-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddCustomOffMenuItem}
                        className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                      >
                        Add to Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Items & Kitchen Dispatch */}
          <div className="w-80 flex flex-col bg-white overflow-hidden shrink-0">
            <div className="px-4 py-3 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-brand-600" />
                Kitchen Tray ({cartItems.reduce((acc, it) => acc + it.quantity, 0)} items)
              </span>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCartItems([])}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mb-2">
                    <ShoppingBag className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">Kitchen Tray is Empty</p>
                  <p className="text-[11px] text-slate-400 max-w-[190px] mt-1 leading-relaxed">
                    Select dishes from the menu on the left to dispatch to kitchen.
                  </p>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-stone-200/90 bg-white hover:border-stone-300 transition-all space-y-2 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">{item.name}</h5>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] font-semibold text-slate-700">₹{item.price}</span>
                          {item.portion && (
                            <span className="text-[10px] text-slate-400 bg-stone-100 px-1 rounded">
                              {item.portion}
                            </span>
                          )}
                          {item.isCustom && (
                            <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1 rounded">
                              Custom
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                      <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(idx, -1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-700 hover:bg-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(idx, 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-700 hover:bg-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {/* Kitchen / Special Cooking Notes */}
              {cartItems.length > 0 && (
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <ChefHat className="w-3 h-3 text-brand-600" />
                    Kitchen Cooking Notes / Instructions:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Less spicy, crisp naan, serve salad first..."
                    value={customerNotes}
                    onChange={e => setCustomerNotes(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Tray Footer: Bill Breakdown & Send To Kitchen CTA */}
            <div className="p-4 border-t border-stone-200 bg-stone-50/80 space-y-3 shrink-0">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 tabular-nums">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST / Taxes ({gstTier})</span>
                  <span className="font-semibold text-slate-900 tabular-nums">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="text-base font-extrabold text-slate-900 tabular-nums">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Primary CTA: Send to Kitchen */}
              <button
                type="button"
                onClick={handleSendToKitchen}
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching to Kitchen...</span>
                  </>
                ) : (
                  <>
                    <ChefHat className="w-4 h-4" />
                    <span>Send to Kitchen & Print KOT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

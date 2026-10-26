import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Utensils,
  ChefHat,
  Search,
  ShoppingBag,
  Bike,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { MenuItem, MenuCategory, TableItem, Restaurant, PrinterConfig, Order } from '../types';
import { api } from '../services/api';
import { kotPrinter } from '../utils/kotPrinter';

// Module-level cache so reopening the drawer renders instantaneously with zero loading spinner
let cachedMenuItems: MenuItem[] = [];
let cachedCategories: MenuCategory[] = [];
let cachedTables: TableItem[] = [];

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
  printerConfig?: PrinterConfig;
  onOrderCreated: (order: Order) => void;
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
  onOrderCreated
}) => {
  // Data state with instant cache fallback
  const [menuItems, setMenuItems] = useState<MenuItem[]>(cachedMenuItems);
  const [categories, setCategories] = useState<MenuCategory[]>(cachedCategories);
  const [tables, setTables] = useState<TableItem[]>(cachedTables);
  const [isLoadingData, setIsLoadingData] = useState(cachedMenuItems.length === 0);

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

  // Load menu items, categories, and tables
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    let isMounted = true;
    if (cachedMenuItems.length === 0) {
      setIsLoadingData(true);
    }

    Promise.all([
      api.getMenuItems().catch(() => ({ items: [] })),
      api.getCategories().catch(() => ({ categories: [] })),
      api.getTables().catch(() => ({ tables: [] }))
    ])
      .then(([itemsRes, catsRes, tablesRes]) => {
        if (!isMounted) return;
        const items: MenuItem[] = itemsRes?.items || (Array.isArray(itemsRes) ? itemsRes : []);
        const cats: MenuCategory[] = catsRes?.categories || (Array.isArray(catsRes) ? catsRes : []);
        const tbls: TableItem[] = tablesRes?.tables || (Array.isArray(tablesRes) ? tablesRes : []);

        cachedMenuItems = items;
        cachedCategories = cats;
        cachedTables = tbls;

        setMenuItems(items);
        setCategories(cats);
        setTables(tbls);

        if (tbls.length > 0 && !selectedTableId) {
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

  // Submit Order: Send directly to kitchen and trigger KOT silently to kitchen printer
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

      // Automatically dispatch KOT to kitchen printer silently (no on-screen preview modal)
      kotPrinter.printOrderKot(
        restaurant,
        createdOrder,
        printerConfig || {
          id: 'default',
          printerName: 'KOT Printer',
          paperWidth: '80mm',
          autoPrintKot: true,
          printerType: 'BROWSER'
        }
      );

      // Notify parent to refresh orders board
      onOrderCreated(createdOrder);

      // Cleanly close drawer immediately
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
      <div className="w-full max-w-4xl lg:max-w-5xl bg-white h-full shadow-2xl flex flex-col border-l border-stone-200">
        
        {/* Unified Top Header Bar */}
        <div className="px-6 py-3.5 bg-white border-b border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0">
              <ChefHat className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Custom Order</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-stone-200">
                  Kitchen Dispatch
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Dispatches directly to kitchen printer • Bill finalized once cooked
              </p>
            </div>
          </div>

          {/* Order Type & Table Selector */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Segmented Source Controls */}
            <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200/80">
              <button
                type="button"
                onClick={() => setOrderSource('DINE_IN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  orderSource === 'DINE_IN'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Utensils className="w-3.5 h-3.5 text-amber-600" />
                <span>Dine-In</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderSource('TAKEAWAY')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  orderSource === 'TAKEAWAY'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
                <span>Takeaway</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderSource('DELIVERY')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  orderSource === 'DELIVERY'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bike className="w-3.5 h-3.5 text-slate-600" />
                <span>Delivery</span>
              </button>
            </div>

            {/* Table Dropdown (if Dine-in) */}
            {orderSource === 'DINE_IN' && (
              <div className="relative">
                {tables.length > 0 ? (
                  <select
                    value={selectedTableId}
                    onChange={e => {
                      setSelectedTableId(e.target.value);
                      setCustomTableNumber('');
                    }}
                    className="appearance-none pl-3 pr-8 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-slate-900 shadow-2xs focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.tableNumber} {t.status === 'OCCUPIED' ? '(Occupied)' : ''}
                      </option>
                    ))}
                    <option value="">Custom Table...</option>
                  </select>
                ) : null}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                {(!selectedTableId || tables.length === 0) && (
                  <input
                    type="text"
                    placeholder="Table #"
                    value={customTableNumber}
                    onChange={e => setCustomTableNumber(e.target.value)}
                    className="w-24 ml-2 px-2.5 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                )}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors ml-1"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-3 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Workspace Body: 2 Columns */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          
          {/* Left Column: Menu Catalog (62% width) */}
          <div className="flex-1 flex flex-col border-r border-stone-200 overflow-hidden bg-white">
            
            {/* Search & Categories Bar */}
            <div className="p-4 border-b border-stone-100 space-y-3 shrink-0 bg-stone-50/50">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search dishes or drinks..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* + Add Off-Menu Custom Item Button */}
                <button
                  type="button"
                  onClick={() => setShowCustomItemRow(v => !v)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 ${
                    showCustomItemRow
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 shadow-2xs'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>+ Custom Dish</span>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                    selectedCategory === 'ALL'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  All ({menuItems.length})
                </button>
                {categories.map(cat => {
                  const count = menuItems.filter(i => i.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat.name} {count > 0 ? `(${count})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Off-Menu Item Inline Panel */}
            {showCustomItemRow && (
              <div className="p-3 mx-4 mt-3 rounded-xl bg-amber-50/80 border border-amber-200 shadow-xs space-y-2 animate-slide-up">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Add Off-Menu Custom Dish
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCustomItemRow(false)}
                    className="text-amber-700 hover:text-amber-900 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Dish Name (e.g. Garlic Naan)"
                    value={customItemName}
                    onChange={e => setCustomItemName(e.target.value)}
                    className="sm:col-span-2 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      placeholder="Price"
                      value={customItemPrice}
                      onChange={e => setCustomItemPrice(e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomOffMenuItem}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Dish</span>
                  </button>
                </div>
              </div>
            )}

            {/* Menu Items Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredMenuItems.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <Utensils className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">No dishes match your selection</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try another category or add a custom dish above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {filteredMenuItems.map(item => {
                    const cartEntry = cartItems.find(i => i.menuItemId === item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                          cartEntry
                            ? 'bg-amber-50/40 border-amber-300 shadow-2xs'
                            : 'bg-white border-stone-200/90 hover:border-stone-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <h4 className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                              {item.name}
                            </h4>
                          </div>
                          {item.portion && (
                            <span className="text-[10px] text-slate-400 bg-stone-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                              {item.portion}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                          <span className="text-xs font-bold text-slate-900 tabular-nums">₹{item.price}</span>

                          {cartEntry ? (
                            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-stone-200 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => {
                                  const idx = cartItems.findIndex(i => i.menuItemId === item.id);
                                  if (idx !== -1) handleUpdateQuantity(idx, -1);
                                }}
                                className="w-5 h-5 rounded flex items-center justify-center text-slate-700 hover:bg-stone-100 transition-colors"
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
                                className="w-5 h-5 rounded flex items-center justify-center text-slate-700 hover:bg-stone-100 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(item)}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Kitchen Order Tray (38% width) */}
          <div className="w-80 lg:w-96 flex flex-col bg-stone-50/70 border-l border-stone-200 shrink-0">
            
            {/* Tray Header */}
            <div className="px-5 py-3.5 border-b border-stone-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-900">Kitchen Tray</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {cartItems.reduce((acc, it) => acc + it.quantity, 0)}
                </span>
              </div>
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

            {/* Tray Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-12">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mb-2">
                    <ShoppingBag className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">No items in tray</p>
                  <p className="text-[11px] text-slate-400 max-w-[180px] mt-0.5">
                    Click + on any dish from the catalog to add to order.
                  </p>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-stone-200/90 bg-white hover:border-stone-300 transition-all space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-slate-900 leading-tight truncate">{item.name}</h5>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                          <span>₹{item.price} each</span>
                          {item.portion && <span>• {item.portion}</span>}
                          {item.isCustom && (
                            <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1 rounded">
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
            </div>

            {/* Tray Footer: Instructions, Totals & Send CTA */}
            <div className="p-4 border-t border-stone-200 bg-white space-y-3 shrink-0 shadow-xs">
              
              {/* Cooking Instructions */}
              <div>
                <input
                  type="text"
                  placeholder="Kitchen note (e.g. Less spicy, extra crisp)..."
                  value={customerNotes}
                  onChange={e => setCustomerNotes(e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Price Calculation */}
              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 tabular-nums">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST / Taxes ({gstTier})</span>
                  <span className="font-semibold text-slate-900 tabular-nums">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-stone-100">
                  <span>Grand Total</span>
                  <span className="text-base font-extrabold text-slate-900 tabular-nums">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Primary Action Button: Send to Kitchen */}
              <button
                type="button"
                onClick={handleSendToKitchen}
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <ChefHat className="w-4 h-4 text-amber-400" />
                <span>{isSubmitting ? 'Sending to Kitchen...' : 'Send Order to Kitchen'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

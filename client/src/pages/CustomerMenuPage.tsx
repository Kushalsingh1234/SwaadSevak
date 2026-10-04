import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Clock,
  CheckCircle,
  Receipt,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Download
} from 'lucide-react';
import { VegIcon } from '../components/VegIcon';
import { api } from '../services/api';
import { getSocket, joinTableRoom } from '../services/socket';
import { InvoiceModal } from '../components/InvoiceModal';
import { downloadInvoicePdf } from '../utils/invoicePdf';

interface CustomerMenuPageProps {
  restaurantSlug: string;
  qrToken: string;
  onExitDinerDemo?: () => void;
}

export const CustomerMenuPage: React.FC<CustomerMenuPageProps> = ({
  restaurantSlug,
  qrToken,
  onExitDinerDemo,
}) => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [restaurant, setRestaurant] = useState<any>(null);
  const [table, setTable] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVegOnly, setFilterVegOnly] = useState(false);

  // Cart State
  const [cart, setCart] = useState<Array<{
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    portion?: string;
    notes?: string;
    isVeg: boolean;
  }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Active placed order tracking
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [billRequested, setBillRequested] = useState(false);
  const [activeBill, setActiveBill] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Load Menu and Table details
  useEffect(() => {
    loadPublicMenu();
  }, [restaurantSlug, qrToken]);

  const loadPublicMenu = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.getPublicMenu(restaurantSlug, qrToken);
      if (data.success) {
        setRestaurant(data.restaurant);
        setTable(data.table);
        setMenu(data.menu || []);
        if (data.activeOrder) {
          setActiveOrder(data.activeOrder);
          if (data.activeOrder.billRequested) {
            setBillRequested(true);
          }
        }

        // Join real-time socket room for this table
        if (data.restaurant?.id && data.table?.id) {
          joinTableRoom(data.restaurant.id, data.table.id);
        }
      } else {
        setErrorMsg(data.message || 'Could not load menu.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Socket.IO event listeners for live updates
  useEffect(() => {
    if (!restaurant?.id || !table?.id) return;
    const socket = getSocket();

    // 1. Live stock toggle updates
    const handleStockUpdate = (data: { itemId: string; isAvailable: boolean }) => {
      setMenu(prevMenu =>
        prevMenu.map(category => ({
          ...category,
          items: category.items.map((item: any) =>
            item.id === data.itemId ? { ...item, isAvailable: data.isAvailable } : item
          )
        }))
      );
    };

    // 2. Order status changes (Accepted, Preparing, Ready, Completed)
    const handleOrderStatus = (order: any) => {
      if (order.tableId === table.id) {
        setActiveOrder(order);
      }
    };

    // 3. Bill generated
    const handleBillGenerated = (bill: any) => {
      if (activeOrder && bill.orderId === activeOrder.id) {
        setActiveBill(bill);
      }
    };

    // Reconnect handler
    const handleConnect = () => {
      joinTableRoom(restaurant.id, table.id);
    };
    socket.on('connect', handleConnect);

    // 4. Order addition added
    const handleAdditionAdded = (data: { order: any; addition: any }) => {
      if (data?.order?.tableId === table.id) {
        setActiveOrder(data.order);
      }
    };

    socket.on('menu:stock_updated', handleStockUpdate);
    socket.on(`menu:stock_updated_${restaurant.id}`, handleStockUpdate);
    socket.on('order:status_updated', handleOrderStatus);
    socket.on(`order:status_updated_${restaurant.id}`, handleOrderStatus);
    socket.on('order:addition_added', handleAdditionAdded);
    socket.on(`order:addition_added_${restaurant.id}`, handleAdditionAdded);
    socket.on('bill:generated', handleBillGenerated);
    socket.on(`bill:generated_${restaurant.id}`, handleBillGenerated);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('menu:stock_updated', handleStockUpdate);
      socket.off(`menu:stock_updated_${restaurant.id}`, handleStockUpdate);
      socket.off('order:status_updated', handleOrderStatus);
      socket.off(`order:status_updated_${restaurant.id}`, handleOrderStatus);
      socket.off('order:addition_added', handleAdditionAdded);
      socket.off(`order:addition_added_${restaurant.id}`, handleAdditionAdded);
      socket.off('bill:generated', handleBillGenerated);
      socket.off(`bill:generated_${restaurant.id}`, handleBillGenerated);
    };
  }, [restaurant?.id, table?.id, activeOrder?.id]);

  // Cart operations
  const addToCart = (item: any) => {
    if (!item.isAvailable) return;
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          portion: item.portion,
          isVeg: item.isVeg
        }
      ];
    });
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.menuItemId === menuItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as any[]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTax = Math.round(cartTotal * 0.05 * 100) / 100;
  const cartGrandTotal = Math.round((cartTotal + cartTax) * 100) / 100;

  // Place Order from diner screen (Section 18)
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);
    try {
      const res = await api.placePublicOrder({
        restaurantSlug,
        qrToken,
        items: cart,
        customerNotes
      });

      if (res.success) {
        setActiveOrder(res.order);
        setCart([]);
        setIsCartOpen(false);
      } else {
        alert(res.message || 'Could not place order');
      }
    } catch (err: any) {
      alert(err.message || 'Order failed. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Request Bill (Section 23)
  const handleRequestBill = async () => {
    if (!activeOrder) return;
    try {
      const res = await api.requestPublicBill(activeOrder.id, {
        restaurantSlug,
        qrToken
      });
      if (res.success) {
        setBillRequested(true);
        setActiveOrder((prev: any) => ({ ...prev, billRequested: true }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-700">Loading Restaurant Menu...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Table QR Issue</h3>
        <p className="text-xs text-slate-600 mt-2 max-w-sm">{errorMsg}</p>
        {onExitDinerDemo && (
          <button
            onClick={onExitDinerDemo}
            className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            ← Return to Manager Dashboard
          </button>
        )}
      </div>
    );
  }

  // Filter items across all categories
  const allDishes = menu.flatMap(cat => cat.items.map((item: any) => ({ ...item, categoryName: cat.name })));
  const displayedCategories = activeCategory === 'ALL'
    ? menu
    : menu.filter(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col max-w-lg mx-auto shadow-2xl relative pb-28 font-sans">
      {/* Demo Return Bar if in simulation */}
      {onExitDinerDemo && (
        <div className="bg-slate-900 text-slate-200 px-4 py-2 text-xs flex items-center justify-between sticky top-0 z-50">
          <span className="font-semibold text-orange-400">📱 Guest Mobile QR Simulation</span>
          <button
            onClick={onExitDinerDemo}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold"
          >
            Exit to Dashboard
          </button>
        </div>
      )}

      {/* Restaurant & Table Header */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900 tracking-tight leading-tight">
              {restaurant?.name || 'The Chai & Chaat Co.'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {restaurant?.restaurantType || 'Café'} • {restaurant?.city || 'Dining Room'}
            </p>
          </div>

          {/* Table Badge */}
          <div className="px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold text-center">
            {table?.tableNumber || 'Table 01'}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xs font-medium text-gray-600 mb-1.5">What are you craving?</p>
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search dishes, chaat, beverages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Filter veg / non-veg */}
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                filterVegOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <VegIcon isVeg={true} size="sm" />
              <span>Pure Veg</span>
            </button>
          </div>

          <span className="text-[11px] text-gray-400">
            Swaad Sevak Direct
          </span>
        </div>
      </header>

      {/* Active Order Live Tracker Bar */}
      {activeOrder && (
        <div className="m-3 p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-900">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">
                Order #{activeOrder.orderNumber}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium">
              {activeOrder.status === 'PENDING' && (
                <span className="flex items-center gap-1.5 text-orange-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Pending Acceptance
                </span>
              )}
              {activeOrder.status === 'ACCEPTED' && (
                <span className="flex items-center gap-1.5 text-amber-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Accepted
                </span>
              )}
              {activeOrder.status === 'PREPARING' && (
                <span className="flex items-center gap-1.5 text-amber-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Preparing in Kitchen
                </span>
              )}
              {activeOrder.status === 'READY' && (
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  Ready to Serve
                </span>
              )}
              {activeOrder.status === 'SERVED' && (
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Food Served
                </span>
              )}
              {activeOrder.status === 'COMPLETED' && (
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  Completed
                </span>
              )}
            </span>
          </div>

          <p className="text-xs text-gray-600">
            {activeOrder.status === 'PENDING' && 'Your order is waiting for manager confirmation.'}
            {activeOrder.status === 'ACCEPTED' && 'Confirmed! The kitchen is preparing your dishes.'}
            {activeOrder.status === 'PREPARING' && 'Freshly cooking on the station.'}
            {activeOrder.status === 'READY' && 'Your dishes are plated and being brought to your table.'}
            {activeOrder.status === 'SERVED' && 'Food is served! Enjoy your meal. Feel free to add more items from the menu below anytime.'}
            {activeOrder.status === 'COMPLETED' && 'Bill settled. Thank you for dining with us!'}
          </p>

          {/* Pending Add-on Banner for Customer */}
          {activeOrder.additions && activeOrder.additions.some((a: any) => a.status === 'PENDING') && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>New items added! Waiting for kitchen confirmation...</span>
              </span>
            </div>
          )}

          {/* Declined Add-on Notification for Customer */}
          {activeOrder.additions && activeOrder.additions.some((a: any) => a.status === 'REJECTED') && (
            <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              <span className="font-semibold">Note:</span> A requested item was unavailable. Your main order is continuing normally!
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-gray-500 font-medium">
              {activeOrder.items?.length || 0} items • ₹{activeOrder.total}
            </span>

            <div className="flex items-center gap-2">
              {activeOrder.status === 'COMPLETED' ? (
                <>
                  <button
                    onClick={() => downloadInvoicePdf(activeOrder, activeBill, restaurant)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Invoice</span>
                  </button>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
                  >
                    View
                  </button>
                </>
              ) : (
                <>
                  {!billRequested ? (
                    <button
                      onClick={handleRequestBill}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors border border-gray-200"
                    >
                      Request Bill
                    </button>
                  ) : (
                    <span className="text-amber-700 font-medium flex items-center gap-1">
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Bill Requested</span>
                    </span>
                  )}
                  {activeBill && (
                    <button
                      onClick={() => setShowInvoiceModal(true)}
                      className="px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-700 font-medium border border-orange-200 hover:bg-orange-100 transition-colors"
                    >
                      View Bill
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 sticky top-[152px] z-20 overflow-x-auto no-scrollbar flex items-center gap-2 shadow-xs">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
            activeCategory === 'ALL'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({allDishes.length})
        </button>
        {menu.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
              activeCategory === cat.id
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Categories and Dishes */}
      <main className="p-4 space-y-6">
        {displayedCategories.map((category) => {
          const categoryItems = category.items.filter((item: any) => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  item.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesVeg = !filterVegOnly || item.isVeg;
            return matchesSearch && matchesVeg;
          });

          if (categoryItems.length === 0) return null;

          return (
            <section key={category.id} className="space-y-3">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <span>{category.name}</span>
                <span className="text-xs text-gray-400 font-normal">({categoryItems.length})</span>
              </h2>

              <div className="space-y-3">
                {categoryItems.map((dish: any) => {
                  const isSoldOut = !dish.isAvailable;
                  const inCart = cart.find(i => i.menuItemId === dish.id);

                  return (
                    <div
                      key={dish.id}
                      className={`bg-white rounded-xl p-4 border transition-all flex justify-between gap-3 shadow-xs ${
                        isSoldOut ? 'border-gray-200 opacity-60' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Left side details */}
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <VegIcon isVeg={dish.isVeg} size="sm" />
                          {dish.tags?.map((t: string) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 border border-amber-200 text-amber-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <h3 className={`text-sm font-semibold text-gray-900 ${isSoldOut ? 'line-through text-gray-400' : ''}`}>
                          {dish.name}
                        </h3>

                        {dish.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {dish.description}
                          </p>
                        )}

                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">
                            ₹{dish.price}
                          </span>
                          {dish.portion && (
                            <span className="text-[11px] text-gray-400">
                              • {dish.portion}
                            </span>
                          )}
                        </div>

                        {isSoldOut && (
                          <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-medium text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                            Unavailable
                          </span>
                        )}
                      </div>

                      {/* Right side Add to Cart / Quantity Selector */}
                      <div className="flex flex-col items-end justify-between shrink-0">
                        {isSoldOut ? (
                          <button
                            disabled
                            className="px-3.5 py-1.5 rounded-lg bg-gray-100 text-gray-400 text-xs font-medium cursor-not-allowed border border-gray-200"
                          >
                            Sold Out
                          </button>
                        ) : inCart ? (
                          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg p-1 text-orange-950 font-medium text-xs shadow-xs">
                            <button
                              onClick={() => updateQuantity(dish.id, -1)}
                              className="w-6 h-6 rounded bg-white flex items-center justify-center text-orange-600 hover:bg-orange-100 shadow-xs"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-5 text-center font-bold">{inCart.quantity}</span>
                            <button
                              onClick={() => updateQuantity(dish.id, 1)}
                              className="w-6 h-6 rounded bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(dish)}
                            className="px-4 py-1.5 rounded-lg bg-white hover:bg-orange-50 border border-orange-300 text-orange-600 text-xs font-semibold shadow-xs transition-colors"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Sticky Bottom Cart Bar */}
      {cartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40 animate-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#111827] text-white rounded-xl p-3.5 shadow-lg border border-gray-800 flex items-center justify-between hover:bg-gray-900 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-xs">
                {cartItemCount}
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold block">{table?.tableNumber} Cart</span>
                <span className="text-[11px] text-gray-400">₹{cartTotal} (+ ₹{cartTax} GST)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-semibold text-xs text-orange-400">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Modal / Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl max-w-lg mx-auto w-full max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Cart Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Your Order</h3>
                <p className="text-xs text-orange-600 font-semibold">{table?.tableNumber}</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.menuItemId} className="py-3 flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <VegIcon isVeg={item.isVeg} size="sm" className="mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-[11px] text-gray-500">₹{item.price} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 text-xs font-medium">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, -1)}
                        className="w-5 h-5 rounded bg-white flex items-center justify-center text-gray-700 shadow-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, 1)}
                        className="w-5 h-5 rounded bg-orange-600 text-white flex items-center justify-center shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-gray-900 w-14 text-right">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}

              {/* Special Cooking Instructions */}
              <div className="pt-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cooking Instructions for Chef (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Less spicy, extra onions, no coriander..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 outline-none focus:border-orange-500"
                />
              </div>

              {/* Summary */}
              <div className="pt-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>₹{cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Grand Total</span>
                  <span>₹{cartGrandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Submit Order Action */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <span>Sending to Kitchen...</span>
                ) : (
                  <>
                    <span>Place Order for {table?.tableNumber} • ₹{cartGrandTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal for diner */}
      {showInvoiceModal && activeOrder && (
        <InvoiceModal
          order={activeOrder}
          bill={activeBill}
          restaurant={restaurant}
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
};

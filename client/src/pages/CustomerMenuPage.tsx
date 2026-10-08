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
  Download,
  Gift,
  Coins,
  Award,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VegIcon } from '../components/VegIcon';
import { api } from '../services/api';
import { getSocket, joinTableRoom, joinCustomerRoom } from '../services/socket';
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

  // CRM & Loyalty State
  const [crmConfig, setCrmConfig] = useState<any>(null);
  const [identifiedCustomer, setIdentifiedCustomer] = useState<any>(() => {
    try {
      const saved = localStorage.getItem(`swaad_customer_${restaurantSlug}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Non-blocking gentle prompt banner
  const [showGentleBanner, setShowGentleBanner] = useState<boolean>(false);

  // Identification modal states
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState<boolean>(false);
  const [identityStep, setIdentityStep] = useState<'PHONE' | 'FOUND' | 'NEW_PROMPT' | 'SIGNUP_FORM' | 'SIGNUP_SUCCESS'>('PHONE');
  const [identityPhone, setIdentityPhone] = useState<string>('');
  const [identityName, setIdentityName] = useState<string>('');
  const [isCheckingPhone, setIsCheckingPhone] = useState<boolean>(false);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [identityError, setIdentityError] = useState<string>('');
  const [signupBonusAwarded, setSignupBonusAwarded] = useState<number>(0);

  // Loyalty Balance Info Modal
  const [showLoyaltyInfoModal, setShowLoyaltyInfoModal] = useState<boolean>(false);

  // Cart Loyalty Redemption
  const [redeemCoins, setRedeemCoins] = useState<boolean>(false);
  const [coinDiscountCalc, setCoinDiscountCalc] = useState<{
    eligible: boolean;
    eligibleDiscount: number;
    coinsToRedeem: number;
    usableCoins: number;
    minOrderValue: number;
  }>({
    eligible: false,
    eligibleDiscount: 0,
    coinsToRedeem: 0,
    usableCoins: 0,
    minOrderValue: 300
  });

  // Post-order Guest Modal
  const [showPostOrderModal, setShowPostOrderModal] = useState<boolean>(false);
  const [postOrderName, setPostOrderName] = useState<string>('');
  const [postOrderPhone, setPostOrderPhone] = useState<string>('');
  const [isClaimingPostOrder, setIsClaimingPostOrder] = useState<boolean>(false);
  const [postOrderClaimSuccess, setPostOrderClaimSuccess] = useState<boolean>(false);

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

  // Confetti helper
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  // Load Menu and Table details
  useEffect(() => {
    loadPublicMenu();
  }, [restaurantSlug, qrToken]);

  const refreshCustomerProfile = async (targetId?: string) => {
    const custId = targetId || identifiedCustomer?.id;
    if (!custId || !restaurantSlug) return;
    try {
      const res = await api.getPublicCustomer(restaurantSlug, custId);
      if (res.success && res.customer) {
        setIdentifiedCustomer(res.customer);
        localStorage.setItem(`swaad_customer_${restaurantSlug}`, JSON.stringify(res.customer));
      }
    } catch {
      // Non-blocking background sync
    }
  };

  const loadPublicMenu = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const savedCustomerId = identifiedCustomer?.id;
      const data = await api.getPublicMenu(restaurantSlug, qrToken, savedCustomerId);
      if (data.success) {
        setRestaurant(data.restaurant);
        setTable(data.table);
        setMenu(data.menu || []);
        if (data.crmConfig) {
          setCrmConfig(data.crmConfig);
        }
        if (data.activeOrder) {
          setActiveOrder(data.activeOrder);
          if (data.activeOrder.billRequested) {
            setBillRequested(true);
          }
        }

        // Authoritative customer sync: if server returned fresh customer data, sync it
        if (data.customer) {
          setIdentifiedCustomer(data.customer);
          localStorage.setItem(`swaad_customer_${restaurantSlug}`, JSON.stringify(data.customer));
        } else if (savedCustomerId) {
          // If customer ID no longer exists in DB, wipe stale profile
          setIdentifiedCustomer(null);
          localStorage.removeItem(`swaad_customer_${restaurantSlug}`);
        }

        // Join real-time socket room for this table and customer
        if (data.restaurant?.id && data.table?.id) {
          joinTableRoom(data.restaurant.id, data.table.id);
          if (data.customer?.id || savedCustomerId) {
            joinCustomerRoom(data.restaurant.id, data.customer?.id || savedCustomerId);
          }
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
        if (order.status === 'COMPLETED') {
          refreshCustomerProfile();
        }
      }
    };

    // 3. Bill generated
    const handleBillGenerated = (bill: any) => {
      if (activeOrder && bill.orderId === activeOrder.id) {
        setActiveBill(bill);
        refreshCustomerProfile();
      }
    };

    // Reconnect handler
    const handleConnect = () => {
      joinTableRoom(restaurant.id, table.id);
      if (identifiedCustomer?.id) {
        joinCustomerRoom(restaurant.id, identifiedCustomer.id);
      }
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
  }, [restaurant?.id, table?.id, activeOrder?.id, identifiedCustomer?.id]);

  // Real-time listener for customer coin balance updates (manager adjustment, order earn/redeem, campaign)
  useEffect(() => {
    if (!restaurant?.id || !identifiedCustomer?.id) return;
    const socket = getSocket();
    joinCustomerRoom(restaurant.id, identifiedCustomer.id);

    const handleCoinsUpdated = (data: any) => {
      if (data?.customerId === identifiedCustomer.id) {
        setIdentifiedCustomer((prev: any) => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            coinBalance: data.coinBalance ?? prev.coinBalance,
            reservedCoins: data.reservedCoins ?? prev.reservedCoins,
            usableCoins: data.usableCoins ?? Math.max(0, (data.coinBalance ?? prev.coinBalance) - (data.reservedCoins ?? prev.reservedCoins ?? 0))
          };
          localStorage.setItem(`swaad_customer_${restaurantSlug}`, JSON.stringify(updated));
          return updated;
        });
      }
    };

    socket.on('customer:coins_updated', handleCoinsUpdated);
    socket.on(`customer:coins_updated_${identifiedCustomer.id}`, handleCoinsUpdated);

    return () => {
      socket.off('customer:coins_updated', handleCoinsUpdated);
      socket.off(`customer:coins_updated_${identifiedCustomer.id}`, handleCoinsUpdated);
    };
  }, [restaurant?.id, identifiedCustomer?.id, restaurantSlug]);

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

  // Gentle Prompt Banner Effect: Trigger after 1.5s if loyalty active and guest
  useEffect(() => {
    if (crmConfig?.enabled && !identifiedCustomer) {
      const isDismissed = sessionStorage.getItem(`swaad_dismiss_crm_${restaurantSlug}`);
      if (!isDismissed) {
        const timer = setTimeout(() => {
          setShowGentleBanner(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [crmConfig?.enabled, identifiedCustomer, restaurantSlug]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Authoritative dynamic discount calculation
  useEffect(() => {
    if (!crmConfig?.enabled || !identifiedCustomer) {
      setCoinDiscountCalc({
        eligible: false,
        eligibleDiscount: 0,
        coinsToRedeem: 0,
        usableCoins: 0,
        minOrderValue: crmConfig?.minOrderValue || 300
      });
      return;
    }

    const minOrder = crmConfig.minOrderValue || 300;
    const usable = Math.max(0, (identifiedCustomer.coinBalance || 0) - (identifiedCustomer.reservedCoins || 0));
    const coinsUnit = Math.max(1, crmConfig.redemptionCoinsUnit || 100);
    const discountUnit = Math.max(1, crmConfig.redemptionDiscountUnit || 10);
    const maxDiscount = crmConfig.maxDiscountPerOrder || 100;

    const affordableUnits = Math.floor(usable / coinsUnit);
    let maxAffordableDiscount = affordableUnits * discountUnit;
    let eligibleDiscount = Math.min(maxDiscount, maxAffordableDiscount);

    if (!crmConfig.allowFullDiscount && eligibleDiscount >= cartTotal) {
      eligibleDiscount = Math.max(0, cartTotal - 1);
    }

    const coinsToRedeem = Math.floor(eligibleDiscount / discountUnit) * coinsUnit;
    const isEligible = cartTotal >= minOrder && eligibleDiscount > 0;

    setCoinDiscountCalc({
      eligible: isEligible,
      eligibleDiscount: isEligible ? eligibleDiscount : 0,
      coinsToRedeem: isEligible ? coinsToRedeem : 0,
      usableCoins: usable,
      minOrderValue: minOrder
    });

    // Auto-enable discount when condition is met
    if (isEligible && cartTotal >= minOrder && !redeemCoins) {
      setRedeemCoins(true);
    }
  }, [cartTotal, identifiedCustomer, crmConfig]);

  // Discount math
  const appliedDiscount = redeemCoins && coinDiscountCalc.eligible ? coinDiscountCalc.eligibleDiscount : 0;
  const appliedCoins = redeemCoins && coinDiscountCalc.eligible ? coinDiscountCalc.coinsToRedeem : 0;
  const netSubtotal = Math.max(0, cartTotal - appliedDiscount);
  const cartTax = Math.round(netSubtotal * 0.05 * 100) / 100;
  const cartGrandTotal = Math.round((netSubtotal + cartTax) * 100) / 100;

  // Identification Handlers
  const handleCheckPhone = async () => {
    const cleaned = identityPhone.replace(/\D/g, '').slice(-10);
    if (cleaned.length !== 10) {
      setIdentityError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIdentityError('');
    setIsCheckingPhone(true);
    try {
      const res = await api.identifyPublicCustomer(restaurantSlug, cleaned);
      if (res.success) {
        if (res.exists && res.customer) {
          setIdentifiedCustomer(res.customer);
          localStorage.setItem(`swaad_customer_${restaurantSlug}`, JSON.stringify(res.customer));
          setIdentityStep('FOUND');
        } else {
          setIdentityStep('NEW_PROMPT');
        }
      } else {
        setIdentityError(res.message || 'Could not verify mobile number.');
      }
    } catch (e: any) {
      setIdentityError(e.message || 'Verification failed. Please try again.');
    } finally {
      setIsCheckingPhone(false);
    }
  };

  const handleSignup = async () => {
    if (!identityName.trim()) {
      setIdentityError('Please enter your full name');
      return;
    }
    const cleaned = identityPhone.replace(/\D/g, '').slice(-10);
    setIdentityError('');
    setIsSigningUp(true);
    try {
      const res = await api.signupPublicCustomer(restaurantSlug, identityName.trim(), cleaned);
      if (res.success && res.customer) {
        setIdentifiedCustomer(res.customer);
        localStorage.setItem(`swaad_customer_${restaurantSlug}`, JSON.stringify(res.customer));
        setSignupBonusAwarded(res.bonusAwarded || 100);
        setIdentityStep('SIGNUP_SUCCESS');
        triggerConfetti();
      } else {
        setIdentityError(res.message || 'Registration failed.');
      }
    } catch (e: any) {
      setIdentityError(e.message || 'Registration failed.');
    } finally {
      setIsSigningUp(false);
    }
  };

  // Post-order Guest Claim
  const handleClaimPostOrder = async () => {
    if (!postOrderName.trim()) return;
    const cleaned = postOrderPhone.replace(/\D/g, '').slice(-10);
    if (cleaned.length !== 10) return;

    setIsClaimingPostOrder(true);
    try {
      const res = await api.claimPostOrderBonus(restaurantSlug, activeOrder?.id, postOrderName.trim(), cleaned);
      if (res.success && res.customer) {
        setIdentifiedCustomer(res.customer);
        localStorage.setItem(`swaad_customer_${restaurantSlug}`, JSON.stringify(res.customer));
        setPostOrderClaimSuccess(true);
        triggerConfetti();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsClaimingPostOrder(false);
    }
  };

  // Place Order from diner screen (Section 18)
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);
    try {
      const res = await api.placePublicOrder({
        restaurantSlug,
        qrToken,
        items: cart,
        customerNotes,
        customerId: identifiedCustomer?.id,
        redeemCoins: redeemCoins && coinDiscountCalc.eligible
      });

      if (res.success) {
        setActiveOrder(res.order);
        setCart([]);
        setIsCartOpen(false);

        // If guest placed an order and CRM is enabled, present the post-order signup celebration modal
        if (!identifiedCustomer && crmConfig?.enabled) {
          setTimeout(() => {
            setShowPostOrderModal(true);
          }, 900);
        }

        // If customer profile returned or coins were used, update local customer state
        if (res.customer) {
          setIdentifiedCustomer(res.customer);
          localStorage.setItem(`swaad_customer_${restaurantSlug}`, JSON.stringify(res.customer));
        } else if (identifiedCustomer && res.coinsReserved > 0) {
          const updated = {
            ...identifiedCustomer,
            reservedCoins: (identifiedCustomer.reservedCoins || 0) + res.coinsReserved,
            usableCoins: Math.max(0, (identifiedCustomer.coinBalance || 0) - ((identifiedCustomer.reservedCoins || 0) + res.coinsReserved))
          };
          setIdentifiedCustomer(updated);
          localStorage.setItem(`swaad_customer_${restaurantSlug}`, JSON.stringify(updated));
        }
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
      <header className="bg-white border-b border-gray-200 p-3.5 sm:p-4 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 pr-1">
            <h1 className="text-base font-bold text-gray-900 tracking-tight leading-tight truncate">
              {restaurant?.name || 'The Chai & Chaat Co.'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {restaurant?.restaurantType || 'Café'} • {restaurant?.city || 'Dining Room'}
            </p>
          </div>

          {/* Table & Loyalty Badges */}
          <div className="flex items-center gap-1.5 shrink-0">
            {crmConfig?.enabled && (
              identifiedCustomer ? (
                <button
                  onClick={() => {
                    refreshCustomerProfile();
                    setShowLoyaltyInfoModal(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-linear-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-900 text-xs font-bold hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="View your Discount Coins"
                >
                  <span className="text-sm">🪙</span>
                  <span>{identifiedCustomer.coinBalance ?? 0} Coins</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIdentityStep('PHONE');
                    setIsIdentityModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold hover:bg-orange-100 transition-all active:scale-95 cursor-pointer"
                >
                  <span className="text-xs">🪙</span>
                  <span>Redeem Coins</span>
                </button>
              )
            )}

            <div className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold text-center shrink-0">
              {table?.tableNumber || 'Table 01'}
            </div>
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
                Order {activeOrder.orderNumber.startsWith('#') ? activeOrder.orderNumber : `#${activeOrder.orderNumber}`}
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

      {/* Floating Gentle Loyalty Prompt Toast */}
      {crmConfig?.enabled && !identifiedCustomer && showGentleBanner && !isCartOpen && (
        <div className={`fixed ${cartItemCount > 0 ? 'bottom-20' : 'bottom-4'} left-4 right-4 max-w-md mx-auto z-40 animate-in slide-in-from-bottom-2 fade-in duration-300`}>
          <div className="bg-stone-900/95 text-white backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-stone-700/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl shrink-0">🪙</span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Have Discount Coins?</p>
                <p className="text-[11px] text-stone-300 truncate">Enter phone to unlock instant bill savings</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  setShowGentleBanner(false);
                  sessionStorage.setItem(`swaad_dismiss_crm_${restaurantSlug}`, 'true');
                  setIsIdentityModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Claim
              </button>
              <button
                onClick={() => {
                  setShowGentleBanner(false);
                  sessionStorage.setItem(`swaad_dismiss_crm_${restaurantSlug}`, 'true');
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Cart Bar */}
      {cartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-3 sm:left-4 right-3 sm:right-4 max-w-md mx-auto z-40 pb-safe animate-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#111827] text-white rounded-xl p-3.5 shadow-xl border border-gray-800 flex items-center justify-between hover:bg-gray-900 transition-all active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                {cartItemCount}
              </div>
              <div className="text-left min-w-0">
                <span className="text-xs font-semibold block truncate">{table?.tableNumber} Cart</span>
                <span className="text-[11px] text-gray-400 truncate">₹{cartTotal} (+ ₹{cartTax} GST)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-semibold text-xs text-orange-400 shrink-0">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Modal / Drawer */}
      {isCartOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setIsCartOpen(false); }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end"
        >
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
            <div className="flex-1 overflow-y-auto p-4 pb-10 space-y-4">
              <div className="divide-y divide-gray-100">
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
                          className="w-5 h-5 rounded bg-white flex items-center justify-center text-gray-700 shadow-xs cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, 1)}
                          className="w-5 h-5 rounded bg-orange-600 text-white flex items-center justify-center shadow-xs cursor-pointer"
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
              </div>

              {/* Special Cooking Instructions */}
              <div className="pt-1">
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

              {/* Loyalty Coin Redemption Card (Phases 9 & 10) */}
              {crmConfig?.enabled && (
                <div className="pt-1">
                  {identifiedCustomer ? (
                    <div className={`p-3 rounded-xl border transition-all ${
                      coinDiscountCalc.eligible
                        ? 'bg-linear-to-br from-amber-50 to-orange-50/60 border-amber-300 shadow-xs'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🪙</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-gray-900">Discount Coins</h4>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                Balance: {identifiedCustomer.coinBalance ?? 0}
                              </span>
                            </div>
                            {coinDiscountCalc.eligible ? (
                              <p className="text-[11px] text-amber-800 mt-0.5">
                                You can save <span className="font-bold text-amber-900">₹{coinDiscountCalc.eligibleDiscount}</span> using {coinDiscountCalc.coinsToRedeem} coins
                              </p>
                            ) : cartTotal < coinDiscountCalc.minOrderValue ? (
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                Add ₹{(coinDiscountCalc.minOrderValue - cartTotal).toFixed(0)} more to redeem coins (Min order ₹{coinDiscountCalc.minOrderValue})
                              </p>
                            ) : (
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                You'll earn coins on this order for future discounts!
                              </p>
                            )}
                          </div>
                        </div>

                        {coinDiscountCalc.eligible && (
                          <button
                            onClick={() => setRedeemCoins(!redeemCoins)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
                              redeemCoins
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-orange-600 hover:bg-orange-500 text-white'
                            }`}
                          >
                            {redeemCoins ? '✓ Applied' : `Apply ₹${coinDiscountCalc.eligibleDiscount}`}
                          </button>
                        )}
                      </div>

                      {redeemCoins && coinDiscountCalc.eligible && (
                        <div className="mt-2 pt-2 border-t border-amber-200/70 flex items-center justify-between text-[11px] text-amber-900">
                          <span className="flex items-center gap-1 font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>₹{appliedDiscount} discount active</span>
                          </span>
                          <span className="font-semibold">{appliedCoins} coins will be used</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🪙</span>
                        <div>
                          <p className="text-xs font-bold text-gray-900">Have Discount Coins?</p>
                          <p className="text-[11px] text-gray-600">Redeem coins to save on this order</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIdentityStep('PHONE');
                          setIsIdentityModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
                      >
                        Redeem Coins
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              <div className="pt-2 space-y-1.5 text-xs bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg">
                    <span className="flex items-center gap-1">
                      <span>🪙 Coin Discount</span>
                      <span className="text-[10px] text-emerald-600 font-normal">({appliedCoins} coins)</span>
                    </span>
                    <span>-₹{appliedDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>₹{cartTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>Grand Total</span>
                  <span>₹{cartGrandTotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <p className="text-[10px] text-gray-500 pt-1 leading-tight">
                    ℹ️ 🪙 {appliedCoins} coins will be deducted automatically only after payment is completed.
                  </p>
                )}
              </div>
            </div>

            {/* Submit Order Action */}
            <div className="p-4 pb-safe bg-white border-t border-gray-200 shrink-0 shadow-lg">
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer active:scale-98"
              >
                {isPlacingOrder ? (
                  <span>Sending to Kitchen...</span>
                ) : (
                  <>
                    <span className="truncate">Place Order for {table?.tableNumber} • ₹{cartGrandTotal.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
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

      {/* PHASE 6, 7, 8 — CUSTOMER IDENTIFICATION MODAL */}
      {isIdentityModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsIdentityModalOpen(false);
              setIdentityError('');
            }
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 relative my-auto">
            <button
              onClick={() => {
                setIsIdentityModalOpen(false);
                setIdentityError('');
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP: PHONE INPUT (Phase 6) */}
            {identityStep === 'PHONE' && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-3 shadow-inner">
                  🪙
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  Redeem your Discount Coins
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Enter your mobile number to check your balance and save on this order.
                </p>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      maxLength={10}
                      value={identityPhone}
                      onChange={(e) => {
                        setIdentityPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                        setIdentityError('');
                      }}
                      className="w-full pl-12 pr-3 py-2.5 text-sm font-semibold rounded-xl border border-gray-300 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all tracking-wider"
                      autoFocus
                    />
                  </div>
                  {identityError && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{identityError}</span>
                    </p>
                  )}
                </div>

                <div className="mt-5 space-y-2">
                  <button
                    onClick={handleCheckPhone}
                    disabled={isCheckingPhone || identityPhone.length !== 10}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCheckingPhone ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsIdentityModalOpen(false);
                      sessionStorage.setItem(`swaad_dismiss_crm_${restaurantSlug}`, 'true');
                    }}
                    className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Continue as Guest
                  </button>
                </div>
              </div>
            )}

            {/* STEP: EXISTING CUSTOMER FOUND (Phase 7) */}
            {identityStep === 'FOUND' && identifiedCustomer && (
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
                  👋
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Welcome back, {identifiedCustomer.name}!
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  You have <span className="font-bold text-orange-600">{identifiedCustomer.coinBalance ?? 0} Discount Coins</span>.
                </p>

                <div className="my-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium text-left flex items-center gap-2.5">
                  <span className="text-xl">✨</span>
                  <span>You can use your coins for discounts on this order during checkout!</span>
                </div>

                <button
                  onClick={() => setIsIdentityModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  Continue Ordering
                </button>
              </div>
            )}

            {/* STEP: NEW CUSTOMER PROMPT (Phase 8) */}
            {identityStep === 'NEW_PROMPT' && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl mb-3">
                  🔍
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  No profile found with +91 {identityPhone}
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Want to create a free profile and get <span className="font-bold text-orange-600">{crmConfig?.signupBonusCoins || 100} Welcome Coins</span> right now?
                </p>

                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => setIdentityStep('SIGNUP_FORM')}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Create Profile & Get Coins</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsIdentityModalOpen(false);
                      sessionStorage.setItem(`swaad_dismiss_crm_${restaurantSlug}`, 'true');
                    }}
                    className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Continue as Guest
                  </button>
                </div>
              </div>
            )}

            {/* STEP: SIGNUP FORM (Phase 8) */}
            {identityStep === 'SIGNUP_FORM' && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-3">
                  🎉
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Create your Loyalty Profile
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Takes 5 seconds. No passwords. No OTP.
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={identityName}
                      onChange={(e) => {
                        setIdentityName(e.target.value);
                        setIdentityError('');
                      }}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-300 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={`+91 ${identityPhone}`}
                      disabled
                      className="w-full px-3 py-2.5 text-xs rounded-xl bg-gray-100 border border-gray-200 text-gray-600 font-semibold"
                    />
                  </div>

                  {identityError && (
                    <p className="text-xs text-red-600">{identityError}</p>
                  )}
                </div>

                <div className="mt-5 space-y-2">
                  <button
                    onClick={handleSignup}
                    disabled={isSigningUp || !identityName.trim()}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSigningUp ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Claim {crmConfig?.signupBonusCoins || 100} Coins</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIdentityStep('PHONE')}
                    className="w-full py-1.5 text-xs text-gray-400 hover:text-gray-600"
                  >
                    ← Change Number
                  </button>
                </div>
              </div>
            )}

            {/* STEP: SIGNUP SUCCESS (Phase 8) */}
            {identityStep === 'SIGNUP_SUCCESS' && (
              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl mx-auto mb-3 shadow-xl animate-bounce">
                  🪙
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Welcome, {identifiedCustomer?.name}!
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  You've received <span className="font-bold text-orange-600">{signupBonusAwarded} Discount Coins</span> as a welcome reward.
                </p>

                <div className="my-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Profile active for this restaurant</span>
                </div>

                <button
                  onClick={() => setIsIdentityModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  Start Ordering & Earning
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOYALTY INFO MODAL (Phase 9) */}
      {showLoyaltyInfoModal && identifiedCustomer && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowLoyaltyInfoModal(false); }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 relative my-auto">
            <button
              onClick={() => setShowLoyaltyInfoModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shadow-inner">
                🪙
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{identifiedCustomer.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {identifiedCustomer.status || 'REGULAR'} Customer
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center">
              <span className="text-xs text-amber-800 font-medium block">Current Balance</span>
              <span className="text-2xl font-black text-amber-900 block mt-0.5">
                {identifiedCustomer.coinBalance ?? 0} <span className="text-sm font-bold text-amber-700">Coins</span>
              </span>
              {identifiedCustomer.reservedCoins > 0 && (
                <span className="text-[11px] text-amber-700 block mt-1">
                  ({identifiedCustomer.reservedCoins} reserved on active order)
                </span>
              )}
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
                <span>Earning Rule</span>
                <span className="font-bold text-gray-900">
                  1 coin per ₹{crmConfig?.coinsPerAmount || 10} spent
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
                <span>Redemption Rule</span>
                <span className="font-bold text-gray-900">
                  {crmConfig?.redemptionCoinsUnit || 100} coins = ₹{crmConfig?.redemptionDiscountUnit || 10} discount
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
                <span>Min Order to Redeem</span>
                <span className="font-bold text-gray-900">
                  ₹{crmConfig?.minOrderValue || 300}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
                <span>Max Discount / Order</span>
                <span className="font-bold text-gray-900">
                  ₹{crmConfig?.maxDiscountPerOrder || 100}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={() => setShowLoyaltyInfoModal(false)}
                className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowLoyaltyInfoModal(false);
                  localStorage.removeItem(`swaad_customer_${restaurantSlug}`);
                  setIdentifiedCustomer(null);
                }}
                className="w-full py-1 text-[11px] text-gray-400 hover:text-gray-600"
              >
                Switch / Log out Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 15 & 16 — POST-ORDER SIGNUP MODAL FOR GUESTS */}
      {showPostOrderModal && !identifiedCustomer && crmConfig?.enabled && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowPostOrderModal(false); }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 relative text-center my-auto">
            <button
              onClick={() => setShowPostOrderModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {!postOrderClaimSuccess ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
                  🎉
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Want Discount Coins on your next visit?
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  You just placed an order. Create your free loyalty profile in 5 seconds and receive:
                </p>

                <div className="my-3 py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-200 inline-flex items-center gap-2">
                  <span className="text-xl">🪙</span>
                  <span className="text-sm font-black text-amber-900">
                    {crmConfig?.signupBonusCoins || 100} Bonus Coins
                  </span>
                </div>

                <div className="mt-3 text-left space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={postOrderName}
                      onChange={(e) => setPostOrderName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={postOrderPhone}
                      onChange={(e) => setPostOrderPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 outline-none focus:border-orange-500 tracking-wider"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleClaimPostOrder}
                    disabled={isClaimingPostOrder || !postOrderName.trim() || postOrderPhone.length !== 10}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isClaimingPostOrder ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Claim My Coins</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowPostOrderModal(false)}
                    className="w-full py-1 text-xs font-medium text-gray-400 hover:text-gray-600"
                  >
                    Maybe Later
                  </button>
                </div>
              </>
            ) : (
              <div className="py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-3">
                  🎁
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Welcome to SwaadSevak Rewards!
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-bold text-orange-600">{crmConfig?.signupBonusCoins || 100} Coins added</span> to your profile!
                </p>
                <div className="my-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
                  Current Balance: 🪙 {identifiedCustomer?.coinBalance ?? (crmConfig?.signupBonusCoins || 100)} Coins
                </div>
                <button
                  onClick={() => setShowPostOrderModal(false)}
                  className="w-full py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-xs hover:bg-orange-500"
                >
                  Awesome, got it!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

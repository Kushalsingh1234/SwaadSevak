import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { RegisterOnboardingPage } from './pages/RegisterOnboardingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardSetupPage } from './pages/DashboardSetupPage';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { LiveOrdersPage } from './pages/LiveOrdersPage';
import { MenuManagementPage } from './pages/MenuManagementPage';
import { TablesManagementPage } from './pages/TablesManagementPage';
import { BillsManagementPage } from './pages/BillsManagementPage';
import { PrinterSettingsPage } from './pages/PrinterSettingsPage';
import { CustomerMenuPage } from './pages/CustomerMenuPage';
import { Navigation } from './components/Navigation';
import { AddDishModal } from './components/AddDishModal';
import { api } from './services/api';
import { getSocket, joinRestaurantRoom } from './services/socket';
import { soundManager } from './utils/sound';
import { Restaurant, Manager, MenuCategory, MenuItem, TableItem, Order, Bill, PrinterConfig } from './types';

export function App() {
  // Check if current URL is a diner QR scan: /menu/:slug/:token
  const pathname = window.location.pathname;
  const matchDinerRoute = pathname.match(/^\/menu\/([^\/]+)\/([^\/]+)/);

  // Diner state if accessed via QR URL
  if (matchDinerRoute) {
    const restaurantSlug = matchDinerRoute[1];
    const qrToken = matchDinerRoute[2];
    return <CustomerMenuPage restaurantSlug={restaurantSlug} qrToken={qrToken} />;
  }

  // Persisted session & active tab
  const savedToken = typeof window !== 'undefined' ? localStorage.getItem('swaad_token') : null;
  const savedTab = typeof window !== 'undefined' ? localStorage.getItem('swaad_active_tab') : null;

  // Manager App States
  const [authView, setAuthView] = useState<'LANDING' | 'REGISTER' | 'LOGIN' | 'APP'>(
    savedToken ? 'APP' : 'LANDING'
  );
  const [currentTab, setCurrentTab] = useState<string>(savedTab || 'orders');
  const [isFirstSetup, setIsFirstSetup] = useState<boolean>(false);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    localStorage.setItem('swaad_active_tab', tab);
  };

  // App Data State
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [manager, setManager] = useState<Manager | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [printerConfig, setPrinterConfig] = useState<PrinterConfig | undefined>(undefined);

  // Manual Add Dish Modal
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);

  // Check existing session on load
  useEffect(() => {
    const token = localStorage.getItem('swaad_token');
    if (token) {
      loadInitialData();
    }
  }, []);

  const loadInitialData = async () => {
    try {
      const meRes = await api.getMe();
      if (meRes.success) {
        setRestaurant(meRes.restaurant);
        setManager(meRes.manager);
        setAuthView('APP');

        // Fetch remaining restaurant resources
        await refreshAllData(meRes.restaurant.id);

        // Join real-time socket room for this restaurant
        joinRestaurantRoom(meRes.restaurant.id);
      } else {
        localStorage.removeItem('swaad_token');
        localStorage.removeItem('swaad_active_tab');
        setAuthView('LANDING');
      }
    } catch {
      localStorage.removeItem('swaad_token');
      localStorage.removeItem('swaad_active_tab');
      setAuthView('LANDING');
    }
  };

  const refreshAllData = async (restId?: string) => {
    try {
      const [catsRes, itemsRes, tablesRes, ordersRes, billsRes, printerRes] = await Promise.all([
        api.getCategories(),
        api.getMenuItems(),
        api.getTables(),
        api.getOrders(),
        api.getBills(),
        api.getPrinterConfig()
      ]);

      if (catsRes.success) setCategories(catsRes.categories);
      if (itemsRes.success) setMenuItems(itemsRes.items);
      if (tablesRes.success) setTables(tablesRes.tables);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (billsRes.success) setBills(billsRes.bills);
      if (printerRes.success) setPrinterConfig(printerRes.config);
    } catch (e) {
      console.error('Error refreshing data:', e);
    }
  };

  // Socket.IO Listeners for Manager
  useEffect(() => {
    if (!restaurant?.id) return;
    const socket = getSocket();

    const joinRooms = () => {
      joinRestaurantRoom(restaurant.id);
    };

    joinRooms();
    socket.on('connect', joinRooms);

    const handleNewOrder = (newOrder: Order) => {
      setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
      // Trigger pleasant ting order chime!
      soundManager.playTing(1046.5, 0.4);
    };

    const handleStatusUpdate = (updatedOrder: Order) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    };

    const handleBillRequested = (data: any) => {
      setOrders(prev =>
        prev.map(o => o.id === data.orderId ? { ...o, billRequested: true } : o)
      );
      soundManager.playTing(880, 0.3);
    };

    const handleBillGenerated = (newBill: Bill) => {
      setBills(prev => [newBill, ...prev.filter(b => b.id !== newBill.id)]);
    };

    socket.on('order:new', handleNewOrder);
    socket.on(`order:new_${restaurant.id}`, handleNewOrder);
    socket.on('order:status_updated', handleStatusUpdate);
    socket.on(`order:status_updated_${restaurant.id}`, handleStatusUpdate);
    socket.on('bill:requested', handleBillRequested);
    socket.on(`bill:requested_${restaurant.id}`, handleBillRequested);
    socket.on('bill:generated', handleBillGenerated);
    socket.on(`bill:generated_${restaurant.id}`, handleBillGenerated);

    // Fast 5-second polling sync fallback so orders ALWAYS appear instantly even across network hiccups
    const syncInterval = setInterval(() => {
      api.getOrders().then(res => {
        if (res.success && res.orders) {
          setOrders(prev => {
            // Check if there are new orders to trigger ting sound
            const prevIds = new Set(prev.map(o => o.id));
            const hasNewPending = res.orders.some((o: any) => !prevIds.has(o.id) && o.status === 'PENDING');
            if (hasNewPending) {
              soundManager.playTing(1046.5, 0.4);
            }
            return res.orders;
          });
        }
      }).catch(() => {});
    }, 5000);

    return () => {
      socket.off('connect', joinRooms);
      socket.off('order:new', handleNewOrder);
      socket.off(`order:new_${restaurant.id}`, handleNewOrder);
      socket.off('order:status_updated', handleStatusUpdate);
      socket.off(`order:status_updated_${restaurant.id}`, handleStatusUpdate);
      socket.off('bill:requested', handleBillRequested);
      socket.off(`bill:requested_${restaurant.id}`, handleBillRequested);
      socket.off('bill:generated', handleBillGenerated);
      socket.off(`bill:generated_${restaurant.id}`, handleBillGenerated);
      clearInterval(syncInterval);
    };
  }, [restaurant?.id]);

  // Auth Handlers
  const handleRegisterSuccess = async (data: any) => {
    setRestaurant(data.restaurant);
    setManager(data.manager);
    setIsFirstSetup(true);
    setAuthView('APP');
    if (data.restaurant?.id) {
      joinRestaurantRoom(data.restaurant.id);
    }
    await refreshAllData(data.restaurant?.id);
  };

  const handleLoginSuccess = async (data: any) => {
    setRestaurant(data.restaurant);
    setManager(data.manager);
    setIsFirstSetup(false);
    setAuthView('APP');
    if (data.restaurant?.id) {
      joinRestaurantRoom(data.restaurant.id);
    }
    await refreshAllData(data.restaurant?.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('swaad_token');
    localStorage.removeItem('swaad_active_tab');
    setRestaurant(null);
    setManager(null);
    setAuthView('LANDING');
    setCurrentTab('orders');
    soundManager.stopPendingLoop();
  };

  // Order Lifecycle Handlers
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, status);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? res.order : o));
      }
    } catch (e) {
      console.error('Failed to update order status:', e);
    }
  };

  // Fast Stock Toggle Handler
  const handleToggleStock = async (itemId: string, currentStatus: boolean) => {
    try {
      const res = await api.toggleItemStock(itemId, !currentStatus);
      if (res.success) {
        setMenuItems(prev => prev.map(i => i.id === itemId ? res.item : i));
      }
    } catch (e) {
      console.error('Failed to toggle stock:', e);
    }
  };

  // Dish Handlers
  const handleSaveDish = async (dishData: any) => {
    let finalCategoryId = dishData.categoryId;
    if (dishData.newCategoryName && dishData.newCategoryName.trim()) {
      const catRes = await api.createCategory(dishData.newCategoryName.trim());
      if (catRes.success && catRes.category) {
        setCategories(prev => [...prev, catRes.category]);
        finalCategoryId = catRes.category.id;
      }
    }

    const res = await api.createMenuItem({
      ...dishData,
      categoryId: finalCategoryId
    });
    if (res.success) {
      setMenuItems(prev => [...prev, res.item]);
      if (res.createdCategory) {
        setCategories(prev => [...prev.filter(c => c.id !== res.createdCategory.id), res.createdCategory]);
      }
    }
  };

  const handleUpdateDish = async (dishId: string, dishData: any) => {
    let finalCategoryId = dishData.categoryId;
    if (dishData.newCategoryName && dishData.newCategoryName.trim()) {
      const catRes = await api.createCategory(dishData.newCategoryName.trim());
      if (catRes.success && catRes.category) {
        setCategories(prev => [...prev, catRes.category]);
        finalCategoryId = catRes.category.id;
      }
    }

    const res = await api.updateMenuItem(dishId, {
      ...dishData,
      categoryId: finalCategoryId
    });
    if (res.success) {
      setMenuItems(prev => prev.map(i => i.id === dishId ? res.item : i));
    }
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!window.confirm('Delete this dish?')) return;
    const res = await api.deleteMenuItem(dishId);
    if (res.success) {
      setMenuItems(prev => prev.filter(i => i.id !== dishId));
    }
  };

  // Category Handlers
  const handleCreateCategory = async (name: string) => {
    const res = await api.createCategory(name);
    if (res.success) {
      setCategories(prev => [...prev, res.category]);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!window.confirm('Delete this category and all its dishes?')) return;
    const res = await api.deleteCategory(catId);
    if (res.success) {
      setCategories(prev => prev.filter(c => c.id !== catId));
      setMenuItems(prev => prev.filter(i => i.categoryId !== catId));
    }
  };

  // Printer Config
  const handleUpdatePrinterConfig = async (newConfig: any) => {
    const res = await api.updatePrinterConfig(newConfig);
    if (res.success) {
      setPrinterConfig(res.config);
    }
  };

  // Demo Login Quick Launch from Landing Page
  const handleLaunchDemoFromLanding = async () => {
    try {
      const res = await api.login({ username: 'demo_manager', pin: '1234' });
      if (res.success) {
        localStorage.setItem('swaad_token', res.token);
        await handleLoginSuccess(res);
      }
    } catch {
      setAuthView('LOGIN');
    }
  };

  // RENDER BASED ON VIEW
  if (authView === 'LANDING') {
    return (
      <LandingPage
        onStartRegistration={() => setAuthView('REGISTER')}
        onOpenLogin={() => setAuthView('LOGIN')}
        onLaunchDemoDashboard={handleLaunchDemoFromLanding}
        onLaunchDemoCustomerMenu={() => {
          window.open('/menu/chai-and-chaat/qr_token_demo_tbl_01_a2cebc9c', '_blank');
        }}
      />
    );
  }

  if (authView === 'REGISTER') {
    return (
      <RegisterOnboardingPage
        onSuccess={handleRegisterSuccess}
        onBackToLanding={() => setAuthView('LANDING')}
        onGoToLogin={() => setAuthView('LOGIN')}
      />
    );
  }

  if (authView === 'LOGIN') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => setAuthView('REGISTER')}
        onBackToLanding={() => setAuthView('LANDING')}
      />
    );
  }

  // First Dashboard Experience (Option 1: AI PDF vs Option 2: Manual)
  if (isFirstSetup) {
    return (
      <DashboardSetupPage
        restaurant={restaurant}
        onProceedToDashboard={async () => {
          await refreshAllData(restaurant?.id);
          setIsFirstSetup(false);
        }}
        onOpenManualAddDish={async () => {
          await refreshAllData(restaurant?.id);
          setIsFirstSetup(false);
          handleTabChange('menu');
          setIsAddDishModalOpen(true);
        }}
      />
    );
  }

  // Seamless restoration screen when restoring an existing session
  if (authView === 'APP' && !restaurant) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center font-black text-2xl animate-pulse shadow-lg shadow-orange-500/30">
          S
        </div>
        <div className="mt-4 font-bold text-slate-200 text-sm tracking-wide">Swaad Sevak</div>
        <div className="mt-1 text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span>Restoring workspace...</span>
        </div>
      </div>
    );
  }

  const pendingCount = orders.filter(o => o.status === 'PENDING').length;

  // Global continuous sound alert: rings continuously on any tab and in background Chrome tabs
  useEffect(() => {
    if (authView === 'APP' && pendingCount > 0) {
      soundManager.startPendingLoop();
    } else {
      soundManager.stopPendingLoop();
    }
  }, [pendingCount, authView]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Navigation (Sidebar on Desktop, Drawer/Bottom Bar on Mobile) */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        restaurant={restaurant}
        manager={manager}
        onLogout={handleLogout}
        pendingOrdersCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8 overflow-y-auto">
        {currentTab === 'dashboard' && (
          <DashboardOverviewPage
            restaurant={restaurant}
            manager={manager}
            orders={orders}
            tables={tables}
            menuItems={menuItems}
            onNavigateTab={handleTabChange}
            onRefreshOrders={refreshAllData}
          />
        )}

        {currentTab === 'orders' && (
          <LiveOrdersPage
            restaurant={restaurant}
            manager={manager}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onRefreshOrders={refreshAllData}
            printerConfig={printerConfig}
          />
        )}

        {currentTab === 'menu' && (
          <MenuManagementPage
            categories={categories}
            items={menuItems}
            onToggleStock={handleToggleStock}
            onSaveDish={handleSaveDish}
            onUpdateDish={handleUpdateDish}
            onDeleteDish={handleDeleteDish}
            onCreateCategory={handleCreateCategory}
            onDeleteCategory={handleDeleteCategory}
            onRefreshMenu={refreshAllData}
          />
        )}

        {currentTab === 'tables' && (
          <TablesManagementPage
            restaurant={restaurant}
            tables={tables}
            onRefreshTables={refreshAllData}
          />
        )}

        {currentTab === 'bills' && (
          <BillsManagementPage
            restaurant={restaurant}
            bills={bills}
            onRefreshBills={refreshAllData}
          />
        )}

        {currentTab === 'printer' && (
          <PrinterSettingsPage
            restaurant={restaurant}
            config={printerConfig}
            onUpdateConfig={handleUpdatePrinterConfig}
          />
        )}
      </main>

      {/* Manual Add Dish Modal */}
      <AddDishModal
        isOpen={isAddDishModalOpen}
        categories={categories}
        onClose={() => setIsAddDishModalOpen(false)}
        onSave={handleSaveDish}
      />
    </div>
  );
}

export default App;

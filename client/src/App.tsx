import React, { useState, useEffect } from 'react';
import { SEO } from './components/ui/SEO';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/sections/HeroSection';
import { CoreFeaturesShowcaseSection } from './components/sections/CoreFeaturesShowcaseSection';
import { ProductTabsSection } from './components/sections/ProductTabsSection';
import { WhyUsSection } from './components/sections/WhyUsSection';
import { EcosystemSection } from './components/sections/EcosystemSection';
import { MetricsBandSection } from './components/sections/MetricsBandSection';
import { AccordionBenefitsSection } from './components/sections/AccordionBenefitsSection';
import { WebsiteInquirySection } from './components/sections/WebsiteInquirySection';
import { SavingsCalculatorSection } from './components/sections/SavingsCalculatorSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { Footer } from './components/layout/Footer';
import { CookieBanner } from './components/ui/CookieBanner';

// Platform Pages & Components
import { LoginPage } from './pages/LoginPage';
import { RegisterOnboardingPage } from './pages/RegisterOnboardingPage';
import { WebsiteServicePage } from './pages/WebsiteServicePage';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { LiveOrdersPage } from './pages/LiveOrdersPage';
import { MenuManagementPage } from './pages/MenuManagementPage';
import { TablesManagementPage } from './pages/TablesManagementPage';
import { BillsManagementPage } from './pages/BillsManagementPage';
import { PrinterSettingsPage } from './pages/PrinterSettingsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AggregatorHubPage } from './pages/AggregatorHubPage';
import { GrowthEnginePage } from './pages/GrowthEnginePage';
import { CrmPage } from './pages/CrmPage';
import { CustomerMenuPage } from './pages/CustomerMenuPage';
import { FeatureDetailPage } from './pages/FeatureDetailPage';
import { Navigation } from './components/Navigation';
import { AddDishModal } from './components/AddDishModal';
import { api } from './services/api';
import { getSocket, joinRestaurantRoom } from './services/socket';
import { soundManager } from './utils/sound';
import { Restaurant, Manager, Order, TableItem, MenuCategory, MenuItem, Bill } from './types';

export const App: React.FC = () => {
  // Check if current URL is a diner QR scan: /menu/:slug/:token
  const pathname = window.location.pathname;
  const matchDinerRoute = pathname.match(/^\/menu\/([^\/]+)\/([^\/]+)/);

  if (matchDinerRoute) {
    const restaurantSlug = matchDinerRoute[1];
    const qrToken = matchDinerRoute[2];
    return <CustomerMenuPage restaurantSlug={restaurantSlug} qrToken={qrToken} />;
  }

  const [activeFeatureId, setActiveFeatureId] = useState<string>(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.startsWith('#feature-')) return hash.replace('#feature-', '');
    if (hash.startsWith('#features/')) return hash.replace('#features/', '');
    return 'qr-ordering';
  });

  const [view, setView] = useState<'landing' | 'login' | 'register' | 'dashboard' | 'website-inquiry' | 'feature-detail'>(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#login') return 'login';
    if (hash === '#register') return 'register';
    if (hash === '#website-inquiry' || hash === '#website-service' || hash === '#website') return 'website-inquiry';
    if (hash.startsWith('#feature-') || hash.startsWith('#features/')) return 'feature-detail';
    if (hash === '#dashboard' && localStorage.getItem('swaad_token')) return 'dashboard';
    return 'landing';
  });

  // Dashboard state
  const [currentTab, setCurrentTab] = useState('orders');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(() => {
    const saved = localStorage.getItem('swaad_restaurant');
    return saved ? JSON.parse(saved) : null;
  });
  const [manager, setManager] = useState<Manager | null>(() => {
    const saved = localStorage.getItem('swaad_manager');
    return saved ? JSON.parse(saved) : null;
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [printerConfig, setPrinterConfig] = useState<any>({
    autoPrintKOT: true,
    autoPrintBill: false,
    printerType: 'NETWORK',
    paperWidth: '80mm',
    printerIp: '192.168.1.100',
    characterSet: 'PC437_USA'
  });
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login') {
        setView('login');
      } else if (hash === '#register') {
        setView('register');
      } else if (hash === '#website-inquiry' || hash === '#website-service' || hash === '#website') {
        setView('website-inquiry');
      } else if (hash.startsWith('#feature-') || hash.startsWith('#features/')) {
        const featId = hash.startsWith('#feature-') ? hash.replace('#feature-', '') : hash.replace('#features/', '');
        setActiveFeatureId(featId);
        setView('feature-detail');
      } else if (hash === '#dashboard') {
        setView('dashboard');
      } else if (hash === '#landing' || hash === '' || hash.startsWith('#features') || hash.startsWith('#why-us') || hash.startsWith('#calculator') || hash.startsWith('#ecosystem') || hash.startsWith('#products')) {
        setView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const refreshAllData = async (_restId?: string) => {
    if (!localStorage.getItem('swaad_token')) return;
    try {
      const [ordRes, tblRes, catRes, itemRes, billRes] = await Promise.allSettled([
        api.getOrders(),
        api.getTables(),
        api.getCategories(),
        api.getMenuItems(),
        api.getBills()
      ]);
      if (ordRes.status === 'fulfilled' && ordRes.value.success) setOrders(ordRes.value.orders || []);
      if (tblRes.status === 'fulfilled' && tblRes.value.success) setTables(tblRes.value.tables || []);
      if (catRes.status === 'fulfilled' && catRes.value.success) setCategories(catRes.value.categories || []);
      if (itemRes.status === 'fulfilled' && itemRes.value.success) setMenuItems(itemRes.value.items || []);
      if (billRes.status === 'fulfilled' && billRes.value.success) setBills(billRes.value.bills || []);
    } catch (e) {
      console.error('Error refreshing platform data:', e);
    }
  };

  // Initial load if token exists
  useEffect(() => {
    if (localStorage.getItem('swaad_token')) {
      refreshAllData();
    }
  }, []);

  // Calculate pending orders requiring attention
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const pendingAdditionsCount = orders.reduce((sum, o) => {
    return sum + (o.additions?.filter(a => a.status === 'PENDING').length || 0);
  }, 0);
  const totalNeedsAttentionCount = pendingCount + pendingAdditionsCount;

  // Global continuous sound alert: rings continuously on pending order until accepted
  useEffect(() => {
    if (view === 'dashboard' && totalNeedsAttentionCount > 0) {
      soundManager.startPendingLoop();
    } else {
      soundManager.stopPendingLoop();
    }
  }, [totalNeedsAttentionCount, view]);

  // Real-time socket listener for orders, additions, bills
  useEffect(() => {
    if (!restaurant?.id) return;
    const socket = getSocket();
    joinRestaurantRoom(restaurant.id);

    const handleNewOrder = (newOrder: Order) => {
      soundManager.playTing(1174.66, 0.7);
      setOrders(prev => {
        const exists = prev.some(o => o.id === newOrder.id);
        if (exists) return prev.map(o => o.id === newOrder.id ? newOrder : o);
        return [newOrder, ...prev];
      });
    };

    const handleAddition = ({ order }: { order: Order; addition: any }) => {
      soundManager.playTing(1318.5, 0.7);
      setOrders(prev => prev.map(o => o.id === order.id ? order : o));
    };

    const handleStatusUpdate = (updatedOrder: Order) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    };

    const handleBillRequested = () => {
      soundManager.playTing(987.77, 0.6);
      refreshAllData();
    };

    socket.on('order:new', handleNewOrder);
    socket.on(`order:new_${restaurant.id}`, handleNewOrder);
    socket.on('order:addition_added', handleAddition);
    socket.on(`order:addition_added_${restaurant.id}`, handleAddition);
    socket.on('order:status_updated', handleStatusUpdate);
    socket.on(`order:status_updated_${restaurant.id}`, handleStatusUpdate);
    socket.on('bill:requested', handleBillRequested);
    socket.on(`bill:requested_${restaurant.id}`, handleBillRequested);
    socket.on('bill:generated', () => refreshAllData());
    socket.on('table_updated', () => refreshAllData());

    return () => {
      socket.off('order:new', handleNewOrder);
      socket.off(`order:new_${restaurant.id}`, handleNewOrder);
      socket.off('order:addition_added', handleAddition);
      socket.off(`order:addition_added_${restaurant.id}`, handleAddition);
      socket.off('order:status_updated', handleStatusUpdate);
      socket.off(`order:status_updated_${restaurant.id}`, handleStatusUpdate);
      socket.off('bill:requested', handleBillRequested);
      socket.off(`bill:requested_${restaurant.id}`, handleBillRequested);
      socket.off('bill:generated');
      socket.off('table_updated');
    };
  }, [restaurant?.id]);

  const handleLoginSuccess = async (data: { token: string; restaurant: any; manager: any }) => {
    setRestaurant(data.restaurant);
    setManager(data.manager);
    setView('dashboard');
    window.location.hash = 'dashboard';
    await refreshAllData(data.restaurant?.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('swaad_token');
    localStorage.removeItem('swaad_restaurant');
    localStorage.removeItem('swaad_manager');
    setRestaurant(null);
    setManager(null);
    setView('landing');
    window.location.hash = '';
  };

  // View: Login Page
  if (view === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => {
          setView('register');
          window.location.hash = 'register';
        }}
        onBackToLanding={() => {
          setView('landing');
          window.location.hash = '';
        }}
      />
    );
  }

  // View: Register Page
  if (view === 'register') {
    return (
      <RegisterOnboardingPage
        onSuccess={handleLoginSuccess}
        onBackToLanding={() => {
          setView('landing');
          window.location.hash = '';
        }}
        onGoToLogin={() => {
          setView('login');
          window.location.hash = 'login';
        }}
      />
    );
  }

  // View: Website Service & 24h Inquiry Page
  if (view === 'website-inquiry') {
    return (
      <WebsiteServicePage
        onBackToLanding={() => {
          setView('landing');
          window.location.hash = '';
        }}
        onOpenLogin={() => {
          setView('login');
          window.location.hash = 'login';
        }}
      />
    );
  }

  // View: Feature Deep-Dive Detail Page
  if (view === 'feature-detail') {
    return (
      <FeatureDetailPage
        featureId={activeFeatureId}
        onNavigateHome={() => {
          setView('landing');
          window.location.hash = '';
        }}
        onSelectFeature={(featId) => {
          setActiveFeatureId(featId);
          window.location.hash = `#feature-${featId}`;
        }}
      />
    );
  }

  // View: POS Platform Dashboard
  if (view === 'dashboard') {
    return (
      <div className="min-h-[100dvh] lg:h-screen bg-slate-50 flex flex-col lg:pl-60 font-sans w-full max-w-full lg:overflow-hidden relative">
        <Navigation
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          restaurant={restaurant}
          manager={manager}
          onLogout={handleLogout}
          pendingOrdersCount={totalNeedsAttentionCount}
        />

        <main className={`flex-1 min-w-0 pt-14 lg:pt-4 ${
          currentTab === 'orders'
            ? 'p-2 sm:p-3.5 lg:p-4 lg:pt-3 pb-24 sm:pb-28 lg:pb-4 lg:h-full lg:overflow-hidden flex flex-col w-full'
            : 'p-3.5 sm:p-5 lg:p-6 lg:pt-5 max-w-7xl mx-auto w-full pb-24 sm:pb-28 lg:pb-8 lg:h-full lg:overflow-y-auto'
        }`}>
          {currentTab === 'dashboard' && (
            <DashboardOverviewPage
              restaurant={restaurant}
              manager={manager}
              orders={orders}
              tables={tables}
              menuItems={menuItems}
              onNavigateTab={setCurrentTab}
              onRefreshOrders={() => refreshAllData()}
            />
          )}

          {currentTab === 'growth' && (
            <GrowthEnginePage
              restaurant={restaurant}
              manager={manager}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'crm' && (
            <CrmPage
              restaurant={restaurant}
              manager={manager}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsPage
              restaurant={restaurant}
              manager={manager}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'orders' && (
            <LiveOrdersPage
              restaurant={restaurant}
              manager={manager}
              orders={orders}
              onUpdateOrderStatus={async (orderId, status) => {
                const res = await api.updateOrderStatus(orderId, status);
                if (res.success && res.order) {
                  setOrders(prev => prev.map(o => o.id === orderId ? res.order : o));
                }
              }}
              onRefreshOrders={() => refreshAllData()}
              printerConfig={printerConfig}
            />
          )}

          {currentTab === 'aggregators' && (
            <AggregatorHubPage
              restaurant={restaurant}
              manager={manager}
              orders={orders}
              onRefreshOrders={() => refreshAllData()}
              onNavigateTab={setCurrentTab}
              printerConfig={printerConfig}
            />
          )}

          {currentTab === 'menu' && (
            <MenuManagementPage
              categories={categories}
              items={menuItems}
              onToggleStock={async (itemId) => {
                const item = menuItems.find(i => i.id === itemId);
                const newStatus = item ? !item.isAvailable : false;
                const res = await api.toggleItemStock(itemId, newStatus);
                if (res.success) {
                  setMenuItems(prev => prev.map(i => i.id === itemId ? { ...i, isAvailable: newStatus } : i));
                }
              }}
              onSaveDish={async (dish) => {
                const res = await api.createMenuItem(dish);
                if (res.success && res.item) setMenuItems(prev => [...prev, res.item]);
              }}
              onUpdateDish={async (itemId, updates) => {
                const res = await api.updateMenuItem(itemId, updates);
                if (res.success && res.item) setMenuItems(prev => prev.map(i => i.id === itemId ? res.item : i));
              }}
              onDeleteDish={async (itemId) => {
                const res = await api.deleteMenuItem(itemId);
                if (res.success) setMenuItems(prev => prev.filter(i => i.id !== itemId));
              }}
              onCreateCategory={async (name) => {
                const res = await api.createCategory(name);
                if (res.success && res.category) setCategories(prev => [...prev, res.category]);
              }}
              onDeleteCategory={async (catId) => {
                const res = await api.deleteCategory(catId);
                if (res.success) setCategories(prev => prev.filter(c => c.id !== catId));
              }}
              onRefreshMenu={() => refreshAllData()}
            />
          )}

          {currentTab === 'tables' && (
            <TablesManagementPage
              restaurant={restaurant}
              tables={tables}
              onRefreshTables={() => refreshAllData()}
            />
          )}

          {currentTab === 'bills' && (
            <BillsManagementPage
              restaurant={restaurant}
              bills={bills}
              onRefreshBills={() => refreshAllData()}
            />
          )}

          {currentTab === 'printer' && (
            <PrinterSettingsPage
              restaurant={restaurant}
              config={printerConfig}
              onUpdateConfig={async (newConfig) => {
                const res = await api.updatePrinterConfig(newConfig);
                if (res.success) setPrinterConfig(res.config);
              }}
            />
          )}
        </main>

        <AddDishModal
          isOpen={isAddDishModalOpen}
          categories={categories}
          onClose={() => setIsAddDishModalOpen(false)}
          onSave={async (dish) => {
            const res = await api.createMenuItem(dish);
            if (res.success && res.item) setMenuItems(prev => [...prev, res.item]);
            setIsAddDishModalOpen(false);
          }}
        />
      </div>
    );
  }

  // View: Landing Page (Default)
  return (
    <div className="min-h-screen flex flex-col bg-[#1A0F0A] text-stone-100 antialiased selection:bg-orange-500 selection:text-espresso font-sans overflow-x-hidden w-full max-w-[100vw]">
      {/* 0. SEO Meta & Structured JSON-LD */}
      <SEO />

      {/* 1. Header (Slim espresso, sticky with blur-and-shrink on scroll) */}
      <Header
        onOpenLogin={() => {
          setView('login');
          window.location.hash = 'login';
        }}
        onOpenWebsiteService={() => {
          setView('website-inquiry');
          window.location.hash = 'website-inquiry';
        }}
      />

      {/* Main Sections in Exact Rhythm */}
      <main id="main-content" className="flex-1">
        {/* 2. Dark Espresso Hero */}
        <HeroSection onOpenLogin={() => {
          setView('login');
          window.location.hash = 'login';
        }} />

        {/* 2.5. Attention-Grabbing Detailed Core Feature Showcase */}
        <CoreFeaturesShowcaseSection
          onSelectFeature={(featId) => {
            setActiveFeatureId(featId);
            setView('feature-detail');
            window.location.hash = `#feature-${featId}`;
          }}
        />

        {/* 3. Product Tab Switcher (Crossfading Device Screens) */}
        <ProductTabsSection />

        {/* 5. Why Choose SwaadSevak (Platform Analysis & Value Pillars) */}
        <WhyUsSection />

        {/* 6. Ecosystem on White (2x2 Grid of Sand-Tinted Cards) */}
        <EcosystemSection />

        {/* 8. Accordion Benefits (What SwaadSevak Can Do For You + Team Illustration) */}
        <AccordionBenefitsSection />

        {/* 9. Website Promo Advertisement Section (Dark Espresso Band, 24h Response Guarantee) */}
        <WebsiteInquirySection onOpenWebsiteService={() => {
          setView('website-inquiry');
          window.location.hash = 'website-inquiry';
        }} />

        {/* 10. Savings Calculator on White (Visible Formula) */}
        <SavingsCalculatorSection />

        {/* 11. Testimonials (3 Cards + Carousel Arrows) */}
        <TestimonialsSection />

        {/* 14. Espresso Metrics Band (How We Build Trust - Just before last section) */}
        <MetricsBandSection />
      </main>

      {/* 15. Footer on Espresso */}
      <Footer />

      {/* Global Action Utilities */}
      <CookieBanner />
    </div>
  );
};

export default App;

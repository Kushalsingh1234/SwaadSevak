import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableViewMockup } from '../mockups/TableViewMockup';
import { LiveOrderFeedMockup } from '../mockups/LiveOrderFeedMockup';
import { InventoryMockup } from '../mockups/InventoryMockup';
import { WebsitePreviewMockup } from '../mockups/WebsitePreviewMockup';
import { ArrowRight, Monitor, ShoppingBag, Sparkles, Globe } from 'lucide-react';
import { SITE_CONTENT } from '../../content/site';
import { trackEvent } from '../../lib/analytics';

type TabKey = 'pos' | 'online' | 'inventory' | 'website';

interface TabItem {
  id: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  headline: string;
  description: string;
  exploreLink: string;
  exploreText: string;
}

const TABS: TabItem[] = [
  {
    id: 'pos',
    label: 'POS & Billing',
    icon: Monitor,
    headline: 'Fast 3-Touch Billing & Instant Thermal KOTs',
    description: 'Punch orders, split checks, apply 5% GST rules, and auto-print thermal KOTs directly to kitchen stations with zero lag.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'Explore POS features',
  },
  {
    id: 'online',
    label: 'Aggregator Hub',
    icon: ShoppingBag,
    headline: 'Unified Hub for Swiggy, Zomato & Table QR Orders',
    description: 'Auto-accept delivery orders on one kitchen screen with synchronized menu items, channel price overrides, and rush hour protection.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'Explore aggregator hub',
  },
  {
    id: 'inventory',
    label: 'AI Growth & CRM',
    icon: Sparkles,
    headline: 'Actionable Revenue Insights & Automated WhatsApp CRM',
    description: 'Convert POS sales into prioritized margin recommendations, reward diners with SwaadSevak Coins, and automate WhatsApp retention.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'Explore AI growth engine',
  },
  {
    id: 'website',
    label: 'Restaurant Website',
    icon: Globe,
    headline: 'Custom Branded Website with 0% Commission Direct Ordering',
    description: 'Launch your direct digital ordering menu with instant WhatsApp checkout and table bookings. We deliver custom quotes in 24 hours.',
    exploreLink: SITE_CONTENT.links.websiteInquiry,
    exploreText: 'Get a 24-hour website quote',
  },
];

export const ProductTabsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('pos');

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  const handleTabSelect = (tabId: TabKey) => {
    setActiveTab(tabId);
    trackEvent('product_tab_switch', { tab: tabId });
  };

  return (
    <section id="products" className="relative pt-6 sm:pt-8 pb-8 sm:pb-10 overflow-hidden font-sans w-full" style={{ backgroundColor: '#2B1A12' }}>
      {/* Split Background: Top White Region with Smooth Dramatic Curve, Base Solid #2B1A12 */}
      <div className="absolute inset-0 pointer-events-none -z-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {/* White top region with curved bottom */}
          <path
            d="M 0 0 L 1440 0 L 1440 240 Q 720 440 0 240 Z"
            fill="#FFFFFF"
          />
        </svg>

        {/* Ambient Warm Dot Grid inside the lower brown region */}
        <div
          className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Tab Selection Bar */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-0.5 rounded-xl bg-cream border border-sand-200 shadow-soft max-w-full overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-bold text-[11px] sm:text-xs whitespace-nowrap transition-all duration-200 focus-ring cursor-pointer ${
                    isActive
                      ? 'bg-espresso text-white shadow-soft'
                      : 'text-bodyText hover:text-espresso hover:bg-sand-100/50'
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-500' : 'text-bodyText'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Headline & Details */}
        <div className="text-center max-w-lg mx-auto mt-3.5 mb-4 sm:mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-base sm:text-lg lg:text-xl font-black text-espresso tracking-tight mb-1">
                {currentTab.headline}
              </h3>
              <p className="text-[11px] sm:text-xs text-bodyText leading-relaxed mb-1.5">
                {currentTab.description}
              </p>
              <a
                href={currentTab.exploreLink}
                className="inline-flex items-center gap-1 font-bold text-[11px] sm:text-xs text-orange-dark hover:text-orange-hover focus-ring rounded"
              >
                <span>{currentTab.exploreText}</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Interactive Mockup with Smooth Crossfade */}
        <div className="max-w-3xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex justify-center items-center w-full"
            >
              {activeTab === 'pos' && <TableViewMockup />}
              {activeTab === 'online' && <LiveOrderFeedMockup />}
              {activeTab === 'inventory' && <InventoryMockup />}
              {activeTab === 'website' && <WebsitePreviewMockup />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

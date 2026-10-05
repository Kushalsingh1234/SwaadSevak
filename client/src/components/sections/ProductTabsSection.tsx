import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableViewMockup } from '../mockups/TableViewMockup';
import { LiveOrderFeedMockup } from '../mockups/LiveOrderFeedMockup';
import { InventoryMockup } from '../mockups/InventoryMockup';
import { WebsitePreviewMockup } from '../mockups/WebsitePreviewMockup';
import { ArrowRight, Monitor, ShoppingBag, Boxes, Globe } from 'lucide-react';
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
    description: 'Punch orders, split checks, apply GST rules and print instant KOTs with zero latency during peak rush hours.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'Explore POS features',
  },
  {
    id: 'online',
    label: 'Online Orders',
    icon: ShoppingBag,
    headline: 'Unified Hub for Zomato, Swiggy & Table QR Orders',
    description: 'Auto-accept delivery orders on one kitchen screen with synchronized menu items and automatic rider status updates.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'Explore online ordering',
  },
  {
    id: 'inventory',
    label: 'Inventory & Stock',
    icon: Boxes,
    headline: 'Automated Recipe Deductions & Raw Material Alerts',
    description: 'Selling 1 butter chicken deducts exact grams of chicken, butter and gravy in real-time, preventing kitchen shrinkage.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'Explore inventory engine',
  },
  {
    id: 'website',
    label: 'Restaurant Website',
    icon: Globe,
    headline: 'Custom Branded Website with 0% Commission Direct Ordering',
    description: 'Get your own digital ordering menu and WhatsApp flow. We reply with complete scope and quote within 24 hours.',
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
    <section id="products" className="relative pt-12 sm:pt-16 pb-14 sm:pb-20 overflow-hidden font-sans">
      {/* Split Background: Upper White, Lower Brown with Smooth Dramatic Curve */}
      <div className="absolute inset-0 pointer-events-none -z-0 bg-white">
        {/* Full-bleed SVG defining the smooth curved bottom espresso area */}
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Smooth continuous curve dividing top white and bottom espresso brown */}
          <path
            d="M 0 240 Q 720 440 1440 240 L 1440 600 L 0 600 Z"
            fill="#2B1A12"
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

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Tab Selection Bar */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-cream border border-sand-200 shadow-soft max-w-full overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-200 focus-ring cursor-pointer ${
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
        <div className="text-center max-w-2xl mx-auto mt-6 mb-6 sm:mb-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-espresso tracking-tight mb-2">
                {currentTab.headline}
              </h3>
              <p className="text-xs sm:text-sm text-bodyText leading-relaxed mb-3">
                {currentTab.description}
              </p>
              <a
                href={currentTab.exploreLink}
                className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm text-orange-dark hover:text-orange-hover focus-ring rounded"
              >
                <span>{currentTab.exploreText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Interactive Mockup with Smooth Crossfade */}
        <div className="max-w-5xl mx-auto w-full">
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

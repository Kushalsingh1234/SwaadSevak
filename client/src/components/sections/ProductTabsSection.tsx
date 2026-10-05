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
    headline: 'Fast 3-Touch Billing & Offline KOT Printing',
    description: 'Punch orders, split checks, apply GST rules and print instant KOTs even when your internet dips.',
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
    <section id="products" className="py-16 sm:py-24 bg-white text-espresso font-sans border-b border-sand-200">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
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
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 focus-ring cursor-pointer ${
                    isActive
                      ? 'bg-espresso text-white shadow-soft'
                      : 'text-bodyText hover:text-espresso hover:bg-sand-100/50'
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-bodyText'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Headline & Details */}
        <div className="text-center max-w-2xl mx-auto mt-8 mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl sm:text-2xl font-extrabold text-espresso tracking-tight mb-2">
                {currentTab.headline}
              </h3>
              <p className="text-sm sm:text-base text-bodyText leading-relaxed mb-4">
                {currentTab.description}
              </p>
              <a
                href={currentTab.exploreLink}
                className="inline-flex items-center gap-1.5 font-bold text-sm text-orange-dark hover:text-orange-hover focus-ring rounded"
              >
                <span>{currentTab.exploreText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Interactive Mockup with Smooth Crossfade */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="bg-cream rounded-card-lg p-3 sm:p-6 border border-sand-200 shadow-card"
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

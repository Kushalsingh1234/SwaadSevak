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
    <section id="products" className="relative py-16 sm:py-24 bg-white text-espresso font-sans border-b border-sand-200 overflow-hidden">
      {/* Background Logo Glimpse (Watermark Silhouette in Middle) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0 select-none overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div className="w-[700px] h-[700px] rounded-full bg-orange-500/5 blur-[120px] absolute" />
        
        {/* Big Subtle SwaadSevak Mark Watermark */}
        <svg
          viewBox="0 0 200 200"
          className="w-[500px] sm:w-[700px] md:w-[850px] lg:w-[1000px] h-auto text-orange-500 opacity-[0.045] transition-transform duration-1000"
          fill="currentColor"
        >
          {/* 3 Rising Saffron Steam Waves */}
          <path d="M 60 75 C 50 45 80 30 68 10" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M 100 75 C 90 45 120 30 108 10" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M 140 75 C 130 45 160 30 148 10" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none" />
          {/* Bowl Rim */}
          <rect x="25" y="95" width="150" height="16" rx="8" fill="currentColor" />
          {/* Bowl Body */}
          <path d="M 35 113 C 40 155 75 175 100 175 C 125 175 160 155 165 113 Z" fill="currentColor" />
          {/* Pedestal Foot */}
          <rect x="75" y="175" width="50" height="10" rx="5" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-container mx-auto px-4 sm:px-6 relative z-10">
        
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
        <div className="max-w-6xl mx-auto w-full">
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

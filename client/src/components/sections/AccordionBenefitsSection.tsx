import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, TrendingUp, ShoppingBag, Boxes, Globe } from 'lucide-react';
import { TeamIllustration } from '../illustrations/TeamIllustration';
import { StaffIllustration } from '../illustrations/StaffIllustration';
import { ChefIllustration } from '../illustrations/ChefIllustration';
import { OwnerIllustration } from '../illustrations/OwnerIllustration';
import { SITE_CONTENT } from '../../content/site';

interface BenefitItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  exploreLink: string;
  exploreText: string;
  illustration: 'team' | 'staff' | 'chef' | 'owner';
}

const BENEFITS: BenefitItem[] = [
  {
    id: 'growth',
    title: 'Boost restaurant growth',
    icon: TrendingUp,
    description: 'Speed up table turn times with fast 3-touch billing, QR ordering menus, customer loyalty programs, and instant daily sales reports.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'See growth tools',
    illustration: 'owner',
  },
  {
    id: 'orders',
    title: 'Manage online orders',
    icon: ShoppingBag,
    description: 'Auto-accept Swiggy, Zomato, and ONDC orders onto a single kitchen screen. Never miss an order during peak weekend rush hours.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'See delivery hub',
    illustration: 'staff',
  },
  {
    id: 'stock',
    title: 'Control stock & raw materials',
    icon: Boxes,
    description: 'Automate raw material recipe deductions down to grams of dairy, paneer, and poultry. Get morning purchase reorder alerts.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'See inventory features',
    illustration: 'chef',
  },
  {
    id: 'website',
    title: 'Get a custom restaurant website',
    icon: Globe,
    description: 'Launch your direct digital ordering portal with 1-tap WhatsApp checkout and 0% commission. We reply with full scope and quote within 24 hours.',
    exploreLink: SITE_CONTENT.links.websiteInquiry,
    exploreText: 'Get 24h website quote',
    illustration: 'team',
  },
];

export const AccordionBenefitsSection: React.FC = () => {
  const [openId, setOpenId] = useState<string>('growth');

  const activeBenefit = BENEFITS.find((b) => b.id === openId) || BENEFITS[0];

  return (
    <section className="py-12 sm:py-16 bg-cream text-espresso font-sans border-b border-sand-200">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sand-200 text-xs font-semibold text-espresso shadow-soft mb-3">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Operational Outcomes</span>
          </div>
          <h2 className="h2-fluid font-extrabold text-espresso tracking-tight mb-3">
            What SwaadSevak Can Do For You
          </h2>
          <p className="text-sm sm:text-base text-bodyText leading-relaxed">
            Engineered specifically to solve day-to-day chaos for Indian restaurant owners, managers, and kitchen teams.
          </p>
        </div>

        {/* 2-Column Layout: Accordion Left (7 cols), Illustration Panel Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Accordion List (7 cols) */}
          <div className="lg:col-span-7 space-y-3 text-left">
            {BENEFITS.map((item) => {
              const isOpen = item.id === openId;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-orange-500 shadow-card'
                      : 'bg-white/60 border-sand-200 hover:bg-white hover:border-sand-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(item.id)}
                    className="w-full p-4 sm:p-4.5 flex items-center justify-between gap-3 text-left cursor-pointer focus-ring"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center font-bold transition-colors ${
                          isOpen ? 'bg-orange-500 text-espresso-950' : 'bg-sand-100 text-bodyText'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-espresso">
                        {item.title}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-bodyText transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-orange-dark' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: 'auto' },
                          collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-sand-100">
                          <p className="text-xs sm:text-sm text-bodyText leading-relaxed mb-3">
                            {item.description}
                          </p>
                          <a
                            href={item.exploreLink}
                            className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm text-orange-dark hover:text-orange-hover focus-ring rounded"
                          >
                            <span>{item.exploreText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Crossfading Illustration Panel on Sand Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-sand-100 border border-sand-200 rounded-card-lg p-5 sm:p-6 flex flex-col items-center justify-center min-h-[300px] shadow-card">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBenefit.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center text-center"
                >
                  {activeBenefit.illustration === 'team' && <TeamIllustration className="w-48 h-auto" />}
                  {activeBenefit.illustration === 'staff' && <StaffIllustration className="w-44 h-auto" />}
                  {activeBenefit.illustration === 'chef' && <ChefIllustration className="w-44 h-auto" />}
                  {activeBenefit.illustration === 'owner' && <OwnerIllustration className="w-44 h-auto" />}

                  <div className="mt-3">
                    <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-orange-dark block">
                      {activeBenefit.title}
                    </span>
                    <span className="text-[11px] text-bodyText font-medium">
                      Designed for Indian restaurant operations
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

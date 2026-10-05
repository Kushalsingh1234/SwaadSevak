import React from 'react';
import { SEO } from './components/ui/SEO';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/sections/HeroSection';
import { ProofStripSection } from './components/sections/ProofStripSection';
import { DayStorySection } from './components/sections/DayStorySection';
import { FeaturesBentoSection } from './components/sections/FeaturesBentoSection';
import { Website24hSection } from './components/sections/Website24hSection';
import { OutletTypesSection } from './components/sections/OutletTypesSection';
import { SavingsCalculatorSection } from './components/sections/SavingsCalculatorSection';
import { IntegrationsSection } from './components/sections/IntegrationsSection';
import { SwitchingSection } from './components/sections/SwitchingSection';
import { PricingSection } from './components/sections/PricingSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { FAQSection } from './components/sections/FAQSection';
import { FinalCTASection } from './components/sections/FinalCTASection';
import { Footer } from './components/layout/Footer';
import { CookieBanner } from './components/ui/CookieBanner';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { MobileBottomBar } from './components/ui/MobileBottomBar';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-[#160D10] text-maroon-950 dark:text-cream-50 transition-colors duration-300">
      {/* Dynamic SEO & JSON-LD schema */}
      <SEO />

      {/* 1. Header (Sticky & Shrink-on-scroll) */}
      <Header />

      {/* Main Page Sections */}
      <main id="main-content" className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Proof Strip Section */}
        <ProofStripSection />

        {/* 4. "A Day at Your Restaurant" Scroll Story */}
        <DayStorySection />

        {/* 5. Features Bento Grid (8 Tiles with Mini Demos) */}
        <FeaturesBentoSection />

        {/* 6. FEATURED: Your Restaurant Website in 24 Hours */}
        <Website24hSection />

        {/* 7. Outlet Types (8 Tabs) */}
        <OutletTypesSection />

        {/* 8. Savings Calculator */}
        <SavingsCalculatorSection />

        {/* 9. Integrations Grid */}
        <IntegrationsSection />

        {/* 10. Switching Made Easy */}
        <SwitchingSection />

        {/* 11. Pricing & Comparison */}
        <PricingSection />

        {/* 12. Testimonials (Receipt-style) */}
        <TestimonialsSection />

        {/* 13. FAQ Accordion */}
        <FAQSection />

        {/* 14. Final CTA Demo Form */}
        <FinalCTASection />
      </main>

      {/* 15. Footer */}
      <Footer />

      {/* Global Conversion & Privacy Utilities */}
      <CookieBanner />
      <FloatingWhatsApp />
      <MobileBottomBar />
    </div>
  );
};

export default App;

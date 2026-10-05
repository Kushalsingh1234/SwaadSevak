import React from 'react';
import { SEO } from './components/ui/SEO';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/sections/HeroSection';
import { ProofStripSection } from './components/sections/ProofStripSection';
import { ProblemSolutionSection } from './components/sections/ProblemSolutionSection';
import { ProductTourSection } from './components/sections/ProductTourSection';
import { FeaturesBentoSection } from './components/sections/FeaturesBentoSection';
import { WebsiteInquirySection } from './components/sections/WebsiteInquirySection';
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
    <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-ink-950 text-ink-950 dark:text-ink-50 transition-colors duration-200">
      {/* 0. SEO Helmet & Structured Schema */}
      <SEO />

      {/* 1. Header (Sticky with blur-and-shrink on scroll) */}
      <Header />

      {/* Main Content Sections */}
      <main id="main-content" className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Proof Strip */}
        <ProofStripSection />

        {/* 4. Problem to Solution (3 Pains & Fixes) */}
        <ProblemSolutionSection />

        {/* 5. Product Tour (4-Moment Scroll Story with React Mockups) */}
        <ProductTourSection />

        {/* 6. Features Bento Grid (8 Tiles with Mini Demos) */}
        <FeaturesBentoSection />

        {/* 7. Website Inquiry Section (Dark Ink Band, 24h Response Scope) */}
        <WebsiteInquirySection />

        {/* 8. Outlet Types (8 Tabs) */}
        <OutletTypesSection />

        {/* 9. Savings Calculator */}
        <SavingsCalculatorSection />

        {/* 10. Integrations */}
        <IntegrationsSection />

        {/* 11. Switching Made Easy (3 Steps with Timeline) */}
        <SwitchingSection />

        {/* 12. Pricing & Comparison Table */}
        <PricingSection />

        {/* 13. Testimonials (Marked TODO Placeholders) */}
        <TestimonialsSection />

        {/* 14. FAQ (8 Accessible Accordion Items) */}
        <FAQSection />

        {/* 15. Final CTA Demo Form (Dark Ink Band) */}
        <FinalCTASection />
      </main>

      {/* 16. Footer */}
      <Footer />

      {/* Global Utilities */}
      <CookieBanner />
      <FloatingWhatsApp />
      <MobileBottomBar />
    </div>
  );
};

export default App;

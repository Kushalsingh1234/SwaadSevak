import React from 'react';
import { SEO } from './components/ui/SEO';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/sections/HeroSection';
import { ProductTabsSection } from './components/sections/ProductTabsSection';
import { TrustStripSection } from './components/sections/TrustStripSection';
import { WhyUsSection } from './components/sections/WhyUsSection';
import { EcosystemSection } from './components/sections/EcosystemSection';
import { MetricsBandSection } from './components/sections/MetricsBandSection';
import { AccordionBenefitsSection } from './components/sections/AccordionBenefitsSection';
import { WebsiteInquirySection } from './components/sections/WebsiteInquirySection';
import { SavingsCalculatorSection } from './components/sections/SavingsCalculatorSection';
import { PricingSection } from './components/sections/PricingSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { FAQSection } from './components/sections/FAQSection';
import { BookDemoSection } from './components/sections/BookDemoSection';
import { Footer } from './components/layout/Footer';
import { CookieBanner } from './components/ui/CookieBanner';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { MobileBottomBar } from './components/ui/MobileBottomBar';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-espresso antialiased selection:bg-orange-500 selection:text-espresso font-sans">
      {/* 0. SEO Meta & Structured JSON-LD */}
      <SEO />

      {/* 1. Header (Slim espresso, sticky with blur-and-shrink on scroll) */}
      <Header />

      {/* Main Sections in Exact Rhythm */}
      <main id="main-content" className="flex-1">
        {/* 2. Dark Espresso Hero */}
        <HeroSection />

        {/* 3. Product Tab Switcher (Crossfading Device Screens) */}
        <ProductTabsSection />

        {/* 4. Trust Strip on Cream Band (Infinite Marquee) */}
        <TrustStripSection />

        {/* 5. Dark "Why Us" Section (Asymmetric 2+1/1+2 Grid) */}
        <WhyUsSection />

        {/* 6. Ecosystem on White (2x2 Grid of Sand-Tinted Cards) */}
        <EcosystemSection />

        {/* 7. Espresso Metrics Band (How We Build Trust) */}
        <MetricsBandSection />

        {/* 8. Accordion Benefits (What SwaadSevak Can Do For You + Team Illustration) */}
        <AccordionBenefitsSection />

        {/* 9. Website Inquiry Section (Dark Espresso Band, 24h Response Guarantee) */}
        <WebsiteInquirySection />

        {/* 10. Savings Calculator on White (Visible Formula) */}
        <SavingsCalculatorSection />

        {/* 11. Pricing on Cream (Starter, Growth, Scale) */}
        <PricingSection />

        {/* 12. Testimonials on White (3 Cards + Carousel Arrows) */}
        <TestimonialsSection />

        {/* 13. FAQ (8 Accessible Accordion Items) */}
        <FAQSection />

        {/* 14. Book a Free Demo (Cream Panel with Choice Chips) */}
        <BookDemoSection />
      </main>

      {/* 15. Footer on Espresso */}
      <Footer />

      {/* Global Action Utilities */}
      <CookieBanner />
      <FloatingWhatsApp />
      <MobileBottomBar />
    </div>
  );
};

export default App;

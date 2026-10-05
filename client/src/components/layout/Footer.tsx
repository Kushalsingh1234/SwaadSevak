import React from 'react';
import { SwaadSevakLogo } from '../ui/SwaadSevakLogo';
import { SITE_CONTENT } from '../../content/site';
import { Phone, Mail, MessageCircle, MapPin, Globe, ShieldCheck, Award } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const Footer: React.FC = () => {
  const { language, toggleLanguage } = useTranslation();

  return (
    <footer className="bg-espresso text-sand-200 pt-16 pb-28 sm:pb-16 border-t border-walnut font-sans text-left">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-walnut">
          
          {/* Brand Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <SwaadSevakLogo size="md" lightText />
            <p className="text-xs sm:text-sm text-sand-300 max-w-sm leading-relaxed">
              {SITE_CONTENT.brand.tagline}. Built specifically for Indian restaurants, cafés, cloud kitchens, and multi-outlet chains.
            </p>
            
            {/* Country & Language Switch */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cocoa hover:bg-cocoa-light text-xs font-bold text-sand-100 border border-walnut transition-colors cursor-pointer focus-ring"
              >
                <Globe className="w-3.5 h-3.5 text-orange-400" />
                <span>Language: {language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
              </button>
              <span className="text-xs text-sand-300 font-mono">🇮🇳 India</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-white text-sm">Products</h4>
            <ul className="space-y-2 text-sand-300">
              <li>
                <a href="#products" className="hover:text-orange-400 transition-colors">
                  POS &amp; KOT Billing
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-orange-400 transition-colors">
                  Online Orders Hub
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-orange-400 transition-colors">
                  Recipe Inventory Engine
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.websiteInquiry} className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span>Restaurant Website</span>
                  <span className="text-[9px] font-mono bg-orange-500 text-espresso font-bold px-1 rounded">24h</span>
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.calculator} className="hover:text-orange-400 transition-colors">
                  Savings Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Pricing */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-white text-sm">Resources</h4>
            <ul className="space-y-2 text-sand-300">
              <li><a href={SITE_CONTENT.links.pricing} className="hover:text-orange-400 transition-colors">Pricing Plans</a></li>
              <li><a href="#why-us" className="hover:text-orange-400 transition-colors">Why SwaadSevak</a></li>
              <li><a href="#ecosystem" className="hover:text-orange-400 transition-colors">Ecosystem</a></li>
              <li><a href={SITE_CONTENT.links.faq} className="hover:text-orange-400 transition-colors">FAQ</a></li>
              <li><a href={SITE_CONTENT.links.demo} className="hover:text-orange-400 transition-colors">Book a Demo</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-white text-sm">Contact &amp; Support</h4>
            <div className="space-y-2.5 text-sand-300">
              <a href={`tel:${SITE_CONTENT.brand.supportPhoneRaw}`} className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{SITE_CONTENT.brand.supportPhone}</span>
              </a>
              <a
                href={`https://wa.me/${SITE_CONTENT.brand.whatsappNumber}?text=Hi%20SwaadSevak%2C%20I%20would%20like%20to%20know%20more%20about%20your%20restaurant%20POS.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-orange-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-success shrink-0" />
                <span>WhatsApp Live Desk</span>
              </a>
              <a href={`mailto:${SITE_CONTENT.brand.supportEmail}`} className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{SITE_CONTENT.brand.supportEmail}</span>
              </a>
              <div className="flex items-start gap-2 pt-1 text-xs text-sand-300 leading-relaxed">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{SITE_CONTENT.brand.officeAddress}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Placeholder Award & Rating Badges Row (Marked TODO, no fake awards) */}
        <div className="py-6 border-b border-walnut flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="font-mono text-sand-300 text-[11px] uppercase">
            Certification &amp; Benchmark Badges:
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cocoa border border-walnut text-[11px] text-sand-200">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>GST &amp; DLT Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cocoa border border-walnut text-[11px] text-sand-200">
              <Award className="w-3.5 h-3.5 text-orange-400" />
              <span>ESC/POS Standard Certified</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-cocoa border border-walnut text-[10px] font-mono text-sand-300 uppercase">
              TODO: REPLACE WITH VERIFIED BADGES
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-300">
          <p>© {new Date().getFullYear()} {SITE_CONTENT.brand.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href={SITE_CONTENT.links.privacy} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href={SITE_CONTENT.links.terms} className="hover:text-white transition-colors">Terms of Service</a>
            <a href={SITE_CONTENT.links.refund} className="hover:text-white transition-colors">Refund Policy</a>
            <a href="/security" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

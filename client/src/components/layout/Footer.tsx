import React from 'react';
import { SwaadSevakLogo } from '../ui/SwaadSevakLogo';
import { SITE_CONTENT } from '../../content/site';
import { Phone, Mail, MessageCircle, MapPin, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-orange-500 text-espresso pt-16 pb-28 sm:pb-16 border-t border-orange-600/30 font-sans text-left">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-espresso/20">
          
          {/* Brand Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block">
              <SwaadSevakLogo size="md" />
            </div>
            <p className="text-xs sm:text-sm text-espresso max-w-sm leading-relaxed font-semibold">
              {SITE_CONTENT.brand.tagline}. Built specifically for Indian restaurants, cafés, cloud kitchens, and multi-outlet chains.
            </p>
            
            {/* Country Badge */}
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 text-xs font-extrabold text-espresso shadow-soft border border-espresso/15">
                <span>🇮🇳</span>
                <span>Built for Indian Food Businesses</span>
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-extrabold text-espresso-950 text-sm uppercase tracking-wide">Products</h4>
            <ul className="space-y-2 text-espresso font-semibold">
              <li>
                <a href="#products" className="hover:text-espresso-950 hover:underline transition-all">
                  POS &amp; KOT Billing
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-espresso-950 hover:underline transition-all">
                  Online Orders Hub
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-espresso-950 hover:underline transition-all">
                  Recipe Inventory Engine
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.websiteInquiry} className="hover:text-espresso-950 hover:underline transition-all flex items-center gap-1.5">
                  <span>Restaurant Website</span>
                  <span className="text-[9px] font-mono bg-espresso text-white font-extrabold px-1 rounded">24h</span>
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.calculator} className="hover:text-espresso-950 hover:underline transition-all">
                  Savings Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Pricing */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-extrabold text-espresso-950 text-sm uppercase tracking-wide">Resources</h4>
            <ul className="space-y-2 text-espresso font-semibold">
              <li><a href={SITE_CONTENT.links.pricing} className="hover:text-espresso-950 hover:underline transition-all">Pricing Plans</a></li>
              <li><a href="#why-us" className="hover:text-espresso-950 hover:underline transition-all">Why SwaadSevak</a></li>
              <li><a href="#ecosystem" className="hover:text-espresso-950 hover:underline transition-all">Ecosystem</a></li>
              <li><a href={SITE_CONTENT.links.faq} className="hover:text-espresso-950 hover:underline transition-all">FAQ</a></li>
              <li><a href={SITE_CONTENT.links.demo} className="hover:text-espresso-950 hover:underline transition-all">Book a Demo</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-extrabold text-espresso-950 text-sm uppercase tracking-wide">Contact &amp; Support</h4>
            <div className="space-y-2.5 text-espresso font-semibold">
              <a href={`tel:${SITE_CONTENT.brand.supportPhoneRaw}`} className="flex items-center gap-2 hover:text-espresso-950 transition-colors">
                <Phone className="w-4 h-4 text-espresso shrink-0" />
                <span>{SITE_CONTENT.brand.supportPhone}</span>
              </a>
              <a
                href={`https://wa.me/${SITE_CONTENT.brand.whatsappNumber}?text=Hi%20SwaadSevak%2C%20I%20would%20like%20to%20know%20more%20about%20your%20restaurant%20POS.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-espresso-950 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-espresso shrink-0" />
                <span>WhatsApp Live Desk</span>
              </a>
              <a href={`mailto:${SITE_CONTENT.brand.supportEmail}`} className="flex items-center gap-2 hover:text-espresso-950 transition-colors">
                <Mail className="w-4 h-4 text-espresso shrink-0" />
                <span>{SITE_CONTENT.brand.supportEmail}</span>
              </a>
              <div className="flex items-start gap-2 pt-1 text-xs text-espresso leading-relaxed font-semibold">
                <MapPin className="w-4 h-4 text-espresso shrink-0 mt-0.5" />
                <span>{SITE_CONTENT.brand.officeAddress}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Certification & Benchmark Badges Row */}
        <div className="py-6 border-b border-espresso/20 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="font-mono text-espresso font-extrabold text-[11px] uppercase">
            Certification &amp; Benchmark Badges:
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 border border-espresso/20 text-[11px] text-espresso font-bold shadow-soft">
              <ShieldCheck className="w-3.5 h-3.5 text-espresso" />
              <span>GST &amp; DLT Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 border border-espresso/20 text-[11px] text-espresso font-bold shadow-soft">
              <Award className="w-3.5 h-3.5 text-espresso" />
              <span>ESC/POS Standard Certified</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/70 border border-espresso/20 text-[10px] font-mono text-espresso font-extrabold uppercase">
              TODO: REPLACE WITH VERIFIED BADGES
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-espresso font-semibold">
          <p>© {new Date().getFullYear()} {SITE_CONTENT.brand.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href={SITE_CONTENT.links.privacy} className="hover:text-espresso-950 hover:underline transition-all">Privacy Policy</a>
            <a href={SITE_CONTENT.links.terms} className="hover:text-espresso-950 hover:underline transition-all">Terms of Service</a>
            <a href={SITE_CONTENT.links.refund} className="hover:text-espresso-950 hover:underline transition-all">Refund Policy</a>
            <a href="/security" className="hover:text-espresso-950 hover:underline transition-all">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

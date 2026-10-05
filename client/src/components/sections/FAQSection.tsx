import React from 'react';
import { SITE_CONTENT, FAQItem } from '../../content/site';
import { useTranslation } from '../../i18n';
import { Badge } from '../ui/Badge';
import { Accordion } from '../ui/Accordion';
import { HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { t, language } = useTranslation();

  const accordionItems = SITE_CONTENT.faqs.map((faq) => ({
    id: faq.id,
    title: language === 'hi' ? faq.questionHi : faq.questionEn,
    content: language === 'hi' ? faq.answerHi : faq.answerEn,
  }));

  return (
    <section id="faq" className="py-16 sm:py-24 font-sans bg-cream-100/40 dark:bg-maroon-900/10 border-t border-receipt-divider dark:border-maroon-800">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="saffron" className="mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.faq.badge}</span>
          </Badge>
          <h2 className="h2-fluid font-serif font-bold text-maroon-950 dark:text-cream-50 mb-3">
            {t.faq.title}
          </h2>
          <p className="text-sm sm:text-base text-maroon-900/80 dark:text-cream-200/80 leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* 8-Item Accordion */}
        <div className="max-w-3xl mx-auto text-left">
          <Accordion items={accordionItems} allowMultiple={false} />
        </div>

      </div>
    </section>
  );
};

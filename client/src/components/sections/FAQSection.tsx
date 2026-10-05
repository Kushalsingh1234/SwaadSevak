import React from 'react';
import { SITE_CONTENT } from '../../content/site';
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
    <section id="faq" className="py-16 sm:py-24 font-sans bg-ink-50/50 dark:bg-ink-900/30 border-t border-ink-200/80 dark:border-ink-800">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="neutral" className="mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.faq.badge}</span>
          </Badge>
          <h2 className="h2-fluid font-bold text-ink-950 dark:text-ink-50 mb-3">
            {t.faq.title}
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
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

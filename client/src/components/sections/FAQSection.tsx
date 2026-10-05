import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { useTranslation } from '../../i18n';
import { Accordion } from '../ui/Accordion';
import { HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { language } = useTranslation();

  const accordionItems = SITE_CONTENT.faqs.map((faq) => ({
    id: faq.id,
    title: language === 'hi' ? faq.questionHi : faq.questionEn,
    content: language === 'hi' ? faq.answerHi : faq.answerEn,
  }));

  return (
    <section id="faq" className="py-20 sm:py-28 font-sans bg-sand-50/50 text-espresso border-b border-sand-200">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-100 border border-sand-200 text-xs font-semibold text-espresso shadow-soft mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="h2-fluid font-extrabold text-espresso tracking-tight mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-base sm:text-lg text-bodyText leading-relaxed">
            Straight answers to the most common questions from Indian restaurant operators.
          </p>
        </div>

        {/* 8-Item Accessible Accordion */}
        <div className="max-w-3xl mx-auto text-left">
          <Accordion items={accordionItems} allowMultiple={false} />
        </div>

      </div>
    </section>
  );
};

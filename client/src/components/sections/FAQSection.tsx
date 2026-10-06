import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { Accordion } from '../ui/Accordion';
import { HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const accordionItems = SITE_CONTENT.faqs.map((faq) => ({
    id: faq.id,
    title: faq.questionEn,
    content: faq.answerEn,
  }));

  return (
    <section id="faq" className="py-6 sm:py-8 font-sans bg-sand-50/50 text-espresso border-b border-sand-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand-100 border border-sand-200 text-[10.5px] font-semibold text-espresso shadow-soft mb-1.5">
            <HelpCircle className="w-3 h-3 text-orange-500" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="h2-fluid font-extrabold text-espresso tracking-tight mb-1.5">
            Everything You Need to Know
          </h2>
          <p className="text-[11px] sm:text-xs text-bodyText leading-relaxed font-normal">
            Straight answers to the most common questions from Indian restaurant operators.
          </p>
        </div>

        {/* 8-Item Accessible Accordion */}
        <div className="max-w-xl mx-auto text-left">
          <Accordion items={accordionItems} allowMultiple={false} />
        </div>

      </div>
    </section>
  );
};

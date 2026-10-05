import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../i18n';
import { SITE_CONTENT } from '../../content/site';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl = 'https://swaadsevak.vercel.app/',
  ogImage = 'https://swaadsevak.vercel.app/brand/og-image.png',
}) => {
  const { language } = useTranslation();

  const finalTitle =
    title ||
    (language === 'hi'
      ? 'स्वादसेवक — भारतीय रेस्टोरेंट्स के लिए बिलिंग POS, KOT और 24h वेबसाइट'
      : 'SwaadSevak — Restaurant POS, Offline KOT & 24h Custom Website');

  const finalDescription =
    description ||
    (language === 'hi'
      ? 'भारतीय कैफ़े, रेस्टोरेंट और क्लाउड किचन के लिए 3-क्लिक बिलिंग, थर्मल KOT, स्विगी/ज़ोमैटो सिंक और 24 घंटे में लाइव वेबसाइट।'
      : '3-click billing, offline thermal KOT, Zomato/Swiggy aggregator sync, automated recipe stock deduction, and your custom restaurant website live in 24 hours.');

  // FAQ Schema for SEO rich snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SITE_CONTENT.faqs.map((faq) => ({
      '@type': 'Question',
      name: language === 'hi' ? faq.questionHi : faq.questionEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: language === 'hi' ? faq.answerHi : faq.answerEn,
      },
    })),
  };

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data: FAQPage */}
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
  );
};

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_CONTENT } from '../../content/site';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'SwaadSevak — Restaurant POS, Offline KOT & 24h Custom Website',
  description = '3-touch billing, offline thermal KOT, Zomato/Swiggy aggregator sync, automated recipe stock deduction, and your custom restaurant website live in 24 hours.',
  canonicalUrl = 'https://swaadsevak.vercel.app/',
  ogImage = 'https://swaadsevak.vercel.app/brand/og-image.png',
}) => {
  // FAQ Schema for SEO rich snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SITE_CONTENT.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.questionEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answerEn,
      },
    })),
  };

  return (
    <Helmet htmlAttributes={{ lang: 'en' }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: SITE_CONTENT.brand.name,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web, Windows, Android, iOS',
          offers: {
            '@type': 'Offer',
            price: '1199',
            priceCurrency: 'INR',
          },
        })}
      </script>

      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
  );
};

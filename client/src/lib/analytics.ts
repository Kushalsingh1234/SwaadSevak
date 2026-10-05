/**
 * SwaadSevak Analytics & Event Tracking Helper
 * Integrates with Google Tag Manager (GTM) dataLayer with safe browser fallback.
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export type AnalyticsEventName =
  | 'demo_cta_click'
  | 'website_configurator_interact'
  | 'website_form_submit'
  | 'savings_calculator_slide'
  | 'pricing_plan_select'
  | 'whatsapp_click'
  | 'faq_expand'
  | 'language_toggle'
  | 'outlet_tab_change';

export function trackEvent(eventName: AnalyticsEventName, payload: Record<string, unknown> = {}) {
  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  // Push to GTM dataLayer if present
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);

    // Development diagnostic log
    if (import.meta.env.DEV) {
      console.log(`[Analytics Event: ${eventName}]`, payload);
    }
  }
}

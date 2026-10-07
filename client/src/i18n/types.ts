export type Language = 'en' | 'hi';

export interface Translations {
  nav: {
    features: string;
    website24h: string;
    outletTypes: string;
    pricing: string;
    faq: string;
    bookDemo: string;
    callUs: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    liveTicker: string;
    activeOrders: string;
    kotCount: string;
    totalBill: string;
    statusCooking: string;
    statusReady: string;
    statusNew: string;
  };
  proof: {
    badge: string;
    sub: string;
  };
  dayStory: {
    title: string;
    subtitle: string;
    badge: string;
    moment1Title: string;
    moment1Desc: string;
    moment2Title: string;
    moment2Desc: string;
    moment3Title: string;
    moment3Desc: string;
    moment4Title: string;
    moment4Desc: string;
  };
  features: {
    badge: string;
    title: string;
    subtitle: string;
    billingTitle: string;
    billingDesc: string;
    inventoryTitle: string;
    inventoryDesc: string;
    aggregatorsTitle: string;
    aggregatorsDesc: string;
    reportsTitle: string;
    reportsDesc: string;
    crmTitle: string;
    crmDesc: string;
    qrTitle: string;
    qrDesc: string;
    kdsTitle: string;
    kdsDesc: string;
    offlineTitle: string;
    offlineDesc: string;
  };
  website24h: {
    badge: string;
    title: string;
    subtitle: string;
    configuratorHeader: string;
    pickCuisine: string;
    pickColor: string;
    enterName: string;
    phonePreview: string;
    desktopPreview: string;
    timelineStep1: string;
    timelineStep1Desc: string;
    timelineStep2: string;
    timelineStep2Desc: string;
    timelineStep3: string;
    timelineStep3Desc: string;
    includedTitle: string;
    formTitle: string;
    formSubtitle: string;
    formOwnerLabel: string;
    formRestLabel: string;
    formPhoneLabel: string;
    formCityLabel: string;
    formUploadLabel: string;
    formSubmitBtn: string;
    successMessage: string;
  };
  calculator: {
    badge: string;
    title: string;
    subtitle: string;
    outletsLabel: string;
    ordersLabel: string;
    commissionLabel: string;
    wastageLabel: string;
    estimatedSavings: string;
    perMonth: string;
    perYear: string;
    formulaTitle: string;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    monthly: string;
    annual: string;
    annualDiscount: string;
    mostPopular: string;
    getStarted: string;
    whatCostsExtra: string;
    comparisonTitle: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
  };
  finalCta: {
    badge: string;
    title: string;
    subtitle: string;
    submitButton: string;
    whatsappDirect: string;
  };
}

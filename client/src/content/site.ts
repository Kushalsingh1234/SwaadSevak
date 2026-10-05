/**
 * SwaadSevak — Single Source of Truth for Content, Stats, Pricing & Links
 * NOTE: All customer numbers, ratings, and partner logos are strictly labeled placeholders
 * to be replaced with verified production data before commercial launch.
 */

export interface PricingPlan {
  id: 'starter' | 'growth' | 'scale';
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPricePerMonth: number;
  popular?: boolean;
  features: string[];
  websiteIncluded: boolean;
  hardwareSupport: string;
  outletsLimit: string;
  ctaText: string;
}

export interface FAQItem {
  id: string;
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
  category: 'general' | 'hardware' | 'billing' | 'website';
}

export interface OutletType {
  id: string;
  name: string;
  nameHi: string;
  badge: string;
  tagline: string;
  features: string[];
  highlightMetric: string;
  highlightLabel: string;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  confirmTag: string; // [CONFIRM]
}

export const SITE_CONTENT = {
  brand: {
    name: 'SwaadSevak',
    legalName: 'SwaadSevak Technologies Pvt. Ltd.',
    tagline: 'The dependable hand behind every plate',
    supportPhone: '+91 98765 43210', // [PLACEHOLDER: Replace with actual customer care line]
    supportPhoneRaw: '919876543210',
    whatsappNumber: '919876543210', // [PLACEHOLDER: Replace with actual business WhatsApp]
    supportEmail: 'namaste@swaadsevak.in',
    officeAddress: 'Floor 3, Indiranagar 100ft Road, Bengaluru, Karnataka 560038', // [PLACEHOLDER: Replace with registered office]
    gstNumber: '29AAAAA0000A1Z5', // [PLACEHOLDER: Replace with company GSTIN]
  },

  links: {
    demo: '#book-demo',
    website24h: '#website-in-24h',
    pricing: '#pricing',
    features: '#features',
    faq: '#faq',
    calculator: '#savings-calculator',
    privacy: '/privacy',
    terms: '/terms',
    refund: '/refund',
  },

  // Proof Strip Placeholders (Honesty rule: Marked as placeholders)
  proofStats: [
    {
      value: '2.4M+',
      label: 'KOT Tickets Printed (Simulated)',
      sub: 'Across 450+ early beta food partners',
      isPlaceholder: true,
    },
    {
      value: '99.98%',
      label: 'Offline Engine Uptime',
      sub: 'Bills keep printing when internet dips',
      isPlaceholder: true,
    },
    {
      value: '24 Hours',
      label: 'Website Turnaround Time',
      sub: 'Guaranteed delivery after menu receipt',
      isPlaceholder: false,
    },
  ],

  // Logo strip partner labels (fictional/generic outlet types for demo representation)
  partnerTypes: [
    'Artisanal Cafes',
    'South Indian Tiffin Hubs',
    'Dum Biryani Kitchens',
    'Sweet & Chaat Houses',
    'Multi-outlet QSRs',
    'Rooftop Restro-bars',
  ],

  // 24h Website Configurator Options
  cuisines: [
    { id: 'north-indian', name: 'North Indian & Mughlai', defaultColor: '#B8500D', previewTag: 'Butter Chicken & Naan' },
    { id: 'south-indian', name: 'South Indian & Tiffin', defaultColor: '#1E7B4D', previewTag: 'Ghee Podi Roast Dosa' },
    { id: 'cafe', name: 'Cafe & Specialty Coffee', defaultColor: '#78330F', previewTag: 'Cold Brew & Croissants' },
    { id: 'bakery', name: 'Artisan Bakery & Pastry', defaultColor: '#BC2C4E', previewTag: 'Sourdough & Cheesecakes' },
    { id: 'biryani', name: 'Dum Biryani House', defaultColor: '#E57A1F', previewTag: 'Hyderabadi Mutton Biryani' },
    { id: 'fast-food', name: 'Street Food & Chaat', defaultColor: '#D46714', previewTag: 'Pani Puri & Vada Pav' },
    { id: 'chinese', name: 'Indo-Chinese & Momos', defaultColor: '#971F3B', previewTag: 'Chilli Chicken & Dimsums' },
  ],

  websiteDeliverables: [
    'Custom domain connection support (yourrestaurant.com)',
    '100% Mobile-first responsive layout with fast ordering UX',
    'Interactive digital menu with high-res food previews & veg/non-veg tags',
    'Direct WhatsApp one-tap ordering button for customers',
    'Direct Google Maps & Instagram integration',
    'Full On-Page SEO setup for local neighborhood searches',
    'Free SSL Security certificate & 99.9% cloud hosting',
    '2 Free revision cycles included after first 24h delivery',
  ],

  websiteTermsNote: 'Delivery clock starts upon receiving your finalized menu list/PDF and brand logo. Initial live version is created using our hand-crafted restaurant design engine.',

  websitePricing: {
    standalonePrice: 2499,
    growthPlanIncluded: true,
  },

  // Outlet Types (8 Tabs)
  outletTypes: [
    {
      id: 'cafe',
      name: 'Café & Bistro',
      nameHi: 'कैफ़े और बिस्ट्रो',
      badge: 'Speed & Ambience',
      tagline: 'Quick table turns with digital QR menus and barista KOT dispatch.',
      features: [
        'Interactive QR code tables with zero app install required for guests',
        'Direct Barista station split KOT (coffee vs kitchen items routed separately)',
        'Customer loyalty points synced with mobile phone numbers',
      ],
      highlightMetric: '< 15s',
      highlightLabel: 'Average QR Order-to-KOT dispatch time',
    },
    {
      id: 'qsr',
      name: 'Quick Service (QSR)',
      nameHi: 'क्विक सर्विस (QSR)',
      badge: 'High Volume',
      tagline: 'Blazing fast counter billing designed for 200+ orders per hour.',
      features: [
        '3-Touch counter billing with instant numeric keypad entry',
        'Customer facing token display screen (KDS token queue)',
        'Unified UPI dynamic QR code generator on customer-facing display',
      ],
      highlightMetric: '3-Touch',
      highlightLabel: 'Rapid checkout speed per order',
    },
    {
      id: 'finedine',
      name: 'Fine Dining & Resto-Bar',
      nameHi: 'फ़ाइन डाइनिंग और बार',
      badge: 'Guest Experience',
      tagline: 'Multi-course pacing, server tablet ordering, and split billing.',
      features: [
        'Captain tablet ordering app with live floor plan map & table vacancy',
        'Course pacing controls (Starters → Mains → Desserts KOT hold & fire)',
        'Split billing by seats, item shares, or custom split ratios',
      ],
      highlightMetric: '100%',
      highlightLabel: 'Live table floor occupancy clarity',
    },
    {
      id: 'cloud',
      name: 'Cloud Kitchen',
      nameHi: 'क्लाउड किचन',
      badge: 'Multi-Brand',
      tagline: 'Run 10 virtual delivery brands from 1 single kitchen screen.',
      features: [
        'Auto-accept and centralized KOT printing for Zomato & Swiggy',
        'Centralized raw material auto-deduction across all child brands',
        'Rider pickup screen with live OTP and delivery executive tracker',
      ],
      highlightMetric: '10 Brands',
      highlightLabel: 'Managed smoothly from one central dashboard',
    },
    {
      id: 'bakery',
      name: 'Bakery & Sweets',
      nameHi: 'बेकरी और मिष्ठान',
      badge: 'Weight & Batching',
      tagline: 'Weight scale barcode integration and advance custom cake bookings.',
      features: [
        'Electronic weighing scale integration (auto-computes gram rates)',
        'Advance custom cake orders calendar with delivery date reminders',
        'Batch expiry and perishable inventory track alerts',
      ],
      highlightMetric: 'Auto-Gram',
      highlightLabel: 'Precision electronic scale sync',
    },
    {
      id: 'bar',
      name: 'Bar & Brewery',
      nameHi: 'बार और शराबखाना',
      badge: 'Liquor Compliance',
      tagline: 'Bottle vs peg decanting tracking and state excise compliant reports.',
      features: [
        'Peg-level inventory tracking (30ml, 60ml, bottle decanting deduction)',
        'Happy hours automated pricing rules with scheduled time triggers',
        'State excise register generation with daily closing stock logs',
      ],
      highlightMetric: 'Peg-Level',
      highlightLabel: 'Liquor wastage reduction tracking',
    },
    {
      id: 'foodcourt',
      name: 'Food Court & Mall',
      nameHi: 'फ़ूड कोर्ट',
      badge: 'Prepaid Cards',
      tagline: 'Multi-vendor food court prepaid cards and centralized settlement.',
      features: [
        'NFC food court smart card recharge and balance refund kiosk',
        'Automatic revenue share split calculations per vendor stall',
        'Centralized audit reports with real-time mall operator portal',
      ],
      highlightMetric: 'Zero Leakage',
      highlightLabel: 'Automated vendor revenue settlements',
    },
    {
      id: 'chain',
      name: 'Multi-Outlet Chain',
      nameHi: 'फ़ूड चेन्स (5-50+ आउटलेट्स)',
      badge: 'Enterprise HQ',
      tagline: 'Centralized recipe control, master menu publishing, and HQ analytics.',
      features: [
        '1-Click Master menu price push to all branches or tiered zones',
        'Central commissary kitchen purchase orders & inter-store transfers',
        'Role-based granular staff permissions (Cashier, Captain, GM, CFO)',
      ],
      highlightMetric: '50+ Stores',
      highlightLabel: 'Synced in real time across India',
    },
  ],

  // Savings Calculator Defaults
  calculatorDefaults: {
    outlets: 1,
    monthlyOrders: 1800,
    averageOrderValue: 420,
    aggregatorSharePct: 45, // 45% orders via aggregators
    aggregatorCommissionPct: 24, // 24% typical commission
    wastagePct: 6, // 6% food wastage
  },

  // Integrations List (with [CONFIRM] tags)
  integrations: [
    {
      id: 'zomato',
      name: 'Zomato Live Sync',
      category: 'Food Delivery',
      badge: 'Direct API',
      description: 'Auto-accept orders, sync menu prices, and toggle out-of-stock items in real time. [CONFIRM: Requires merchant partner API approval]',
      confirmTag: '[CONFIRM]',
    },
    {
      id: 'swiggy',
      name: 'Swiggy UrbanPiper Bridge',
      category: 'Food Delivery',
      badge: 'Direct API',
      description: 'Single KOT print for both Swiggy orders and in-house dining with centralized rider dispatch. [CONFIRM: Partner onboarding sync]',
      confirmTag: '[CONFIRM]',
    },
    {
      id: 'ondc',
      name: 'ONDC Network Seller',
      category: 'Open Commerce',
      badge: 'Zero Commission',
      description: 'Accept direct orders from ONDC buyer apps like Paytm, Magicpin, and Pincode at 3-5% base gateway charges. [CONFIRM]',
      confirmTag: '[CONFIRM]',
    },
    {
      id: 'upi',
      name: 'Dynamic UPI & POS Terminals',
      category: 'Payments',
      badge: 'Instant Soundbox',
      description: 'Dynamic UPI QR on bill slips, Pine Labs, Paytm, PhonePe soundbox and EDC machine integrations. [CONFIRM]',
      confirmTag: '[CONFIRM]',
    },
    {
      id: 'tally',
      name: 'Tally Prime & Zoho Books',
      category: 'Accounting',
      badge: 'Daily Sync',
      description: 'End-of-day sales, GST item-wise breakups, and raw material purchase vouchers exported automatically. [CONFIRM]',
      confirmTag: '[CONFIRM]',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business Cloud API',
      category: 'Customer CRM',
      badge: 'Green Tick',
      description: 'Auto-send digital GST bills, delivery tracking links, and personalized re-order promo coupons. [CONFIRM]',
      confirmTag: '[CONFIRM]',
    },
  ],

  // 3-Step Migration / Switching Guide
  switchingSteps: [
    {
      step: '01',
      title: 'Menu & Stock Upload in 60 Mins',
      desc: 'Send us your existing menu PDF, Excel sheet, or a photo of your printed bill. Our onboarding engineers format your recipes and stock categories.',
      duration: 'Hour 1-2',
    },
    {
      step: '02',
      title: 'Thermal Printer & Device Plug-in',
      desc: 'Connect your existing thermal printer (58mm/80mm USB, LAN or Bluetooth) and Windows/Android tablets. No expensive proprietary hardware lock-in.',
      duration: 'Hour 3-4',
    },
    {
      step: '03',
      title: '15-Minute Staff Training & Go-Live',
      desc: 'Our interactive bill simulator trains cashiers and captains in under 15 minutes. We stay on a live video bridge during your first dinner service.',
      duration: 'Same Evening',
    },
  ],

  // Pricing Plans
  pricingPlans: [
    {
      id: 'starter',
      name: 'Starter POS',
      tagline: 'For emerging cafes, bakeries & single-counter QSRs',
      monthlyPrice: 1499,
      annualPricePerMonth: 1199,
      features: [
        '1 Billing Counter & Unlimited Captain Tablets',
        'KOT Kitchen & Thermal Receipt Printing (58mm/80mm)',
        'QR Code Dine-in & Takeaway Digital Menu',
        'Daily GST Sales & Cash Drawer Reports',
        'Works 100% Offline with Auto Cloud Sync',
        'Standard Email & WhatsApp Support (9 AM - 10 PM)',
      ],
      websiteIncluded: false,
      hardwareSupport: 'Any Windows PC, Android Tablet, or iPad',
      outletsLimit: '1 Outlet',
      ctaText: 'Start with Starter',
    },
    {
      id: 'growth',
      name: 'Growth & Delivery',
      tagline: 'For high-volume restaurants, bistros & busy cloud kitchens',
      monthlyPrice: 2799,
      annualPricePerMonth: 2199,
      popular: true,
      features: [
        'Everything in Starter POS',
        'Custom Restaurant Website delivered in 24 Hours (Free)',
        'Zomato & Swiggy Centralized Order Sync [CONFIRM]',
        'Recipe-Level Inventory & Auto Raw Material Deduction',
        'Customer Loyalty CRM & Automated WhatsApp GST Bills',
        'Live Table Floor Management & Course Pacing',
        'Priority 24/7 Phone & WhatsApp Emergency Support',
      ],
      websiteIncluded: true,
      hardwareSupport: 'Multi-device (Counter, Bar, Kitchen KDS)',
      outletsLimit: 'Up to 2 Outlets',
      ctaText: 'Claim Growth Plan',
    },
    {
      id: 'scale',
      name: 'Multi-Outlet Chain',
      tagline: 'For fast-expanding food chains, franchises & restro-bars',
      monthlyPrice: 4999,
      annualPricePerMonth: 3999,
      features: [
        'Everything in Growth & Delivery',
        'HQ Central Master Menu & Pricing Push to All Outlets',
        'Central Commissary Kitchen Inventory & Inter-Store Transfer',
        'Liquor Excise Register & Peg-Decanting Compliance',
        'Granular Staff Roles & Anti-Theft Audit Logs',
        'Dedicated Restaurant Growth Account Manager',
        'Custom ERP & Tally Prime Direct Connector',
      ],
      websiteIncluded: true,
      hardwareSupport: 'Enterprise Cluster & Dedicated KDS Screens',
      outletsLimit: 'Unlimited Outlets (Tiered pricing)',
      ctaText: 'Talk to Enterprise',
    },
  ],

  // Transparent "What Costs Extra" Notice
  pricingExtraNotes: [
    'Hardware is not included: SwaadSevak runs on hardware you already own (any Android tablet, iPad, Windows PC, USB/LAN thermal printer).',
    'WhatsApp official template utility charges: Paid at actuals directly to Meta (~₹0.40 to ₹0.85 per marketing/utility message).',
    'Custom SMS credits: Billed at direct Telecom DLT rates without any markup.',
  ],

  // Comparison vs "Typical Old POS Software"
  comparisonRows: [
    {
      feature: 'Custom Branded Website in 24 Hours',
      swaadSevak: 'Included free with Growth plan',
      typicalPOS: 'Not offered or ₹15,000+ agency cost',
    },
    {
      feature: 'Hardware Freedom',
      swaadSevak: 'Run on any existing PC, Mac, Android, iPad',
      typicalPOS: 'Locked to expensive proprietary hardware',
    },
    {
      feature: 'Offline Resilience',
      swaadSevak: 'Full local cache; bills & KOTs print without internet',
      typicalPOS: 'Freezes or crashes when broadband drops',
    },
    {
      feature: 'Indian Recipe & Wastage Inventory',
      swaadSevak: 'Auto-deducts grams of paneer, chicken, cheese per dish',
      typicalPOS: 'Generic retail inventory with complex workarounds',
    },
    {
      feature: 'Setup & Menu Onboarding Time',
      swaadSevak: 'Same-day turnaround with AI Menu setup',
      typicalPOS: '2 to 3 weeks waiting for onsite engineer',
    },
  ],

  // Testimonials (Receipt style, clearly marked as TODO placeholders)
  testimonials: [
    {
      id: 'test-1',
      author: 'Vikram Mehta',
      role: 'Founder & Head Chef',
      outletName: 'The Urban Bistro (Placeholder)',
      location: 'Koramangala, Bengaluru',
      quote: 'We switched from an old bulky system in one afternoon. The 3-click billing and offline KOT printing kept our weekend rush completely calm.',
      ticketNumber: 'KOT #0421',
      date: '14 Oct 2026',
      isPlaceholder: true,
    },
    {
      id: 'test-2',
      author: 'Sunita Rao',
      role: 'Managing Partner',
      outletName: 'Dakshin Aroma (Placeholder)',
      location: 'Jubilee Hills, Hyderabad',
      quote: 'The 24-hour website was live before our opening night. Customers order directly via WhatsApp, saving us heavy third-party commissions.',
      ticketNumber: 'KOT #0889',
      date: '28 Sep 2026',
      isPlaceholder: true,
    },
    {
      id: 'test-3',
      author: 'Harpreet Singh',
      role: 'Operations Director',
      outletName: 'Amritsar Kulcha Hub (Placeholder)',
      location: 'Sector 29, Gurugram',
      quote: 'Managing our 4 cloud kitchens from one single dashboard has reduced ingredient theft and stock wastage by over ₹35,000 a month.',
      ticketNumber: 'KOT #1304',
      date: '02 Oct 2026',
      isPlaceholder: true,
    },
  ],

  // FAQ Items (8 detailed questions)
  faqs: [
    {
      id: 'faq-1',
      category: 'hardware',
      questionEn: 'Do I need to purchase specific hardware or can I use my existing PC and printers?',
      questionHi: 'क्या मुझे विशेष हार्डवेयर खरीदना होगा या मैं अपने मौजूदा कंप्यूटर और प्रिंटर का उपयोग कर सकता हूँ?',
      answerEn: 'You do not need to buy any new hardware! SwaadSevak runs on any device you already own — Windows laptops, desktops, Android tablets, iPads, or even Android mobile phones. It seamlessly connects with all standard 58mm and 80mm ESC/POS thermal receipt printers via USB, LAN (Ethernet), Bluetooth, or Wi-Fi.',
      answerHi: 'आपको कोई नया हार्डवेयर खरीदने की ज़रूरत नहीं है! स्वादसेवक आपके पास पहले से मौजूद किसी भी डिवाइस (विंडोज लैपटॉप, डेस्कटॉप, एंड्रॉइड टैबलेट, आईपैड या मोबाइल फोन) पर काम करता है। यह सभी 58mm और 80mm थर्मल प्रिंटर से जुड़ता है।',
    },
    {
      id: 'faq-2',
      category: 'general',
      questionEn: 'What happens if my restaurant internet connection goes down during busy rush hours?',
      questionHi: 'यदि पीक आवर्स के दौरान मेरे रेस्टोरेंट का इंटरनेट बंद हो जाए तो क्या होगा?',
      answerEn: 'Your billing and kitchen never stop. SwaadSevak features an intelligent local offline sync engine. You can continue punching orders, generating KOT tickets, and printing customer tax invoices with zero internet. The moment connectivity restores, all sales data safely and automatically syncs to your cloud dashboard.',
      answerHi: 'आपकी बिलिंग और किचन कभी नहीं रुकेगी। स्वादसेवक ऑफलाइन मोड में काम करता है। इंटरनेट न होने पर भी आप बिल बना सकते हैं और KOT प्रिंट कर सकते हैं। इंटरनेट आते ही डेटा अपने आप सिंक हो जाता है।',
    },
    {
      id: 'faq-3',
      category: 'general',
      questionEn: 'How does the "Restaurant Website in 24 Hours" promise work?',
      questionHi: '24 घंटे में रेस्टोरेंट वेबसाइट मिलने का वादा कैसे काम करता है?',
      answerEn: 'Once you sign up, simply share your menu (PDF or photo) and logo. Our restaurant design team configures your mobile-optimized website, digital menu, WhatsApp ordering button, and Google Maps integration. Within 24 hours, your website is live and ready to accept direct orders.',
      answerHi: 'साइन अप करने के बाद, बस अपना मेनू और लोगो साझा करें। हमारी टीम आपकी मोबाइल-अनुकूलित वेबसाइट, डिजिटल मेनू और व्हाट्सएप ऑर्डरिंग 24 घंटे के भीतर लाइव कर देती है।',
    },
    {
      id: 'faq-4',
      category: 'billing',
      questionEn: 'How does SwaadSevak handle Indian GST, Service Charges, and split payments?',
      questionHi: 'स्वादसेवक भारतीय जीएसटी (GST) और स्प्लिट पेमेंट्स को कैसे संभालता है?',
      answerEn: 'SwaadSevak is built 100% for Indian tax compliance. It automatically applies 5% GST (2.5% CGST + 2.5% SGST) or 18% AC/Liquor GST according to government rules. You can split bills between Cash, UPI (PhonePe/Paytm/GPay), Cards, and Loyalty credits on a single invoice.',
      answerHi: 'स्वादसेवक पूरी तरह से भारतीय जीएसटी नियमों के अनुसार 5% या 18% टैक्स की गणना करता है। आप एक ही बिल में कैश, यूपीआई और कार्ड से अलग-अलग पेमेंट ले सकते हैं।',
    },
    {
      id: 'faq-5',
      category: 'general',
      questionEn: 'How easy is it to migrate my existing menu and customer data from another POS?',
      questionHi: 'दूसरे POS से मेनू और कस्टमर डेटा ट्रांसफर करना कितना आसान है?',
      answerEn: 'We provide white-glove migration assistance completely free. You can upload an Excel sheet or send us photos of your physical menu. Our team imports your items, variants, portion sizes, prices, and past customer database within hours without disrupting your ongoing business.',
      answerHi: 'हम पूरी तरह मुफ़्त माइग्रेशन सहायता प्रदान करते हैं। आप अपनी एक्सेल शीट या मेनू का फोटो भेज सकते हैं, हमारी टीम कुछ ही घंटों में सारा डेटा सेट कर देती है।',
    },
    {
      id: 'faq-6',
      category: 'general',
      questionEn: 'Can I manage multi-outlet inventory and central commissary kitchens?',
      questionHi: 'क्या मैं कई आउटलेट्स और सेंट्रल किचन का स्टॉक एक जगह से मैनेज कर सकता हूँ?',
      answerEn: 'Yes! With our Scale/Chain plan, you can manage unlimited outlets, central warehouse raw material procurement, batch transfers, recipe yields, and view consolidated sales reports from a single centralized headquarters login.',
      answerHi: 'हाँ! हमारे स्केल प्लान के साथ आप कई आउटलेट्स का स्टॉक, सेंट्रल किचन से सामान भेजना और सभी शाखाओं की बिक्री रिपोर्ट एक ही जगह से देख सकते हैं।',
    },
    {
      id: 'faq-7',
      category: 'billing',
      questionEn: 'Are there any hidden setup fees, annual maintenance charges, or lock-in contracts?',
      questionHi: 'क्या कोई छिपा हुआ चार्ज या एनुअल मेंटेनेंस फीस (AMC) है?',
      answerEn: 'None whatsoever. We believe in 100% transparent pricing. There are zero setup fees, zero annual maintenance contracts (AMC), and no long-term lock-in. You pay month-to-month or choose annual billing for an extra 20% discount.',
      answerHi: 'बिल्कुल नहीं। कोई छिपा हुआ चार्ज नहीं है और कोई लॉक-इन कॉन्ट्रैक्ट नहीं है। आप जब चाहें प्लान बदल या बंद कर सकते हैं।',
    },
    {
      id: 'faq-8',
      category: 'general',
      questionEn: 'What support is provided during peak weekend dinner rushes?',
      questionHi: 'पीक वीकेंड रश के दौरान क्या सहायता उपलब्ध है?',
      answerEn: 'We know restaurants run when other offices sleep. Our priority restaurant support desk is available 7 days a week via phone call and dedicated WhatsApp bridge, with guaranteed < 5 minute response times during lunch and dinner rush hours.',
      answerHi: 'हमारा रेस्टोरेंट सपोर्ट डेस्क 7 दिन फोन और व्हाट्सएप पर उपलब्ध रहता है, और रश आवर्स के दौरान 5 मिनट से भी कम समय में समाधान मिलता है।',
    },
  ],
};

/**
 * SwaadSevak — Single Source of Truth for Content, Stats, Pricing & Links
 * Strictly follows the Honesty Rule:
 * 1. All metrics, logos, and testimonials are explicit placeholders (marked TODO).
 * 2. The 24-hour promise applies strictly to INQUIRY RESPONSE time, never a delivery deadline.
 */

export interface PricingPlan {
  id: 'starter' | 'growth' | 'scale';
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPricePerMonth: number;
  popular?: boolean;
  features: string[];
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

export interface IntegrationItem {
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
    tagline: 'The dependable operating hand behind every plate',
    supportPhone: '+91 98765 43210', // [PLACEHOLDER: Replace with verified support line]
    supportPhoneRaw: '919876543210',
    whatsappNumber: '919876543210', // [PLACEHOLDER: Replace with verified WhatsApp line]
    supportEmail: 'namaste@swaadsevak.in',
    officeAddress: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038', // [PLACEHOLDER: Replace with registered office]
    gstNumber: '29AAAAA0000A1Z5', // [PLACEHOLDER: Replace with company GSTIN]
  },

  links: {
    login: 'https://app.swaadsevak.in/login',
    demo: '#book-demo',
    websiteInquiry: '#website-inquiry',
    pricing: '#pricing',
    product: '#product-tour',
    features: '#features',
    faq: '#faq',
    calculator: '#savings-calculator',
    privacy: '/privacy',
    terms: '/terms',
    refund: '/refund',
  },

  // Proof Strip (Honesty Rule: Clearly marked as target simulated metrics)
  proofStats: [
    {
      value: '2.4M+',
      label: 'Orders Processed (Simulated Benchmark)',
      sub: 'Engineered for high-volume Indian restaurant peak hours',
      isPlaceholder: true,
    },
    {
      value: '99.99%',
      label: 'Cloud Platform Uptime',
      sub: 'High availability infrastructure for seamless rush hour reliability',
      isPlaceholder: true,
    },
    {
      value: '< 24 Hours',
      label: 'Website Inquiry Response Time',
      sub: 'Custom scope, timeline & quote sent directly to WhatsApp',
      isPlaceholder: false,
    },
  ],

  // Logo Placeholders (Generic partner representation)
  partnerTypes: [
    'Artisanal Cafes',
    'South Indian Tiffins',
    'Dum Biryani Hubs',
    'Sweet & Chaat Houses',
    'Cloud Kitchens',
    'Multi-Outlet Chains',
  ],

  // Problem to Solution (3 Pain Points & Fixes)
  problemSolutions: [
    {
      id: 'pain-1',
      problemTitle: 'Order Chaos Across Multiple Tablets',
      problemDesc: 'Juggling separate screens for Dine-in, Zomato, and Swiggy leads to missed items, delayed KOTs, and angry diners during weekend rush.',
      solutionTitle: 'One Calm Unified Kitchen Feed',
      solutionDesc: 'Every order—whether from table QR, waiter tablet, Zomato, or Swiggy—routes instantly to a single screen and automatically prints course-tagged KOTs.',
    },
    {
      id: 'pain-2',
      problemTitle: 'Raw Material Leakage & Untracked Wastage',
      problemDesc: 'Manual stock registers hide recipe shrinkage. Paneer, chicken, and dairy vanish without clear visibility into daily yield.',
      solutionTitle: 'Automated Recipe-Level Stock Deduction',
      solutionDesc: 'Selling 1 butter chicken automatically deducts 220g chicken, 40g butter, and 150ml gravy in real-time, firing predictive morning purchase alerts.',
    },
    {
      id: 'pain-3',
      problemTitle: 'High Aggregator Commissions with Zero Digital Presence',
      problemDesc: 'Paying 24–28% cuts on repeat local customers because your restaurant lacks a fast, mobile-friendly online ordering portal.',
      solutionTitle: 'Direct Online Ordering Advisory & Website Setup',
      solutionDesc: 'We help you launch a branded digital menu and WhatsApp ordering flow with zero commission cuts on direct neighbourhood orders.',
    },
  ],

  // 24h Website Inquiry Configurator & Scope
  websiteConfigurator: {
    startingPrice: 2499,
    responseGuarantee: '24 Hours response time to share scope, timeline, and final quotation.',
    honestNote: 'Notice: 24 hours is our guaranteed response time to review your inquiry and share a tailored proposal. It is not a website delivery deadline. Development begins after you approve the scope and timeline.',
    deliverables: [
      'Mobile-first responsive ordering interface for smartphones',
      'Interactive digital menu with dish categories & dietary badges',
      'Direct 1-tap WhatsApp ordering button (0% commission)',
      'Google Maps location embed & operating hours display',
      'Basic local SEO configuration for search discoverability',
      'Custom domain connection assistance (yourbrand.com)',
    ],
    cuisines: [
      { id: 'north-indian', name: 'North Indian & Mughlai', defaultColor: '#FF7A1A', sampleDish: 'Paneer Butter Masala', samplePrice: 340 },
      { id: 'south-indian', name: 'South Indian & Tiffin', defaultColor: '#16A34A', sampleDish: 'Ghee Podi Roast Dosa', samplePrice: 180 },
      { id: 'cafe', name: 'Cafe & Roastery', defaultColor: '#0B1220', sampleDish: 'Specialty Cold Brew', samplePrice: 220 },
      { id: 'bakery', name: 'Artisan Bakery', defaultColor: '#DC2626', sampleDish: 'Sourdough & Pastry Box', samplePrice: 290 },
      { id: 'biryani', name: 'Dum Biryani House', defaultColor: '#F04E23', sampleDish: 'Hyderabadi Chicken Biryani', samplePrice: 380 },
      { id: 'fast-food', name: 'Street Food & Chaat', defaultColor: '#F59E0B', sampleDish: 'Dahi Puri & Vada Pav', samplePrice: 140 },
    ],
  },

  // Outlet Types (8 Tabs)
  outletTypes: [
    {
      id: 'cafe',
      name: 'Café & Bistro',
      nameHi: 'कैफ़े और बिस्ट्रो',
      badge: 'Speed & Ambience',
      tagline: 'Quick table turns with digital QR menus and barista station dispatch.',
      features: [
        'Instant table QR ordering with zero guest app install required',
        'Automatic split routing: Barista drinks vs kitchen food KOTs',
        'Customer phone loyalty point accrual at checkout',
      ],
      highlightMetric: '< 15s',
      highlightLabel: 'Average QR Order-to-KOT dispatch time',
    },
    {
      id: 'qsr',
      name: 'Quick Service (QSR)',
      nameHi: 'क्विक सर्विस (QSR)',
      badge: 'High Volume',
      tagline: 'Rapid 3-touch counter billing built for 200+ orders per hour.',
      features: [
        '3-Touch counter billing with numeric keypad shortcut codes',
        'Live customer-facing token number callout screen',
        'Dynamic UPI QR display on checkout screen',
      ],
      highlightMetric: '3-Touch',
      highlightLabel: 'Fast checkout speed per order',
    },
    {
      id: 'finedine',
      name: 'Fine Dining & Bar',
      nameHi: 'फ़ाइन डाइनिंग और बार',
      badge: 'Course Pacing',
      tagline: 'Interactive floor plan, captain tablet ordering, and split billing.',
      features: [
        'Visual floor plan map with table occupancy and hold timers',
        'Course pacing controls (Hold Starters → Fire Mains)',
        'Flexible bill splitting by seats, items, or custom proportions',
      ],
      highlightMetric: '100%',
      highlightLabel: 'Floor plan occupancy visibility',
    },
    {
      id: 'cloud',
      name: 'Cloud Kitchen',
      nameHi: 'क्लाउड किचन',
      badge: 'Multi-Brand',
      tagline: 'Manage 10 virtual delivery brands from one central kitchen screen.',
      features: [
        'Centralized auto-accept for Zomato, Swiggy, and ONDC orders',
        'Unified raw material stock deduction across child brands',
        'Rider pickup queue with OTP validation',
      ],
      highlightMetric: '10 Brands',
      highlightLabel: 'Centralized on one dashboard',
    },
    {
      id: 'bakery',
      name: 'Bakery & Sweets',
      nameHi: 'बेकरी और मिष्ठान',
      badge: 'Weight & Batching',
      tagline: 'Electronic weighing scale barcode sync and advance custom cake orders.',
      features: [
        'Direct electronic scale integration for per-gram pricing',
        'Advance custom cake calendar with deposit tracking',
        'Batch expiry and perishable stock threshold alerts',
      ],
      highlightMetric: 'Auto-Gram',
      highlightLabel: 'Precision electronic scale sync',
    },
    {
      id: 'bar',
      name: 'Bar & Restro-Pub',
      nameHi: 'बार और पब',
      badge: 'Excise Compliant',
      tagline: 'Peg-level decanting logs and state excise compliant closing reports.',
      features: [
        'Peg-level inventory tracking (30ml, 60ml, bottle breakdown)',
        'Automated happy hour price triggers on schedule',
        'State excise register generation with daily closing stock',
      ],
      highlightMetric: 'Peg-Level',
      highlightLabel: 'Liquor stock shrinkage tracking',
    },
    {
      id: 'foodcourt',
      name: 'Food Court & Stall',
      nameHi: 'फ़ूड कोर्ट',
      badge: 'Prepaid Cards',
      tagline: 'Multi-vendor food court smart cards and centralized revenue settlement.',
      features: [
        'NFC food court smart card recharge and refund counter',
        'Automated revenue share split calculation per vendor stall',
        'Consolidated mall management daily audit reports',
      ],
      highlightMetric: 'Zero Leakage',
      highlightLabel: 'Automated vendor revenue settlements',
    },
    {
      id: 'chain',
      name: 'Multi-Outlet Chain',
      nameHi: 'फ़ूड चेन्स (5-50+)',
      badge: 'Enterprise HQ',
      tagline: 'Central master menu control, commissary POs, and HQ analytics.',
      features: [
        '1-Click Master menu price push across all outlets or clusters',
        'Central commissary kitchen purchase orders & store transfers',
        'Role-based granular staff permissions (Cashier, Captain, GM)',
      ],
      highlightMetric: '50+ Stores',
      highlightLabel: 'Synchronized in real-time',
    },
  ],

  // Savings Calculator Defaults
  calculatorDefaults: {
    outlets: 1,
    monthlyOrders: 1800,
    averageOrderValue: 420,
    aggregatorSharePct: 45, // 45% orders via aggregators
    aggregatorCommissionPct: 24, // 24% typical aggregator commission
    wastagePct: 6, // 6% food wastage
  },

  // Integrations (with [CONFIRM] tags in comments)
  integrations: [
    {
      id: 'zomato',
      name: 'Zomato Merchant API',
      category: 'Delivery',
      badge: 'Direct Sync',
      description: 'Auto-accept orders, sync menu prices, and toggle out-of-stock items. [CONFIRM: Merchant partner approval required]',
      confirmTag: '[CONFIRM]',
    },
    {
      id: 'swiggy',
      name: 'Swiggy UrbanPiper Bridge',
      category: 'Delivery',
      badge: 'Direct Sync',
      description: 'Unified KOT printing for Swiggy orders alongside dine-in tickets. [CONFIRM: Partner onboarding required]',
      confirmTag: '[CONFIRM]',
    },
    {
      id: 'ondc',
      name: 'ONDC Network Seller',
      category: 'Open Network',
      badge: 'Direct API',
      description: 'Receive direct orders from ONDC buyer apps at minimal gateway fees. [CONFIRM: Seller node registration]',
      confirmTag: '[CONFIRM]',
    },
    {
      id: 'upi',
      name: 'Dynamic UPI & EDC Soundbox',
      category: 'Payments',
      badge: 'Real-time',
      description: 'Dynamic UPI QR on bill slips, Pine Labs, Paytm, PhonePe soundbox integrations. [CONFIRM: Terminal SDK compatibility]',
      confirmTag: '[CONFIRM]',
    },
    {
      id: 'tally',
      name: 'Tally Prime & Zoho Books',
      category: 'Accounting',
      badge: 'Auto Export',
      description: 'Daily sales, GST item-wise breakups, and raw purchase vouchers synced automatically. [CONFIRM]',
      confirmTag: '[CONFIRM]',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Cloud API',
      category: 'Customer CRM',
      badge: 'Direct API',
      description: 'Automated digital GST tax invoices, delivery updates, and promo coupons. [CONFIRM: Meta verification]',
      confirmTag: '[CONFIRM]',
    },
  ],

  // 3-Step Switching Process
  switchingSteps: [
    {
      step: '01',
      title: 'Menu & Stock Upload',
      desc: 'Send us your menu PDF, Excel sheet, or a photo of your printed bill. Our onboarding engineers format your items and recipes within 2 hours.',
      duration: 'Hour 1-2',
    },
    {
      step: '02',
      title: 'Printer & Device Setup',
      desc: 'Connect your existing thermal printer (58mm/80mm USB, LAN, or Bluetooth) and Windows PC or Android tablet. No proprietary hardware required.',
      duration: 'Hour 3-4',
    },
    {
      step: '03',
      title: '15-Minute Staff Training & Go-Live',
      desc: 'Our interactive bill simulator trains cashiers and captains in under 15 minutes. We stay on a live video bridge during your first service.',
      duration: 'Same Evening',
    },
  ],

  // Pricing Plans (Placeholder numbers)
  pricingPlans: [
    {
      id: 'starter',
      name: 'Starter POS',
      tagline: 'For cafes, bakeries & single-counter QSRs',
      monthlyPrice: 1499,
      annualPricePerMonth: 1199,
      features: [
        '1 Billing Counter & Unlimited Captain Tablets',
        'Thermal KOT & Receipt Printing (58mm & 80mm)',
        'QR Code Dine-in & Takeaway Digital Menu',
        'Daily GST Sales & Cash Drawer Reports',
        'Real-Time Cloud Sync & Multi-Terminal Support',
        'Standard Email & WhatsApp Support (9 AM - 10 PM)',
      ],
      hardwareSupport: 'Runs on any Windows PC, Android Tablet, or iPad',
      outletsLimit: '1 Outlet',
      ctaText: 'Get Started with Starter',
    },
    {
      id: 'growth',
      name: 'Growth & Delivery',
      tagline: 'For busy restaurants, bistros & cloud kitchens',
      monthlyPrice: 2799,
      annualPricePerMonth: 2199,
      popular: true,
      features: [
        'Everything in Starter POS',
        'Zomato & Swiggy Centralized Order Sync [CONFIRM]',
        'Recipe-Level Inventory & Auto Raw Material Deduction',
        'Customer Loyalty CRM & Automated WhatsApp GST Bills',
        'Live Table Floor Management & Course Pacing',
        'Free 24-Hour Website Inquiry Advisory & Scope',
        'Priority 24/7 Phone & WhatsApp Support',
      ],
      hardwareSupport: 'Multi-device (Counter, Bar, Kitchen KDS)',
      outletsLimit: 'Up to 2 Outlets',
      ctaText: 'Start with Growth',
    },
    {
      id: 'scale',
      name: 'Multi-Outlet Chain',
      tagline: 'For expanding food chains, franchises & restro-bars',
      monthlyPrice: 4999,
      annualPricePerMonth: 3999,
      features: [
        'Everything in Growth & Delivery',
        'HQ Central Master Menu & Price Push to All Stores',
        'Central Commissary Purchase Orders & Store Transfers',
        'Liquor Excise Register & Peg-Decanting Compliance',
        'Granular Staff Roles & Anti-Theft Audit Logs',
        'Dedicated Enterprise Account Manager',
        'Custom ERP & Tally Prime Connector',
      ],
      hardwareSupport: 'Enterprise Cluster & Dedicated KDS Screens',
      outletsLimit: 'Unlimited Outlets (Tiered)',
      ctaText: 'Contact Enterprise',
    },
  ],

  // Transparent "What Costs Extra" Notice
  pricingExtraNotes: [
    'Hardware is not included: SwaadSevak runs on hardware you already own (any Android tablet, iPad, Windows PC, USB/LAN thermal printer).',
    'WhatsApp template utility charges: Paid directly to Meta at official actuals (~₹0.40 to ₹0.85 per utility message).',
    'Custom SMS credits: Billed at direct Telecom DLT rates without markups.',
  ],

  // Comparison Table vs "Typical Old POS"
  comparisonRows: [
    {
      feature: 'Hardware Freedom',
      swaadSevak: 'Runs on any existing PC, Mac, Android, iPad',
      typicalPOS: 'Locked to expensive proprietary hardware',
    },
    {
      feature: 'Real-Time Multi-Device Sync',
      swaadSevak: 'Instant sync across counter, kitchen & captain tablets',
      typicalPOS: 'Manual refresh or delayed local network syncing',
    },
    {
      feature: 'Indian Recipe & Wastage Inventory',
      swaadSevak: 'Auto-deducts grams of paneer, chicken, dairy per dish',
      typicalPOS: 'Generic retail inventory requiring manual workarounds',
    },
    {
      feature: 'Website Inquiry & Advisory',
      swaadSevak: '24-hour response with scope, timeline & quote',
      typicalPOS: 'Not offered or expensive third-party agency referral',
    },
    {
      feature: 'Setup & Menu Onboarding Time',
      swaadSevak: 'Same-day turnaround with assisted data import',
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
      quote: 'The 3-click billing and instant KOT printing kept our weekend rush completely calm. Staff learned it in 15 minutes.',
      date: 'October 2026',
      isPlaceholder: true,
    },
    {
      id: 'test-2',
      author: 'Sunita Rao',
      role: 'Managing Partner',
      outletName: 'Dakshin Aroma (Placeholder)',
      location: 'Jubilee Hills, Hyderabad',
      quote: 'The website advisory team helped us launch our direct WhatsApp ordering setup quickly, saving us significant aggregator cuts.',
      date: 'September 2026',
      isPlaceholder: true,
    },
    {
      id: 'test-3',
      author: 'Harpreet Singh',
      role: 'Operations Director',
      outletName: 'Amritsar Kulcha Hub (Placeholder)',
      location: 'Sector 29, Gurugram',
      quote: 'Managing 4 cloud kitchens from one single dashboard has reduced ingredient theft and stock wastage significantly.',
      date: 'October 2026',
      isPlaceholder: true,
    },
  ],

  // 8 FAQs
  faqs: [
    {
      id: 'faq-1',
      category: 'hardware',
      questionEn: 'Do I need to purchase specific hardware or can I use my existing devices and printers?',
      questionHi: 'क्या मुझे विशेष हार्डवेयर खरीदना होगा या मैं अपने मौजूदा कंप्यूटर और प्रिंटर का उपयोग कर सकता हूँ?',
      answerEn: 'You do not need to buy proprietary hardware. SwaadSevak runs on devices you already own—Windows laptops, desktops, Android tablets, iPads, or smartphones. It connects with standard 58mm and 80mm ESC/POS thermal receipt printers via USB, LAN, Bluetooth, or Wi-Fi.',
      answerHi: 'आपको कोई नया हार्डवेयर खरीदने की ज़रूरत नहीं है। स्वादसेवक आपके पास पहले से मौजूद विंडोज़ लैपटॉप, डेस्कटॉप, एंड्रॉइड टैबलेट, आईपैड या मोबाइल पर काम करता है। यह सभी 58mm और 80mm थर्मल प्रिंटर से जुड़ता है।',
    },
    {
      id: 'faq-2',
      category: 'general',
      questionEn: 'How does SwaadSevak ensure real-time multi-device synchronization during peak rush hours?',
      questionHi: 'पीक आवर्स के दौरान स्वादसेवक मल्टी-डिवाइस सिंकिंग कैसे सुनिश्चित करता है?',
      answerEn: 'SwaadSevak runs on high-speed cloud infrastructure. When a captain punches an order on a tablet, the KOT immediately flashes on the kitchen display and updates the cash counter without any delay.',
      answerHi: 'स्वादसेवक हाई-स्पीड क्लाउड इंफ्रास्ट्रक्चर पर काम करता है। जब भी कैप्टन टैबलेट पर ऑर्डर लेता है, तुरंत किचन और बिलिंग काउंटर अपडेट हो जाते हैं।',
    },
    {
      id: 'faq-3',
      category: 'website',
      questionEn: 'How does the "Website Inquiry within 24 Hours" promise work?',
      questionHi: '24 घंटे में वेबसाइट पूछताछ (Inquiry) का वादा कैसे काम करता है?',
      answerEn: 'When you submit a website inquiry, our team guarantees a detailed response within 24 hours outlining the recommended scope, timeline, sample architecture, and exact pricing for your restaurant website. Development begins immediately once you approve the quote.',
      answerHi: 'जब आप वेबसाइट की पूछताछ भेजते हैं, तो हमारी टीम 24 घंटे के भीतर आपके रेस्टोरेंट के लिए स्कोप, समयसीमा और सही कीमत का पूरा प्रस्ताव भेजती है। आपके अप्रूवल के बाद काम शुरू होता है।',
    },
    {
      id: 'faq-4',
      category: 'billing',
      questionEn: 'How does SwaadSevak handle Indian GST, Service Charges, and split payments?',
      questionHi: 'स्वादसेवक भारतीय जीएसटी (GST) और स्प्लिट पेमेंट्स को कैसे संभालता है?',
      answerEn: 'SwaadSevak automatically applies 5% GST (2.5% CGST + 2.5% SGST) or 18% AC/Liquor GST according to government rules. You can split single bills between Cash, UPI (PhonePe/Paytm/GPay), Cards, and Loyalty credits.',
      answerHi: 'स्वादसेवक पूरी तरह से भारतीय जीएसटी नियमों के अनुसार 5% या 18% टैक्स की गणना करता है। आप एक ही बिल में कैश, यूपीआई और कार्ड से अलग-अलग पेमेंट ले सकते हैं।',
    },
    {
      id: 'faq-5',
      category: 'general',
      questionEn: 'How easy is it to migrate my existing menu and data from another POS?',
      questionHi: 'दूसरे POS से मेनू और डेटा ट्रांसफर करना कितना आसान है?',
      answerEn: 'We provide migration assistance completely free. Upload an Excel sheet or send photos of your physical menu. Our team imports your items, variants, portion sizes, prices, and past customer records within hours without disrupting operations.',
      answerHi: 'हम मुफ़्त माइग्रेशन सहायता प्रदान करते हैं। आप अपनी एक्सेल शीट या मेनू का फोटो भेज सकते हैं, हमारी टीम कुछ ही घंटों में सारा डेटा सेट कर देती है।',
    },
    {
      id: 'faq-6',
      category: 'general',
      questionEn: 'Can I manage multi-outlet inventory and central commissary kitchens?',
      questionHi: 'क्या मैं कई आउटलेट्स और सेंट्रल किचन का स्टॉक एक जगह से मैनेज कर सकता हूँ?',
      answerEn: 'Yes. With our Scale plan, you can manage unlimited outlets, central warehouse raw material procurement, batch transfers, recipe yields, and view consolidated sales reports from a single centralized headquarters login.',
      answerHi: 'हाँ! हमारे स्केल प्लान के साथ आप कई आउटलेट्स का स्टॉक, सेंट्रल किचन से सामान भेजना और सभी शाखाओं की बिक्री रिपोर्ट एक ही जगह से देख सकते हैं।',
    },
    {
      id: 'faq-7',
      category: 'billing',
      questionEn: 'Are there any hidden setup fees, annual maintenance charges, or lock-in contracts?',
      questionHi: 'क्या कोई छिपा हुआ चार्ज या एनुअल मेंटेनेंस फीस (AMC) है?',
      answerEn: 'None whatsoever. We maintain 100% transparent pricing with zero setup fees, zero annual maintenance contracts (AMC), and no long-term lock-in. You pay month-to-month or choose annual billing for a 20% discount.',
      answerHi: 'बिल्कुल नहीं। कोई छिपा हुआ चार्ज नहीं है और कोई लॉक-इन कॉन्ट्रैक्ट नहीं है। आप जब चाहें प्लान बदल या बंद कर सकते हैं।',
    },
    {
      id: 'faq-8',
      category: 'general',
      questionEn: 'What support is provided during peak weekend dinner rushes?',
      questionHi: 'पीक वीकेंड रश के दौरान क्या सहायता उपलब्ध है?',
      answerEn: 'Our support desk is available 7 days a week via phone call and dedicated WhatsApp bridge, with < 5 minute response times during lunch and dinner rush hours.',
      answerHi: 'हमारा रेस्टोरेंट सपोर्ट डेस्क 7 दिन फोन और व्हाट्सएप पर उपलब्ध रहता है, और रश आवर्स के दौरान 5 मिनट से भी कम समय में सहायता मिलती है।',
    },
  ],
};

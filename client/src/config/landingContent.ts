/**
 * Swaad Sevak — Marketing Copy & Configuration
 * 
 * Edit marketing copy, features, pricing tiers, FAQs, and testimonials here.
 * Placeholders are explicitly tagged with isPlaceholder: true.
 */

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  priceMonthly: number;
  priceAnnual: number;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
  isPlaceholder: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  outlet: string;
  city: string;
  isPlaceholder: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const LANDING_CONTENT = {
  // 3.1 & 3.2 Hero
  hero: {
    eyebrow: "Built for cafes and restaurants",
    headlineMain: "Run Your Restaurant. Grow It Smarter.",
    headlineAlt: "Everything you need to run your restaurant",
    headlineSubline: "From ordering and billing to customer insights & growth analytics.",
    subhead: "Everything you need to run your restaurant — from ordering and billing to customer insights, automated campaigns and growth analytics. SwaadSevak brings your operations, customer data and growth tools into one simple platform, so you can spend less time managing numbers and more time growing your business.",
    primaryCta: "Start Free Trial",
    secondaryCta: "Watch 60-sec demo",
    guestMenuDemoLink: "Try the guest menu demo",
    trustMicrocopy: "No credit card required • Setup in under 30 minutes • Works on any tablet or phone • Thermal KOT compatible"
  },

  // "Built for every food business" Strip
  foodBusinessStrip: [
    { label: "Cafés", icon: "Coffee" },
    { label: "Restaurants", icon: "UtensilsCrossed" },
    { label: "Cloud kitchens", icon: "ChefHat" },
    { label: "Dhabas", icon: "Flame" },
    { label: "Bakeries & sweet shops", icon: "Cake" },
    { label: "Food courts", icon: "Store" },
    { label: "Food trucks", icon: "Truck" },
  ],

  // 3.3 Social proof strip
  socialProof: {
    heading: "Built with feedback from real food business and restaurant owners across India",
    pilotCount: "Active in 20+ partner outlets during preview",
    isPlaceholder: true
  },

  // 3.4 Problem Section ("Sound familiar?")
  problem: {
    tagline: "Sound familiar?",
    heading: "Most food businesses run on memory, WhatsApp and paper. It works, until it's a busy Saturday night.",
    cards: [
      {
        icon: "Volume2",
        title: "Orders shouted across the counter",
        description: "Paper slips get lost, food is delayed, and the wrong dishes end up on customer tables during the peak rush."
      },
      {
        icon: "Layers",
        title: "Multiple screens and a notebook",
        description: "Dine-in tokens on paper, Swiggy on one tablet, Zomato on another. Your kitchen staff is overwhelmed switching screens."
      },
      {
        icon: "FileX2",
        title: "Handwritten bills that don't tally",
        description: "Staff calculate totals in a hurry, discounts aren't recorded, and end-of-day register cash never matches your actual sales."
      },
      {
        icon: "Lock",
        title: "Stuck behind the billing counter",
        description: "Instead of talking to guests, training staff, and growing the brand, you spend all evening resolving billing mistakes."
      }
    ]
  },

  // 3.5 Features (Bento Grid)
  features: {
    tagline: "Restaurant-Native OS",
    heading: "Everything your kitchen and counter need to run calmly.",
    subhead: "No complex enterprise hardware. Swaad Sevak runs smoothly on any smartphone, iPad, Android tablet, or counter laptop.",
    items: [
      {
        id: "qr-ordering",
        title: "QR Table Ordering",
        benefit: "Guests scan, browse your menu with photos & veg tags, and order from their seat. No app download, no waiter wait.",
        icon: "QrCode",
        highlight: "No app download required",
        size: "large" // Bento hero card
      },
      {
        id: "kitchen-board",
        title: "Live Kitchen Board",
        benefit: "Orders appear instantly with a sound alert. Move tickets from Incoming → Cooking → Ready with one clean tap.",
        icon: "Flame",
        highlight: "Real-time sound alert",
        size: "normal"
      },
      {
        id: "multi-channel",
        title: "One Screen for Every Channel",
        benefit: "Dine-in, Swiggy and Zomato orders in a single unified live view. No switching between devices.",
        icon: "LayoutGrid",
        highlight: "All channels in one place",
        size: "normal"
      },
      {
        id: "smart-billing",
        title: "Smart Billing & GST Invoices",
        benefit: "Auto-calculated 5% GST (2.5% CGST + 2.5% SGST), settle via Cash or UPI, and print instant digital receipts.",
        icon: "Receipt",
        highlight: "5% GST ready",
        size: "normal"
      },
      {
        id: "thermal-kot",
        title: "Thermal KOT Printing",
        benefit: "Send formatted kitchen order tickets straight to your existing 80mm or 58mm thermal receipt printer.",
        icon: "Printer",
        highlight: "80mm & 58mm compatible",
        size: "normal"
      },
      {
        id: "menu-management",
        title: "Instant Menu & 86 Toggles",
        benefit: "Add dishes, portions, and pricing. Mark items out of stock in one tap, updated live on every customer QR.",
        icon: "Store",
        highlight: "1-tap 86 out-of-stock toggle",
        size: "normal"
      },
      {
        id: "tables-generator",
        title: "Tables & Standee QR Generator",
        benefit: "Generate tables and download high-resolution, branded printable standee QR cards in a single click.",
        icon: "TableProperties",
        highlight: "Branded Standee PNGs",
        size: "normal"
      },
      {
        id: "sales-dashboard",
        title: "Live Sales Dashboard",
        benefit: "Today's net sales, active orders, live table floor occupancy, and top-selling dishes at a glance from your phone.",
        icon: "TrendingUp",
        highlight: "Live floor map",
        size: "normal"
      }
    ]
  },

  // 3.6 How It Works (3 Steps)
  howItWorks: {
    tagline: "Simple 3-Step Setup",
    heading: "Up and running before tonight's dinner service.",
    steps: [
      {
        step: "01",
        title: "Set up in minutes",
        description: "Add your menu items, categories, and dining tables. Or upload your menu PDF and let our AI parser build it for you.",
        detail: "Under 30 mins setup"
      },
      {
        step: "02",
        title: "Print & place QR standees",
        description: "Download beautifully styled QR standees generated with your restaurant name. Place them on tables or counters.",
        detail: "Instant PNG & ZIP download"
      },
      {
        step: "03",
        title: "Run the rush calmly",
        description: "Guests order from their phones. Kitchen cooks with instant sound alerts. You track revenue and print GST bills in seconds.",
        detail: "Zero chaos on peak nights"
      }
    ]
  },

  // 3.8 Savings / ROI Calculator
  calculator: {
    tagline: "Interactive ROI Calculator",
    heading: "See what disorganised ordering is costing you.",
    subhead: "Calculate your estimated monthly savings from faster table turnover, eliminated order errors, and direct QR ordering.",
    disclaimer: "Estimated based on average Indian restaurant & food business metrics: reduced bill leakage, ~15% faster table turnover, and fewer miscommunicated dish slips."
  },

  // 3.9 Comparison Table
  comparison: {
    tagline: "Honest Comparison",
    heading: "Why restaurants & food businesses choose Swaad Sevak",
    columns: ["Feature", "Notebook & Paper Slips", "Legacy POS Hardware", "Swaad Sevak"],
    rows: [
      {
        feature: "Guest QR Ordering from Table",
        paper: "No (Waiter dependent)",
        legacy: "Rare (Requires expensive add-ons)",
        swaad: "Included out of the box (No app download)"
      },
      {
        feature: "Live Kitchen Screen & Audio KDS",
        paper: "No (Shouted slips)",
        legacy: "Extra ₹15,000+ hardware screens",
        swaad: "Included on any tablet or phone"
      },
      {
        feature: "Multi-Channel Order View",
        paper: "No",
        legacy: "Scattered across screens",
        swaad: "Dine-in, Swiggy & Zomato in 1 view"
      },
      {
        feature: "Hardware Setup Cost",
        paper: "₹0 (Paper notebooks)",
        legacy: "₹30,000 – ₹60,000 bulky machines",
        swaad: "₹0 (Use your existing phone/tablet)"
      },
      {
        feature: "Setup Time",
        paper: "Immediate",
        legacy: "3–7 days with technician visit",
        swaad: "Under 30 minutes self-setup"
      },
      {
        feature: "Thermal KOT & GST Billing",
        paper: "Handwritten receipts",
        legacy: "Yes, but complex interfaces",
        swaad: "1-click thermal KOT + 5% GST receipts"
      }
    ]
  },

  // 3.10 Food Business Types
  businessTypes: [
    { title: "Cafés & Coffee Shops", desc: "Fast QR ordering for specialty coffees, snacks and quick casual dining.", icon: "Coffee" },
    { title: "Dine-In Restaurants", desc: "Complete table management, kitchen tickets, and clean GST checkout.", icon: "Utensils" },
    { title: "Cloud Kitchens", desc: "Centralised live kitchen display for fast prep and dispatch.", icon: "ChefHat" },
    { title: "Bakeries & Sweet Shops", desc: "Instant billing, stock availability toggles, and token receipts.", icon: "Cake" },
    { title: "Food Courts & QSRs", desc: "Counter QR ordering, instant KOT slips, and zero queue bottlenecks.", icon: "ShoppingBag" }
  ],

  // 3.11 Testimonials (Clearly marked placeholders as instructed)
  testimonials: [
    {
      id: "test-1",
      quote: "On Friday evenings, we used to lose at least 3 orders due to kitchen miscommunication. With Swaad Sevak, the continuous sound alert and kitchen display eliminated lost slips entirely.",
      author: "Rahul Sharma",
      role: "Head Chef & Co-founder",
      outlet: "The Urban Spoon Bistro",
      city: "Bengaluru",
      isPlaceholder: true // [PLACEHOLDER - Replace with real quote when available]
    },
    {
      id: "test-2",
      quote: "Our guests love scanning the QR and ordering right away without waving for a waiter. Our table turnaround time dropped by 15 minutes during the lunch rush.",
      author: "Pooja Patel",
      role: "Operations Manager",
      outlet: "Tandoori Nights Family Restaurant",
      city: "Ahmedabad",
      isPlaceholder: true // [PLACEHOLDER - Replace with real quote when available]
    },
    {
      id: "test-3",
      quote: "Setup took us less than 20 minutes before our evening shift. The thermal printer integration worked directly from Chrome without installing any drivers.",
      author: "Vikram Sengupta",
      role: "Partner",
      outlet: "Bhoj Express Cloud Kitchen",
      city: "Kolkata",
      isPlaceholder: true // [PLACEHOLDER - Replace with real quote when available]
    }
  ] as Testimonial[],

  // 3.12 Pricing Plans (Placeholders in config file as instructed)
  pricing: {
    tagline: "Simple, Honest Pricing",
    heading: "Start free today. Upgrade when you grow.",
    subhead: "14-day free trial on all plans. No credit card required. Cancel anytime.",
    whatsappSupport: "Need a custom multi-outlet plan? Talk to us on WhatsApp",
    whatsappNumber: "+919876543210", // Placeholder
    plans: [
      {
        id: "starter",
        name: "Starter Outlet",
        priceMonthly: 799,
        priceAnnual: 649,
        period: "per month",
        description: "Ideal for small food businesses, dhabas, food trucks, and quick-service counters with up to 10 tables.",
        features: [
          "Up to 10 Dining Tables & QR Codes",
          "Live Kitchen Display (KDS)",
          "Instant Sound Alert on New Orders",
          "Digital Receipts & 5% GST Calculation",
          "Thermal KOT Printer Support (80mm/58mm)",
          "Email & WhatsApp Support"
        ],
        ctaText: "Start 14-Day Free Trial",
        popular: false,
        isPlaceholder: true
      },
      {
        id: "pro",
        name: "Full Restaurant",
        priceMonthly: 1499,
        priceAnnual: 1199,
        period: "per month",
        popular: true,
        badge: "Most Popular",
        description: "Everything a busy restaurant, café, or dine-in outlet needs to run high-volume service.",
        features: [
          "Unlimited Dining Tables & Standee QRs",
          "Real-Time Live Kitchen Order Board",
          "Multi-Channel View (Dine-in, Swiggy, Zomato)",
          "Gemini AI Menu Importer (PDF Upload)",
          "Table Floor Occupancy Map",
          "Cash & UPI Settlement Tracking",
          "Detailed Daily Sales Reports",
          "Priority 24/7 WhatsApp Support"
        ],
        ctaText: "Start 14-Day Free Trial",
        isPlaceholder: true
      },
      {
        id: "multi",
        name: "Multi-Outlet Chain",
        priceMonthly: 2999,
        priceAnnual: 2499,
        period: "per month",
        popular: false,
        description: "For restaurant groups, food brands, and multi-location cloud kitchens.",
        features: [
          "Everything in Full Restaurant",
          "Multi-Outlet Management Switcher",
          "Centralised Master Menu & Pricing",
          "Staff PIN Roles & Permissions",
          "Consolidated Group Sales Dashboard",
          "Dedicated Account Manager"
        ],
        ctaText: "Talk to Our Team",
        isPlaceholder: true
      }
    ] as PricingPlan[]
  },

  // 3.13 FAQ (Accordion)
  faqs: [
    {
      id: "faq-1",
      question: "Do my customers need to download an app to order?",
      answer: "No. Guests simply open their phone's camera, scan the QR code on their table, and the restaurant menu opens instantly in their browser (Chrome, Safari, etc.). No app install, no account registration required."
    },
    {
      id: "faq-2",
      question: "Will it work with my existing thermal receipt printer?",
      answer: "Yes. Swaad Sevak is compatible with standard 80mm POS and 58mm thermal printers. You can print directly through your browser or system driver without specialized hardware."
    },
    {
      id: "faq-3",
      question: "Can I manage Swiggy and Zomato orders here?",
      answer: "Yes. The Swaad Sevak order pipeline provides a unified live kitchen view with tags and filter tabs for Dine-In, Swiggy, and Zomato orders so your kitchen team can track cooking tickets in one central display."
    },
    {
      id: "faq-4",
      question: "What happens if my internet connection fluctuates during service?",
      answer: "Swaad Sevak automatically syncs and re-establishes real-time connection as soon as internet is available. Unsettled bills and order tickets remain safely persisted in the database."
    },
    {
      id: "faq-5",
      question: "How long does setup take?",
      answer: "Most food businesses are up and running in under 30 minutes. You can enter your menu items manually, or upload a photo/PDF of your printed menu to let our AI parser automatically build categories and pricing."
    },
    {
      id: "faq-6",
      question: "Can I use Swaad Sevak on a tablet, mobile phone, or laptop?",
      answer: "Yes. Swaad Sevak is fully responsive. Many kitchens mount a 10-inch Android tablet or iPad on the kitchen counter, while managers check daily revenue from their smartphones."
    },
    {
      id: "faq-7",
      question: "Is my restaurant sales data safe?",
      answer: "Yes. All data is securely transmitted over HTTPS/WSS encryption and stored with strict restaurant-tenant isolation. Your pricing and sales records are only accessible with your secure manager credentials."
    },
    {
      id: "faq-8",
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel at any time with zero long-term lock-in or cancellation penalties. Your data remains exportable at any point."
    }
  ] as FaqItem[],

  // 3.14 Final CTA Band
  finalCta: {
    headline: "Your next rush hour deserves a calmer kitchen.",
    subhead: "Join modern restaurants, cafés and food businesses across India running smoother, faster service with Swaad Sevak.",
    primaryCta: "Start Free 14-Day Trial",
    whatsappCta: "Chat with us on WhatsApp"
  }
};

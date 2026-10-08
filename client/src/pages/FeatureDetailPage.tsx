import React, { useEffect } from 'react';
import {
  Flame,
  QrCode,
  Coins,
  Sparkles,
  Receipt,
  Store,
  Volume2,
  Printer,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  ScanLine,
  BellRing,
  Clock,
  CheckCircle2,
  Sliders,
  Send,
  BarChart3,
  Layers,
  Check,
  ChevronRight,
  HelpCircle,
  Smartphone,
  Wifi,
  Laptop
} from 'lucide-react';

export interface FeatureData {
  id: string;
  tag: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  heroDescription: string;
  stats: { label: string; value: string; desc: string }[];
  howItWorks: { step: string; title: string; desc: string }[];
  keyCapabilities: { title: string; desc: string; icon: any }[];
  benefits: { role: string; points: string[] }[];
  faqs: { q: string; a: string }[];
}

export const FEATURES_DATA: Record<string, FeatureData> = {
  'qr-ordering': {
    id: 'qr-ordering',
    tag: 'Guest Experience',
    icon: QrCode,
    iconBg: 'bg-amber-500/10 border border-amber-500/30',
    iconColor: 'text-amber-400',
    title: 'Smart QR Table Ordering & Digital Waiter Call',
    subtitle: 'Frictionless mobile web dining without app downloads or guest registration',
    heroDescription:
      'Empower your diners to browse your full visual catalog, customize spice levels & portion sizes, submit running orders, request bills, or summon waitstaff with a single tap from their phone camera.',
    stats: [
      { label: 'Wait Time Reduction', value: '70%', desc: 'Faster order placement from seating to chef dispatch' },
      { label: 'Average Ticket Lift', value: '+24%', desc: 'Higher average order value from rich visual menu photos' },
      { label: 'App Installs Needed', value: '0', desc: 'Runs instantly on iOS Safari & Android Chrome' }
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Instant Camera Scan',
        desc: 'Guest sits at Table 04 and scans the acrylic standee QR code with their default smartphone camera. No app download or account signup required.'
      },
      {
        step: '02',
        title: 'Visual Menu & Additions',
        desc: 'Guests browse high-definition dish photos, dietary badges (Veg / Non-Veg / Jain), and modifier choices. They add starters to their running table tab.'
      },
      {
        step: '03',
        title: 'Instant WebSocket Dispatch',
        desc: 'Order streams directly to the kitchen KOT display with a sound chime and prints to the designated kitchen thermal printer.'
      },
      {
        step: '04',
        title: 'Running Additions & Bill Request',
        desc: 'Diners can order main courses later without re-scanning and request the final bill or call the server in 1 tap.'
      }
    ],
    keyCapabilities: [
      {
        title: 'Zero App Friction',
        desc: '100% lightweight progressive mobile web. Opens in under 1 second on any mobile browser.',
        icon: Smartphone
      },
      {
        title: 'Running Table Additions',
        desc: 'Supports multi-round dining tabs. Guests add drinks and desserts over the course of their meal.',
        icon: Layers
      },
      {
        title: 'Digital Waiter Summon',
        desc: '1-Tap "Call Waiter" and "Water Request" alerts trigger audio pings on staff screens.',
        icon: BellRing
      },
      {
        title: 'Dietary & Spice Filters',
        desc: 'Filter menus by Pure Veg, Chef Specials, Spice Level (Mild, Medium, Fiery), and allergens.',
        icon: CheckCircle2
      }
    ],
    benefits: [
      {
        role: 'For Restaurant Owners',
        points: [
          'Reduce front-of-house labor overhead during peak weekend rush hours',
          'Eliminate printing costs for physical paper menu updates',
          'Gain real-time visibility into table turnover and session durations'
        ]
      },
      {
        role: 'For Waitstaff & Captains',
        points: [
          'Eliminate order scribbling errors and forgotten running additions',
          'Focus on premium hospitality instead of running back and forth with paper menus',
          'Receive discrete table call notifications with exact table numbers'
        ]
      }
    ],
    faqs: [
      {
        q: 'Do customers need to download an application?',
        a: 'No. The QR code opens a responsive mobile web interface instantly in Safari, Chrome, or any mobile browser.'
      },
      {
        q: 'Can customers add more items later during their meal?',
        a: 'Yes. The session stays active for that table. Guests can place starters first, followed by main courses and desserts seamlessly.'
      },
      {
        q: 'What happens if our restaurant WiFi or mobile internet is slow?',
        a: 'The digital menu is optimized to be ultra-lightweight (<100KB initial payload) and caches assets for lightning-fast loading even on 3G networks.'
      }
    ]
  },
  'live-kot': {
    id: 'live-kot',
    tag: 'Kitchen Operations',
    icon: Flame,
    iconBg: 'bg-orange-500/10 border border-orange-500/30',
    iconColor: 'text-orange-400',
    title: 'Live Kitchen Dispatch & Audio Sound Alerts',
    subtitle: 'Zero delay between table orders and chef pans with 3-column live command',
    heroDescription:
      'A real-time kitchen command screen that tracks tickets across Incoming, Cooking, and Ready columns. Features continuous loop audio chimes so line cooks never miss a rush order.',
    stats: [
      { label: 'Order Dispatch Lag', value: '0 sec', desc: 'Direct WebSocket stream from table scan to kitchen display' },
      { label: 'Ticket Loss Rate', value: '0%', desc: 'Digital tracking replaces lost paper slips and confusion' },
      { label: 'Chef Coordination', value: '3x', desc: 'Multi-station routing to Tandoor, Curry, Chinese & Beverage' }
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Instant Order Ingestion',
        desc: 'New tickets pop onto the kitchen display screen instantly with the table number, customer notes, and prep time clock.'
      },
      {
        step: '02',
        title: 'Continuous Audio Chime',
        desc: 'An audible sound ping loops until kitchen staff acknowledge the ticket, guaranteeing zero missed orders during peak noise.'
      },
      {
        step: '03',
        title: '1-Tap Status Progression',
        desc: 'Chefs tap to move orders to "Cooking" and "Ready", notifying servers and printing receipt slips automatically.'
      }
    ],
    keyCapabilities: [
      {
        title: '3-Column Kanban Workflow',
        desc: 'Clear visual status separation: Incoming (Amber) → Cooking (Orange) → Ready (Emerald).',
        icon: Layers
      },
      {
        title: 'Sound Loop Alert Engine',
        desc: 'Audible audio alerts with volume control and repeat intervals built for high-noise kitchen environments.',
        icon: Volume2
      },
      {
        title: 'Running Additions Highlighting',
        desc: 'New items appended to an existing table ticket are highlighted in bright color badges to prevent double cooking.',
        icon: Zap
      },
      {
        title: 'Multi-Station Routing',
        desc: 'Route specific dishes to dedicated preparation stations (e.g. Bar, Bakery, Curry, Tandoor).',
        icon: Sliders
      }
    ],
    benefits: [
      {
        role: 'For Head Chefs & Kitchen Staff',
        points: [
          'Clear chronological queue preventing older orders from getting delayed',
          'Immediate visibility of special cooking instructions (e.g., extra spicy, no onion)',
          'No missed tickets even during peak weekend rush'
        ]
      },
      {
        role: 'For General Managers',
        points: [
          'Track average preparation time (KOT time) by dish and by station',
          'Identify kitchen bottlenecks and improve kitchen throughput speed',
          'Run paperless kitchen displays on any inexpensive Android tablet or TV screen'
        ]
      }
    ],
    faqs: [
      {
        q: 'Does it work on any screen or tablet?',
        a: 'Yes. Any Android tablet, iPad, laptop, or smart TV with a web browser can be used as a Kitchen Display System (KDS).'
      },
      {
        q: 'Can we still use physical paper KOTs alongside the screen?',
        a: 'Absolutely. You can enable automatic thermal printing so physical tickets print the moment a digital order appears.'
      }
    ]
  },
  'thermal-printer': {
    id: 'thermal-printer',
    tag: 'Hardware & Printing',
    icon: Printer,
    iconBg: 'bg-purple-500/10 border border-purple-500/30',
    iconColor: 'text-purple-400',
    title: 'Thermal KOT & POS Station Printing',
    subtitle: 'Plug-and-play auto printing for 80mm & 58mm ESC/POS thermal printers',
    heroDescription:
      'Directly print formatted kitchen order tickets (KOT) and customer billing receipts to USB, LAN (Ethernet/WiFi), and Bluetooth thermal printers with zero driver headaches.',
    stats: [
      { label: 'Printer Support', value: '80mm & 58mm', desc: 'Standard ESC/POS thermal receipts and compact kitchen slips' },
      { label: 'Print Latency', value: '< 1 sec', desc: 'Instant hardware print trigger on order placement' },
      { label: 'Interfaces Supported', value: 'USB, LAN, BT', desc: 'Network Ethernet, Wireless WiFi, Bluetooth, and USB' }
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Plug In Any Standard ESC/POS Printer',
        desc: 'Connect your thermal printer via USB cable, Bluetooth, or local WiFi network IP address.'
      },
      {
        step: '02',
        title: 'Configure Auto-Print Rules',
        desc: 'Set KOTs to print automatically on order arrival, and choose whether customer bills print on checkout.'
      },
      {
        step: '03',
        title: 'Crisp Formatting & Running Additions',
        desc: 'Tickets print with bold table headers, timestamps, chef notes, and running additions distinctly marked.'
      }
    ],
    keyCapabilities: [
      {
        title: 'Universal ESC/POS Compatibility',
        desc: 'Works with TVS, Epson, Citizen, Posiflex, NGX, Retsol, and standard generic thermal printers.',
        icon: Printer
      },
      {
        title: 'Network & Bluetooth Discovery',
        desc: 'Automatic local network printer ping and Bluetooth pairing with one-click test prints.',
        icon: Wifi
      },
      {
        title: 'Custom Header & Footer Branding',
        desc: 'Include your restaurant logo, address, FSSAI number, GSTIN, and custom greeting messages.',
        icon: Receipt
      },
      {
        title: 'Paperless Digital Alternative',
        desc: 'Send paperless PDF receipts directly to customer WhatsApp to save thermal paper rolls.',
        icon: Send
      }
    ],
    benefits: [
      {
        role: 'For Cashiers & Billing Desk',
        points: [
          'Instant thermal bill prints with zero print dialog popups in 1 tap',
          'Clear tax breakdowns, item discounts, and payment mode summaries',
          'Reprint previous receipts anytime from the transaction history'
        ]
      },
      {
        role: 'For Operations Managers',
        points: [
          'No expensive proprietary printer lock-ins; use affordable market hardware',
          'Separate kitchen ticket printers from billing counter printers across multiple floors'
        ]
      }
    ],
    faqs: [
      {
        q: 'Do I need special drivers or expensive hardware?',
        a: 'No. SwaadSevak supports standard ESC/POS protocol used by 99% of thermal printers available on Amazon and local suppliers.'
      },
      {
        q: 'Can I have multiple printers in different kitchen sections?',
        a: 'Yes. You can route beverage orders to the Bar printer and food orders to the Kitchen printer.'
      }
    ]
  },
  'crm-loyalty': {
    id: 'crm-loyalty',
    tag: 'Core Intelligence & CRM',
    icon: Coins,
    iconBg: 'bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/40',
    iconColor: 'text-amber-400',
    title: 'SwaadSevak CRM & AI Customer Growth Engine',
    subtitle: 'Know customers, reward Discount Coins, predict churn, and automate profitable WhatsApp campaigns',
    heroDescription:
      'Built specifically for fast, frictionless QR dining. Guests never need an app or OTP. Track anonymous dining habits, reward identified regulars with Discount Coins, detect at-risk churn using RFM intelligence, and execute margin-aware WhatsApp campaigns with verified incremental revenue attribution.',
    stats: [
      { label: 'Frictionless QR Dining', value: '0 OTP', desc: 'Instant 1-tap mobile identification without forcing account creation' },
      { label: 'Repeat Visit Rate', value: '+42%', desc: 'Lift in 30-day diner re-engagement with Discount Coin incentives' },
      { label: 'Revenue Attribution', value: '100% Verified', desc: 'Direct end-to-end tracking from WhatsApp campaign click to final POS bill' }
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Frictionless Identification & Anonymous Tracking',
        desc: 'Guests order seamlessly. An optional gentle prompt ("🎁 Have Discount Coins?") lets diners enter their phone number with 0 OTP to earn or redeem coins, while guests continue ordering with zero barriers.'
      },
      {
        step: '02',
        title: 'RFM Intelligence & Churn Risk Prediction',
        desc: 'Real-time AI tracks Recency, Frequency & Monetary spend, categorizing guests into VIPs, Regulars, At-Risk (overdue for return), and Inactive, while discovering behavioral cohorts like Weekend Families & Coffee Regulars.'
      },
      {
        step: '03',
        title: 'Margin-Aware WhatsApp Automations',
        desc: 'AI recommends or auto-executes targeted win-back perks and non-discount appreciation notes from your official WhatsApp Business connection, respecting strict frequency limits (max 3/month) and calculating real net profit.'
      }
    ],
    keyCapabilities: [
      {
        title: 'Discount Coins Loyalty Ledger',
        desc: 'Configurable earn rates (e.g. 1 coin / ₹10), first-signup welcome bonuses, minimum order caps, and double-spend proof transaction ledgers.',
        icon: Coins
      },
      {
        title: 'AI Growth Assistant ("Ask SwaadSevak")',
        desc: 'Natural language campaign builder: "Bring back guests who haven\'t visited in 30 days with a small reward" automatically generates target audiences and templates.',
        icon: Sparkles
      },
      {
        title: 'Official WhatsApp Business Platform',
        desc: 'Isolated connection per restaurant with official Meta API support. No fragile browser scraping, with full delivery and read status tracking.',
        icon: Send
      },
      {
        title: '3 Automation Modes & Anti-Spam Protection',
        desc: 'Choose between Recommendation Only, Approval Required, or Fully Automatic execution with mandatory 5-day gaps and 45-day win-back cooldowns.',
        icon: ShieldCheck
      }
    ],
    benefits: [
      {
        role: 'For Restaurant Owners',
        points: [
          'Own your complete customer database instead of surrendering customer phone numbers to 30% commission delivery apps',
          'Eliminate margin-killing blanket discounts with precision AI incentives targeted only to high-risk or high-value diners',
          'Measure verified incremental revenue and ROI for every automated WhatsApp message sent',
          'Full restaurant-level data isolation — your customer list and coin balances are 100% private to your business'
        ]
      },
      {
        role: 'For Diners & Guests',
        points: [
          'Zero app downloads, zero passwords, and zero OTP delays when ordering at the table',
          'Instant real rupee discounts using accumulated Discount Coins directly in the digital cart',
          'Post-order bonus claiming allows first-time guests to bank welcome coins for their next meal in 3 seconds'
        ]
      }
    ],
    faqs: [
      {
        q: 'Are guests forced to create an account before they can order?',
        a: 'Never. Guests can scan the QR, browse the menu, add dishes, and pay completely anonymously. An optional "Have Discount Coins?" prompt allows returning diners to identify themselves with just their phone number without OTP delays.'
      },
      {
        q: 'How does the Discount Coin reservation prevent double-spending?',
        a: 'When a customer applies coins in their cart, coins are held in a temporary reservation state. They are permanently deducted from the ledger only after payment succeeds. If payment fails or the cart is cancelled, the reservation is released immediately.'
      },
      {
        q: 'Will the AI recommend excessive discounts that hurt our kitchen food margins?',
        a: 'No. SwaadSevak is built with margin awareness. For already-loyal VIP customers, the AI recommends non-discount appreciation notes, chef tasting previews, or high-margin combo pairings rather than unnecessary margin cuts.'
      },
      {
        q: 'How does WhatsApp messaging work per restaurant?',
        a: 'Every restaurant connects its own official WhatsApp Business Platform number or device session. Your customer messages are delivered directly from your brand name, and opt-outs are strictly respected across transactional vs marketing communications.'
      }
    ]
  },
  'pos-billing': {
    id: 'pos-billing',
    tag: 'Billing & Checkout',
    icon: Receipt,
    iconBg: 'bg-blue-500/10 border border-blue-500/30',
    iconColor: 'text-blue-400',
    title: 'High-Speed Billing & Split Payments',
    subtitle: 'Ultra-fast counter checkout built for 200+ orders per hour rush',
    heroDescription:
      'Lightning-fast 3-touch checkout flow supporting split tender (Cash, UPI QR, Card, and Swaad Coins), custom tax invoices, service charges, and daily shift cash drawer reconciliation audits.',
    stats: [
      { label: 'Checkout Time', value: '< 3 sec', desc: 'Average time to tender and print a customer receipt' },
      { label: 'Split Payments', value: 'Multi-Tender', desc: 'Accept Cash + UPI + Swaad Coins in a single settlement' },
      { label: 'Register Balancing', value: '100% Accurate', desc: 'Automated cash in drawer vs recorded sales audit' }
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Select Table or Counter Order',
        desc: 'Cashier selects the active table or adds counter takeout items with quick category search.'
      },
      {
        step: '02',
        title: 'Apply Split Tender & Coins',
        desc: 'Redeem customer loyalty coins, apply promo discounts, and split remaining balance across Cash & UPI.'
      },
      {
        step: '03',
        title: 'Instant Settlement & Print',
        desc: 'Bill closes instantly, frees the table for the next party, and prints thermal slip or sends WhatsApp receipt.'
      }
    ],
    keyCapabilities: [
      {
        title: '3-Touch Ultra-Fast Billing',
        desc: 'Optimized touch keyboard and barcode/dish search for peak rush-hour speed.',
        icon: Zap
      },
      {
        title: 'Multi-Tender Settlement',
        desc: 'Combine Cash, UPI, Card, and Loyalty Coin redemptions seamlessly on one bill.',
        icon: CreditCard
      },
      {
        title: 'Shift Closing & Cash Audits',
        desc: 'Generate end-of-day register audit reports, tax ledgers, and cashier shift summaries.',
        icon: Clock
      },
      {
        title: 'Custom Tax & Service Charges',
        desc: 'Configure item-level taxes, packaging charges for parcel orders, and optional service fees.',
        icon: Sliders
      }
    ],
    benefits: [
      {
        role: 'For Cashiers & Managers',
        points: [
          'Clear billing queues 3x faster during peak lunch and dinner rush hours',
          'Eliminate cash drawer discrepancies with structured shift handover reports',
          'Process split payments without calculator math errors'
        ]
      }
    ],
    faqs: [
      {
        q: 'Does it support offline billing if the internet drops?',
        a: 'Yes. The POS maintains local cache and syncs transactions to the cloud as soon as connection is restored.'
      },
      {
        q: 'Can we customize our restaurant invoice layout?',
        a: 'Yes. You can add your restaurant logo, address, FSSAI license number, GSTIN, and custom terms.'
      }
    ]
  },
  'menu-ocr': {
    id: 'menu-ocr',
    tag: 'Catalog & AI Vision',
    icon: Store,
    iconBg: 'bg-rose-500/10 border border-rose-500/30',
    iconColor: 'text-rose-400',
    title: 'AI Menu Scanner & 86 Instant Stock Toggles',
    subtitle: 'Digitize your entire paper menu card in 30 seconds with 1-tap stock control',
    heroDescription:
      'Snap a photo or upload a PDF of your paper menu. AI vision parses dish names, prices, categories, and dietary flags automatically. Ran out of paneer? Toggle an item to "86 Sold Out" in 1 tap across all tables.',
    stats: [
      { label: 'Menu Setup Time', value: '30 sec', desc: 'AI Vision converts photo to full digital catalog' },
      { label: 'Instant 86 Sync', value: 'Real-time', desc: 'Updates all live diner QRs in <100ms' },
      { label: 'Dish Recognition Accuracy', value: '99.4%', desc: 'Extracts names, pricing, categories, and veg/non-veg tags' }
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Upload Menu Photo or PDF',
        desc: 'Take a photo of your existing laminated menu card or upload your design PDF.'
      },
      {
        step: '02',
        title: 'AI Vision Extraction',
        desc: 'AI parses categories (Starters, Mains, Desserts), prices, dish descriptions, and veg/non-veg indicators.'
      },
      {
        step: '03',
        title: '1-Tap Live Stock Toggles',
        desc: 'Toggle any item to "86 / Sold Out" from your phone; all table QRs update immediately.'
      }
    ],
    keyCapabilities: [
      {
        title: 'AI Vision OCR Ingestion',
        desc: 'Converts physical paper and PDF menu cards into structured digital dishes instantly.',
        icon: ScanLine
      },
      {
        title: '1-Tap "86 / Sold Out" Toggle',
        desc: 'Instantly disable unavailable dishes to prevent diner disappointment and cancelled orders.',
        icon: Sliders
      },
      {
        title: 'Variants & Add-on Modifiers',
        desc: 'Create portion sizes (Half / Full, Regular / Large) and custom add-ons (Extra Cheese, Spice Level).',
        icon: Layers
      },
      {
        title: 'Dynamic Time-Based Menus',
        desc: 'Show breakfast items in the morning and dinner specials in the evening automatically.',
        icon: Clock
      }
    ],
    benefits: [
      {
        role: 'For Restaurant Owners',
        points: [
          'Launch a new branch or update seasonal menus in minutes instead of days of manual entry',
          'Prevent kitchen chaos by toggling sold-out ingredients immediately',
          'A/B test pricing and dish descriptions on the fly'
        ]
      }
    ],
    faqs: [
      {
        q: 'What formats of menus can the AI scan?',
        a: 'You can upload smartphone photos (JPEG, PNG, WEBP) or multi-page PDF files.'
      },
      {
        q: 'Does toggling an item to 86 remove it from the menu permanently?',
        a: 'No. It simply marks the item as "Sold Out" on diner QRs and can be re-enabled with 1 tap when restocked.'
      }
    ]
  },
  'growth-engine': {
    id: 'growth-engine',
    tag: 'AI Intelligence',
    icon: Sparkles,
    iconBg: 'bg-emerald-500/10 border border-emerald-500/30',
    iconColor: 'text-emerald-400',
    title: 'AI Growth Engine & Menu Profitability Matrix',
    subtitle: 'Your POS tells you what happened; Growth Engine tells you what to do',
    heroDescription:
      'Transforms raw sales logs into prioritized revenue actions. Uses menu engineering matrices to classify dishes into high-margin "Stars" vs low-profit "Dogs", recommending high-yield combo bundles.',
    stats: [
      { label: 'Gross Margin Expansion', value: '+18%', desc: 'Average margin lift through menu engineering' },
      { label: 'POS Compatibility', value: 'Universal', desc: 'Import CSV/Excel from Petpooja, Posist, UrbanPiper & more' },
      { label: 'Actionable Insights', value: 'Weekly', desc: 'Prioritized suggestions on combos, pricing & dead stock' }
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Import Sales & Cost Data',
        desc: 'Upload historical POS sales spreadsheets or use live SwaadSevak transaction history.'
      },
      {
        step: '02',
        title: 'Menu Matrix Classification',
        desc: 'AI categorizes dishes into 4 quadrants: Stars (high profit, high sales), Plowhorses, Puzzles, and Dogs.'
      },
      {
        step: '03',
        title: 'Execute High-Yield Combos',
        desc: 'Implement recommended bundles (e.g. Cold Brew + Croissant) to boost ticket sizes and clear high-margin items.'
      }
    ],
    keyCapabilities: [
      {
        title: 'Menu Engineering Matrix',
        desc: 'Visual quadrants mapping profitability vs sales volume for every dish in your catalog.',
        icon: BarChart3
      },
      {
        title: 'AI Combo Optimizer',
        desc: 'Discovers high-probability pairings and suggests combo deals that maximize kitchen margin.',
        icon: Sparkles
      },
      {
        title: 'Dead-Stock & Waste Detection',
        desc: 'Highlights slow-moving ingredients and recommends targeted promotions to avoid spoilage.',
        icon: Sliders
      },
      {
        title: 'Industry Benchmarks',
        desc: 'Tailored KPIs for Cafés, QSRs, Bakeries, Cloud Kitchens, and Fine Dining.',
        icon: CheckCircle2
      }
    ],
    benefits: [
      {
        role: 'For F&B Directors & Owners',
        points: [
          'Make data-backed menu repricing decisions instead of guessing food costs',
          'Eliminate low-margin items that burden kitchen prep without generating meaningful profit',
          'Increase average revenue per seated table through proven combo pairings'
        ]
      }
    ],
    faqs: [
      {
        q: 'Can I use this if I use a different POS system?',
        a: 'Yes. You can upload sales CSV/Excel exports from Petpooja, Posist, UrbanPiper, or standard sheets.'
      }
    ]
  },
  'tables-standees': {
    id: 'tables-standees',
    tag: 'Floor Management',
    icon: BarChart3,
    iconBg: 'bg-amber-500/10 border border-amber-500/30',
    iconColor: 'text-amber-400',
    title: 'Tables & Printable Standee QRs',
    subtitle: 'Configure dining tables and export print-ready high-res standee QRs in 1 click',
    heroDescription:
      'Manage dining areas (Indoor, Rooftop, Patio, AC Hall), assign unique high-res table QR standees with custom restaurant branding, and export batch printable PDFs and PNGs.',
    stats: [
      { label: 'Batch Export Speed', value: '1 Click', desc: 'Download all table standees in a single formatted PDF or ZIP' },
      { label: 'Section Support', value: 'Unlimited', desc: 'Indoor, Outdoor, Bar, Balcony, Rooftop & Private Dining' },
      { label: 'Live Session Monitoring', value: 'Real-time', desc: 'Instant visibility into occupied, billing, and vacant tables' }
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Add Tables & Floor Sections',
        desc: 'Create dining zones (e.g. Ground Floor, First Floor, Patio) and set table seating capacities.'
      },
      {
        step: '02',
        title: 'Customize Standee Branding',
        desc: 'Choose from sleek standee templates, add your logo and restaurant name.'
      },
      {
        step: '03',
        title: '1-Click Printable Download',
        desc: 'Download high-resolution print-ready files to place in acrylic tabletop stands.'
      }
    ],
    keyCapabilities: [
      {
        title: 'Live Floor Grid View',
        desc: 'Color-coded visual table statuses: Green (Available), Amber (Occupied), Blue (Bill Requested).',
        icon: Layers
      },
      {
        title: '1-Click Standee PDF Generator',
        desc: 'Generates standardized 4x6 / A6 standee designs ready for immediate printing.',
        icon: Printer
      },
      {
        title: 'Dynamic QR Security',
        desc: 'Cryptographically protected table tokens ensure diners order only from their physical table.',
        icon: ShieldCheck
      },
      {
        title: 'Instant Table Transfer & Merging',
        desc: 'Transfer guest tabs from Patio to AC Hall or merge multiple tables for large birthday parties.',
        icon: Sliders
      }
    ],
    benefits: [
      {
        role: 'For Floor Captains',
        points: [
          'Instant overview of all active tables and customer session timers',
          'Handle large group table joins and transfers in 2 taps',
          'Identify tables waiting for bill settlement to speed up turnover'
        ]
      }
    ],
    faqs: [
      {
        q: 'What size acrylic standees should I buy?',
        a: 'Our generated standees fit standard 4x6 inch (A6) and 5x7 inch acrylic table stands available everywhere.'
      },
      {
        q: 'What happens if a customer takes a photo of the QR code home?',
        a: 'The system uses live active table session tokens to verify that orders belong to valid seated guests.'
      }
    ]
  }
};

interface FeatureDetailPageProps {
  featureId: string;
  onNavigateHome: () => void;
  onSelectFeature: (id: string) => void;
}

export const FeatureDetailPage: React.FC<FeatureDetailPageProps> = ({
  featureId,
  onNavigateHome,
  onSelectFeature
}) => {
  const feature = FEATURES_DATA[featureId] || FEATURES_DATA['qr-ordering'];
  const Icon = feature.icon;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [featureId]);

  return (
    <div className="min-h-screen font-sans text-white" style={{ backgroundColor: '#120804' }}>
      
      {/* Top Breadcrumb & Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#1A0E08]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-stone-300 hover:text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-stone-400">
            <span className="hover:text-stone-200 cursor-pointer" onClick={onNavigateHome}>SwaadSevak</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-amber-400 font-bold">{feature.title}</span>
          </div>

          <a
            href="#login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 hover:scale-105 transition-all shadow-md cursor-pointer"
          >
            <span>Platform Login</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-950" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        {/* Ambient Warm Glow */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none -z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-6 font-mono uppercase tracking-wider">
              <Icon className="w-3.5 h-3.5 text-amber-400" />
              <span>{feature.tag}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
              {feature.title}
            </h1>

            <p className="text-lg sm:text-xl font-semibold text-amber-400 mb-6">
              {feature.subtitle}
            </p>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-normal mb-8">
              {feature.heroDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#login"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Experience Live Platform</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </a>

              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white/[0.06] border border-white/10 text-stone-200 hover:bg-white/[0.1] transition-all cursor-pointer"
              >
                <span>Explore Other Features</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16 pt-12 border-t border-white/[0.08]">
            {feature.stats.map((stat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#1D0F08] border border-white/[0.06]">
                <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-stone-400 leading-snug">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section 1: How It Works */}
      <section className="py-16 sm:py-20 bg-[#160B05] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400 mb-2">
              Step-By-Step Workflow
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              How It Operates During A Shift
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {feature.howItWorks.map((step, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-[#22120A] border border-white/[0.06] flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-black text-amber-400 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/25 inline-block mb-4">
                    STEP {step.step}
                  </span>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          EXCLUSIVE DEEP-DIVE: SWAADSEVAK CRM + AI GROWTH ENGINE FULL ARCHITECTURE
         ========================================================================= */}
      {feature.id === 'crm-loyalty' && (
        <section className="py-16 sm:py-24 bg-[#1E0F07] border-b border-amber-500/20 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-orange-500/10 blur-[140px] pointer-events-none -z-0" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            
            {/* 1. Closed-Loop Philosophy Header & Flowchart */}
            <div>
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-3 font-mono uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Closed-Loop CRM Engine</span>
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Not A Complex Salesforce Clone. Pure Restaurant Revenue.
                </h3>
                <p className="text-stone-300 text-sm sm:text-base mt-3 leading-relaxed">
                  "Know customers → understand behaviour → reward coins → recommend actions → execute automated WhatsApp campaigns → verify real POS cash collected."
                </p>
              </div>

              {/* Step Sequence Band */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 text-center">
                {[
                  { step: '01', title: 'Customer Data', sub: 'Frictionless QR dining & anonymous spend history' },
                  { step: '02', title: 'RFM Intelligence', sub: 'Calculates recency, visit frequency & churn risk' },
                  { step: '03', title: 'AI Assistant', sub: 'Margin-aware win-back & VIP protection suggestions' },
                  { step: '04', title: 'Official WhatsApp', sub: 'Official Meta API per restaurant with frequency caps' },
                  { step: '05', title: 'Verified POS ROI', sub: 'Directly attributes table bill payment to campaign' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-[#28140B] border border-amber-500/20 text-left">
                    <span className="text-[11px] font-mono font-black text-amber-400 block mb-1">
                      {item.step}
                    </span>
                    <h5 className="text-sm font-bold text-white mb-1">
                      {item.title}
                    </h5>
                    <p className="text-xs text-stone-400 leading-snug">
                      {item.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Dual Customer Experience: Anonymous Guest vs Identified Diner */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Box A: Anonymous Guest */}
              <div className="p-7 sm:p-8 rounded-3xl bg-[#25130A] border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-800 text-stone-300 border border-stone-700">
                      100% Frictionless Dining
                    </span>
                    <span className="text-xs font-mono text-stone-400">#A8291 Tracking</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">
                    1. Guest &amp; Anonymous Diners
                  </h4>
                  <p className="text-stone-300 text-sm leading-relaxed mb-5">
                    Guests are <strong>never forced to register</strong> before ordering. They scan, customize dishes, submit orders, and pay freely without OTPs, passwords, or app downloads.
                  </p>

                  <div className="p-4 rounded-xl bg-[#1A0D07] border border-white/[0.06] space-y-2 text-xs text-stone-300">
                    <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                      <span className="text-stone-400">Anonymous ID</span>
                      <span className="font-mono text-amber-400">Guest #A8291</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                      <span className="text-stone-400">Behavior Stored</span>
                      <span className="text-white">7 Orders • ₹4,820 Spend</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Post-Order Claim</span>
                      <span className="text-emerald-400">Claim 100 Welcome Coins in 3 sec</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-stone-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero cart drop-off from mandatory login walls</span>
                </div>
              </div>

              {/* Box B: Identified Customer */}
              <div className="p-7 sm:p-8 rounded-3xl bg-[#2A160C] border border-amber-500/30 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      0-OTP Instant Lookup
                    </span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Ledger
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">
                    2. Identified VIP Customers
                  </h4>
                  <p className="text-stone-300 text-sm leading-relaxed mb-5">
                    Before ordering, a gentle prompt allows diners to enter their phone number (no OTP). SwaadSevak recognizes returning guests instantly, displaying their live Discount Coin balance.
                  </p>

                  <div className="p-4 rounded-xl bg-[#1A0D07] border border-amber-500/20 space-y-2 text-xs text-stone-300">
                    <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                      <span className="text-stone-400">Identified Profile</span>
                      <span className="font-bold text-white">Rahul Sharma (VIP Regular)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                      <span className="text-stone-400">Coin Balance</span>
                      <span className="font-bold text-amber-400">🪙 240 Discount Coins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Coin Reservation</span>
                      <span className="text-emerald-400">Temporary hold on cart; deducted only on paid bill</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-stone-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Double-spend proof reservation engine prevents exploits</span>
                </div>
              </div>

            </div>

            {/* 3. AI Growth Feed & Assistant Interactive Mockup */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#231209] border border-amber-500/25 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    AI Business Assistant Feed
                  </span>
                  <h4 className="text-2xl font-black text-white">
                    "Good Evening 👋 Here's What I Found Today"
                  </h4>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ask SwaadSevak NLP Enabled</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Feed Card 1: Churn Risk */}
                <div className="p-6 rounded-2xl bg-[#1A0D07] border border-rose-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        🔥 Churn Risk Alert
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">43 Diners</span>
                    </div>
                    <h5 className="text-base font-bold text-white mb-2">
                      43 Diners Overdue for Visit
                    </h5>
                    <p className="text-xs text-stone-300 leading-relaxed mb-4">
                      These customers normally visit every 18–25 days but haven't returned in 30+ days.
                    </p>
                    <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-300 text-xs font-semibold mb-4 border border-rose-500/20">
                      Recommendation: ₹75 Coins valid for 7 days
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs">
                      Create Campaign
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 text-stone-300 text-xs">
                      Customize
                    </span>
                  </div>
                </div>

                {/* Feed Card 2: VIP Protection */}
                <div className="p-6 rounded-2xl bg-[#1A0D07] border border-amber-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        💎 VIP Regulars Protection
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">18 Diners</span>
                    </div>
                    <h5 className="text-base font-bold text-white mb-2">
                      18 VIPs Generate 31% Revenue
                    </h5>
                    <p className="text-xs text-stone-300 leading-relaxed mb-4">
                      3 top-spenders are showing decreased weekly frequency. Non-discount VIP perk suggested.
                    </p>
                    <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-semibold mb-4 border border-amber-500/20">
                      Recommendation: Chef Tasting Invitation
                    </div>
                  </div>
                  <div>
                    <span className="px-3 py-1.5 rounded-lg bg-white/10 text-stone-200 font-bold text-xs inline-block">
                      View VIP Profiles
                    </span>
                  </div>
                </div>

                {/* Feed Card 3: Growth Opportunity */}
                <div className="p-6 rounded-2xl bg-[#1A0D07] border border-emerald-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        📈 Margin Growth Opportunity
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">Weekend Boost</span>
                    </div>
                    <h5 className="text-base font-bold text-white mb-2">
                      High-Margin Beverage Combos
                    </h5>
                    <p className="text-xs text-stone-300 leading-relaxed mb-4">
                      Weekend orders with mocktails average +₹280 higher ticket. Promote pairings this Friday.
                    </p>
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/20">
                      Projected Revenue: +₹18,400 this weekend
                    </div>
                  </div>
                  <div>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500 text-stone-950 font-bold text-xs inline-block">
                      Schedule WhatsApp Broadcast
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Anti-Spam Frequency Protection & Official WhatsApp Infrastructure */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#22120A] border border-white/[0.08]">
                <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>3 Automation Modes</span>
                </h5>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Choose between <strong>Recommendation Only</strong>, <strong>Approval Required (Default)</strong>, or <strong>Fully Automatic</strong> execution with budget caps.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#22120A] border border-white/[0.08]">
                <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Anti-Spam Frequency Protection</span>
                </h5>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Strictly caps promotional messages to <strong>max 3/month</strong> with mandatory <strong>5-day gaps</strong> and <strong>45-day win-back cooldowns</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#22120A] border border-white/[0.08]">
                <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                  <span>100% Attributed POS Revenue</span>
                </h5>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Connects WhatsApp clicks directly to settled POS billing tickets to measure verified incremental cash generated, not just vanity open rates.
                </p>
              </div>
            </div>

            {/* 5. Complete 4-Pillar Architectural Breakdown (Operate, Understand, Engage, Grow) */}
            <div className="pt-8 border-t border-amber-500/20">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Comprehensive Platform Pillars
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-white">
                  The Complete 4-Stage Operational Architecture
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Pillar 01: OPERATE */}
                <div className="p-6 sm:p-7 rounded-3xl bg-[#241209] border border-amber-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-black text-amber-400 px-2.5 py-1 rounded-md bg-[#3D2519] border border-[#5A3A28]">
                        01 — OPERATE
                      </span>
                      <span className="text-xs text-stone-400 font-mono">6 Core Modules</span>
                    </div>
                    <h5 className="text-lg font-bold text-white mb-1">
                      Run your restaurant smarter
                    </h5>
                    <p className="text-xs text-stone-300 mb-4 leading-relaxed">
                      SwaadSevak simplifies everyday operations by unifying workflows and business data into one connected system.
                    </p>
                    <div className="space-y-2 text-xs">
                      {[
                        { title: 'Restaurant Dashboard', desc: 'Single view of today\'s sales, orders, AOV, visits, and growth indicators.' },
                        { title: 'Sales & Revenue Tracking', desc: 'Daily, weekly and monthly revenue, order volume, and peak sales periods.' },
                        { title: 'Customer & Transaction Data', desc: 'Automatic organization of purchase history, visit frequency, and spend.' },
                        { title: 'Customer Profiles', desc: 'Unified profiles with contact details, spend history, and segments.' },
                        { title: 'Universal Data Import', desc: 'Import historical sales & customer CSV/Excel files from Petpooja or Posist.' },
                        { title: 'Multi-Outlet Management', desc: 'Manage multiple branches from one central login with outlet comparisons.' }
                      ].map((m, i) => (
                        <div key={i} className="p-2 rounded-lg bg-[#1A0D07] border border-white/[0.04]">
                          <span className="font-bold text-amber-300 block">{m.title}</span>
                          <span className="text-[11px] text-stone-400">{m.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pillar 02: UNDERSTAND */}
                <div className="p-6 sm:p-7 rounded-3xl bg-[#241209] border border-amber-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-black text-amber-400 px-2.5 py-1 rounded-md bg-[#3D2519] border border-[#5A3A28]">
                        02 — UNDERSTAND
                      </span>
                      <span className="text-xs text-stone-400 font-mono">10 Analytics Engines</span>
                    </div>
                    <h5 className="text-lg font-bold text-white mb-1">
                      Turn restaurant data into clear insights
                    </h5>
                    <p className="text-xs text-stone-300 mb-4 leading-relaxed">
                      Transforms raw sales logs into plain-English intelligence explaining what happened and why.
                    </p>
                    <div className="space-y-2 text-xs">
                      {[
                        { title: 'Business Analytics', desc: 'Understand revenue trends, acquisition rate, and retention curves.' },
                        { title: 'Customer Segmentation', desc: 'Auto-group into New, Repeat, Loyal, High-Value, and At-Risk diners.' },
                        { title: 'RFM Value Scoring', desc: 'Recency, Frequency, and Monetary scoring combined for actionability.' },
                        { title: 'Product Analytics', desc: 'Best-selling Stars vs low-profit Dogs and category contribution.' },
                        { title: 'Cohort & Retention Analysis', desc: 'Measure how many diners return over 30, 60, and 90-day periods.' },
                        { title: 'Campaign Attribution', desc: 'Track table visits, coin redemptions, and net revenue per campaign.' }
                      ].map((m, i) => (
                        <div key={i} className="p-2 rounded-lg bg-[#1A0D07] border border-white/[0.04]">
                          <span className="font-bold text-amber-300 block">{m.title}</span>
                          <span className="text-[11px] text-stone-400">{m.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pillar 03: ENGAGE */}
                <div className="p-6 sm:p-7 rounded-3xl bg-[#241209] border border-amber-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-black text-amber-400 px-2.5 py-1 rounded-md bg-[#3D2519] border border-[#5A3A28]">
                        03 — ENGAGE
                      </span>
                      <span className="text-xs text-stone-400 font-mono">10 CRM Capabilities</span>
                    </div>
                    <h5 className="text-lg font-bold text-white mb-1">
                      Build stronger customer relationships
                    </h5>
                    <p className="text-xs text-stone-300 mb-4 leading-relaxed">
                      Reach the right customer at the right time with personalized WhatsApp messages and zero spam.
                    </p>
                    <div className="space-y-2 text-xs">
                      {[
                        { title: 'Centralized Restaurant CRM', desc: '360° diner identity, visit history, spend tier, and preferences.' },
                        { title: 'Smart Customer Segments', desc: 'Rule-based targeting: "Spent > ₹5K", "Pizza Lovers", or "30d Inactive".' },
                        { title: 'No-Code Campaign Builder', desc: 'Audience, Offer, Message, Channel & Timing in 60 seconds.' },
                        { title: 'Official WhatsApp Platform', desc: 'Direct Meta API integration per restaurant with high delivery rates.' },
                        { title: 'Automated Customer Journeys', desc: 'Visual multi-step sequences: Visit → 3d Thank-You → 10d Comeback.' },
                        { title: 'Ready-Made Templates', desc: 'Pre-written templates for Weekend Offers, "We Miss You", and VIPs.' }
                      ].map((m, i) => (
                        <div key={i} className="p-2 rounded-lg bg-[#1A0D07] border border-white/[0.04]">
                          <span className="font-bold text-amber-300 block">{m.title}</span>
                          <span className="text-[11px] text-stone-400">{m.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pillar 04: GROW */}
                <div className="p-6 sm:p-7 rounded-3xl bg-[#241209] border border-amber-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-black text-amber-400 px-2.5 py-1 rounded-md bg-[#3D2519] border border-[#5A3A28]">
                        04 — GROW
                      </span>
                      <span className="text-xs text-stone-400 font-mono">10 Growth Drivers</span>
                    </div>
                    <h5 className="text-lg font-bold text-white mb-1">
                      Turn insights into measurable growth
                    </h5>
                    <p className="text-xs text-stone-300 mb-4 leading-relaxed">
                      Converts data into continuous, profitable revenue growth and repeat dine-in visits.
                    </p>
                    <div className="space-y-2 text-xs">
                      {[
                        { title: 'AI Growth Engine', desc: 'Identifies where you are losing customers and what to do next.' },
                        { title: 'Action Recommendations', desc: 'Converts data to action: "214 diners overdue → Launch ₹75 Win-Back".' },
                        { title: 'Revenue Recovery', desc: 'Pinpoint lost customers and recover revenue with targeted incentives.' },
                        { title: 'Customer Lifetime Value', desc: 'Estimate long-term customer worth to prioritize VIP hospitality.' },
                        { title: 'Measurable Growth Goals', desc: 'Set and track targets: "+15% repeat diners" or "Reactivate 200 guests".' },
                        { title: 'Executive Growth Reports', desc: 'Structured: "What Happened → Why → What To Do → Growth Generated".' }
                      ].map((m, i) => (
                        <div key={i} className="p-2 rounded-lg bg-[#1A0D07] border border-white/[0.04]">
                          <span className="font-bold text-amber-300 block">{m.title}</span>
                          <span className="text-[11px] text-stone-400">{m.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 6. The Complete Closed Loop Flywheel */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2F180E] to-[#1E0F07] border border-amber-500/30 text-left">
              <div className="max-w-xl mb-6">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  The Closed Operational Loop
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  The Complete SwaadSevak Flywheel
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-6">
                <div className="p-3.5 rounded-2xl bg-[#1A0D07] border border-amber-500/20">
                  <span className="text-xs font-mono font-bold text-amber-400 block mb-1">01 OPERATE</span>
                  <span className="text-xs text-stone-300">Collect table data</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#1A0D07] border border-amber-500/20">
                  <span className="text-xs font-mono font-bold text-amber-400 block mb-1">02 UNDERSTAND</span>
                  <span className="text-xs text-stone-300">Analyze RFM & Churn</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#1A0D07] border border-amber-500/20">
                  <span className="text-xs font-mono font-bold text-amber-400 block mb-1">03 ENGAGE</span>
                  <span className="text-xs text-stone-300">Target WhatsApp CRM</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#1A0D07] border border-amber-500/20">
                  <span className="text-xs font-mono font-bold text-amber-400 block mb-1">04 GROW</span>
                  <span className="text-xs text-stone-300">Measure POS ROI</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#150904] border border-amber-500/25">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                  The SwaadSevak Core Promise
                </span>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-semibold">
                  "Here is what happened, why it happened, what you should do next, and how much growth that action generated."
                </p>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Section 2: Key Capabilities */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400 mb-2">
              Deep Architecture
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Core Capabilities Built For High Volume
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feature.keyCapabilities.map((cap, idx) => {
              const CapIcon = cap.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-[#1D0F08] border border-white/[0.06] flex items-start gap-5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                    <CapIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1.5">
                      {cap.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Benefits for Staff & Owners */}
      <section className="py-16 sm:py-20 bg-[#160B05] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400 mb-2">
              Real-World Impact
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Why Restaurants Choose SwaadSevak
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {feature.benefits.map((b, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#22120A] border border-amber-500/20 shadow-xl"
              >
                <h4 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>{b.role}</span>
                </h4>
                <ul className="space-y-4">
                  {b.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-3 text-sm text-stone-300 leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                      </div>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: FAQs */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400 mb-2">
              Got Questions?
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {feature.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#1D0F08] border border-white/[0.06]"
              >
                <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-sm text-stone-300 leading-relaxed pl-6.5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Switch Feature Links */}
      <section className="py-16 sm:py-20 bg-[#160B05] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Explore More SwaadSevak Features
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              Click any module to read detailed architecture and operational workflows.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.values(FEATURES_DATA).map((item) => {
              const ItemIcon = item.icon;
              const isCurrent = item.id === feature.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectFeature(item.id)}
                  className={`p-4 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isCurrent
                      ? 'bg-amber-500/20 border border-amber-500/50 shadow-md'
                      : 'bg-[#22120A] border border-white/[0.06] hover:border-amber-500/30 hover:bg-[#28150D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-mono font-bold text-amber-400">Active</span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                      {item.tag}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 bg-[#100703] border-t border-white/[0.08] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h4 className="text-2xl font-black text-white mb-3">
            Ready to streamline your restaurant shifts?
          </h4>
          <p className="text-sm text-stone-400 mb-6">
            Get started in under 5 minutes with zero hardware lock-in.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="#login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <span>Platform Login</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </a>
            <button
              onClick={onNavigateHome}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-white/[0.06] border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

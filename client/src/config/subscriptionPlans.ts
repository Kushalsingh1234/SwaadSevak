import { SubscriptionPlan } from '../types/auth';

export const COMMON_FEATURES: string[] = [
  'Complete access to all SwaadSevak features',
  'Restaurant management tools',
  'Customer management',
  'Business insights and analytics',
  'Menu and product management',
  'Dedicated restaurant profile',
  'Regular platform updates',
  'Customer engagement tools',
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_3m',
    durationKey: '3_MONTHS',
    name: 'Quarterly Starter',
    durationLabel: '3 Months',
    months: 3,
    price: 599,
    pricePerMonth: 200,
    features: [
      ...COMMON_FEATURES,
      'Support assistance',
    ],
    prioritySupport: false,
  },
  {
    id: 'plan_6m',
    durationKey: '6_MONTHS',
    name: 'Half-Year Growth',
    durationLabel: '6 Months',
    months: 6,
    price: 999,
    originalPrice: 1198,
    pricePerMonth: 166,
    savingsLabel: 'Save 17%',
    isPopular: true,
    badge: 'MOST POPULAR',
    features: [
      ...COMMON_FEATURES,
      'Support assistance',
    ],
    prioritySupport: false,
  },
  {
    id: 'plan_12m',
    durationKey: '12_MONTHS',
    name: 'Annual Scale',
    durationLabel: '12 Months',
    months: 12,
    price: 1899,
    originalPrice: 2396,
    pricePerMonth: 158,
    savingsLabel: 'Save 21% • Best Value',
    badge: 'BEST VALUE',
    features: [
      ...COMMON_FEATURES,
      'Priority support assistance',
    ],
    prioritySupport: true,
  },
];

export const DEFAULT_PLAN_ID = 'plan_6m';

// Integration Config for Razorpay (Preparation)
export const RAZORPAY_CONFIG = {
  // Placeholder test key - Replace with process.env / Vite env when real Razorpay account is connected
  keyId: 'rzp_test_swaadsevak_demo',
  currency: 'INR',
  companyName: 'SwaadSevak Technologies',
  themeColor: '#F25C05',
};

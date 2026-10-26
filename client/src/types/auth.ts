export interface AuthUser {
  uid: string;
  email: string;
  username?: string;
  displayName?: string;
  photoUrl?: string;
  provider: 'google' | 'password' | 'demo';
  emailVerified: boolean;
  createdAt: string;
}

export type SubscriptionDuration = '3_MONTHS' | '6_MONTHS' | '12_MONTHS';

export interface SubscriptionPlan {
  id: string;
  durationKey: SubscriptionDuration;
  name: string;
  durationLabel: string;
  months: number;
  price: number;
  originalPrice?: number;
  pricePerMonth: number;
  savingsLabel?: string;
  isPopular?: boolean;
  badge?: string;
  features: string[];
  prioritySupport: boolean;
}

export type RestaurantType = 
  | 'Restaurant'
  | 'Cafe'
  | 'Cloud Kitchen'
  | 'Bakery'
  | 'Fast Food'
  | 'Other';

export interface RestaurantOnboardingData {
  // Owner Details
  ownerName: string;
  phone: string;
  email: string;
  altPhone?: string;

  // Restaurant Details
  restaurantName: string;
  restaurantType: RestaurantType;
  category: string;
  description?: string;

  // Location Details
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;

  // Additional Details
  logoUrl?: string;
  coverImageUrl?: string;
  gstNumber?: string;
  fssaiNumber?: string;

  // Plan Selected
  selectedPlanId?: string;
}

export type AuthFlowStep = 
  | 'login'
  | 'signup'
  | 'create-account'
  | 'forgot-password'
  | 'reset-password'
  | 'subscription-plans'
  | 'onboarding'
  | 'onboarding-success';

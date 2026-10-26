export type ProfileTabId = 
  | 'overview'
  | 'personal'
  | 'restaurant'
  | 'subscription'
  | 'history'
  | 'security';

export interface UserProfileData {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  altPhone: string;
  photoUrl: string;
  createdAt: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  googleConnected: boolean;
  googleEmail: string;
  lastLogin: string;
  role: string;
}

export interface UserRestaurantProfileData {
  id?: string;
  slug?: string;
  restaurantName: string;
  restaurantType: string;
  category: string;
  description: string;
  ownerName: string;
  phone: string;
  altPhone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  gstNumber: string;
  fssaiNumber: string;
  logoUrl: string;
  coverImageUrl: string;
}

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';

export interface ActiveSubscriptionData {
  planId: string;
  planName: string;
  price: number;
  durationLabel: string;
  months: number;
  purchaseDate: string; // ISO string
  startDate: string;    // ISO string
  expiryDate: string;   // ISO string
  status: SubscriptionStatus;
  remainingDays: number;
  usedDays: number;
  totalDays: number;
  progressPercent: number;
  autoRenew: boolean;
  transactionId: string;
}

export interface SubscriptionHistoryItem {
  id: string;
  planName: string;
  duration: string;
  amount: number;
  purchaseDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'RENEWED' | 'EXPIRED';
  transactionId: string;
  paymentMethod: string;
  invoiceNumber: string;
}

export interface NotificationPreferences {
  expiryReminders: boolean;
  paymentAlerts: boolean;
  securityUpdates: boolean;
  productAnnouncements: boolean;
  promotions: boolean;
}


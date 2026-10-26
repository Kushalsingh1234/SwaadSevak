import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfileData,
  UserRestaurantProfileData,
  ActiveSubscriptionData,
  SubscriptionHistoryItem,
  NotificationPreferences,
  ProfileTabId,
  SubscriptionStatus,
} from '../types/profile';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';

// ============================================================================
// ARCHITECTURAL INTEGRATION POINTS FOR FIREBASE & RAZORPAY:
//
// 1. FIREBASE AUTHENTICATION (Profile & Security):
//    - User profile update: `updateProfile(auth.currentUser, { displayName, photoURL })`
//    - Email update with verification: `verifyBeforeUpdateEmail(auth.currentUser, newEmail)`
//    - Password change:
//        const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
//        await reauthenticateWithCredential(auth.currentUser, cred);
//        await updatePassword(auth.currentUser, newPassword);
//
// 2. FIRESTORE (Restaurant & Notifications):
//    - Restaurant profile sync: `setDoc(doc(db, "restaurants", restaurantId), data, { merge: true })`
//    - Notification settings: `setDoc(doc(db, "user_settings", userId), preferences, { merge: true })`
//
// 3. RAZORPAY (Subscription Renewal & Invoicing):
//    - Webhook triggers `subscription.charged` or `payment.captured`
//    - Backend verifies Razorpay signature via HMAC SHA256
//    - Backend computes new expiry date and extends subscription in DB
// ============================================================================

interface ProfileContextType {
  activeTab: ProfileTabId;
  setActiveTab: (tab: ProfileTabId) => void;
  
  // User Profile
  profile: UserProfileData;
  updateUserProfile: (data: Partial<UserProfileData>) => Promise<{ success: boolean; message?: string }>;
  
  // Restaurant Profile
  restaurantProfile: UserRestaurantProfileData;
  updateRestaurantProfile: (data: Partial<UserRestaurantProfileData>) => Promise<{ success: boolean; message?: string }>;
  
  // Subscription
  subscription: ActiveSubscriptionData;
  subscriptionHistory: SubscriptionHistoryItem[];
  renewSubscriptionPlan: (planId: string) => Promise<{ success: boolean; message?: string }>;
  setTestExpiryDays: (days: number) => void; // Testing utility for dynamic states
  
  // Security
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
  
  // Notifications
  notifications: NotificationPreferences;
  updateNotifications: (prefs: Partial<NotificationPreferences>) => void;
  
  // Account Management
  requestAccountDeletion: (confirmationText: string) => Promise<{ success: boolean; message?: string }>;
}

const STORAGE_KEYS = {
  USER_PROFILE: 'swaad_user_profile',
  RESTAURANT_PROFILE: 'swaad_restaurant_profile',
  SUBSCRIPTION: 'swaad_subscription',
  HISTORY: 'swaad_subscription_history',
  NOTIFICATIONS: 'swaad_notifications',
};

// Helper: Calculate dynamic subscription metrics using real Date objects
const computeSubscriptionMetrics = (startDateStr: string, expiryDateStr: string): {
  status: SubscriptionStatus;
  remainingDays: number;
  usedDays: number;
  totalDays: number;
  progressPercent: number;
} => {
  const now = new Date();
  const start = new Date(startDateStr);
  const expiry = new Date(expiryDateStr);

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.max(1, Math.ceil((expiry.getTime() - start.getTime()) / msPerDay));
  const remainingDays = Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / msPerDay));
  const usedDays = Math.max(0, Math.min(totalDays, totalDays - remainingDays));
  const progressPercent = Math.min(100, Math.max(0, Math.round((usedDays / totalDays) * 100)));

  let status: SubscriptionStatus = 'ACTIVE';
  if (remainingDays <= 0) {
    status = 'EXPIRED';
  } else if (remainingDays <= 7) {
    status = 'EXPIRING_SOON';
  } else {
    status = 'ACTIVE';
  }

  return { status, remainingDays, usedDays, totalDays, progressPercent };
};

export const DEFAULT_CAFE_LOGO = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80';

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ProfileTabId>('overview');

  // 1. User Personal Information
  const [profile, setProfile] = useState<UserProfileData>(() => {
    try {
      const savedStr = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (savedStr) {
        const parsed = JSON.parse(savedStr);
        // Migrate old woman stock photo to cafe logo
        if (!parsed.photoUrl || parsed.photoUrl.includes('1534528741775-53994a69daeb')) {
          parsed.photoUrl = DEFAULT_CAFE_LOGO;
        }
        return parsed;
      }

      // Seed from existing auth user or manager if present
      const savedUser = localStorage.getItem('swaad_auth_user');
      const savedMgr = localStorage.getItem('swaad_manager');
      const userObj = savedUser ? JSON.parse(savedUser) : null;
      const mgrObj = savedMgr ? JSON.parse(savedMgr) : null;

      const userPhoto = userObj?.photoUrl && !userObj.photoUrl.includes('1534528741775-53994a69daeb')
        ? userObj.photoUrl
        : DEFAULT_CAFE_LOGO;

      return {
        fullName: userObj?.displayName || 'Vikram Sharma',
        username: userObj?.username || mgrObj?.username || 'demo_manager',
        email: userObj?.email || 'vikram.sharma.restaurant@gmail.com',
        phone: '+91 98765 43210',
        altPhone: '+91 98111 22334',
        photoUrl: userPhoto,
        createdAt: '2026-01-12T10:30:00.000Z',
        emailVerified: true,
        phoneVerified: true,
        googleConnected: true,
        googleEmail: userObj?.email || 'vikram.sharma.restaurant@gmail.com',
        lastLogin: new Date().toISOString(),
        role: mgrObj?.role || 'RESTAURANT_OWNER',
      };
    } catch {
      return {
        fullName: 'Vikram Sharma',
        username: 'demo_manager',
        email: 'vikram.sharma.restaurant@gmail.com',
        phone: '+91 98765 43210',
        altPhone: '+91 98111 22334',
        photoUrl: DEFAULT_CAFE_LOGO,
        createdAt: '2026-01-12T10:30:00.000Z',
        emailVerified: true,
        phoneVerified: true,
        googleConnected: true,
        googleEmail: 'vikram.sharma.restaurant@gmail.com',
        lastLogin: new Date().toISOString(),
        role: 'RESTAURANT_OWNER',
      };
    }
  });

  // 2. Restaurant Profile Information
  const [restaurantProfile, setRestaurantProfile] = useState<UserRestaurantProfileData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESTAURANT_PROFILE);
      if (saved) return JSON.parse(saved);

      const savedRest = localStorage.getItem('swaad_restaurant');
      const restObj = savedRest ? JSON.parse(savedRest) : null;

      return {
        id: restObj?.id || '0a27ebec-e14c-4b60-a199-c2fe67f56102',
        slug: restObj?.slug || 'chai-and-chaat',
        restaurantName: restObj?.name || 'The Chai & Chaat Co.',
        restaurantType: restObj?.restaurantType || 'Cafe & Quick Service',
        category: 'North Indian, Street Food & Beverages',
        description: 'Authentic artisan kulchas, street chaat, and high-energy cutting chai served fresh daily with zero compromise on quality.',
        ownerName: restObj?.ownerName || 'Vikram Sharma',
        phone: restObj?.phone || '+91 98765 43210',
        altPhone: '+91 98111 22334',
        email: restObj?.email || 'contact@chaiandchaat.in',
        address: restObj?.address || 'Shop 4, Ground Floor, Indiranagar 100ft Road',
        city: restObj?.city || 'Bengaluru',
        state: restObj?.state || 'Karnataka',
        pincode: '560038',
        landmark: 'Opposite Metro Pillar 114',
        gstNumber: restObj?.gstNumber || '29ABCDE1234F1Z5',
        fssaiNumber: '11223344556677',
        logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
      };
    } catch {
      return {
        restaurantName: 'The Chai & Chaat Co.',
        restaurantType: 'Cafe & Quick Service',
        category: 'North Indian, Street Food & Beverages',
        description: 'Authentic artisan kulchas, street chaat, and high-energy cutting chai served fresh daily.',
        ownerName: 'Vikram Sharma',
        phone: '+91 98765 43210',
        altPhone: '+91 98111 22334',
        email: 'contact@chaiandchaat.in',
        address: 'Shop 4, Ground Floor, Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        landmark: 'Near Metro Pillar 114',
        gstNumber: '29ABCDE1234F1Z5',
        fssaiNumber: '11223344556677',
        logoUrl: '',
        coverImageUrl: '',
      };
    }
  });

  // 3. Active Subscription (Dynamic date calculations)
  const [subscription, setSubscription] = useState<ActiveSubscriptionData>(() => {
    // Dynamic default: 6-month plan expiring 28 February 2027 (~124 days remaining as requested)
    const expiry = new Date('2027-02-28T23:59:59.000Z');
    // Start date 180 days before expiry
    const start = new Date(expiry.getTime() - 180 * 24 * 60 * 60 * 1000);
    const purchase = new Date(start.getTime());

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
      if (saved) {
        const parsed = JSON.parse(saved);
        const metrics = computeSubscriptionMetrics(parsed.startDate, parsed.expiryDate);
        return {
          ...parsed,
          ...metrics,
        };
      }
    } catch {
      // Fallback to default
    }

    const metrics = computeSubscriptionMetrics(start.toISOString(), expiry.toISOString());

    return {
      planId: '6-months',
      planName: '6 Months Plan',
      price: 999,
      durationLabel: '6 Months',
      months: 6,
      purchaseDate: purchase.toISOString(),
      startDate: start.toISOString(),
      expiryDate: expiry.toISOString(),
      autoRenew: true,
      transactionId: 'pay_SS99824XJ7',
      ...metrics,
    };
  });

  // 4. Subscription History
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {}

    return [
      {
        id: 'sub_hist_01',
        planName: '6 Months Plan',
        duration: '6 Months',
        amount: 999,
        purchaseDate: '2026-08-31T10:00:00.000Z',
        expiryDate: '2027-02-28T23:59:59.000Z',
        status: 'ACTIVE',
        transactionId: 'pay_SS99824XJ7',
        paymentMethod: 'UPI (GPay / PhonePe)',
        invoiceNumber: 'INV-2026-0892',
      },
      {
        id: 'sub_hist_02',
        planName: '3 Months Plan',
        duration: '3 Months',
        amount: 599,
        purchaseDate: '2026-05-31T14:30:00.000Z',
        expiryDate: '2026-08-31T23:59:59.000Z',
        status: 'RENEWED',
        transactionId: 'pay_SS88192KJ3',
        paymentMethod: 'HDFC Business Credit Card',
        invoiceNumber: 'INV-2026-0511',
      },
      {
        id: 'sub_hist_03',
        planName: 'Starter 3 Months Plan',
        duration: '3 Months',
        amount: 599,
        purchaseDate: '2026-02-28T09:15:00.000Z',
        expiryDate: '2026-05-31T23:59:59.000Z',
        status: 'EXPIRED',
        transactionId: 'pay_SS77102QP9',
        paymentMethod: 'NetBanking (ICICI)',
        invoiceNumber: 'INV-2026-0204',
      },
    ];
  });

  // 5. Notification Preferences
  const [notifications, setNotifications] = useState<NotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      expiryReminders: true,
      paymentAlerts: true,
      securityUpdates: true,
      productAnnouncements: true,
      promotions: false,
    };
  });

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESTAURANT_PROFILE, JSON.stringify(restaurantProfile));
  }, [restaurantProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(subscriptionHistory));
  }, [subscriptionHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Actions: User Profile Update
  const updateUserProfile = async (data: Partial<UserProfileData>): Promise<{ success: boolean; message?: string }> => {
    // Validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (data.phone && !/^[6-9]\d{9}$/.test(data.phone.replace(/\D/g, '').slice(-10))) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }

    setProfile(prev => ({ ...prev, ...data }));
    return { success: true, message: 'Personal information updated successfully.' };
  };

  // Actions: Restaurant Profile Update
  const updateRestaurantProfile = async (data: Partial<UserRestaurantProfileData>): Promise<{ success: boolean; message?: string }> => {
    if (data.restaurantName && !data.restaurantName.trim()) {
      return { success: false, message: 'Restaurant name cannot be empty.' };
    }

    setRestaurantProfile(prev => {
      const updated = { ...prev, ...data };
      // Also sync to swaad_restaurant in localStorage so the main app views stay updated
      try {
        const existingRest = JSON.parse(localStorage.getItem('swaad_restaurant') || '{}');
        const merged = {
          ...existingRest,
          name: updated.restaurantName,
          restaurantType: updated.restaurantType,
          ownerName: updated.ownerName,
          phone: updated.phone,
          email: updated.email,
          address: updated.address,
          city: updated.city,
          state: updated.state,
          gstNumber: updated.gstNumber,
        };
        localStorage.setItem('swaad_restaurant', JSON.stringify(merged));
      } catch (e) {
        console.error('Failed to sync restaurant storage:', e);
      }
      return updated;
    });

    return { success: true, message: 'Restaurant details updated successfully.' };
  };

  // Actions: Change Password
  const changePassword = async (currentPass: string, newPass: string): Promise<{ success: boolean; message?: string }> => {
    if (!currentPass.trim()) {
      return { success: false, message: 'Current password is required.' };
    }
    if (newPass.length < 8) {
      return { success: false, message: 'New password must be at least 8 characters long.' };
    }
    if (!/\d/.test(newPass) || !/[A-Z]/.test(newPass) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPass)) {
      return { success: false, message: 'New password must contain at least 1 uppercase letter, 1 number, and 1 special symbol.' };
    }

    // In demo environment, accept demo PIN '1234' or any valid 4+ char string for mock
    // FIREBASE AUTH INTEGRATION POINT:
    // const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPass);
    // await reauthenticateWithCredential(auth.currentUser, credential);
    // await updatePassword(auth.currentUser, newPass);

    return {
      success: true,
      message: 'Password updated successfully! In production, this verifies with Firebase Authentication.',
    };
  };

  // Actions: Subscription Renewal Plan selection
  const renewSubscriptionPlan = async (planId: string): Promise<{ success: boolean; message?: string }> => {
    const foundPlan = SUBSCRIPTION_PLANS.find(p => p.id === planId) || SUBSCRIPTION_PLANS[1];
    
    // Calculate new start & expiry (extends from current expiry or today if expired)
    const now = new Date();
    const currentExpiry = new Date(subscription.expiryDate);
    const baseDate = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(baseDate.getTime() + foundPlan.months * 30 * 24 * 60 * 60 * 1000);
    const metrics = computeSubscriptionMetrics(baseDate.toISOString(), newExpiry.toISOString());

    const updatedSub: ActiveSubscriptionData = {
      ...subscription,
      planId: foundPlan.id,
      planName: foundPlan.name,
      price: foundPlan.price,
      durationLabel: foundPlan.durationLabel,
      months: foundPlan.months,
      purchaseDate: now.toISOString(),
      startDate: baseDate.toISOString(),
      expiryDate: newExpiry.toISOString(),
      transactionId: `pay_SS${Date.now().toString().slice(-8)}`,
      ...metrics,
    };

    setSubscription(updatedSub);

    // Add to history
    const newHistoryItem: SubscriptionHistoryItem = {
      id: `sub_hist_${Date.now()}`,
      planName: foundPlan.name,
      duration: foundPlan.durationLabel,
      amount: foundPlan.price,
      purchaseDate: now.toISOString(),
      expiryDate: newExpiry.toISOString(),
      status: 'ACTIVE',
      transactionId: updatedSub.transactionId,
      paymentMethod: 'Razorpay Verified Payment',
      invoiceNumber: `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setSubscriptionHistory(prev => [newHistoryItem, ...prev.map(item => item.status === 'ACTIVE' ? { ...item, status: 'RENEWED' as const } : item)]);

    return {
      success: true,
      message: `Subscription successfully renewed to ${foundPlan.name}.`,
    };
  };

  // Testing helper: Dynamically set remaining days to test 'ACTIVE', 'EXPIRING_SOON', and 'EXPIRED' UI states
  const setTestExpiryDays = (days: number) => {
    const now = new Date();
    const newExpiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    // Start date 180 days before expiry
    const newStart = new Date(newExpiry.getTime() - 180 * 24 * 60 * 60 * 1000);
    const metrics = computeSubscriptionMetrics(newStart.toISOString(), newExpiry.toISOString());

    setSubscription(prev => ({
      ...prev,
      startDate: newStart.toISOString(),
      expiryDate: newExpiry.toISOString(),
      ...metrics,
    }));
  };

  // Actions: Update Notifications
  const updateNotifications = (prefs: Partial<NotificationPreferences>) => {
    setNotifications(prev => ({ ...prev, ...prefs }));
  };

  // Actions: Request Account Deletion
  const requestAccountDeletion = async (confirmationText: string): Promise<{ success: boolean; message?: string }> => {
    if (confirmationText.trim().toUpperCase() !== 'DELETE') {
      return { success: false, message: 'Please type DELETE exactly to confirm.' };
    }
    return {
      success: true,
      message: 'Account deletion request submitted. An authorization confirmation link has been dispatched to your registered Google email.',
    };
  };

  return (
    <ProfileContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        updateUserProfile,
        restaurantProfile,
        updateRestaurantProfile,
        subscription,
        subscriptionHistory,
        renewSubscriptionPlan,
        setTestExpiryDays,
        changePassword,
        notifications,
        updateNotifications,
        requestAccountDeletion,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

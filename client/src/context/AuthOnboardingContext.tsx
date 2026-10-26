import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, RestaurantOnboardingData, SubscriptionPlan } from '../types/auth';
import { SUBSCRIPTION_PLANS, DEFAULT_PLAN_ID } from '../config/subscriptionPlans';
import { api } from '../services/api';

// ============================================================================
// FIREBASE & RAZORPAY ARCHITECTURE NOTE:
// This context manages the mock state for:
// 1. Google initial authentication
// 2. Custom username + password setup
// 3. Password reset via verified Google account
// 4. Subscription plan selection
// 5. Restaurant profile onboarding
//
// WHEN READY TO CONNECT FIREBASE & RAZORPAY:
// - Replace `loginWithGoogleMock` with `signInWithPopup(auth, googleProvider)`
// - Replace `createAccountWithUsernameAndPassword` with `createUserWithEmailAndPassword(auth, email, password)`
// - Replace `sendForgotPasswordVerification` with `sendPasswordResetEmail(auth, email)`
// - Replace `handleRazorpayCheckout` with `new (window as any).Razorpay(options).open()`
// - Persist restaurant onboarding data to Firestore collection `restaurants/{restaurantId}`
// ============================================================================

interface AuthOnboardingContextType {
  // Current user & authentication state
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isRegisteredWithGoogle: boolean;

  // Flow State
  selectedPlan: SubscriptionPlan;
  restaurantDraft: Partial<RestaurantOnboardingData>;

  // Authentication Actions
  loginWithCredentials: (usernameOrEmail: string, passwordOrPin: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogleMock: (mockProfile?: { email: string; name: string }) => Promise<AuthUser>;
  checkUsernameAvailability: (username: string) => Promise<{ available: boolean; message: string }>;
  createAccountWithUsernameAndPassword: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  
  // Forgot Password Actions
  sendForgotPasswordVerification: (googleEmail: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; message?: string }>;
  
  // Subscription Actions
  selectPlan: (planId: string) => void;
  openRazorpayModal: () => void;
  closeRazorpayModal: () => void;
  isRazorpayModalOpen: boolean;
  completeSubscriptionPaymentMock: () => Promise<void>;

  // Onboarding Actions
  updateRestaurantDraft: (fields: Partial<RestaurantOnboardingData>) => void;
  submitRestaurantOnboarding: (formData: RestaurantOnboardingData) => Promise<{ success: boolean; message?: string; restaurant?: any }>;
  
  // Reset / Clear
  logout: () => void;
}

const STORAGE_KEYS = {
  USER: 'swaad_auth_user',
  PLAN: 'swaad_selected_plan',
  DRAFT: 'swaad_onboarding_draft',
  REGISTERED_USERS: 'swaad_mock_registered_users',
};

const AuthOnboardingContext = createContext<AuthOnboardingContextType | undefined>(undefined);

export const AuthOnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current authenticated user (prepared for Firebase User)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Selected subscription plan
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.PLAN);
      const found = SUBSCRIPTION_PLANS.find(p => p.id === savedId);
      return found || SUBSCRIPTION_PLANS.find(p => p.id === DEFAULT_PLAN_ID)!;
    } catch {
      return SUBSCRIPTION_PLANS.find(p => p.id === DEFAULT_PLAN_ID)!;
    }
  });

  // Restaurant onboarding form draft
  const [restaurantDraft, setRestaurantDraft] = useState<Partial<RestaurantOnboardingData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRAFT);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Razorpay payment modal simulator
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem(STORAGE_KEYS.PLAN, selectedPlan.id);
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (restaurantDraft && Object.keys(restaurantDraft).length > 0) {
      localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(restaurantDraft));
    }
  }, [restaurantDraft]);

  // Handle Login with Username/Email and Password
  const loginWithCredentials = async (
    identifier: string,
    passwordOrPin: string,
    _rememberMe: boolean = true
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanSecret = passwordOrPin.trim();

    // 1. First check if it matches existing backend manager credentials (e.g. demo_manager / 1234 or any registered DB manager)
    try {
      const backendRes = await api.login({ username: identifier.trim(), pin: cleanSecret });
      if (backendRes.success) {
        localStorage.setItem('swaad_token', backendRes.token);
        if (backendRes.restaurant) localStorage.setItem('swaad_restaurant', JSON.stringify(backendRes.restaurant));
        if (backendRes.manager) localStorage.setItem('swaad_manager', JSON.stringify(backendRes.manager));

        const user: AuthUser = {
          uid: backendRes.manager.id || `mgr_${Date.now()}`,
          email: `${backendRes.manager.username}@swaadsevak.in`,
          username: backendRes.manager.username,
          displayName: backendRes.restaurant.name || 'Restaurant Manager',
          provider: 'password',
          emailVerified: true,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(user);
        return { success: true };
      }
    } catch (e: any) {
      // If backend fails, check if it's one of the mock-registered users in this browser session
      console.log('Backend auth bypassed or failed, checking local mock registry:', e.message);
    }

    // 2. Check local mock registered accounts
    const mockUsers: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
    const matched = mockUsers.find(
      u => (u.username?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId) && u.password === cleanSecret
    );

    if (matched) {
      const user: AuthUser = {
        uid: matched.uid,
        email: matched.email,
        username: matched.username,
        displayName: matched.displayName || matched.username,
        photoUrl: matched.photoUrl,
        provider: 'password',
        emailVerified: true,
        createdAt: matched.createdAt
      };
      setCurrentUser(user);
      return { success: true };
    }

    // 3. Fallback demo acceptance for quick review if testing
    if (cleanId === 'demo_manager' && cleanSecret === '1234') {
      const demoUser: AuthUser = {
        uid: 'demo_user_001',
        email: 'manager@swaadsevak.com',
        username: 'demo_manager',
        displayName: 'Demo Restaurant Owner',
        provider: 'demo',
        emailVerified: true,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(demoUser);
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid username/email or password. For demo testing, use demo_manager / 1234.'
    };
  };

  // Handle Google Sign Up / Sign In
  const loginWithGoogleMock = async (mockProfile?: { email: string; name: string }): Promise<AuthUser> => {
    // Simulated Google OAuth response
    // When Firebase is connected:
    // const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const profile = mockProfile || {
      email: 'vikram.sharma@gmail.com',
      name: 'Vikram Sharma',
    };

    const googleUser: AuthUser = {
      uid: `google_${Date.now()}`,
      email: profile.email,
      displayName: profile.name,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      provider: 'google',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(googleUser);
    return googleUser;
  };

  // Check username availability
  const checkUsernameAvailability = async (username: string): Promise<{ available: boolean; message: string }> => {
    const clean = username.trim().toLowerCase();
    if (!clean) return { available: false, message: 'Username cannot be blank' };
    if (clean.length < 3) return { available: false, message: 'Username must be at least 3 characters' };
    if (!/^[a-z0-9_]+$/.test(clean)) {
      return { available: false, message: 'Only lowercase letters, numbers, and underscores allowed' };
    }

    const takenUsernames = ['admin', 'root', 'support', 'swaadsevak', 'demo'];
    const mockUsers: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
    const isTaken = takenUsernames.includes(clean) || mockUsers.some(u => u.username?.toLowerCase() === clean);

    // Simulate async network latency
    await new Promise(r => setTimeout(r, 200));

    if (isTaken) {
      return { available: false, message: `@${clean} is already taken. Try another!` };
    }

    return { available: true, message: `@${clean} is available` };
  };

  // Create Username & Password after Google Registration
  const createAccountWithUsernameAndPassword = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser || !password) {
      return { success: false, message: 'Please provide both username and password.' };
    }

    // Verify availability
    const avail = await checkUsernameAvailability(cleanUser);
    if (!avail.available) {
      return { success: false, message: avail.message };
    }

    const updatedUser: AuthUser = {
      uid: currentUser?.uid || `user_${Date.now()}`,
      email: currentUser?.email || `${cleanUser}@example.com`,
      username: cleanUser,
      displayName: currentUser?.displayName || cleanUser,
      photoUrl: currentUser?.photoUrl,
      provider: 'google',
      emailVerified: true,
      createdAt: currentUser?.createdAt || new Date().toISOString(),
    };

    setCurrentUser(updatedUser);

    // Persist to local mock registry
    const mockUsers: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
    const index = mockUsers.findIndex(u => u.email === updatedUser.email);
    const record = { ...updatedUser, password };
    if (index >= 0) {
      mockUsers[index] = record;
    } else {
      mockUsers.push(record);
    }
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(mockUsers));

    return { success: true };
  };

  // Forgot Password — Verify Google Account Email
  const sendForgotPasswordVerification = async (
    googleEmail: string
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid Google account email address.' };
    }

    // Simulate verification delay
    await new Promise(r => setTimeout(r, 700));

    // In Firebase:
    // await sendPasswordResetEmail(auth, cleanEmail);
    return {
      success: true,
      message: `Google account ${cleanEmail} verified! You can now set your new password.`,
    };
  };

  // Reset Password with confirmed new password
  const resetPassword = async (newPassword: string): Promise<{ success: boolean; message?: string }> => {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long.' };
    }

    await new Promise(r => setTimeout(r, 500));

    // Update locally stored password for current user if applicable
    if (currentUser?.email) {
      const mockUsers: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
      const user = mockUsers.find(u => u.email?.toLowerCase() === currentUser.email.toLowerCase());
      if (user) {
        user.password = newPassword;
        localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(mockUsers));
      }
    }

    return { success: true };
  };

  // Select subscription plan
  const selectPlan = (planId: string) => {
    const found = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (found) {
      setSelectedPlan(found);
    }
  };

  // Razorpay Checkout placeholder handlers
  const openRazorpayModal = () => setIsRazorpayModalOpen(true);
  const closeRazorpayModal = () => setIsRazorpayModalOpen(false);

  const completeSubscriptionPaymentMock = async () => {
    await new Promise(r => setTimeout(r, 600));
    setIsRazorpayModalOpen(false);
  };

  // Update onboarding form fields in progress
  const updateRestaurantDraft = (fields: Partial<RestaurantOnboardingData>) => {
    setRestaurantDraft(prev => ({ ...prev, ...fields }));
  };

  // Submit complete restaurant onboarding
  const submitRestaurantOnboarding = async (
    formData: RestaurantOnboardingData
  ): Promise<{ success: boolean; message?: string; restaurant?: any }> => {
    try {
      // 1. Try registering with the backend so live dashboard data works out-of-the-box
      const cleanUsername = currentUser?.username || formData.ownerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const cleanPin = '1234'; // Default PIN for manager dashboard tablet quick-unlock

      let backendResult: any = null;
      try {
        backendResult = await api.register({
          restaurantName: formData.restaurantName.trim(),
          ownerName: formData.ownerName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          restaurantType: formData.restaurantType,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          tableCount: 8,
          username: cleanUsername,
          pin: cleanPin,
        });

        if (backendResult?.success) {
          localStorage.setItem('swaad_token', backendResult.token);
          if (backendResult.restaurant) {
            localStorage.setItem('swaad_restaurant', JSON.stringify(backendResult.restaurant));
          }
          if (backendResult.manager) {
            localStorage.setItem('swaad_manager', JSON.stringify(backendResult.manager));
          }
        }
      } catch (err: any) {
        console.warn('Backend live register notice, storing in local session:', err?.message || err);
      }

      // 2. Prepare client-side restaurant record
      const fullRestaurant = {
        id: backendResult?.restaurant?.id || `rest_${Date.now()}`,
        slug: backendResult?.restaurant?.slug || formData.restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: formData.restaurantName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        restaurantType: formData.restaurantType,
        category: formData.category,
        description: formData.description,
        gstNumber: formData.gstNumber,
        fssaiNumber: formData.fssaiNumber,
        logoUrl: formData.logoUrl,
        coverImageUrl: formData.coverImageUrl,
        subscriptionPlan: selectedPlan,
      };

      // Ensure local storage has restaurant session
      if (!localStorage.getItem('swaad_restaurant')) {
        localStorage.setItem('swaad_restaurant', JSON.stringify(fullRestaurant));
      }
      if (!localStorage.getItem('swaad_token')) {
        localStorage.setItem('swaad_token', `swaad_mock_token_${Date.now()}`);
      }
      if (!localStorage.getItem('swaad_manager')) {
        localStorage.setItem(
          'swaad_manager',
          JSON.stringify({
            id: currentUser?.uid || `mgr_${Date.now()}`,
            username: cleanUsername,
            role: 'OWNER',
          })
        );
      }

      // Clear draft
      localStorage.removeItem(STORAGE_KEYS.DRAFT);
      setRestaurantDraft({});

      return {
        success: true,
        restaurant: fullRestaurant,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to complete restaurant registration.',
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem('swaad_token');
    localStorage.removeItem('swaad_restaurant');
    localStorage.removeItem('swaad_manager');
  };

  return (
    <AuthOnboardingContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isRegisteredWithGoogle: !!currentUser?.email && currentUser?.provider === 'google',
        selectedPlan,
        restaurantDraft,
        loginWithCredentials,
        loginWithGoogleMock,
        checkUsernameAvailability,
        createAccountWithUsernameAndPassword,
        sendForgotPasswordVerification,
        resetPassword,
        selectPlan,
        openRazorpayModal,
        closeRazorpayModal,
        isRazorpayModalOpen,
        completeSubscriptionPaymentMock,
        updateRestaurantDraft,
        submitRestaurantOnboarding,
        logout,
      }}
    >
      {children}
    </AuthOnboardingContext.Provider>
  );
};

export const useAuthOnboarding = () => {
  const context = useContext(AuthOnboardingContext);
  if (!context) {
    throw new Error('useAuthOnboarding must be used within an AuthOnboardingProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';
import apiClient from '../api/apiClient';
import paymentApi from '../api/paymentApi';
import SHRAWAN_PROFILE_IMAGE_URI from '../constants/shrawanProfileImage';

const AuthContext = createContext(null);

export const loadRazorpayScript = () => {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existing) {
      existing.onload = () => resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const SHRAWAN_PLUS_DEMO_USER = {
  id: 'user_shrawan_plus',
  name: 'Shrawan Kr Yadav',
  fullName: 'Shrawan Kr Yadav',
  email: 'shrawan.yadav@skydevx.com',
  subscriptionTier: 'PLUS',
  subscriptionPlan: 'PLUS',
  profileImageUrl: SHRAWAN_PROFILE_IMAGE_URI,
  isEmailVerified: true,
  role: 'LEAD_SOFTWARE_ARCHITECT',
  isDemoMode: true,
};

/**
 * Normalizes user object across login, register, verify, and session restore
 */
export const formatUserProfile = (raw, fallbackName = '', fallbackEmail = '') => {
  if (!raw) return null;
  const data = raw.data || raw;
  const name = data.name || data.fullName || fallbackName || 'Candidate';
  const email = data.email || fallbackEmail || '';
  const tier = (data.subscriptionPlan || data.subscriptionTier || 'FREE').toUpperCase();
  const profileImageUrl = data.profileImageUrl || data.imageUrl || null;
  const isEmailVerified = data.emailVerified !== false && data.isEmailVerified !== false;

  return {
    id: data.id || data._id || null,
    name: name,
    fullName: name,
    email: email,
    profileImageUrl: profileImageUrl,
    subscriptionTier: tier,
    subscriptionPlan: tier,
    isEmailVerified: isEmailVerified,
    role: data.role || 'USER',
    isDemoMode: !!data.isDemoMode,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await apiClient.getToken();
        if (storedToken && storedToken !== 'mock_shrawan_plus_jwt_token') {
          setToken(storedToken);
          try {
            const profile = await authApi.getProfile();
            const pData = profile?.data || profile;
            if (pData?.id || pData?.email) {
              setUser(formatUserProfile(pData));
            }
          } catch (profileErr) {
            console.warn('[AuthContext] Session expired or invalid:', profileErr.message);
            await apiClient.setToken(null);
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Init error:', err);
      }
    };
    initAuth();
  }, []);

  // Standard Login
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      const authData = res?.data || res;
      if (authData?.token) {
        await apiClient.setToken(authData.token);
        setToken(authData.token);
      }
      const userProfile = formatUserProfile(authData, '', email);
      setUser(userProfile);
      return { success: true, data: userProfile };
    } catch (err) {
      const msg = err.message || 'Login failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Registration with Email Verification Trigger
  const register = async (fullName, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.register({ name: fullName, fullName, email, password });
      const authData = res?.data || res;
      const userProfile = formatUserProfile(authData, fullName, email);

      if (authData?.token) {
        await apiClient.setToken(authData.token);
        setToken(authData.token);
      }

      // If the account is already verified or verification is disabled, sign in directly
      if (userProfile.isEmailVerified) {
        setUser(userProfile);
        setPendingVerificationEmail(null);
        return { success: true, data: userProfile, requireVerification: false };
      }

      // Store initial user state with full registered details
      setUser(userProfile);
      setPendingVerificationEmail(email);
      return { success: true, data: userProfile, requireVerification: true };
    } catch (err) {
      const msg = err.message || 'Registration failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Email with 6-digit Code / Token
  const verifyEmail = async (email, code) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.verifyEmail({ email, code });
      const authData = res?.data || res;
      if (authData?.token) {
        await apiClient.setToken(authData.token);
        setToken(authData.token);
      }
      const userProfile = formatUserProfile(authData, user?.name || '', email);
      userProfile.isEmailVerified = true;
      setUser(userProfile);
      setPendingVerificationEmail(null);
      return { success: true, data: userProfile };
    } catch (err) {
      const msg = err.message || 'Email verification failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification email
  const resendVerification = async (email) => {
    try {
      return await authApi.resendVerification(email);
    } catch (err) {
      throw err;
    }
  };

  // Upload Profile Avatar Photo
  const uploadAvatar = async (formDataOrFile) => {
    setIsLoading(true);
    setError(null);
    try {
      let formData;
      if (formDataOrFile instanceof FormData) {
        formData = formDataOrFile;
      } else {
        formData = new FormData();
        formData.append('file', formDataOrFile);
      }

      const res = await authApi.uploadProfileImage(formData);
      const imageUrl = res?.imageUrl || (res?.data && res?.data?.imageUrl);

      if (imageUrl) {
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            profileImageUrl: imageUrl,
          };
        });
      }
      return { success: true, imageUrl, message: res?.message || 'Avatar photo updated successfully' };
    } catch (err) {
      const msg = err.message || 'Failed to upload profile picture';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Razorpay Upgrade to PLUS
  const upgradeToPlus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (typeof window !== 'undefined') {
        await loadRazorpayScript();
      }

      const orderRes = await paymentApi.createOrder('PLUS');
      const order = orderRes?.data || orderRes;
      const orderId = order.orderId;
      const amount = order.amount || 49900;
      const currency = order.currency || 'INR';
      const keyId = order.keyId || 'rzp_test_TIY8F95ZYQV2PN';

      if (typeof window !== 'undefined' && window.Razorpay) {
        return new Promise((resolve) => {
          const rzpOptions = {
            key: keyId,
            amount: amount,
            currency: currency,
            name: 'Resume Genie',
            description: 'PLUS Lifetime Upgrade',
            order_id: orderId,
            prefill: {
              name: user?.name || user?.fullName || '',
              email: user?.email || '',
            },
            theme: { color: '#F59E0B' },
            handler: async (response) => {
              try {
                await paymentApi.verifyPayment(
                  response.razorpay_order_id,
                  response.razorpay_payment_id,
                  response.razorpay_signature
                );
                const p = await authApi.getProfile();
                const freshUser = formatUserProfile(p);
                setUser(freshUser);
                resolve({ success: true, message: 'Upgraded to PLUS successfully!' });
              } catch (verErr) {
                resolve({ success: false, error: verErr.message || 'Signature verification failed' });
              }
            },
            modal: {
              ondismiss: () => {
                resolve({ success: false, error: 'Payment cancelled' });
              },
            },
          };
          const rzpInstance = new window.Razorpay(rzpOptions);
          rzpInstance.open();
        });
      } else {
        // Test simulation verification for native mobile / non-browser environments
        await paymentApi.verifyPayment(
          orderId,
          'pay_test_' + Date.now(),
          'test_signature'
        );
        const p = await authApi.getProfile();
        const freshUser = formatUserProfile(p);
        setUser(freshUser);
        return { success: true, message: 'Upgraded to PLUS successfully (Test Mode)!' };
      }
    } catch (err) {
      const msg = err.message || 'Payment initiation failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Instant Reset to Shrawan Kr Yadav PLUS Demo Profile (Accessible to anyone anytime)
  const loginAsDemo = async () => {
    setUser(SHRAWAN_PLUS_DEMO_USER);
    setToken('mock_shrawan_plus_jwt_token');
    await apiClient.setToken('mock_shrawan_plus_jwt_token');
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('[AuthContext] Logout warning:', e);
    } finally {
      await apiClient.setToken(null);
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        pendingVerificationEmail,
        setPendingVerificationEmail,
        login,
        register,
        verifyEmail,
        resendVerification,
        uploadAvatar,
        upgradeToPlus,
        logout,
        loginAsDemo,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import authApi from '../api/authApi';
import apiClient from '../api/apiClient';
import paymentApi from '../api/paymentApi';
import storage from '../utils/storage';
import SHRAWAN_PROFILE_IMAGE_URI from '../constants/shrawanProfileImage';
import RazorpayModal from '../components/RazorpayModal';

const AuthContext = createContext(null);

export const loadRazorpayScript = () => {
  if (Platform.OS !== 'web') return Promise.resolve(false);
  if (typeof document === 'undefined') return Promise.resolve(false);
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    try {
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
    } catch (_) {
      resolve(false);
    }
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
  const [razorpayModalState, setRazorpayModalState] = useState({
    visible: false,
    orderData: null,
    resolve: null,
  });

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
              const formatted = formatUserProfile(pData);
              const userKey = formatted.id || formatted.email;
              if (!formatted.profileImageUrl && userKey) {
                const cached = await storage.getItem(`user_avatar_${userKey}`);
                if (cached) {
                  formatted.profileImageUrl = cached;
                }
              } else if (formatted.profileImageUrl && userKey) {
                await storage.setItem(`user_avatar_${userKey}`, formatted.profileImageUrl);
              }
              setUser(formatted);
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
      const userProfile = formatUserProfile(authData, '', email);

      if (!userProfile.isEmailVerified) {
        setUser(null);
        setPendingVerificationEmail(email);
        return { success: false, requireVerification: true, error: 'Please enter your 6-digit verification code.' };
      }

      const userKey = userProfile.id || userProfile.email;
      if (!userProfile.profileImageUrl && userKey) {
        const cached = await storage.getItem(`user_avatar_${userKey}`);
        if (cached) {
          userProfile.profileImageUrl = cached;
        }
      } else if (userProfile.profileImageUrl && userKey) {
        await storage.setItem(`user_avatar_${userKey}`, userProfile.profileImageUrl);
      }

      if (authData?.token) {
        await apiClient.setToken(authData.token);
        setToken(authData.token);
      }
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

      // Never auto-login immediately on registration: enforce 6-digit verification step
      setUser(null);
      setPendingVerificationEmail(email);

      return {
        success: true,
        data: userProfile,
        requireVerification: true,
        verificationCode: authData?.verificationCode || null,
      };
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
      let rawBase64 = null;
      let rawUri = null;

      if (formDataOrFile && formDataOrFile.uri) {
        rawUri = formDataOrFile.uri;
        if (formDataOrFile.base64) {
          rawBase64 = `data:${formDataOrFile.type || 'image/jpeg'};base64,${formDataOrFile.base64}`;
        }
      }

      let imageUrl = null;

      // 1. First priority: Upload base64 directly to Cloudinary endpoint (fastest & most reliable on Android)
      if (rawBase64) {
        try {
          const base64Res = await authApi.uploadAvatarBase64(rawBase64);
          imageUrl = base64Res?.imageUrl || (base64Res?.data && base64Res?.data?.imageUrl);
          if (imageUrl && !imageUrl.startsWith('data:')) {
            console.log('[uploadAvatar] Direct Cloudinary Base64 upload successful:', imageUrl);
          }
        } catch (base64Err) {
          console.warn('[uploadAvatar] Direct Base64 upload warning, trying multipart:', base64Err?.message);
        }
      }

      // 2. Second priority: Multipart form-data upload
      if (!imageUrl || imageUrl.startsWith('data:')) {
        try {
          let formData = new FormData();
          if (formDataOrFile instanceof FormData) {
            formData = formDataOrFile;
          } else if (rawUri) {
            formData.append('file', {
              uri: rawUri,
              name: formDataOrFile.name || 'avatar.jpg',
              type: formDataOrFile.type || 'image/jpeg',
            });
          } else {
            formData.append('file', formDataOrFile);
          }

          const res = await authApi.uploadProfileImage(formData);
          imageUrl = res?.imageUrl || (res?.data && res?.data?.imageUrl);
          if (imageUrl && !imageUrl.startsWith('data:')) {
            console.log('[uploadAvatar] Multipart Cloudinary upload successful:', imageUrl);
          }
        } catch (uploadErr) {
          console.warn('[uploadAvatar] Multipart upload warning:', uploadErr?.message);
        }
      }

      // 3. Third priority: updateProfile with Base64 fallback (Backend uploads to Cloudinary automatically)
      if ((!imageUrl || imageUrl.startsWith('data:')) && rawBase64) {
        try {
          const updateRes = await authApi.updateProfile({ profileImageUrl: rawBase64 });
          const savedData = updateRes?.data || updateRes;
          if (savedData?.profileImageUrl) {
            imageUrl = savedData.profileImageUrl;
          }
        } catch (dbErr) {
          console.warn('[uploadAvatar] updateProfile fallback warning:', dbErr?.message);
        }
      }

      // 4. Final local display fallback if offline
      if (!imageUrl && rawUri) {
        imageUrl = rawUri;
      }

      if (imageUrl) {
        // Cache locally for instant offline loading
        const userKey = user?.id || user?.email;
        if (userKey) {
          await storage.setItem(`user_avatar_${userKey}`, imageUrl);
        }

        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            profileImageUrl: imageUrl,
          };
        });
        return { success: true, imageUrl, message: 'Profile photo updated successfully!' };
      }

      return { success: false, error: 'Could not upload photo. Please check your internet connection.' };
    } catch (err) {
      const msg = err.message || 'Failed to upload profile picture';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };
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
      if (Platform.OS === 'web') {
        await loadRazorpayScript();
      }

      const orderRes = await paymentApi.createOrder('PLUS');
      const order = orderRes?.data || orderRes;
      const orderId = order.orderId;
      const amount = order.amount || 49900;
      const currency = order.currency || 'INR';
      const keyId = order.keyId || 'rzp_test_TIY8F95ZYQV2PN';

      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.Razorpay) {
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
        // Native mobile / non-browser: Open authentic interactive Razorpay Test Modal!
        return new Promise((resolve) => {
          setRazorpayModalState({
            visible: true,
            orderData: { orderId, amount, currency, keyId },
            resolve,
          });
        });
      }
    } catch (err) {
      const msg = err.message || 'Payment initiation failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSuccess = async (rzpPayload) => {
    try {
      await paymentApi.verifyPayment(
        rzpPayload.razorpay_order_id,
        rzpPayload.razorpay_payment_id,
        rzpPayload.razorpay_signature
      );
      const p = await authApi.getProfile();
      const freshUser = formatUserProfile(p);
      setUser(freshUser);
      const resFn = razorpayModalState.resolve;
      setRazorpayModalState({ visible: false, orderData: null, resolve: null });
      if (resFn) {
        resFn({ success: true, message: 'Payment verified! Account upgraded to PLUS.' });
      }
    } catch (err) {
      const resFn = razorpayModalState.resolve;
      setRazorpayModalState({ visible: false, orderData: null, resolve: null });
      if (resFn) {
        resFn({ success: false, error: err.message || 'Payment verification failed' });
      }
    }
  };

  const handleModalDismiss = () => {
    const resFn = razorpayModalState.resolve;
    setRazorpayModalState({ visible: false, orderData: null, resolve: null });
    if (resFn) {
      resFn({ success: false, error: 'Payment cancelled' });
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
      <RazorpayModal
        visible={razorpayModalState.visible}
        orderData={razorpayModalState.orderData}
        onSuccess={handleModalSuccess}
        onDismiss={handleModalDismiss}
      />
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

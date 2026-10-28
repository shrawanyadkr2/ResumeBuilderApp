import { Platform } from 'react-native';

/**
 * Resume Genie - Centralized Environment Configuration
 * Supports web browsers, Android emulators (10.0.2.2), physical Android devices (LAN IP),
 * and production deployment.
 */

// Production base URL when deployed
const LIVE_RENDER_URL = 'https://resumebuilderapp-jux7.onrender.com';
const PROD_API_URL = process.env.EXPO_PUBLIC_API_URL || LIVE_RENDER_URL;

// Development URL resolver based on platform
const getDevApiUrl = () => {
  const configured = process.env.EXPO_PUBLIC_API_URL;
  // If explicitly configured with an IP or domain, use it
  if (configured) {
    return configured;
  }

  // Connect directly to live Render backend by default
  return LIVE_RENDER_URL;
};

const isProd = process.env.NODE_ENV === 'production';

export const ENV = {
  isProduction: isProd,
  apiUrl: process.env.EXPO_PUBLIC_API_URL || LIVE_RENDER_URL,
  appName: 'Resume Genie',
  appVersion: '1.0.0',
  creator: 'sky.devX',
  defaultTimeoutMs: 25000,
  razorpayKeyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TIY8F95ZYQV2PN',
};

export default ENV;

import { Platform } from 'react-native';

/**
 * Resume Genie - Centralized Environment Configuration
 * Supports web browsers, Android emulators (10.0.2.2), physical Android devices (LAN IP),
 * and production deployment.
 */

// Production base URL when deployed
const LIVE_RENDER_URL = 'https://resumebuilderapp-jux7.onrender.com';

// Always resolve to the live Render cloud backend unless explicitly overridden with another remote URL
const resolveApiUrl = () => {
  const configured = process.env.EXPO_PUBLIC_API_URL;
  if (configured && !configured.includes('localhost') && !configured.includes('127.0.0.1')) {
    return configured;
  }
  return LIVE_RENDER_URL;
};

const isProd = process.env.NODE_ENV === 'production';
const activeApiUrl = resolveApiUrl();

console.log('[ENV] Active Backend API URL:', activeApiUrl);

export const ENV = {
  isProduction: isProd,
  apiUrl: activeApiUrl,
  appName: 'Resume Genie',
  appVersion: '1.0.0',
  creator: 'sky.devX',
  defaultTimeoutMs: 60000,
  razorpayKeyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TIY8F95ZYQV2PN',
};

export default ENV;

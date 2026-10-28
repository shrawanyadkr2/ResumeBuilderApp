import { Platform } from 'react-native';

/**
 * Resume Genie - Centralized Environment Configuration
 * Supports web browsers, Android emulators (10.0.2.2), physical Android devices (LAN IP),
 * and production deployment.
 */

// Production base URL when deployed
const PROD_API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://resume-genie-backend.onrender.com';

// Development URL resolver based on platform
const getDevApiUrl = () => {
  const configured = process.env.EXPO_PUBLIC_API_URL;
  // If explicitly configured with an IP or domain, use it
  if (configured && !configured.includes('localhost') && !configured.includes('127.0.0.1')) {
    return configured;
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }
  
  // On physical Android or iOS device running Expo Go, connect to the dev machine's Wi-Fi LAN IP
  return 'http://192.168.1.7:8080';
};

const isProd = process.env.NODE_ENV === 'production';

export const ENV = {
  isProduction: isProd,
  apiUrl: isProd ? PROD_API_URL : (process.env.EXPO_PUBLIC_API_URL || getDevApiUrl()),
  appName: 'Resume Genie',
  appVersion: '1.0.0',
  creator: 'sky.devX',
  defaultTimeoutMs: 15000,
  razorpayKeyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TIY8F95ZYQV2PN',
};

export default ENV;

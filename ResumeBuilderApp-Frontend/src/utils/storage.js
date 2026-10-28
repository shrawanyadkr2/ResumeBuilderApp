import { Platform } from 'react-native';

/**
 * Universal multiplatform storage
 * Web uses window.localStorage, Native uses safe memory storage / secure store
 */
const memoryStorage = new Map();

export const storage = {
  async getItem(key) {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage.get(key) || null;
    } catch (e) {
      console.warn('[Storage] getItem failed for key:', key, e);
      return memoryStorage.get(key) || null;
    }
  },

  async setItem(key, value) {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      memoryStorage.set(key, value);
    } catch (e) {
      console.warn('[Storage] setItem failed for key:', key, e);
      memoryStorage.set(key, value);
    }
  },

  async removeItem(key) {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      memoryStorage.delete(key);
    } catch (e) {
      console.warn('[Storage] removeItem failed for key:', key, e);
      memoryStorage.delete(key);
    }
  },

  async clear() {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
      memoryStorage.clear();
    } catch (e) {
      console.warn('[Storage] clear failed:', e);
      memoryStorage.clear();
    }
  },
};

export default storage;

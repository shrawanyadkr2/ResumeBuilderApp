import ENV from '../config/env';
import storage from '../utils/storage';

const TOKEN_KEY = 'resume_genie_auth_token';

/**
 * Standard HTTP Client for Resume Genie
 * Handles Authorization headers, error extraction, timeouts, and JSON parsing.
 */
class ApiClient {
  constructor() {
    this.baseUrl = ENV.apiUrl;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
  }

  async getHeaders(customHeaders = {}) {
    const token = await storage.getItem(TOKEN_KEY);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers = await this.getHeaders(options.headers);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ENV.defaultTimeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const contentType = response.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        let errorMsg = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
        if (data?.errors && typeof data.errors === 'object') {
          const firstDetail = Object.values(data.errors)[0];
          if (firstDetail && typeof firstDetail === 'string') {
            errorMsg = firstDetail;
          }
        }
        const error = new Error(errorMsg);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      clearTimeout(timeout);
      const isAbort = err.name === 'AbortError' ||
                      err.message?.toLowerCase().includes('cancel') ||
                      err.message?.toLowerCase().includes('abort');
      if (isAbort) {
        const timeoutError = new Error('Server was waking up from sleep. Please tap once more to continue.');
        timeoutError.status = 408;
        throw timeoutError;
      }
      throw err;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async upload(endpoint, formData, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const token = await storage.getItem(TOKEN_KEY);
    const headers = {
      'Accept': 'application/json',
      ...(options.headers || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const contentType = response.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorMsg = data?.message || data?.error || `Upload failed (${response.status})`;
        const error = new Error(errorMsg);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        const timeoutError = new Error('Upload timed out. Please check your connection.');
        timeoutError.status = 408;
        throw timeoutError;
      }
      throw err;
    }
  }

  async setToken(token) {
    if (token) {
      await storage.setItem(TOKEN_KEY, token);
    } else {
      await storage.removeItem(TOKEN_KEY);
    }
  }

  async getToken() {
    return storage.getItem(TOKEN_KEY);
  }
}

export const apiClient = new ApiClient();
export default apiClient;

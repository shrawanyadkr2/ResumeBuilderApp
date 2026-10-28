import apiClient from './apiClient';

export const authApi = {
  async register(data) {
    const name = data.name || data.fullName || '';
    const res = await apiClient.post('/api/auth/register', {
      name,
      fullName: name,
      email: data.email?.trim(),
      password: data.password,
    });
    const authData = res?.data || res;
    if (authData?.token) {
      await apiClient.setToken(authData.token);
    }
    return authData;
  },

  async login(data) {
    // data: { email, password }
    const res = await apiClient.post('/api/auth/login', {
      email: data.email?.trim(),
      password: data.password,
    });
    const authData = res?.data || res;
    if (authData?.token) {
      await apiClient.setToken(authData.token);
    }
    return authData;
  },

  async verifyEmail(data) {
    // data: { email, code, token }
    const code = data.code || data.token || '';
    const res = await apiClient.post('/api/auth/verify-email', {
      email: data.email?.trim(),
      code,
      token: code,
    });
    const authData = res?.data || res;
    if (authData?.token) {
      await apiClient.setToken(authData.token);
    }
    return authData;
  },

  async resendVerification(email) {
    return apiClient.post('/api/auth/resend-verification', { email });
  },

  async forgotPassword(email) {
    return apiClient.post('/api/auth/forgot-password', { email });
  },

  async resetPassword(data) {
    // data: { token, newPassword }
    return apiClient.post('/api/auth/reset-password', data);
  },

  async getProfile() {
    const res = await apiClient.get('/api/auth/profile');
    return res?.data || res;
  },

  async updateProfile(data) {
    const res = await apiClient.put('/api/auth/profile', data);
    return res?.data || res;
  },

  async uploadProfileImage(formData) {
    const res = await apiClient.upload('/api/auth/upload-image', formData);
    return res?.data || res;
  },

  async logout() {
    await apiClient.setToken(null);
  },
};

export default authApi;

import apiClient from './apiClient';

export const templateApi = {
  async getTemplates() {
    return apiClient.get('/api/templates');
  },

  async getTemplateById(id) {
    return apiClient.get(`/api/templates/${id}`);
  },

  async getEntitlements() {
    return apiClient.get('/api/users/entitlements');
  },
};

export const paymentApi = {
  async createOrder(plan = 'PLUS') {
    return apiClient.post('/api/payments/order', { plan });
  },

  async verifyPayment(paymentDetails) {
    // paymentDetails: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
    return apiClient.post('/api/payments/verify', paymentDetails);
  },

  async getPaymentHistory() {
    return apiClient.get('/api/payments/history');
  },
};

export default { templateApi, paymentApi };

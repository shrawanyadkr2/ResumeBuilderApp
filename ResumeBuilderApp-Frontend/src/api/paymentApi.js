import apiClient from './apiClient';

export const paymentApi = {
  /**
   * Create Razorpay payment order for Plus plan upgrade
   * @param {string} planType 'PLUS'
   */
  async createOrder(planType = 'PLUS') {
    return apiClient.post('/api/payment/create-order', { planType });
  },

  /**
   * Verify Razorpay cryptographic signature server-side
   * @param {string} orderId
   * @param {string} paymentId
   * @param {string} signature
   */
  async verifyPayment(orderId, paymentId, signature) {
    return apiClient.post('/api/payment/verify', {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    });
  },

  /**
   * Retrieve transaction history from MongoDB
   */
  async getPaymentHistory() {
    return apiClient.get('/api/payment/history');
  },
};

export default paymentApi;

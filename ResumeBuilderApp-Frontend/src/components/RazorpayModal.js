import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';

export const RazorpayModal = ({
  visible,
  orderData,
  onSuccess,
  onDismiss,
}) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!visible) return null;

  const amountDisplay = orderData?.amount ? (orderData.amount / 100).toFixed(2) : '499.00';
  const orderId = orderData?.orderId || 'order_test_demo';

  const handlePaySuccess = async () => {
    setIsProcessing(true);
    try {
      await onSuccess({
        razorpay_order_id: orderId,
        razorpay_payment_id: 'pay_test_' + Date.now(),
        razorpay_signature: 'test_signature',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Razorpay Brand Header */}
          <View style={styles.rzpHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>R</Text>
              </View>
              <View>
                <Text style={styles.brandTitle}>Razorpay</Text>
                <Text style={styles.merchantTitle}>Resume Genie by sky.devX</Text>
              </View>
            </View>
            <View style={styles.testModeBadge}>
              <Text style={styles.testModeText}>TEST MODE</Text>
            </View>
          </View>

          {/* Amount & Order Summary */}
          <View style={styles.orderSummary}>
            <View>
              <Text style={styles.planName}>Lifetime PLUS Plan</Text>
              <Text style={styles.orderIdText}>Order: {orderId.substring(0, 18)}...</Text>
            </View>
            <Text style={styles.amountText}>₹{amountDisplay}</Text>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Payment Methods */}
            <Text style={styles.sectionTitle}>SELECT PAYMENT METHOD (TEST)</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.methodCard, selectedMethod === 'card' && styles.methodCardActive]}
              onPress={() => setSelectedMethod('card')}
            >
              <Text style={styles.methodIcon}>💳</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodName}>Cards (Visa, Mastercard, RuPay)</Text>
                <Text style={styles.methodSub}>Test card: 4111 •••• •••• 1111</Text>
              </View>
              <View style={[styles.radio, selectedMethod === 'card' && styles.radioActive]} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.methodCard, selectedMethod === 'upi' && styles.methodCardActive]}
              onPress={() => setSelectedMethod('upi')}
            >
              <Text style={styles.methodIcon}>📱</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodName}>UPI / QR (Google Pay, PhonePe)</Text>
                <Text style={styles.methodSub}>Test UPI: success@razorpay</Text>
              </View>
              <View style={[styles.radio, selectedMethod === 'upi' && styles.radioActive]} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.methodCard, selectedMethod === 'netbanking' && styles.methodCardActive]}
              onPress={() => setSelectedMethod('netbanking')}
            >
              <Text style={styles.methodIcon}>🏦</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodName}>Netbanking</Text>
                <Text style={styles.methodSub}>HDFC, ICICI, SBI (Test Simulation)</Text>
              </View>
              <View style={[styles.radio, selectedMethod === 'netbanking' && styles.radioActive]} />
            </TouchableOpacity>

            {/* Test Simulation Notice */}
            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>
                💡 Razorpay Test Environment: No real money will be charged. Tap the button below to verify instant upgrade.
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionFooter}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.payButton}
              onPress={handlePaySuccess}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.payButtonText}>Pay ₹{amountDisplay} (Test Success)</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.cancelButton}
              onPress={onDismiss}
              disabled={isProcessing}
            >
              <Text style={styles.cancelButtonText}>Cancel & Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RazorpayModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  rzpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0A2540',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 22,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  merchantTitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  testModeBadge: {
    backgroundColor: '#F59E0B25',
    borderColor: '#F59E0B',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  testModeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '800',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  planName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  orderIdText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  amountText: {
    color: '#10B981',
    fontSize: 22,
    fontWeight: '800',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#334155',
    gap: 12,
  },
  methodCardActive: {
    borderColor: '#0066FF',
    backgroundColor: '#1E293B',
  },
  methodIcon: {
    fontSize: 22,
  },
  methodName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  methodSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#64748B',
  },
  radioActive: {
    borderColor: '#0066FF',
    backgroundColor: '#0066FF',
  },
  noticeBox: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  noticeText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  actionFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  payButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
});

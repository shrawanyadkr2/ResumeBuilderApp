import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import typography from '../theme/typography';
import Header from '../components/Header';
import Button from '../components/Button';
import GoldenButton from '../components/GoldenButton';
import { useAuth } from '../context/AuthContext';
import PlusCrownAvatar from '../components/PlusCrownAvatar';
import paymentApi from '../api/paymentApi';
import { SparklesIcon, CheckIcon } from '../components/Icons';

export const ProfileScreen = ({ onBack, onLogout }) => {
  const { colors: themeColors, isDark } = useTheme();
  const { user, logout, uploadAvatar, upgradeToPlus } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await paymentApi.getPaymentHistory();
        const list = Array.isArray(res) ? res : (res?.data || []);
        setPaymentHistory(list);
      } catch (e) {
        console.warn('Payment history fetch warning:', e.message);
      }
    };
    if (user && !user.isDemoMode) {
      fetchHistory();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    if (onLogout) onLogout();
  };

  const handlePhotoUpload = async (file) => {
    setUploading(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const res = await uploadAvatar(file);
      if (res.success) {
        setStatusMessage('Profile photo updated successfully!');
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setErrorMessage(res.error || 'Failed to upload photo.');
      }
    } catch (e) {
      setErrorMessage(e.message || 'Error uploading photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpgradePayment = async () => {
    setPaying(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const res = await upgradeToPlus();
      if (res.success) {
        setStatusMessage(res.message || 'Payment verified! Account upgraded to PLUS.');
        // Refresh payment history
        try {
          const freshHistory = await paymentApi.getPaymentHistory();
          setPaymentHistory(Array.isArray(freshHistory) ? freshHistory : (freshHistory?.data || []));
        } catch (_) {}
      } else {
        setErrorMessage(res.error || 'Payment could not be completed.');
      }
    } catch (e) {
      setErrorMessage(e.message || 'Payment error.');
    } finally {
      setPaying(false);
    }
  };

  const displayName = user?.name || user?.fullName || 'Candidate';
  const displayEmail = user?.email || 'N/A';
  const isDemo = !!user?.isDemoMode;
  const isPlus = isDemo || user?.subscriptionTier === 'PLUS' || user?.subscriptionPlan === 'PLUS';

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title={isDemo ? 'Showcase Profile' : 'Candidate Account'}
        subtitle="Identity & Settings"
        onBack={onBack}
        showPreview={false}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card with Queen Crown Avatar */}
        <View style={[styles.avatarCard, { backgroundColor: themeColors.cardBg, borderColor: isPlus ? '#F59E0B60' : themeColors.ui.border }]}>
          <View style={styles.avatarHolder}>
            <PlusCrownAvatar
              size={100}
              imageUrl={user?.profileImageUrl}
              name={displayName}
              isPlus={isPlus}
              badgeText={isDemo ? 'PLUS LIFETIME' : (isPlus ? 'PLUS' : 'BASIC')}
              editable={true}
              isUploading={uploading}
              onUploadFile={handlePhotoUpload}
            />
          </View>

          <Text style={[styles.tapToChangeHint, { color: themeColors.text.muted }]}>
            Tap avatar or camera badge to upload photo (Cloudinary)
          </Text>

          {statusMessage && (
            <View style={styles.successBanner}>
              <CheckIcon size={14} color="#10B981" />
              <Text style={styles.successText}>{statusMessage}</Text>
            </View>
          )}

          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <Text style={[styles.fullName, { color: themeColors.text.primary }]}>{displayName}</Text>
          <Text style={[styles.email, { color: themeColors.text.secondary }]}>{displayEmail}</Text>

          <View style={[styles.tierPill, { backgroundColor: isPlus ? '#FEF3C7' : themeColors.primaryLight }]}>
            <SparklesIcon size={14} color={isPlus ? '#D97706' : themeColors.primary} />
            <Text style={[styles.tierText, { color: isPlus ? '#B45309' : themeColors.primary }]}>
              {isDemo ? 'PLUS LIFETIME ACCESS' : `MEMBERSHIP: ${user?.subscriptionTier || 'FREE'}`}
            </Text>
          </View>
        </View>

        {/* Razorpay Test Payment Card (If on FREE plan or to test payment) */}
        {!isPlus && !isDemo && (
          <View style={[styles.upgradeCard, { backgroundColor: '#181206', borderColor: '#F59E0B' }]}>
            <View style={styles.upgradeHeaderRow}>
              <SparklesIcon size={20} color="#F59E0B" />
              <Text style={styles.upgradeTitle}>Upgrade to PLUS Lifetime Plan</Text>
            </View>
            <Text style={styles.upgradeDesc}>
              Unlock all 7 ATS templates, Queen Crown badge, high-resolution vector PDFs, and direct email dispatch.
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceAmount}>₹499</Text>
              <Text style={styles.priceOneTime}>One-time payment (Razorpay Test Gateway)</Text>
            </View>

            {paying ? (
              <View style={styles.payingIndicator}>
                <ActivityIndicator color="#F59E0B" size="small" />
                <Text style={{ color: '#F59E0B', marginLeft: 8, fontWeight: '700' }}>
                  Processing Razorpay Payment...
                </Text>
              </View>
            ) : (
              <GoldenButton
                title="Pay ₹499 with Razorpay (Test Mode)"
                onPress={handleUpgradePayment}
                icon={<SparklesIcon size={16} color="#FFFFFF" />}
              />
            )}
          </View>
        )}

        {/* Account Details & Security */}
        <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.ui.border }]}>
          <Text style={[styles.sectionLabel, { color: themeColors.text.secondary }]}>ACCOUNT & SECURITY</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: themeColors.text.secondary }]}>Account Status</Text>
            <Text style={[styles.infoValue, { color: isDemo ? '#D97706' : '#10B981', fontWeight: '700' }]}>
              {isDemo ? 'Demo Showcase Mode' : 'Active Member'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: themeColors.text.secondary }]}>Email Verification</Text>
            <Text style={[styles.infoValue, { color: user?.isEmailVerified ? '#10B981' : '#F59E0B', fontWeight: '600' }]}>
              {user?.isEmailVerified ? 'Verified' : 'Pending Verification'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: themeColors.text.secondary }]}>Database Storage</Text>
            <Text style={[styles.infoValue, { color: themeColors.text.primary }]}>
              MongoDB Atlas (resumegenie)
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: themeColors.text.secondary }]}>Cloudinary Photos</Text>
            <Text style={[styles.infoValue, { color: themeColors.text.primary }]}>
              {user?.profileImageUrl ? 'Active Photo Connected' : 'Ready to Upload'}
            </Text>
          </View>
        </View>

        {/* Payment History from MongoDB (If any records) */}
        {paymentHistory.length > 0 && (
          <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.ui.border }]}>
            <Text style={[styles.sectionLabel, { color: themeColors.text.secondary }]}>
              PAYMENT TRANSACTIONS (MONGODB)
            </Text>

            {paymentHistory.map((pmt, idx) => (
              <View key={pmt.id || pmt._id || idx} style={styles.historyRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyOrder, { color: themeColors.text.primary }]}>
                    Order: {pmt.razorpayOrderId || pmt.id}
                  </Text>
                  <Text style={[styles.historyMeta, { color: themeColors.text.secondary }]}>
                    Plan: {pmt.planType || 'PLUS'} • ₹{((pmt.amount || 49900) / 100).toFixed(0)}
                  </Text>
                </View>
                <View style={[styles.statusPill, pmt.status === 'paid' ? styles.statusPaid : styles.statusCreated]}>
                  <Text style={[styles.statusPillText, pmt.status === 'paid' ? styles.statusPaidText : styles.statusCreatedText]}>
                    {(pmt.status || 'PAID').toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Button
          title={isDemo ? 'Exit Demo Showcase' : 'Sign Out'}
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  avatarCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: 16,
  },
  avatarHolder: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapToChangeHint: {
    ...typography.caption,
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  successText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '600',
  },
  fullName: {
    ...typography.h2,
    fontSize: 20,
    fontWeight: '800',
  },
  email: {
    ...typography.body,
    marginTop: 2,
    marginBottom: 12,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 6,
  },
  tierText: {
    ...typography.caption,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  upgradeCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 16,
  },
  upgradeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  upgradeTitle: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '800',
  },
  upgradeDesc: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 14,
  },
  priceAmount: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  priceOneTime: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  payingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  section: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    ...typography.caption,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
    fontSize: 11,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  infoLabel: {
    ...typography.body,
    fontSize: 13,
  },
  infoValue: {
    ...typography.body,
    fontSize: 13,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#334155',
  },
  historyOrder: {
    fontSize: 13,
    fontWeight: '700',
  },
  historyMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  statusPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusPaid: {
    backgroundColor: '#065F4620',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  statusPaidText: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 10,
  },
  statusCreated: {
    backgroundColor: '#F59E0B20',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  statusCreatedText: {
    color: '#F59E0B',
    fontWeight: '800',
    fontSize: 10,
  },
  logoutBtn: {
    marginTop: 10,
  },
});

export default ProfileScreen;

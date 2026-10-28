import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';
import Header from '../components/Header';
import Button from '../components/Button';
import { useResume } from '../context/ResumeContext';
import { useAuth } from '../context/AuthContext';
import { exportOrPrintPdf } from '../utils/pdfGenerator';
import { DownloadIcon, ShareIcon, SparklesIcon, CheckIcon } from '../components/Icons';

export const ExportScreen = ({ onBack, onGoHome }) => {
  const { currentResume } = useResume();
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setSuccessMsg(null);
    try {
      const result = await exportOrPrintPdf(currentResume);
      if (result && result.success) {
        setSuccessMsg(result.message || 'PDF created! Choose "Save to device" to download.');
      } else {
        setSuccessMsg(result?.message || 'Print dialog opened.');
      }
    } catch (err) {
      setSuccessMsg(err.message || 'Error generating PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setSuccessMsg('Shareable resume link copied to clipboard!');
    } else {
      setIsExporting(true);
      try {
        await exportOrPrintPdf(currentResume);
      } catch (_) {
        setSuccessMsg('Resume link prepared.');
      } finally {
        setIsExporting(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Download & Share"
        subtitle="Final Step"
        onBack={onBack}
        showPreview={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Banner */}
        <View style={styles.congratsCard}>
          <View style={styles.sparkleCircle}>
            <SparklesIcon size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.congratsTitle}>Your Resume Is Ready!</Text>
          <Text style={styles.congratsSubtitle}>
            Formatted according to modern ATS (Applicant Tracking System) standards for high interview callback rates.
          </Text>
        </View>

        {successMsg && (
          <View style={styles.msgBox}>
            <CheckIcon size={16} color={colors.status.success} />
            <Text style={styles.msgText}>{successMsg}</Text>
          </View>
        )}

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>EXPORT OPTIONS</Text>

          <Button
            title="Download PDF"
            onPress={handleDownloadPdf}
            variant="primary"
            size="large"
            loading={isExporting}
            icon={<DownloadIcon size={20} color="#FFFFFF" />}
            style={styles.mainExportBtn}
          />

          <Button
            title="Share Resume Link"
            onPress={handleShare}
            variant="outline"
            size="large"
            icon={<ShareIcon size={20} color={colors.primary} />}
            style={styles.shareBtn}
          />
        </View>

        {/* Pro Plan Card */}
        <View style={styles.proCard}>
          <View style={styles.proHeader}>
            <Text style={styles.proBadge}>PLUS TIER</Text>
            <Text style={styles.proTitle}>Unlock Unlimited Resumes</Text>
          </View>
          <Text style={styles.proText}>
            • 15+ Premium Typography Themes{'\n'}
            • AI-powered bullet point enhancer{'\n'}
            • Direct recruiter dispatch feature{'\n'}
            • Razorpay-secured subscription
          </Text>
          <Button
            title="Upgrade to Plus"
            variant="secondary"
            size="medium"
            style={styles.proBtn}
          />
        </View>

        {/* Return to Dashboard */}
        <Button
          title="Return to Dashboard"
          onPress={onGoHome}
          variant="ghost"
          style={styles.homeBtn}
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Resume Genie  •  ATS Export Engine</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
  },
  congratsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.ui.border,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  sparkleCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  congratsTitle: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  congratsSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  msgBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.status.successLight,
    borderWidth: 1,
    borderColor: colors.status.success,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  msgText: {
    ...typography.bodySmall,
    color: colors.status.success,
    fontWeight: '700',
    marginLeft: 8,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  mainExportBtn: {
    marginBottom: 12,
  },
  shareBtn: {
    marginBottom: 12,
  },
  proCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D4E2FF',
    padding: 20,
    marginBottom: 20,
  },
  proHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  proBadge: {
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  proTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontSize: 16,
  },
  proText: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 14,
  },
  proBtn: {
    width: '100%',
  },
  homeBtn: {
    marginTop: 4,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  footerText: {
    ...typography.caption,
    color: colors.text.muted,
  },
  brandingText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
  },
});

export default ExportScreen;

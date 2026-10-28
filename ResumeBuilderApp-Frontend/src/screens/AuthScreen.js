import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';
import InputField from '../components/InputField';
import Button from '../components/Button';
import GoldenButton from '../components/GoldenButton';
import PlusLifetimeBadge from '../components/PlusLifetimeBadge';
import { useAuth } from '../context/AuthContext';
import SkyDevXLogo from '../components/SkyDevXLogo';
import { CheckIcon, SparklesIcon, ArrowLeftIcon } from '../components/Icons';

export const AuthScreen = ({ onSuccess, onBackToSplash }) => {
  const {
    login,
    register,
    verifyEmail,
    resendVerification,
    loginAsDemo,
    isLoading,
    error,
    pendingVerificationEmail,
    setPendingVerificationEmail,
  } = useAuth();

  // Mode: 'login' | 'register' | 'verify'
  const [mode, setMode] = useState(pendingVerificationEmail ? 'verify' : 'login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(pendingVerificationEmail || '');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [localError, setLocalError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  // Handle Login or Register submit
  const handleSubmit = async () => {
    setLocalError(null);
    setInfoMessage(null);

    if (mode === 'verify') {
      if (!verificationCode.trim()) {
        setLocalError('Please enter the 6-digit verification code sent to your email.');
        return;
      }
      const res = await verifyEmail(email, verificationCode);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setLocalError(res.error);
      }
      return;
    }

    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in all required fields.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setLocalError('Full name is required to register.');
        return;
      }
      const res = await register(fullName, email, password);
      if (res.success) {
        setMode('verify');
        setInfoMessage(`A 6-digit verification code has been sent to ${email}. Please check your email inbox.`);
      } else {
        setLocalError(res.error);
      }
    } else {
      const res = await login(email, password);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else if (res.requireVerification) {
        setMode('verify');
        setInfoMessage('Please enter your 6-digit verification code to activate your account.');
      } else {
        setLocalError(res.error);
      }
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification(email);
      setInfoMessage(`New verification code resent to ${email}.`);
    } catch (e) {
      setLocalError(e.message || 'Could not resend email.');
    }
  };

  // Instant one-tap access to Shrawan Kr Yadav PLUS Demo
  const handleShrawanDemo = () => {
    loginAsDemo();
    if (onSuccess) onSuccess();
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardRoot}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Back Navigation */}
        {onBackToSplash && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackToSplash}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeftIcon size={18} color="#94A3B8" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        {/* Header */}
        <View style={styles.header}>
          <SkyDevXLogo size={38} showTagline={false} />
        <Text style={styles.title}>
          {mode === 'login'
            ? 'Sign In to Workspace'
            : mode === 'register'
            ? 'Create Your Account'
            : 'Verify Your Email'}
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'login'
            ? 'Access your ATS-optimized resumes and cloud exports.'
            : mode === 'register'
            ? 'Build recruiter-approved resumes with full export support.'
            : `Enter the code sent to ${email} to activate your account.`}
        </Text>
      </View>

      {/* Tabs (Sign In / Register / Verify) */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, mode === 'login' && styles.activeTab]}
          onPress={() => {
            setMode('login');
            setLocalError(null);
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, mode === 'register' && styles.activeTab]}
          onPress={() => {
            setMode('register');
            setLocalError(null);
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>
            Register
          </Text>
        </TouchableOpacity>

        {mode === 'verify' && (
          <TouchableOpacity
            style={[styles.tab, styles.activeTab]}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, styles.activeTabText]}>
              Verify
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Messages */}
      {infoMessage && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{infoMessage}</Text>
        </View>
      )}

      {(localError || error) && (
        <View style={styles.errorBox}>
          <Text style={styles.errorBannerText}>{localError || error}</Text>
        </View>
      )}

      {/* Form Fields */}
      <View style={styles.form}>
        {mode === 'register' && (
          <InputField
            label="Full Name *"
            placeholder="e.g. Shrawan Kr Yadav"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        )}

        {mode !== 'verify' && (
          <>
            <InputField
              label="Email Address *"
              placeholder="e.g. shrawan.yadav@skydevx.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              label="Password *"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </>
        )}

        {mode === 'verify' && (
          <>
            <InputField
              label="6-Digit Verification Code *"
              placeholder="123456"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
              <Text style={styles.resendText}>Didn't receive code? Resend Email</Text>
            </TouchableOpacity>
          </>
        )}

        <Button
          title={
            mode === 'login'
              ? 'Sign In to Workspace'
              : mode === 'register'
              ? 'Create Account & Send Verification'
              : 'Verify Code & Launch'
          }
          onPress={handleSubmit}
          loading={isLoading}
          size="large"
          style={styles.submitBtn}
        />

        {/* OR Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR TRY INSTANT DEMO</Text>
          <View style={styles.divider} />
        </View>

        {/* Shrawan Kr Yadav PLUS Profile Showcase Button */}
        <GoldenButton
          title="Open Shrawan Kr Yadav (PLUS Membership)"
          onPress={handleShrawanDemo}
          icon={<SparklesIcon size={16} color="#FFFFFF" />}
        />
        <Text style={styles.demoNoteText}>
          Instant demo access preloaded with Shrawan's full profile, 7 templates & Plus tier unlocked.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Resume Genie  •  ATS Resume Platform</Text>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardRoot: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#090D16',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 40,
    justifyContent: 'flex-start',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  infoBox: {
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#A7F3D0',
    fontWeight: '600',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#451A1A',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 12,
    color: '#FCA5A5',
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  resendBtn: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  resendText: {
    fontSize: 12,
    color: '#60A5FA',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  submitBtn: {
    marginTop: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#1F2937',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginHorizontal: 10,
    letterSpacing: 0.8,
  },
  demoNoteText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
});

export default AuthScreen;

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
    loginAsDemo,
    isLoading,
    error,
  } = useAuth();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  // Handle Login or Register submit
  const handleSubmit = async () => {
    setLocalError(null);

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
        if (onSuccess) onSuccess();
      } else {
        setLocalError(res.error);
      }
    } else {
      const res = await login(email, password);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setLocalError(res.error);
      }
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
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Header / Back Button */}
      <View style={styles.topBar}>
        {onBackToSplash && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBackToSplash}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeftIcon size={18} color="#94A3B8" />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <SkyDevXLogo size={36} />
        </View>

        <Text style={styles.title}>Resume Genie</Text>
        <Text style={styles.subtitle}>
          {mode === 'login'
            ? 'Sign in to access your resumes & AI tools'
            : 'Create your account to start building resumes'}
        </Text>
      </View>

      {/* Features Banner */}
      <View style={styles.featuresBanner}>
        <View style={styles.featureItem}>
          <CheckIcon size={14} color="#10B981" />
          <Text style={styles.featureText}>ATS-Compliant Resumes</Text>
        </View>
        <View style={styles.featureItem}>
          <CheckIcon size={14} color="#10B981" />
          <Text style={styles.featureText}>Instant PDF Vector Export</Text>
        </View>
        <View style={styles.featureItem}>
          <CheckIcon size={14} color="#10B981" />
          <Text style={styles.featureText}>Cloud Storage & Sync</Text>
        </View>
      </View>

      {/* Tabs */}
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
      </View>

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

        <Button
          title={mode === 'login' ? 'Sign In to Workspace' : 'Create Account & Launch'}
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
    flex: 1,
    backgroundColor: '#090D16',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  backBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoRow: {
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    marginBottom: 20,
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#0066FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#FCA5A5',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 20,
    gap: 16,
  },
  submitBtn: {
    marginTop: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E293B',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  demoNoteText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: -8,
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#475569',
  },
});

export default AuthScreen;

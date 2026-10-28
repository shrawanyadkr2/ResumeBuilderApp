import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import typography from '../theme/typography';
import Button from '../components/Button';
import GoldenButton from '../components/GoldenButton';
import PlusLifetimeBadge from '../components/PlusLifetimeBadge';
import { SparklesIcon, SunIcon, MoonIcon } from '../components/Icons';
import SkyDevXLogo from '../components/SkyDevXLogo';

export const SplashScreen = ({ onGetStarted, onDemoMode, onGoToAuth }) => {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: '#090D16' }]}>
      {/* Top right actions */}
      <View style={styles.topBar}>
        <SkyDevXLogo size={36} variant="mark-only" isDark={true} />
        <View style={styles.topRightRow}>
          <TouchableOpacity
            style={styles.themeToggle}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            {isDark ? <SunIcon size={20} color="#FBBF24" /> : <MoonIcon size={20} color="#38BDF8" />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Large Central sky.devX Logo */}
          <View style={styles.logoBadgeContainer}>
            <SkyDevXLogo size={74} variant="mark-only" isDark={true} />
          </View>

          <View style={styles.brandTitleRow}>
            <Text style={styles.skyBrand}>sky</Text>
            <Text style={styles.dotBrand}>.</Text>
            <Text style={styles.devXBrand}>devX</Text>
            <Text style={styles.appName}> ResumeBuilder</Text>
          </View>

          {/* Plus Lifetime Badge */}
          <View style={{ marginBottom: 14 }}>
            <PlusLifetimeBadge label="Plus Lifetime Included" />
          </View>

          <Text style={styles.subtitle}>
            Recruiter-approved, ATS-optimized single-page resume builder for high-impact careers.
          </Text>

          <View style={styles.featurePills}>
            <View style={styles.pill}>
              <SparklesIcon size={14} color="#60A5FA" />
              <Text style={styles.pillText}>7 Official Templates</Text>
            </View>
            <View style={styles.pill}>
              <SparklesIcon size={14} color="#60A5FA" />
              <Text style={styles.pillText}>Single-Page A4 Precision</Text>
            </View>
            <View style={styles.pill}>
              <SparklesIcon size={14} color="#60A5FA" />
              <Text style={styles.pillText}>Executive B&W Minimal</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {/* User Golden Gradient Button for Demo */}
            <GoldenButton
              title="Explore Shrawan Kr. Resume"
              onPress={onDemoMode}
              icon={<SparklesIcon size={16} color="#FFFFFF" />}
              style={{ marginBottom: 12 }}
            />

            <Button
              title="Sign In / Register Account"
              onPress={onGoToAuth || onGetStarted}
              variant="outline"
              size="large"
              style={styles.ctaButton}
              textStyle={{ color: '#818CF8' }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Creator Branding */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Engineered with excellence by </Text>
        <Text style={styles.brandingText}>sky.devX</Text>
        <Text style={styles.footerText}>  •  Shrawan Kr Yadav</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  content: {
    alignItems: 'center',
  },
  logoBadgeContainer: {
    marginBottom: 16,
    shadowColor: '#00D8F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  skyBrand: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  dotBrand: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00D8F6',
  },
  devXBrand: {
    fontSize: 26,
    fontWeight: '900',
    color: '#A855F7',
    letterSpacing: -0.5,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
    maxWidth: 320,
  },
  featurePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
    maxWidth: 340,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  pillText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 340,
  },
  ctaButton: {
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    backgroundColor: 'transparent',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#1E293B',
  },
  footerText: {
    fontSize: 11,
    color: '#64748B',
  },
  brandingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
});

export default SplashScreen;

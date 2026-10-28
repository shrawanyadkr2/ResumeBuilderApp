import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const LOGO_IMG = require('../../assets/skydevx_logo.png');

/**
 * Official Decent & Premium sky.devX Logo Component
 * Uses the exact branding from skycodex.vercel.app with cyan dot and sleek gradient text
 */
export const SkyDevXLogo = ({
  size = 38,
  variant = 'full', // 'full' | 'mark-only' | 'compact'
  isDark = true,
  isPremium = false,
  showTagline = false,
  style,
}) => {
  if (variant === 'mark-only') {
    return (
      <View
        style={[
          styles.iconBox,
          {
            width: size,
            height: size,
            borderRadius: size * 0.28,
            backgroundColor: '#030712',
            borderColor: isPremium ? '#F59E0B' : '#06B6D460',
          },
          style,
        ]}
      >
        <Image
          source={LOGO_IMG}
          style={{ width: size * 0.65, height: size * 0.65 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Icon Badge */}
      <View
        style={[
          styles.iconBox,
          {
            width: size,
            height: size,
            borderRadius: size * 0.28,
            backgroundColor: '#030712',
            borderColor: isPremium ? '#F59E0B' : '#06B6D460',
          },
        ]}
      >
        <Image
          source={LOGO_IMG}
          style={{ width: size * 0.68, height: size * 0.68 }}
          resizeMode="contain"
        />
      </View>

      {/* Brand Typography (sky.devX) */}
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.skyText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>sky</Text>
          <Text style={styles.cyanDot}>.</Text>
          <Text style={styles.devXText}>devX</Text>
          {variant !== 'compact' && (
            <Text style={[styles.builderText, { color: isDark ? '#F1F5F9' : '#334155' }]}>
              {' '}ResumeBuilder
            </Text>
          )}
          {isPremium && (
            <View style={styles.proTag}>
              <Text style={styles.proTagText}>PRO</Text>
            </View>
          )}
        </View>

        {showTagline && (
          <Text style={styles.tagline}>
            PROFESSIONAL ATS RESUMES
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  skyText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  cyanDot: {
    fontSize: 18,
    fontWeight: '900',
    color: '#06B6D4',
  },
  devXText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: -0.2,
  },
  builderText: {
    fontSize: 15,
    fontWeight: '800',
  },
  proTag: {
    backgroundColor: '#F59E0B25',
    borderWidth: 1,
    borderColor: '#F59E0B60',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 4,
    marginLeft: 5,
  },
  proTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#F59E0B',
  },
  tagline: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#06B6D4',
    letterSpacing: 1.1,
    marginTop: 1,
    textTransform: 'uppercase',
  },
});

export default SkyDevXLogo;

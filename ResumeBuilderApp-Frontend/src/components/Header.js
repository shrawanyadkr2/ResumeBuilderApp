import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import typography from '../theme/typography';
import { ArrowLeftIcon, EyeIcon, SunIcon, MoonIcon } from './Icons';
import SkyDevXLogo from './SkyDevXLogo';

export const Header = ({
  title = 'Resume Genie',
  subtitle,
  stepNumber,
  totalSteps = 7,
  onBack,
  onPreview,
  showPreview = true,
  rightAction,
}) => {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.ui.border }]}>
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.ui.inputBg }]}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeftIcon size={22} color={colors.text.primary} />
          </TouchableOpacity>
        ) : (
          <SkyDevXLogo size={34} variant="mark-only" isDark={isDark} />
        )}

        <View style={styles.titleContainer}>
          <View style={styles.headerTitleRow}>
            <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
              {title}
            </Text>
          </View>
          {stepNumber ? (
            <Text style={[styles.stepSubtitle, { color: colors.primary }]}>
              Step {stepNumber} of {totalSteps}  •  ATS Optimization
            </Text>
          ) : subtitle ? (
            <Text style={[styles.subtitle, { color: colors.text.secondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightGroup}>
          <TouchableOpacity
            style={[styles.themeToggleSmall, { backgroundColor: colors.ui.inputBg }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            {isDark ? <SunIcon size={18} color="#FBBF24" /> : <MoonIcon size={18} color={colors.primary} />}
          </TouchableOpacity>

          {showPreview && onPreview ? (
            <TouchableOpacity
              style={[styles.previewButton, { backgroundColor: colors.primaryLight }]}
              onPress={onPreview}
              activeOpacity={0.7}
            >
              <EyeIcon size={18} color={colors.primary} />
              <Text style={[styles.previewText, { color: colors.primary }]}>Preview</Text>
            </TouchableOpacity>
          ) : rightAction ? (
            rightAction
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'web' ? 14 : 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skyPrefix: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  stepSubtitle: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  subtitle: {
    ...typography.caption,
    fontSize: 11,
    marginTop: 2,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  previewText: {
    ...typography.buttonSmall,
    marginLeft: 6,
    fontWeight: '700',
  },
  placeholder: {
    width: 36,
  },
});

export default Header;

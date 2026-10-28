import { StyleSheet } from 'react-native';
import colors from './colors';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.text.primary,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text.secondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.muted,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  buttonSmall: {
    fontSize: 13,
    fontWeight: '600',
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  splashSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default typography;

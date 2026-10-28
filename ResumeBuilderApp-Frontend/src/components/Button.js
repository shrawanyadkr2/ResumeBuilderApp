import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import typography from '../theme/typography';

export const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.primaryLight,
          },
          text: {
            color: colors.primary,
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.primary,
          },
          text: {
            color: colors.primary,
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: colors.text.secondary,
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: colors.status.errorLight,
            borderWidth: 1,
            borderColor: colors.status.error,
          },
          text: {
            color: colors.status.error,
          },
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.28,
            shadowRadius: 6,
            elevation: 3,
          },
          text: {
            color: '#FFFFFF',
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          text: styles.smallText,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          text: styles.largeText,
        };
      case 'medium':
      default:
        return {
          container: styles.mediumContainer,
          text: styles.mediumText,
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.baseContainer,
        vStyles.container,
        sStyles.container,
        disabled && styles.disabledContainer,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.baseText,
              vStyles.text,
              sStyles.text,
              disabled && styles.disabledText,
              icon && { marginLeft: 8 },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  baseText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  smallContainer: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  smallText: {
    fontSize: 13,
  },
  mediumContainer: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 48,
  },
  mediumText: {
    fontSize: 15,
  },
  largeContainer: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    minHeight: 54,
  },
  largeText: {
    fontSize: 17,
  },
  disabledContainer: {
    backgroundColor: '#334155',
    borderColor: '#334155',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: '#94A3B8',
  },
});

export default Button;

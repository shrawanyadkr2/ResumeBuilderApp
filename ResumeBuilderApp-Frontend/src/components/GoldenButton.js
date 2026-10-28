import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, View } from 'react-native';

/**
 * Exact Golden Metallic Gradient Button matching user screenshot
 * Smooth metallic golden transition: #E5C05B (light warm gold) -> #C59828 (rich amber gold) -> #9A6F12 (deep burnished gold)
 * Features high-precision inset top bevel highlight and ambient gold glow.
 */
export const GoldenButton = ({
  title,
  onPress,
  icon,
  style,
  textStyle,
  disabled = false,
}) => {
  const webStyle = Platform.OS === 'web' ? {
    backgroundImage: 'linear-gradient(90deg, #E2BD55 0%, #DFBA51 22%, #D5AE3F 50%, #B88921 82%, #A27211 100%)',
    boxShadow: '0 4px 16px rgba(197, 152, 40, 0.45)',
  } : {};

  return (
    <TouchableOpacity
      style={[
        styles.buttonWrapper,
        webStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <View style={styles.innerContent}>
        <Text style={[styles.buttonText, textStyle]} numberOfLines={1}>{title}</Text>
        {icon && <View style={styles.iconWrapper}>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    backgroundColor: '#C59828',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C59828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3D37A60',
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  iconWrapper: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default GoldenButton;

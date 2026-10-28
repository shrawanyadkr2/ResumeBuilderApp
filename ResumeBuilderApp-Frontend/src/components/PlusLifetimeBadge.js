import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CrownIcon } from './Icons';

/**
 * Plus Lifetime Badge matching user screenshot 2 exactly
 * Dark navy pill container with purple border and golden crown
 */
export const PlusLifetimeBadge = ({ label = 'Plus Lifetime', size = 'normal', style }) => {
  return (
    <View style={[styles.pillContainer, style]}>
      <CrownIcon size={16} color="#F59E0B" />
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#3730A3',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#818CF8',
    letterSpacing: 0.2,
  },
});

export default PlusLifetimeBadge;

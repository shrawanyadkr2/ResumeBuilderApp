import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export const StepperProgress = ({ currentStep = 1, totalSteps = 7 }) => {
  const percentage = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);

  return (
    <View style={styles.track}>
      <View style={[styles.indicator, { width: `${percentage}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: '#E2E8F0',
    width: '100%',
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});

export default StepperProgress;

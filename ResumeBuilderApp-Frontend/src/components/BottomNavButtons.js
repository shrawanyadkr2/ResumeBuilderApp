import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

export const BottomNavButtons = ({
  onBack,
  onNext,
  backTitle = 'Back',
  nextTitle = 'Next',
  isLastStep = false,
  loading = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.ui.border }]}>
      {onBack ? (
        <Button
          title={backTitle}
          onPress={onBack}
          variant="outline"
          style={styles.backBtn}
        />
      ) : (
        <View style={styles.emptySpace} />
      )}
      <Button
        title={isLastStep ? 'Finish & Export' : nextTitle}
        onPress={onNext}
        variant="primary"
        loading={loading}
        style={styles.nextBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
  },
  backBtn: {
    flex: 1,
    marginRight: 12,
  },
  nextBtn: {
    flex: 1.5,
  },
  emptySpace: {
    flex: 1,
    marginRight: 12,
  },
});

export default BottomNavButtons;

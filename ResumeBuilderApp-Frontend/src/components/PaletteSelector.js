import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import colors, { templatePalettes } from '../theme/colors';
import typography from '../theme/typography';
import { CheckIcon } from './Icons';

export const PaletteSelector = ({
  selectedPaletteId = 'navy',
  onSelectPalette,
  customColor,
  onCustomColorSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>COLOR PALETTE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {Object.entries(templatePalettes).map(([key, palette]) => {
          const isSelected = selectedPaletteId === key && !customColor;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.swatchCard,
                isSelected && styles.selectedSwatchCard,
              ]}
              onPress={() => onSelectPalette(key)}
              activeOpacity={0.8}
            >
              <View style={[styles.circle, { backgroundColor: palette.primary }]}>
                {isSelected && <CheckIcon size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.paletteName} numberOfLines={1}>
                {palette.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollList: {
    paddingVertical: 4,
    gap: 12,
  },
  swatchCard: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.ui.border,
    minWidth: 90,
  },
  selectedSwatchCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  paletteName: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PaletteSelector;

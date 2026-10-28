import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { CloseIcon } from './Icons';

export const SkillChip = ({ label, onRemove }) => {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.closeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <CloseIcon size={14} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#D4E2FF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  label: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
    marginRight: 6,
  },
  closeBtn: {
    padding: 2,
  },
});

export default SkillChip;

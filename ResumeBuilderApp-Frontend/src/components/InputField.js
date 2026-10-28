import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import typography from '../theme/typography';

export const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  error,
  helperText,
  style,
  inputStyle,
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.ui.inputBg,
            borderColor: isFocused
              ? (colors.ui.focusBorder || colors.primary)
              : error
              ? colors.status.error
              : colors.ui.border,
          },
          multiline && styles.multilineWrapper,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: colors.text.primary },
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.ui.placeholder}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: colors.status.error }]}>{error}</Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: colors.text.muted }]}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    ...typography.label,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 48,
    justifyContent: 'center',
  },
  multilineWrapper: {
    minHeight: 120,
    paddingVertical: 12,
  },
  input: {
    ...typography.body,
    fontSize: 15,
    padding: 0,
    margin: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
    height: '100%',
    minHeight: 100,
  },
  errorText: {
    ...typography.caption,
    marginTop: 4,
  },
  helperText: {
    ...typography.caption,
    marginTop: 4,
  },
});

export default InputField;

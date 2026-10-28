import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../theme/typography';
import InputField from '../../components/InputField';
import { useResume } from '../../context/ResumeContext';

export const Step2Summary = () => {
  const { colors } = useTheme();
  const { currentResume, updateSummary } = useResume();
  const summaryText = currentResume.summary || '';
  const charCount = summaryText.length;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.surface }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.introHeader}>
        <Text style={[styles.sectionHeading, { color: colors.text.primary }]}>Professional Summary</Text>
        <Text style={[styles.sectionSubheading, { color: colors.text.secondary }]}>
          Write a short, engaging summary highlighting your years of experience, core technical strengths, and leadership impact.
        </Text>
      </View>

      <InputField
        label="Summary / About You"
        placeholder="e.g. Innovative Senior Full-Stack Engineer with deep expertise in scalable mobile ecosystems..."
        value={summaryText}
        onChangeText={updateSummary}
        multiline
        numberOfLines={8}
        inputStyle={styles.summaryInput}
        helperText={`${charCount} characters (Recommended: 200–500 characters)`}
      />

      <View style={[styles.tipsBox, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '30' }]}>
        <Text style={[styles.tipsTitle, { color: colors.primary }]}>💡 ATS Optimization Guidance:</Text>
        <Text style={[styles.tipText, { color: colors.text.secondary }]}>• Open with your strongest title and total years of relevant domain experience.</Text>
        <Text style={[styles.tipText, { color: colors.text.secondary }]}>• Include 2-3 specific technical achievements with numbers (e.g., "increased latency by 35%").</Text>
        <Text style={[styles.tipText, { color: colors.text.secondary }]}>• Keep sentences punchy, ATS-friendly, and active voice.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  introHeader: {
    marginBottom: 20,
  },
  sectionHeading: {
    ...typography.h2,
  },
  sectionSubheading: {
    ...typography.body,
    marginTop: 4,
  },
  summaryInput: {
    minHeight: 160,
    fontSize: 15,
    lineHeight: 22,
  },
  tipsBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  tipsTitle: {
    ...typography.bodyBold,
    marginBottom: 6,
  },
  tipText: {
    ...typography.caption,
    lineHeight: 18,
    marginTop: 4,
  },
});

export default Step2Summary;

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import InputField from '../../components/InputField';
import SkillChip from '../../components/SkillChip';
import { PlusIcon } from '../../components/Icons';
import { useResume } from '../../context/ResumeContext';

const SUGGESTED_SKILLS = [
  'React Native',
  'JavaScript',
  'TypeScript',
  'Java',
  'Spring Boot',
  'Python',
  'Node.js',
  'SQL',
  'MongoDB',
  'Docker',
  'AWS',
  'REST APIs',
  'Git & GitHub',
  'Agile / Scrum',
];

export const Step5Skills = () => {
  const { currentResume, addSkill, removeSkill } = useResume();
  const [skillInput, setSkillInput] = useState('');
  const skills = currentResume.skills || [];

  const handleAdd = () => {
    if (skillInput.trim()) {
      addSkill(skillInput);
      setSkillInput('');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.introHeader}>
        <Text style={styles.sectionHeading}>Skills & Technologies</Text>
        <Text style={styles.sectionSubheading}>
          Add the key tools, frameworks, programming languages, and industry competencies you master.
        </Text>
      </View>

      {/* Figma Screen 6: Input field with "Add" button beside it */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <InputField
            placeholder="Type a skill (e.g. React Native, Java)..."
            value={skillInput}
            onChangeText={setSkillInput}
            style={{ marginBottom: 0 }}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <PlusIcon size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Added Skills Chips */}
      <View style={styles.skillsContainer}>
        <Text style={styles.chipSectionLabel}>
          YOUR ADDED SKILLS ({skills.length})
        </Text>
        <View style={styles.chipsWrapper}>
          {skills.length === 0 ? (
            <Text style={styles.emptyText}>
              No skills added yet. Use the input above or choose suggestions below.
            </Text>
          ) : (
            skills.map((skill, idx) => (
              <SkillChip
                key={idx}
                label={skill}
                onRemove={() => removeSkill(skill)}
              />
            ))
          )}
        </View>
      </View>

      {/* Suggested Skills */}
      <View style={styles.suggestionsContainer}>
        <Text style={styles.chipSectionLabel}>POPULAR SUGGESTIONS</Text>
        <View style={styles.chipsWrapper}>
          {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.suggestedChip}
              onPress={() => addSkill(item)}
              activeOpacity={0.7}
            >
              <PlusIcon size={12} color={colors.primary} />
              <Text style={styles.suggestedText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  introHeader: {
    marginBottom: 20,
  },
  sectionHeading: {
    ...typography.h2,
    color: colors.text.primary,
  },
  sectionSubheading: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    height: 48,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    ...typography.buttonSmall,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 6,
  },
  skillsContainer: {
    marginBottom: 24,
    backgroundColor: colors.ui.inputBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  chipSectionLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyText: {
    ...typography.caption,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    marginTop: 4,
  },
  suggestedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D4E2FF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestedText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default Step5Skills;

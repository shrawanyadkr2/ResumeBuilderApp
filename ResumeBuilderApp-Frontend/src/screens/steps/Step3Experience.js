import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import ExperienceCard from '../../components/ExperienceCard';
import { PlusIcon } from '../../components/Icons';
import { useResume } from '../../context/ResumeContext';

export const Step3Experience = () => {
  const {
    currentResume,
    addExperience,
    updateExperience,
    removeExperience,
    addExperienceBullet,
    updateExperienceBullet,
    removeExperienceBullet,
  } = useResume();

  const experiences = currentResume.experiences || [];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.introHeader}>
        <Text style={styles.sectionHeading}>Work Experience</Text>
        <Text style={styles.sectionSubheading}>
          Highlight relevant roles, companies, and measurable accomplishments.
        </Text>
      </View>

      {experiences.map((exp, idx) => (
        <ExperienceCard
          key={exp.id || idx}
          experience={exp}
          index={idx}
          onChange={(field, val) => updateExperience(exp.id, field, val)}
          onRemove={() => removeExperience(exp.id)}
          onAddBullet={() => addExperienceBullet(exp.id)}
          onUpdateBullet={(bIdx, text) =>
            updateExperienceBullet(exp.id, bIdx, text)
          }
          onRemoveBullet={(bIdx) => removeExperienceBullet(exp.id, bIdx)}
        />
      ))}

      {/* Figma Screen 4: "+ Add Work Experience" Primary / Outline button */}
      <TouchableOpacity
        style={styles.addCardButton}
        onPress={addExperience}
        activeOpacity={0.8}
      >
        <View style={styles.addIconCircle}>
          <PlusIcon size={20} color="#0D5BFF" />
        </View>
        <Text style={styles.addCardText}>+ Add Work Experience</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
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
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 24,
  },
  addIconCircle: {
    marginRight: 8,
  },
  addCardText: {
    ...typography.bodyBold,
    color: colors.primary,
    fontSize: 16,
  },
});

export default Step3Experience;

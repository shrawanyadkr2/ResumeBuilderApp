import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import EducationCard from '../../components/EducationCard';
import { PlusIcon } from '../../components/Icons';
import { useResume } from '../../context/ResumeContext';

export const Step4Education = () => {
  const {
    currentResume,
    addEducation,
    updateEducation,
    removeEducation,
    addEducationBullet,
    updateEducationBullet,
    removeEducationBullet,
  } = useResume();

  const educations = currentResume.educations || [];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.introHeader}>
        <Text style={styles.sectionHeading}>Education</Text>
        <Text style={styles.sectionSubheading}>
          List your degrees, universities, certifications, and academic achievements.
        </Text>
      </View>

      {educations.map((edu, idx) => (
        <EducationCard
          key={edu.id || idx}
          education={edu}
          index={idx}
          onChange={(field, val) => updateEducation(edu.id, field, val)}
          onRemove={() => removeEducation(edu.id)}
          onAddBullet={() => addEducationBullet(edu.id)}
          onUpdateBullet={(bIdx, text) =>
            updateEducationBullet(edu.id, bIdx, text)
          }
          onRemoveBullet={(bIdx) => removeEducationBullet(edu.id, bIdx)}
        />
      ))}

      {/* Figma Screen 5: "+ Add Education" */}
      <TouchableOpacity
        style={styles.addCardButton}
        onPress={addEducation}
        activeOpacity={0.8}
      >
        <View style={styles.addIconCircle}>
          <PlusIcon size={20} color="#0D5BFF" />
        </View>
        <Text style={styles.addCardText}>+ Add Education</Text>
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

export default Step4Education;

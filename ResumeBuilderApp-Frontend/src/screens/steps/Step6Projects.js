import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import ProjectCard from '../../components/ProjectCard';
import { PlusIcon } from '../../components/Icons';
import { useResume } from '../../context/ResumeContext';

export const Step6Projects = () => {
  const {
    currentResume,
    addProject,
    updateProject,
    removeProject,
    addProjectBullet,
    updateProjectBullet,
    removeProjectBullet,
  } = useResume();

  const projects = currentResume.projects || [];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.introHeader}>
        <Text style={styles.sectionHeading}>Projects & Portfolio</Text>
        <Text style={styles.sectionSubheading}>
          Demonstrate hands-on initiative, personal apps, open-source work, or major engineering deliveries.
        </Text>
      </View>

      {projects.map((proj, idx) => (
        <ProjectCard
          key={proj.id || idx}
          project={proj}
          index={idx}
          onChange={(field, val) => updateProject(proj.id, field, val)}
          onRemove={() => removeProject(proj.id)}
          onAddBullet={() => addProjectBullet(proj.id)}
          onUpdateBullet={(bIdx, text) =>
            updateProjectBullet(proj.id, bIdx, text)
          }
          onRemoveBullet={(bIdx) => removeProjectBullet(proj.id, bIdx)}
        />
      ))}

      {/* Figma Screen 7: "+ Add Project" */}
      <TouchableOpacity
        style={styles.addCardButton}
        onPress={addProject}
        activeOpacity={0.8}
      >
        <View style={styles.addIconCircle}>
          <PlusIcon size={20} color="#0D5BFF" />
        </View>
        <Text style={styles.addCardText}>+ Add Project</Text>
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

export default Step6Projects;

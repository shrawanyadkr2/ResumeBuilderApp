import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';
import InputField from './InputField';
import { PlusIcon, TrashIcon, CloseIcon } from './Icons';

export const ProjectCard = ({
  project,
  index,
  onChange,
  onRemove,
  onAddBullet,
  onUpdateBullet,
  onRemoveBullet,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerTitle}>
          {project.title || `Project #${index + 1}`}
        </Text>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={onRemove}
          activeOpacity={0.7}
        >
          <TrashIcon size={16} color={colors.status.error} />
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <InputField
        label="Project Title *"
        placeholder="e.g. Resume Genie Mobile App"
        value={project.title}
        onChangeText={(val) => onChange('title', val)}
      />

      <InputField
        label="Project Link / GitHub"
        placeholder="e.g. https://github.com/alexrivera/resumegenie"
        value={project.link}
        onChangeText={(val) => onChange('link', val)}
      />

      <InputField
        label="Short Description"
        placeholder="Brief description of the tech stack and problem solved..."
        value={project.description}
        onChangeText={(val) => onChange('description', val)}
        multiline
        style={{ marginBottom: 12 }}
      />

      {/* Bullets / Highlights */}
      <View style={styles.bulletsSection}>
        <Text style={styles.bulletSectionLabel}>Key Highlights</Text>
        {project.bullets &&
          project.bullets.map((bullet, bIndex) => (
            <View key={bIndex} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <View style={styles.bulletInputWrapper}>
                <InputField
                  placeholder="e.g. Achieved 99.9% uptime with Kubernetes..."
                  value={bullet}
                  onChangeText={(val) => onUpdateBullet(bIndex, val)}
                  multiline
                  style={{ marginBottom: 6 }}
                />
              </View>
              {project.bullets.length > 1 && (
                <TouchableOpacity
                  style={styles.removeBulletBtn}
                  onPress={() => onRemoveBullet(bIndex)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <CloseIcon size={16} color={colors.text.muted} />
                </TouchableOpacity>
              )}
            </View>
          ))}

        <TouchableOpacity
          style={styles.addBulletBtn}
          onPress={onAddBullet}
          activeOpacity={0.7}
        >
          <PlusIcon size={16} color={colors.primary} />
          <Text style={styles.addBulletText}>Add Highlight</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.ui.border,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.divider,
    paddingBottom: 10,
  },
  headerTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '700',
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeText: {
    ...typography.caption,
    color: colors.status.error,
    fontWeight: '700',
    marginLeft: 4,
  },
  bulletsSection: {
    marginTop: 8,
  },
  bulletSectionLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 18,
    marginRight: 8,
  },
  bulletInputWrapper: {
    flex: 1,
  },
  removeBulletBtn: {
    padding: 8,
    marginTop: 8,
    marginLeft: 4,
  },
  addBulletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  addBulletText: {
    ...typography.buttonSmall,
    color: colors.primary,
    marginLeft: 6,
    fontWeight: '700',
  },
});

export default ProjectCard;

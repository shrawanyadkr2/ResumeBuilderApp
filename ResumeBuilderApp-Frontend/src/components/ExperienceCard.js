import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';
import InputField from './InputField';
import { PlusIcon, TrashIcon, CloseIcon } from './Icons';

export const ExperienceCard = ({
  experience,
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
          {experience.jobTitle || `Experience #${index + 1}`}
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
        label="Job Title *"
        placeholder="e.g. Senior Software Engineer"
        value={experience.jobTitle}
        onChangeText={(val) => onChange('jobTitle', val)}
      />

      <InputField
        label="Company / Employer *"
        placeholder="e.g. TechCorp Solutions"
        value={experience.company}
        onChangeText={(val) => onChange('company', val)}
      />

      <View style={styles.row}>
        <View style={styles.halfCol}>
          <InputField
            label="Start Date"
            placeholder="e.g. 2021 or Jan 2021"
            value={experience.startDate}
            onChangeText={(val) => onChange('startDate', val)}
          />
        </View>
        <View style={styles.halfCol}>
          <InputField
            label="End Date"
            placeholder="e.g. Present or Dec 2023"
            value={experience.endDate}
            onChangeText={(val) => onChange('endDate', val)}
          />
        </View>
      </View>

      <InputField
        label="Location"
        placeholder="e.g. San Francisco, CA (or Remote)"
        value={experience.location}
        onChangeText={(val) => onChange('location', val)}
      />

      {/* Responsibilities & Achievements */}
      <View style={styles.bulletsSection}>
        <Text style={styles.bulletSectionLabel}>Key Achievements / Responsibilities</Text>
        {experience.bullets &&
          experience.bullets.map((bullet, bIndex) => (
            <View key={bIndex} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <View style={styles.bulletInputWrapper}>
                <InputField
                  placeholder="Describe an impactful accomplishment or responsibility..."
                  value={bullet}
                  onChangeText={(val) => onUpdateBullet(bIndex, val)}
                  multiline
                  style={{ marginBottom: 6 }}
                />
              </View>
              {experience.bullets.length > 1 && (
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
          <Text style={styles.addBulletText}>Add Bullet Point</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCol: {
    width: '48%',
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

export default ExperienceCard;

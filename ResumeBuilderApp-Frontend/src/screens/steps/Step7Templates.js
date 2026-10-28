import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../theme/typography';
import { RESUME_TEMPLATES, RESUME_PALETTES } from '../../constants/templates.config';
import { useResume } from '../../context/ResumeContext';
import { CheckIcon } from '../../components/Icons';

export const Step7Templates = () => {
  const { colors } = useTheme();
  const { currentResume, setTemplate, setPalette } = useResume();
  const selectedTemplateId = currentResume.templateId || 'modern';
  const selectedPaletteId = currentResume.paletteId || 'indigo';

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.surface }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.introHeader}>
        <Text style={[styles.sectionHeading, { color: colors.text.primary }]}>Templates & Design</Text>
        <Text style={[styles.sectionSubheading, { color: colors.text.secondary }]}>
          Choose from 6 recruiter-approved, single-page ATS templates directly from skycodex.vercel.app.
        </Text>
      </View>

      {/* 6 Templates from skycodex.vercel.app */}
      <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>AVAILABLE RESUME TEMPLATES</Text>
      <View style={styles.templateList}>
        {RESUME_TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id;
          return (
            <TouchableOpacity
              key={tmpl.id}
              style={[
                styles.templateCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? tmpl.previewColor : colors.ui.border,
                },
                isSelected && {
                  backgroundColor: colors.primaryLight,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setTemplate(tmpl.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.radioCircle,
                    { borderColor: tmpl.previewColor },
                  ]}
                >
                  {isSelected && (
                    <View style={[styles.radioInner, { backgroundColor: tmpl.previewColor }]} />
                  )}
                </View>
                <Text style={[styles.templateName, { color: colors.text.primary }]}>{tmpl.name}</Text>
                <View style={[styles.badge, { backgroundColor: tmpl.isPremium ? '#FDE68A' : '#E2E8F0' }]}>
                  <Text style={[styles.badgeText, { color: tmpl.isPremium ? '#92400E' : '#334155' }]}>
                    {tmpl.badge}
                  </Text>
                </View>
              </View>
              <Text style={[styles.templateDesc, { color: colors.text.secondary }]}>{tmpl.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Palette Selector */}
      <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>COLOR ACCENTS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {RESUME_PALETTES.map((palette) => {
          const isSelected = selectedPaletteId === palette.id;
          return (
            <TouchableOpacity
              key={palette.id}
              style={[
                styles.swatchCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? palette.primary : colors.ui.border,
                },
                isSelected && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => setPalette(palette.id, palette.primary)}
              activeOpacity={0.8}
            >
              <View style={[styles.circle, { backgroundColor: palette.primary }]}>
                {isSelected && <CheckIcon size={14} color="#FFFFFF" />}
              </View>
              <Text style={[styles.paletteName, { color: colors.text.primary }]} numberOfLines={1}>
                {palette.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  sectionLabel: {
    ...typography.label,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  templateList: {
    marginBottom: 16,
  },
  templateCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  templateName: {
    ...typography.bodyBold,
    flex: 1,
    fontSize: 15,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '800',
  },
  templateDesc: {
    ...typography.caption,
    paddingLeft: 30,
    lineHeight: 18,
  },
  scrollList: {
    paddingVertical: 4,
    gap: 12,
    marginBottom: 20,
  },
  swatchCard: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: 90,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  paletteName: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Step7Templates;

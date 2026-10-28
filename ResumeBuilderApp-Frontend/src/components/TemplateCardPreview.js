import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const TemplateCardPreview = ({ template }) => {
  const isSingleColumn = template.isSingleColumn;
  const accent = template.previewColor || '#4F46E5';

  if (isSingleColumn) {
    return (
      <View style={styles.cardContainer}>
        {/* Header */}
        <View style={styles.singleHeader}>
          <Text style={styles.singleName}>SHRAWAN KUMAR YADAV</Text>
          <Text style={styles.singleContact}>
            +91 62993 07414 | shrawan.yadav@skydevx.com | LinkedIn | GitHub
          </Text>
        </View>

        {/* Realistic Sections */}
        <View style={styles.sectionsList}>
          <View style={styles.sectionBlock}>
            <Text style={styles.singleSectionTitle}>EDUCATION</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.boldText}>ITS Engineering College</Text>
              <Text style={styles.mutedText}>2021 – 2025</Text>
            </View>
            <Text style={styles.italicText}>B.Tech in Computer Science (CGPA: 8.5)</Text>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.singleSectionTitle}>PROJECTS</Text>
            <Text style={styles.boldText}>Resume Genie SaaS | React Native, Java Spring Boot</Text>
            <Text style={styles.bulletText}>• Full-stack ATS platform for resume optimization</Text>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.singleSectionTitle}>TECHNICAL SKILLS</Text>
            <Text style={styles.bodyText}>
              <Text style={{ fontWeight: '700' }}>Languages & Stack: </Text>
              Java 21, Spring Boot 3, React Native, MongoDB, SQL
            </Text>
          </View>
        </View>

        {/* Footer info strip */}
        <View style={styles.footerStrip}>
          <Text style={styles.footerName}>{template.name}</Text>
          <Text style={[styles.footerTag, { color: accent }]}>
            ● Single-Column ATS
          </Text>
        </View>
      </View>
    );
  }

  // 2-Column Matrix Mini View
  return (
    <View style={styles.cardContainer}>
      {/* Header Banner */}
      <View style={[styles.modernHeader, { borderBottomColor: accent }]}>
        <Text style={[styles.modernName, { color: accent }]}>SHRAWAN YADAV</Text>
        <Text style={styles.modernTitle}>Senior Software Engineer / Architect</Text>
        <Text style={styles.modernContact}>shrawan.yadav@skydevx.com | +91 62993 07414</Text>
      </View>

      {/* Grid Content */}
      <View style={styles.gridRow}>
        <View style={styles.gridLeft}>
          <View style={styles.sectionBlock}>
            <Text style={[styles.modernSectionTitle, { color: accent }]}>EXPERIENCE</Text>
            <Text style={styles.boldText}>Lead Software Architect</Text>
            <Text style={styles.mutedText}>sky.devX Innovations (2022 - Present)</Text>
          </View>
          <View style={styles.sectionBlock}>
            <Text style={[styles.modernSectionTitle, { color: accent }]}>PROJECTS</Text>
            <Text style={styles.boldText}>Resume Genie SaaS</Text>
            <Text style={styles.bulletText}>React Native & Spring Boot</Text>
          </View>
        </View>

        <View style={styles.gridRight}>
          <View style={styles.sectionBlock}>
            <Text style={[styles.modernSectionTitle, { color: accent }]}>SKILLS</Text>
            <View style={styles.pillRow}>
              {['React', 'Java', 'Spring', 'Mongo'].map((s, idx) => (
                <View key={idx} style={[styles.miniPill, { borderColor: accent + '60' }]}>
                  <Text style={[styles.miniPillText, { color: accent }]}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.sectionBlock}>
            <Text style={[styles.modernSectionTitle, { color: accent }]}>EDUCATION</Text>
            <Text style={styles.boldText}>B.Tech CS</Text>
            <Text style={styles.mutedText}>2021 - 2025</Text>
          </View>
        </View>
      </View>

      {/* Footer info strip */}
      <View style={styles.footerStrip}>
        <Text style={styles.footerName}>{template.name}</Text>
        <Text style={[styles.footerTag, { color: accent }]}>
          ● Two-Column Matrix
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 230,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  singleHeader: {
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: '#111827',
  },
  singleName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.8,
  },
  singleContact: {
    fontSize: 6.5,
    color: '#4B5563',
    marginTop: 2,
  },
  sectionsList: {
    gap: 4,
  },
  sectionBlock: {
    marginBottom: 2,
  },
  singleSectionTitle: {
    fontSize: 7,
    fontWeight: '800',
    color: '#111827',
    borderBottomWidth: 0.8,
    borderBottomColor: '#111827',
    paddingBottom: 1,
    marginBottom: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boldText: {
    fontSize: 7.5,
    fontWeight: '700',
    color: '#111827',
  },
  mutedText: {
    fontSize: 6.5,
    color: '#6B7280',
  },
  italicText: {
    fontSize: 6.5,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  bulletText: {
    fontSize: 6.5,
    color: '#374151',
  },
  bodyText: {
    fontSize: 6.5,
    color: '#374151',
  },
  modernHeader: {
    paddingBottom: 4,
    borderBottomWidth: 2,
  },
  modernName: {
    fontSize: 11,
    fontWeight: '800',
  },
  modernTitle: {
    fontSize: 7,
    fontWeight: '600',
    color: '#4B5563',
  },
  modernContact: {
    fontSize: 6.5,
    color: '#6B7280',
  },
  modernSectionTitle: {
    fontSize: 6.5,
    fontWeight: '800',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 1,
    marginBottom: 2,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    marginTop: 4,
  },
  gridLeft: {
    flex: 2,
  },
  gridRight: {
    flex: 1.2,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  miniPill: {
    borderWidth: 0.8,
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  miniPillText: {
    fontSize: 6,
    fontWeight: '700',
  },
  footerStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 4,
    marginTop: 2,
  },
  footerName: {
    fontSize: 8,
    fontWeight: '700',
    color: '#111827',
  },
  footerTag: {
    fontSize: 7,
    fontWeight: '700',
  },
});

export default TemplateCardPreview;

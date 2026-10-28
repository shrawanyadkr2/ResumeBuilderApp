import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { RESUME_TEMPLATES } from '../constants/templates.config';

export const LiveResumePreview = ({ resume, scale = 1, style }) => {
  const {
    personalInfo = {},
    summary = '',
    experiences = [],
    educations = [],
    skills = [],
    projects = [],
    templateId = 'modern',
    customColor,
  } = resume || {};

  const currentTemplate =
    RESUME_TEMPLATES.find((t) => t.id === templateId) || RESUME_TEMPLATES[0];

  const primaryColor = customColor || currentTemplate.previewColor || '#4F46E5';
  const isSingleColumn = currentTemplate.isSingleColumn;
  const isSerif = currentTemplate.fontFamily === 'serif';
  const isMono = currentTemplate.fontFamily === 'monospace';

  // --------------------------------------------------------------------------
  // TEMPLATE VARIANT 1: SINGLE-COLUMN ATS (Minimal Slate / ATS Master Gold)
  // Matching user's skycodex.vercel.app single-column ATS master
  // --------------------------------------------------------------------------
  if (isSingleColumn) {
    return (
      <View style={[styles.previewWrapper, style]}>
        <ScrollView contentContainerStyle={styles.a4PageContainer} showsVerticalScrollIndicator={false}>
          {/* Centered Classic Header */}
          <View style={[styles.singleColHeader, { borderBottomColor: primaryColor }]}>
            <Text style={[styles.singleColName, isSerif && styles.serifFont]}>
              {personalInfo.fullName || 'SHRAWAN KUMAR YADAV'}
            </Text>
            <Text style={[styles.singleColTitle, { color: primaryColor }]}>
              {personalInfo.jobTitle || 'Senior Full-Stack & Mobile Architect'}
            </Text>

            {/* Single-line Contact Strip */}
            <View style={styles.singleColContacts}>
              {personalInfo.phone && <Text style={styles.contactItemText}>{personalInfo.phone}  •  </Text>}
              {personalInfo.email && <Text style={styles.contactItemText}>{personalInfo.email}  •  </Text>}
              {personalInfo.location && <Text style={styles.contactItemText}>{personalInfo.location}</Text>}
            </View>
            <View style={styles.singleColContacts}>
              {personalInfo.linkedin && <Text style={[styles.contactItemText, { color: primaryColor }]}>LinkedIn: {personalInfo.linkedin}  •  </Text>}
              {personalInfo.website && <Text style={[styles.contactItemText, { color: primaryColor }]}>GitHub / Web: {personalInfo.website}</Text>}
            </View>
          </View>

          {/* EDUCATION (Full Width) */}
          {educations && educations.length > 0 && (
            <View style={styles.singleColSection}>
              <Text style={[styles.singleColSectionTitle, isSerif && styles.serifFont]}>EDUCATION</Text>
              <View style={[styles.singleColDivider, { backgroundColor: primaryColor }]} />
              {educations.map((edu, idx) => (
                <View key={edu.id || idx} style={styles.singleColItem}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.itemBoldTitle}>{edu.school || 'ITS Engineering College'}</Text>
                    <Text style={styles.itemDateText}>
                      {edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate || '2025'}
                    </Text>
                  </View>
                  <Text style={styles.itemItalicText}>{edu.degree || 'B.Tech in Computer Science'}</Text>
                  {edu.bullets && edu.bullets.map((b, bIdx) => b ? (
                    <Text key={bIdx} style={styles.singleColBullet}>• {b}</Text>
                  ) : null)}
                </View>
              ))}
            </View>
          )}

          {/* PROJECTS (Full Width) */}
          {projects && projects.length > 0 && (
            <View style={styles.singleColSection}>
              <Text style={[styles.singleColSectionTitle, isSerif && styles.serifFont]}>PROJECTS</Text>
              <View style={[styles.singleColDivider, { backgroundColor: primaryColor }]} />
              {projects.map((proj, idx) => (
                <View key={proj.id || idx} style={styles.singleColItem}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.itemBoldTitle}>{proj.title || 'Resume Genie SaaS Platform'}</Text>
                    {proj.link ? <Text style={[styles.itemLinkText, { color: primaryColor }]}>{proj.link}</Text> : null}
                  </View>
                  {proj.description ? <Text style={styles.singleColDescText}>{proj.description}</Text> : null}
                  {proj.bullets && proj.bullets.map((b, bIdx) => b ? (
                    <Text key={bIdx} style={styles.singleColBullet}>• {b}</Text>
                  ) : null)}
                </View>
              ))}
            </View>
          )}

          {/* TECHNICAL SKILLS (Full Width) */}
          {skills && skills.length > 0 && (
            <View style={styles.singleColSection}>
              <Text style={[styles.singleColSectionTitle, isSerif && styles.serifFont]}>TECHNICAL SKILLS</Text>
              <View style={[styles.singleColDivider, { backgroundColor: primaryColor }]} />
              <Text style={styles.singleColSkillsInline}>
                <Text style={{ fontWeight: '700' }}>Languages & Tools: </Text>
                {skills.join('  •  ')}
              </Text>
            </View>
          )}

          {/* WORK EXPERIENCE (Full Width) */}
          {experiences && experiences.length > 0 && (
            <View style={styles.singleColSection}>
              <Text style={[styles.singleColSectionTitle, isSerif && styles.serifFont]}>WORK EXPERIENCE</Text>
              <View style={[styles.singleColDivider, { backgroundColor: primaryColor }]} />
              {experiences.map((exp, idx) => (
                <View key={exp.id || idx} style={styles.singleColItem}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.itemBoldTitle}>{exp.jobTitle || 'Senior Software Engineer'}</Text>
                    <Text style={styles.itemDateText}>
                      {exp.startDate || '2022'} – {exp.isCurrent ? 'Present' : exp.endDate || '2024'}
                    </Text>
                  </View>
                  <Text style={styles.itemItalicText}>
                    {exp.company || 'TechCorp Solutions'}{exp.location ? ` | ${exp.location}` : ''}
                  </Text>
                  {exp.bullets && exp.bullets.map((b, bIdx) => b ? (
                    <Text key={bIdx} style={styles.singleColBullet}>• {b}</Text>
                  ) : null)}
                </View>
              ))}
            </View>
          )}

          {/* SUMMARY */}
          {summary ? (
            <View style={styles.singleColSection}>
              <Text style={[styles.singleColSectionTitle, isSerif && styles.serifFont]}>PROFESSIONAL SUMMARY</Text>
              <View style={[styles.singleColDivider, { backgroundColor: primaryColor }]} />
              <Text style={styles.singleColSummaryText}>{summary}</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }

  // --------------------------------------------------------------------------
  // TEMPLATE VARIANT 2: TWO-COLUMN MODERN MATRIX (Modern Indigo, Executive Purple, Creative Emerald, Developer Monospace)
  // Matching user's skycodex.vercel.app 2-column layout
  // --------------------------------------------------------------------------
  return (
    <View style={[styles.previewWrapper, style]}>
      <ScrollView contentContainerStyle={styles.a4PageContainer} showsVerticalScrollIndicator={false}>
        {/* Top Header Banner */}
        <View style={[styles.modernHeader, { borderBottomColor: primaryColor }]}>
          <Text style={[styles.modernName, { color: primaryColor }, isMono && styles.monoFont]}>
            {personalInfo.fullName || 'SHRAWAN KUMAR YADAV'}
          </Text>
          <Text style={styles.modernTitle}>
            {personalInfo.jobTitle || 'Senior Full-Stack & Mobile Architect'}
          </Text>

          <View style={styles.modernContacts}>
            {personalInfo.email && <Text style={styles.contactItemText}>{personalInfo.email}  •  </Text>}
            {personalInfo.phone && <Text style={styles.contactItemText}>{personalInfo.phone}  •  </Text>}
            {personalInfo.location && <Text style={styles.contactItemText}>{personalInfo.location}</Text>}
          </View>
          {(personalInfo.linkedin || personalInfo.website) && (
            <View style={styles.modernContacts}>
              {personalInfo.linkedin && <Text style={[styles.contactItemText, { color: primaryColor }]}>{personalInfo.linkedin}  •  </Text>}
              {personalInfo.website && <Text style={[styles.contactItemText, { color: primaryColor }]}>{personalInfo.website}</Text>}
            </View>
          )}
        </View>

        {/* Summary */}
        {summary ? (
          <View style={styles.modernSummaryBox}>
            <Text style={[styles.columnHeading, { color: primaryColor }]}>ABOUT ME</Text>
            <Text style={styles.modernSummaryText}>{summary}</Text>
          </View>
        ) : null}

        {/* 2-Column Responsive Matrix */}
        <View style={styles.matrixContainer}>
          {/* Main Column (Experience & Projects) */}
          <View style={styles.matrixLeft}>
            {/* Experience */}
            {experiences && experiences.length > 0 && (
              <View style={styles.matrixSection}>
                <Text style={[styles.columnHeading, { color: primaryColor }]}>WORK EXPERIENCE</Text>
                <View style={[styles.matrixUnderline, { backgroundColor: primaryColor }]} />
                {experiences.map((exp, idx) => (
                  <View key={exp.id || idx} style={styles.itemBlock}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.itemBoldTitle}>{exp.jobTitle || 'Role'}</Text>
                      <Text style={styles.itemDateText}>
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                      </Text>
                    </View>
                    <Text style={styles.itemItalicText}>{exp.company}</Text>
                    {exp.bullets && exp.bullets.map((b, bIdx) => b ? (
                      <Text key={bIdx} style={styles.bulletText}>• {b}</Text>
                    ) : null)}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <View style={styles.matrixSection}>
                <Text style={[styles.columnHeading, { color: primaryColor }]}>KEY PROJECTS</Text>
                <View style={[styles.matrixUnderline, { backgroundColor: primaryColor }]} />
                {projects.map((proj, idx) => (
                  <View key={proj.id || idx} style={styles.itemBlock}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.itemBoldTitle}>{proj.title || 'Project'}</Text>
                      {proj.link ? <Text style={[styles.itemLinkText, { color: primaryColor }]}>{proj.link}</Text> : null}
                    </View>
                    {proj.description ? <Text style={styles.projectDescText}>{proj.description}</Text> : null}
                    {proj.bullets && proj.bullets.map((b, bIdx) => b ? (
                      <Text key={bIdx} style={styles.bulletText}>• {b}</Text>
                    ) : null)}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Sidebar Column (Skills & Education) */}
          <View style={styles.matrixRight}>
            {/* Skills */}
            {skills && skills.length > 0 && (
              <View style={styles.matrixSection}>
                <Text style={[styles.columnHeading, { color: primaryColor }]}>SKILLS</Text>
                <View style={[styles.matrixUnderline, { backgroundColor: primaryColor }]} />
                <View style={styles.skillsTagWrap}>
                  {skills.map((s, idx) => (
                    <View key={idx} style={[styles.skillPill, { borderColor: primaryColor + '40', backgroundColor: '#F8FAFC' }]}>
                      <Text style={[styles.skillPillText, { color: primaryColor }]}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Education */}
            {educations && educations.length > 0 && (
              <View style={styles.matrixSection}>
                <Text style={[styles.columnHeading, { color: primaryColor }]}>EDUCATION</Text>
                <View style={[styles.matrixUnderline, { backgroundColor: primaryColor }]} />
                {educations.map((edu, idx) => (
                  <View key={edu.id || idx} style={styles.itemBlock}>
                    <Text style={styles.itemBoldTitle}>{edu.degree || 'Degree'}</Text>
                    <Text style={styles.itemItalicText}>{edu.school || 'University'}</Text>
                    <Text style={styles.itemDateText}>{edu.startDate} – {edu.endDate}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  previewWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  a4PageContainer: {
    padding: 22,
    backgroundColor: '#FFFFFF',
    minHeight: 820,
  },
  // Single-Column ATS Styles
  singleColHeader: {
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    marginBottom: 12,
  },
  singleColName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#0F172A',
    textTransform: 'uppercase',
  },
  singleColTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 4,
  },
  singleColContacts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 2,
  },
  contactItemText: {
    fontSize: 10.5,
    color: '#334155',
  },
  singleColSection: {
    marginBottom: 12,
  },
  singleColSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#0F172A',
  },
  singleColDivider: {
    height: 1,
    width: '100%',
    marginTop: 2,
    marginBottom: 6,
  },
  singleColItem: {
    marginBottom: 6,
  },
  singleColBullet: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
    paddingLeft: 4,
    marginTop: 1,
  },
  singleColSkillsInline: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 16,
  },
  singleColDescText: {
    fontSize: 10.5,
    color: '#475569',
    marginTop: 1,
  },
  singleColSummaryText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 16,
    textAlign: 'justify',
  },
  // Two-Column Modern Styles
  modernHeader: {
    paddingBottom: 12,
    borderBottomWidth: 2,
    marginBottom: 12,
  },
  modernName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  modernTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  modernContacts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  modernSummaryBox: {
    marginBottom: 12,
  },
  modernSummaryText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 15,
  },
  columnHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  matrixContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 16,
  },
  matrixLeft: {
    flex: 2,
  },
  matrixRight: {
    flex: 1.2,
  },
  matrixSection: {
    marginBottom: 14,
  },
  matrixUnderline: {
    height: 1.5,
    width: '100%',
    marginTop: 2,
    marginBottom: 8,
    opacity: 0.6,
  },
  itemBlock: {
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  itemBoldTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  itemDateText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  itemItalicText: {
    fontSize: 10.5,
    color: '#475569',
    fontStyle: 'italic',
    marginTop: 1,
  },
  itemLinkText: {
    fontSize: 10,
    textDecorationLine: 'underline',
  },
  projectDescText: {
    fontSize: 10,
    color: '#475569',
    marginTop: 1,
  },
  bulletText: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 14,
    paddingLeft: 4,
    marginTop: 1,
  },
  skillsTagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillPill: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  skillPillText: {
    fontSize: 9.5,
    fontWeight: '600',
  },
  serifFont: {
    fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : 'serif',
  },
  monoFont: {
    fontFamily: Platform.OS === 'web' ? 'Courier New, monospace' : 'monospace',
  },
});

export default LiveResumePreview;

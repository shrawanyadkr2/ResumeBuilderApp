import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../theme/typography';
import InputField from '../../components/InputField';
import { useResume } from '../../context/ResumeContext';

export const Step1PersonalInfo = () => {
  const { colors } = useTheme();
  const { currentResume, updatePersonalInfo } = useResume();
  const info = currentResume.personalInfo || {};

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.surface }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.introHeader}>
        <Text style={[styles.sectionHeading, { color: colors.text.primary }]}>Personal Information</Text>
        <Text style={[styles.sectionSubheading, { color: colors.text.secondary }]}>
          Enter your contact information for recruiters and ATS parsers.
        </Text>
      </View>

      <InputField
        label="Full Name *"
        placeholder="e.g. Shrawan Kr Yadav"
        value={info.fullName}
        onChangeText={(val) => updatePersonalInfo('fullName', val)}
        autoCapitalize="words"
      />

      <InputField
        label="Professional Title *"
        placeholder="e.g. Senior Software Engineer"
        value={info.jobTitle}
        onChangeText={(val) => updatePersonalInfo('jobTitle', val)}
        autoCapitalize="words"
      />

      <InputField
        label="Email Address *"
        placeholder="e.g. shrawan.yadav@skydevx.com"
        value={info.email}
        onChangeText={(val) => updatePersonalInfo('email', val)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <InputField
        label="Phone Number"
        placeholder="e.g. +91 98765 43210"
        value={info.phone}
        onChangeText={(val) => updatePersonalInfo('phone', val)}
        keyboardType="phone-pad"
      />

      <InputField
        label="Location / City, Country"
        placeholder="e.g. Bengaluru, India (or Remote)"
        value={info.location}
        onChangeText={(val) => updatePersonalInfo('location', val)}
      />

      <InputField
        label="LinkedIn Profile URL"
        placeholder="e.g. linkedin.com/in/shrawan-kr-yadav"
        value={info.linkedin}
        onChangeText={(val) => updatePersonalInfo('linkedin', val)}
        autoCapitalize="none"
      />

      <InputField
        label="Portfolio / GitHub / Website"
        placeholder="e.g. https://skydevx.com/shrawan"
        value={info.website}
        onChangeText={(val) => updatePersonalInfo('website', val)}
        autoCapitalize="none"
      />
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
});

export default Step1PersonalInfo;

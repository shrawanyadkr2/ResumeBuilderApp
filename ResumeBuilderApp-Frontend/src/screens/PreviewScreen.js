import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';
import Header from '../components/Header';
import Button from '../components/Button';
import LiveResumePreview from '../components/LiveResumePreview';
import { useResume } from '../context/ResumeContext';
import { DownloadIcon } from '../components/Icons';

export const PreviewScreen = ({ onBack, onGoToExport, onEdit }) => {
  const { currentResume } = useResume();

  return (
    <View style={styles.container}>
      <Header
        title="Resume Preview"
        subtitle="Live ATS Representation"
        onBack={onBack}
        showPreview={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            ✨ Live preview reflects your edits in real time.
          </Text>
        </View>

        {/* Live Resume Sheet */}
        <LiveResumePreview resume={currentResume} style={styles.previewCard} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <Button
          title="Back to Edit"
          onPress={onBack}
          variant="outline"
          style={styles.backBtn}
        />
        <Button
          title="Export / Download"
          onPress={onGoToExport}
          variant="primary"
          icon={<DownloadIcon size={18} color="#FFFFFF" />}
          style={styles.exportBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  banner: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#D4E2FF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  bannerText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  previewCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    gap: 12,
  },
  backBtn: {
    flex: 1,
  },
  exportBtn: {
    flex: 1.5,
  },
});

export default PreviewScreen;

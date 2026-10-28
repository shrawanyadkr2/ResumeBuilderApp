import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import Header from '../components/Header';
import TemplateCardPreview from '../components/TemplateCardPreview';
import GoldenButton from '../components/GoldenButton';
import PlusLifetimeBadge from '../components/PlusLifetimeBadge';
import { RESUME_TEMPLATES } from '../constants/templates.config';
import { SparklesIcon } from '../components/Icons';

export const TemplateMarketplaceScreen = ({ onSelectTemplate, onBack }) => {
  const { colors } = useTheme();
  const { user, upgradeToPlus } = useAuth();
  const { currentResume, setTemplate } = useResume();
  const [filter, setFilter] = useState('All'); // 'All' | 'Basic' | 'Premium'
  const [upgrading, setUpgrading] = useState(false);

  const isPlus = !!user?.isDemoMode || user?.subscriptionTier === 'PLUS' || user?.subscriptionPlan === 'PLUS';

  const filtered = RESUME_TEMPLATES.filter((tmpl) => {
    if (filter === 'Basic') return !tmpl.isPremium;
    if (filter === 'Premium') return tmpl.isPremium;
    return true;
  });

  const handlePick = async (tmpl) => {
    if (tmpl.isPremium && !isPlus) {
      setUpgrading(true);
      try {
        const res = await upgradeToPlus();
        if (res.success) {
          setTemplate(tmpl.id);
          if (onSelectTemplate) onSelectTemplate(tmpl);
        }
      } finally {
        setUpgrading(false);
      }
      return;
    }
    setTemplate(tmpl.id);
    if (onSelectTemplate) onSelectTemplate(tmpl);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#090D16' }]}>
      <Header
        title="Template Marketplace"
        subtitle="ATS-Optimized Designs"
        onBack={onBack}
        showPreview={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Section */}
        <View style={styles.bannerHeader}>
          {/* Exact User Screenshot 2: Plus Lifetime Badge */}
          <View style={styles.lifetimeBadgeRow}>
            <PlusLifetimeBadge label="Plus Lifetime" />
          </View>

          <Text style={styles.bannerTitle}>
            Choose Your <Text style={{ color: '#6366F1' }}>Resume Template</Text>
          </Text>
          <Text style={styles.bannerSubtitle}>
            Select a free baseline or select one of our golden PLUS executive templates engineered to pass 99% of corporate ATS algorithms.
          </Text>

          {/* Filter Tabs */}
          <View style={styles.tabsRow}>
            {['All', 'Basic', 'Premium'].map((tab) => {
              const isActive = filter === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabButton,
                    isActive && styles.activeTabButton,
                  ]}
                  onPress={() => setFilter(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
                    {tab === 'All' ? 'All Templates' : tab === 'Basic' ? 'Basic (Free)' : 'Premium (PLUS)'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Template Cards Grid */}
        <View style={styles.gridContainer}>
          {filtered.map((tmpl) => {
            const isPlus = tmpl.isPremium;
            const isSelected = currentResume.templateId === tmpl.id;

            return (
              <View
                key={tmpl.id}
                style={[
                  styles.templateCard,
                  isPlus && styles.goldBorderCard,
                  isSelected && styles.selectedGlow,
                ]}
              >
                {/* Golden PLUS Ribbon */}
                {isPlus && (
                  <View style={styles.plusRibbon}>
                    <SparklesIcon size={12} color="#000000" />
                    <Text style={styles.plusRibbonText}>PLUS</Text>
                  </View>
                )}

                {/* Live Card Mini Preview */}
                <TemplateCardPreview template={tmpl} />

                {/* Template Info */}
                <View style={styles.cardInfo}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{tmpl.name}</Text>
                    <View style={[styles.catBadge, isPlus ? styles.goldBadge : styles.basicBadge]}>
                      <Text style={[styles.catBadgeText, isPlus ? { color: '#000000' } : { color: '#CBD5E1' }]}>
                        {tmpl.category}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardDesc}>{tmpl.description}</Text>
                </View>

                {/* Action CTA: Exact User Screenshot 1 Golden Gradient Button for PLUS */}
                {isPlus ? (
                  <GoldenButton
                    title="Use PLUS Template  →"
                    onPress={() => handlePick(tmpl)}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.indigoButton}
                    onPress={() => handlePick(tmpl)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.indigoButtonText}>Use Free Template  →</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Resume Genie  •  Professional Template Gallery</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lifetimeBadgeRow: {
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 340,
    lineHeight: 17,
    marginBottom: 14,
  },
  tabsRow: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'center',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  gridContainer: {
    gap: 20,
  },
  templateCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1F2937',
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  goldBorderCard: {
    borderColor: '#F59E0B60',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.15,
  },
  selectedGlow: {
    borderColor: '#6366F1',
    borderWidth: 2,
  },
  plusRibbon: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  plusRibbonText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
  },
  cardInfo: {
    marginTop: 14,
    marginBottom: 14,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  catBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  basicBadge: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  goldBadge: {
    backgroundColor: '#F59E0B',
  },
  catBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  cardDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
  },
  indigoButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indigoButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footer: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    alignItems: 'center',
    backgroundColor: '#090D16',
  },
  footerText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
});

export default TemplateMarketplaceScreen;

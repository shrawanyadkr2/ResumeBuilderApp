import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import typography from '../theme/typography';
import Button from '../components/Button';
import GoldenButton from '../components/GoldenButton';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { PlusIcon, DocumentIcon, TrashIcon, EyeIcon, SunIcon, MoonIcon, SparklesIcon, ArrowLeftIcon } from '../components/Icons';
import SkyDevXLogo from '../components/SkyDevXLogo';

export const DashboardScreen = ({
  onStartNewResume,
  onEditResume,
  onViewPreview,
  onGoToProfile,
  onBack,
}) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, upgradeToPlus } = useAuth();
  const { resumes, startNewResume, deleteResume, setCurrentResume } = useResume();
  const [isUpgrading, setIsUpgrading] = React.useState(false);
  const [upgradeResult, setUpgradeResult] = React.useState(null);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setUpgradeResult(null);
    try {
      const res = await upgradeToPlus();
      if (res.success) {
        setUpgradeResult({ type: 'success', text: res.message || 'Payment confirmed! Account upgraded to PLUS.' });
        setTimeout(() => setUpgradeResult(null), 5000);
      } else {
        setUpgradeResult({ type: 'error', text: res.error || 'Upgrade payment was not completed.' });
      }
    } catch (e) {
      setUpgradeResult({ type: 'error', text: e.message || 'Payment error' });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCreateNew = () => {
    startNewResume();
    if (onStartNewResume) onStartNewResume();
  };

  const handleEdit = (resume) => {
    setCurrentResume(resume);
    if (onEditResume) onEditResume(resume);
  };

  const isDemo = !!user?.isDemoMode;
  const isPlus = isDemo || user?.subscriptionTier === 'PLUS' || user?.subscriptionPlan === 'PLUS';
  const displayName = user?.name || user?.fullName || 'Candidate';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sleek Mobile Phone Top Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.ui.border }]}>
        <View style={styles.topLeftRow}>
          {onBack && (
            <TouchableOpacity
              style={[styles.backBtn, { backgroundColor: colors.ui.inputBg }]}
              onPress={onBack}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeftIcon size={18} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          <SkyDevXLogo size={26} variant="compact" isDark={isDark} showTagline={false} />
        </View>

        <View style={styles.topRightActions}>
          <TouchableOpacity
            style={[styles.themeToggleBtn, { backgroundColor: colors.ui.inputBg }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            {isDark ? <SunIcon size={18} color="#FBBF24" /> : <MoonIcon size={18} color={colors.primary} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.profileBadge,
              {
                backgroundColor: isPlus ? '#FEF3C7' : colors.primaryLight,
                borderColor: isPlus ? '#F59E0B' : colors.primary + '40',
              },
            ]}
            onPress={onGoToProfile}
            activeOpacity={0.7}
          >
            <SparklesIcon size={12} color={isPlus ? '#D97706' : colors.primary} />
            <Text style={[styles.planBadgeText, { color: isPlus ? '#B45309' : colors.primary }]}>
              {isDemo ? 'PLUS' : (user?.subscriptionTier || 'FREE')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.avatarCircleBtn,
              {
                borderColor: isPlus ? '#F59E0B' : colors.ui.border,
                borderWidth: isPlus ? 2 : 1,
                backgroundColor: colors.primary,
              },
            ]}
            onPress={onGoToProfile}
            activeOpacity={0.8}
          >
            {user?.profileImageUrl ? (
              <Image
                source={typeof user.profileImageUrl === 'string' ? { uri: user.profileImageUrl } : user.profileImageUrl}
                style={styles.avatarImg}
              />
            ) : (
              <Text style={styles.avatarLetter}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            )}
            {isPlus && (
              <View style={styles.miniCrownDot}>
                <Text style={styles.crownEmoji}>👑</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Workspace Banner */}
        <View style={[styles.brandingBanner, { backgroundColor: colors.cardBg, borderColor: isPlus ? '#F59E0B50' : colors.primary + '30' }]}>
          <View style={styles.brandingBannerLeft}>
            <Text style={[styles.bannerKicker, { color: isPlus ? '#D97706' : colors.primary }]}>
              {isDemo ? 'PLUS LIFETIME SHOWCASE' : 'CANDIDATE WORKSPACE'}
            </Text>
            <Text style={[styles.bannerTitle, { color: colors.text.primary }]}>
              Welcome, {displayName}
            </Text>
            <Text style={[styles.bannerSubtitle, { color: colors.text.secondary }]}>
              {isDemo
                ? 'All ATS-optimized templates, color customization, and PDF exports are unlocked.'
                : `Account: ${user?.email || 'Signed In'} • Private cloud resume storage.`}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.verifiedBadge, { backgroundColor: isPlus ? '#D97706' : colors.primary }]}
            onPress={onGoToProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.verifiedText}>{isDemo ? 'Showcase' : 'My Account'}</Text>
          </TouchableOpacity>
        </View>

        {/* Upgrade to PLUS Lifetime Card (If Free) */}
        {!isPlus && !isDemo && (
          <View style={[styles.upgradeBannerCard, { backgroundColor: '#181206', borderColor: '#F59E0B' }]}>
            <View style={styles.upgradeBannerLeft}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <SparklesIcon size={16} color="#F59E0B" />
                <Text style={{ color: '#F59E0B', fontWeight: '800', fontSize: 12, letterSpacing: 0.5 }}>
                  UPGRADE TO PLUS LIFETIME
                </Text>
              </View>
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16, marginBottom: 4 }}>
                Unlock All 7 ATS Templates (₹499)
              </Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, lineHeight: 16 }}>
                Razorpay test payment • Queen Crown badge & high-res vector PDFs included.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.payNowBtn}
              onPress={handleUpgrade}
              disabled={isUpgrading}
              activeOpacity={0.85}
            >
              <Text style={styles.payNowText}>
                {isUpgrading ? 'Processing...' : 'Pay ₹499'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {upgradeResult && (
          <View
            style={[
              styles.upgradeMsgToast,
              { backgroundColor: upgradeResult.type === 'success' ? '#059669' : '#DC2626' },
            ]}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
              {upgradeResult.text}
            </Text>
          </View>
        )}

        {/* Create Resume Action Card */}
        <TouchableOpacity
          style={[styles.createCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}
          onPress={handleCreateNew}
          activeOpacity={0.8}
        >
          <View style={[styles.createIconCircle, { backgroundColor: colors.primary }]}>
            <PlusIcon size={24} color="#FFFFFF" />
          </View>
          <View style={styles.createTextWrapper}>
            <Text style={[styles.createTitle, { color: colors.text.primary }]}>Create New Resume</Text>
            <Text style={[styles.createSubtitle, { color: colors.text.secondary }]}>
              Choose from 7 ATS-optimized templates with live instant preview
            </Text>
          </View>
        </TouchableOpacity>

        {/* Resumes List Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            SAVED RESUMES ({resumes.length})
          </Text>
        </View>

        {/* Resumes List */}
        {resumes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <DocumentIcon size={48} color={colors.ui.placeholder} />
            <Text style={[styles.emptyTitle, { color: colors.text.secondary }]}>No resumes created yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.text.muted }]}>
              Tap "Create New Resume" above to start your career story.
            </Text>
          </View>
        ) : (
          resumes.map((resume, idx) => (
            <View
              key={resume.id || idx}
              style={[
                styles.resumeCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.ui.border,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.resumeIcon, { backgroundColor: colors.primaryLight }]}>
                  <DocumentIcon size={24} color={colors.primary} />
                </View>
                <View style={styles.resumeInfo}>
                  <Text style={[styles.resumeTitle, { color: colors.text.primary }]} numberOfLines={1}>
                    {resume.title || resume.personalInfo?.fullName || 'Untitled Resume'}
                  </Text>
                  <Text style={[styles.resumeMeta, { color: colors.text.secondary }]}>
                    ATS-Optimized • Template: {resume.templateId || 'Modern'}
                  </Text>
                </View>
              </View>

              <View style={[styles.cardActions, { borderTopColor: colors.ui.divider }]}>
                <Button
                  title="Edit Resume"
                  onPress={() => handleEdit(resume)}
                  variant="primary"
                  size="small"
                  style={styles.actionBtn}
                />
                <Button
                  title="Preview"
                  onPress={() => {
                    setCurrentResume(resume);
                    if (onViewPreview) onViewPreview();
                  }}
                  variant="outline"
                  size="small"
                  icon={<EyeIcon size={14} color={colors.primary} />}
                  style={styles.actionBtn}
                />
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteResume(resume.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <TrashIcon size={18} color={colors.status.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Subtle Clean Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.ui.border }]}>
        <Text style={[styles.footerText, { color: colors.text.muted }]}>Resume Genie  •  ATS Resume Platform</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  topLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeToggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 3,
  },
  planBadgeText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  avatarCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  miniCrownDot: {
    position: 'absolute',
    top: -6,
    right: -4,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  crownEmoji: {
    fontSize: 9,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  brandingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 18,
  },
  brandingBannerLeft: {
    flex: 1,
    marginRight: 12,
  },
  bannerKicker: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerTitle: {
    ...typography.h2,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerSubtitle: {
    ...typography.caption,
    fontSize: 13,
    lineHeight: 18,
  },
  verifiedBadge: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  upgradeBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  upgradeBannerLeft: {
    flex: 1,
    marginRight: 12,
  },
  payNowBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  upgradeMsgToast: {
    backgroundColor: '#059669',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    alignItems: 'center',
  },
  createCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  createIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  createTextWrapper: {
    flex: 1,
  },
  createTitle: {
    ...typography.h3,
    fontSize: 17,
    marginBottom: 4,
  },
  createSubtitle: {
    ...typography.caption,
    fontSize: 13,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    ...typography.h3,
    marginTop: 14,
    marginBottom: 6,
  },
  emptySubtitle: {
    ...typography.caption,
    textAlign: 'center',
    maxWidth: 280,
  },
  resumeCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  resumeIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  resumeInfo: {
    flex: 1,
  },
  resumeTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: 2,
  },
  resumeMeta: {
    ...typography.caption,
    fontSize: 12,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  actionBtn: {
    paddingHorizontal: 14,
  },
  deleteBtn: {
    marginLeft: 'auto',
    padding: 8,
  },
  footer: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
  },
  footerText: {
    ...typography.caption,
    fontSize: 12,
    letterSpacing: 0.3,
  },
});

export default DashboardScreen;

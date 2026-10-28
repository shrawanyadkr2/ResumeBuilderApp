import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, Polygon } from 'react-native-svg';

/**
 * Queen Crown Hat SVG
 * Modeled after user screenshot: 3-point royal golden crown tilted on top-right,
 * featuring pearl tips, faceted gold body, and a sparkling 4-point star in the center.
 */
export const QueenCrown = ({ size = 48, style }) => {
  return (
    <View style={[styles.crownWrapper, style]}>
      <Svg width={size} height={size * 0.9} viewBox="0 0 100 90" fill="none">
        <Defs>
          <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FDE047" />
            <Stop offset="30%" stopColor="#F59E0B" />
            <Stop offset="70%" stopColor="#D97706" />
            <Stop offset="100%" stopColor="#B45309" />
          </LinearGradient>
          <LinearGradient id="innerShine" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
          </LinearGradient>
          <LinearGradient id="pearlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFDE7" />
            <Stop offset="100%" stopColor="#F59E0B" />
          </LinearGradient>
        </Defs>

        {/* Crown Base Curved Band */}
        <Path
          d="M 12 70 Q 50 82 88 70 L 84 62 Q 50 74 16 62 Z"
          fill="url(#goldGrad)"
          stroke="#B45309"
          strokeWidth="1.5"
        />

        {/* Crown Body (Left, Center, Right Peaks with recessed inner dips) */}
        <Path
          d="M 16 62
             L 10 28
             L 28 44
             L 50 14
             L 72 44
             L 90 28
             L 84 62
             Q 50 74 16 62 Z"
          fill="url(#goldGrad)"
          stroke="#B45309"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Inner Facet / Shadow Highlights */}
        {/* Left inner facet */}
        <Polygon
          points="16,62 10,28 28,44 32,64"
          fill="#D97706"
          opacity="0.5"
        />
        {/* Right inner facet */}
        <Polygon
          points="84,62 90,28 72,44 68,64"
          fill="#B45309"
          opacity="0.5"
        />
        {/* Center Peak Highlight */}
        <Polygon
          points="50,14 38,48 50,66 62,48"
          fill="url(#innerShine)"
        />

        {/* Top Spherical Pearls / Jewels */}
        {/* Left Pearl */}
        <Circle cx="10" cy="26" r="6" fill="url(#pearlGrad)" stroke="#B45309" strokeWidth="1.5" />
        <Circle cx="8.5" cy="24.5" r="2" fill="#FFFFFF" opacity="0.8" />

        {/* Center Tall Pearl */}
        <Circle cx="50" cy="12" r="7.5" fill="url(#pearlGrad)" stroke="#B45309" strokeWidth="1.5" />
        <Circle cx="48" cy="10" r="2.5" fill="#FFFFFF" opacity="0.9" />

        {/* Right Pearl */}
        <Circle cx="90" cy="26" r="6" fill="url(#pearlGrad)" stroke="#B45309" strokeWidth="1.5" />
        <Circle cx="88.5" cy="24.5" r="2" fill="#FFFFFF" opacity="0.8" />

        {/* Center Sparkling 4-point Diamond Star */}
        <Path
          d="M 50 30 Q 50 42 60 42 Q 50 42 50 54 Q 50 42 40 42 Q 50 42 50 30 Z"
          fill="#FFFFFF"
        />
        <Circle cx="50" cy="42" r="2" fill="#FEF08A" />
      </Svg>
    </View>
  );
};

/**
 * Camera Upload Icon
 */
const CameraIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color + '40'}
    />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" fill="#0F172A" />
  </Svg>
);

/**
 * PlusCrownAvatar Component
 * Implements the user's uploaded reference:
 * - Circular avatar (image or initial)
 * - Outer golden halo ring with spacing
 * - Queen Hat crown tilted at top-right with sparkling star
 * - Amber "PREMIUM" / "PLUS" pill badge at bottom
 * - Instant file upload support via Cloudinary
 */
export const PlusCrownAvatar = ({
  size = 96,
  imageUrl,
  name = 'Candidate',
  isPlus = true,
  badgeText = 'PREMIUM',
  editable = false,
  isUploading = false,
  onUploadFile,
  onPress,
}) => {
  const fileInputRef = useRef(null);
  const ringPadding = 6;
  const innerSize = size - ringPadding * 2 - 8;
  const initial = (name || 'C').charAt(0).toUpperCase();

  const handleAvatarClick = () => {
    if (editable && Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (onPress) {
      onPress();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0] && onUploadFile) {
      onUploadFile(e.target.files[0]);
    }
  };

  return (
    <View style={[styles.outerContainer, { width: size + 20, height: size + 28 }]}>
      {/* Hidden Web File Input for Cloudinary Upload */}
      {Platform.OS === 'web' && editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      )}

      {/* Tilted Queen Crown Hat on Top-Right */}
      {isPlus && (
        <View
          style={[
            styles.crownPosition,
            {
              top: -size * 0.22,
              right: -size * 0.08,
              transform: [{ rotate: '24deg' }],
            },
          ]}
          pointerEvents="none"
        >
          <QueenCrown size={size * 0.55} />
        </View>
      )}

      {/* Main Avatar Circle with Golden Outer Ring */}
      <TouchableOpacity
        activeOpacity={editable || onPress ? 0.8 : 1}
        onPress={handleAvatarClick}
        style={[
          styles.ringCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: isPlus ? '#F59E0B' : '#E2E8F0',
            borderWidth: isPlus ? 3.5 : 2,
          },
        ]}
      >
        <View
          style={[
            styles.innerCircle,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: '#64748B',
            },
          ]}
        >
          {imageUrl ? (
            <Image
              source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
              style={{ width: innerSize, height: innerSize, borderRadius: innerSize / 2 }}
              resizeMode="cover"
            />
          ) : (
            <Text style={[styles.initialText, { fontSize: innerSize * 0.42 }]}>{initial}</Text>
          )}

          {/* Uploading Spinner */}
          {isUploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#FFFFFF" size="small" />
            </View>
          )}
        </View>

        {/* Camera Upload Badge */}
        {editable && !isUploading && (
          <View style={styles.cameraBadge}>
            <CameraIcon size={13} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>

      {/* Amber/Gold "PREMIUM" / "PLUS" Bottom Pill Badge */}
      {isPlus && (
        <View style={styles.pillBadgeContainer}>
          <View style={styles.pillBadge}>
            <Text style={styles.pillBadgeText}>{badgeText}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  crownPosition: {
    position: 'absolute',
    zIndex: 10,
  },
  ringCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initialText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 18,
    right: -4,
    backgroundColor: '#D97706',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  pillBadgeContainer: {
    position: 'absolute',
    bottom: -6,
    zIndex: 10,
  },
  pillBadge: {
    backgroundColor: '#F59E0B',
    paddingVertical: 3,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  pillBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.8,
  },
});

export default PlusCrownAvatar;

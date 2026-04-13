import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../constants/AppContext';

/**
 * A single shimmer bone. The shimmer travels left-to-right (or right-to-left
 * for RTL) using a translating LinearGradient overlay on top of the base color.
 */
function Bone({ style }) {
  const { colors, isDark } = useApp();
  const shimmerX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerX, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // The shimmer highlight colors
  const shimmerColors = isDark
    ? ['transparent', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0.06)', 'transparent']
    : ['transparent', 'rgba(255,255,255,0.35)', 'rgba(255,255,255,0.70)', 'rgba(255,255,255,0.35)', 'transparent'];

  return (
    <View style={[{ backgroundColor: colors.surface2, overflow: 'hidden' }, style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateX: shimmerX.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-100%', '100%'],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={shimmerColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

export default function SkeletonCard() {
  const { colors } = useApp();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>

      {/* ── Image area ── */}
      <View style={styles.imgContainer}>
        <Bone style={styles.img} />
        {/* Badge placeholder top-left */}
        <View style={styles.badgePos}>
          <Bone style={[styles.badge, { borderRadius: 8 }]} />
        </View>
        {/* Favourite icon placeholder top-right */}
        <View style={styles.heartPos}>
          <Bone style={styles.heart} />
        </View>
      </View>

      {/* ── Card body ── */}
      <View style={styles.body}>

        {/* Car name + model line */}
        <Bone style={[styles.line, { width: '68%', height: 16 }]} />
        {/* Subtitle / year line */}
        <Bone style={[styles.line, { width: '42%', height: 12, marginTop: 8 }]} />

        {/* Specs row: range | charge | year chips */}
        <View style={styles.specsRow}>
          <View style={styles.specChip}>
            <Bone style={styles.specIcon} />
            <Bone style={[styles.line, { width: 44, height: 10 }]} />
          </View>
          <View style={styles.specChip}>
            <Bone style={styles.specIcon} />
            <Bone style={[styles.line, { width: 44, height: 10 }]} />
          </View>
          <View style={styles.specChip}>
            <Bone style={styles.specIcon} />
            <Bone style={[styles.line, { width: 36, height: 10 }]} />
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Price + CTA row */}
        <View style={styles.footer}>
          <View style={{ gap: 6 }}>
            <Bone style={[styles.line, { width: 56, height: 10 }]} />
            <Bone style={[styles.line, { width: 100, height: 18 }]} />
          </View>
          <Bone style={styles.ctaBtn} />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    // Shadow
    shadowColor: '#0f2744',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  // Image section
  imgContainer: {
    position: 'relative',
  },
  img: {
    height: 190,
    width: '100%',
    borderRadius: 0,
  },
  badgePos: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  badge: {
    width: 64,
    height: 24,
    borderRadius: 8,
  },
  heartPos: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  heart: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },

  // Body section
  body: {
    padding: 16,
    gap: 0,
  },
  line: {
    borderRadius: 6,
  },

  // Specs row
  specsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    marginBottom: 2,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specIcon: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },

  divider: {
    height: 1,
    marginVertical: 14,
    borderRadius: 1,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaBtn: {
    width: 110,
    height: 40,
    borderRadius: 12,
  },
});

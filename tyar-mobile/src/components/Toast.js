import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Config per toast type
const TYPE_CONFIG = {
  success: {
    icon:        'checkmark-circle',
    iconColor:   '#3CAEA3',
    accentColor: '#3CAEA3',
  },
  error: {
    icon:        'close-circle',
    iconColor:   '#e85d5d',
    accentColor: '#e85d5d',
  },
  info: {
    icon:        'information-circle',
    iconColor:   '#60a5fa',
    accentColor: '#60a5fa',
  },
};

export default function Toast({ visible, message, type = 'success', onHide, isDark = false }) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;
  const scale      = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      // Reset before animating in
      opacity.setValue(0);
      translateY.setValue(18);
      scale.setValue(0.92);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 14,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.94,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }),
        ]).start(() => onHide && onHide());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const cfg    = TYPE_CONFIG[type] || TYPE_CONFIG.success;
  const cardBg = isDark ? 'rgba(13,30,51,0.97)' : 'rgba(255,255,255,0.97)';
  const textColor = isDark ? '#deeeff' : '#0a2038';

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [{ translateY }, { scale }],
          shadowColor: isDark ? '#000' : '#0f2744',
          backgroundColor: cardBg,
          borderColor: cfg.accentColor + '35',
        },
      ]}
    >
      {/* Left accent bar */}
      <View style={[styles.accent, { backgroundColor: cfg.accentColor }]} />

      {/* Icon badge */}
      <View style={[styles.iconWrap, { backgroundColor: cfg.accentColor + '18' }]}>
        <Ionicons name={cfg.icon} size={22} color={cfg.iconColor} />
      </View>

      {/* Message */}
      <Text style={[styles.text, { color: textColor }]} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    zIndex: 9999,
    maxWidth: '90%',
    minWidth: 240,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingRight: 20,
    paddingLeft: 0,
    gap: 12,
    // Shadow
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginLeft: 0,
    marginRight: 4,
    flexShrink: 0,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    flexShrink: 1,
    letterSpacing: 0.1,
  },
});

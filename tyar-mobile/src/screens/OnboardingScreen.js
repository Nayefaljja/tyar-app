import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Dimensions, Animated, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../constants/AppContext';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    icon:    'car-sport-outline',
    accentA: '#3CAEA3',
    accentB: '#2a9d8f',
    ar:      { title: 'سوق السيارات الكهربائية', sub: 'اعثر على سيارتك الكهربائية المثالية بأفضل الأسعار مع ضمان الجودة' },
    en:      { title: 'EV Car Marketplace',       sub: 'Find your perfect electric vehicle at the best price with quality guarantee' },
  },
  {
    icon:    'flash-outline',
    accentA: '#2a9d8f',
    accentB: '#1a8a80',
    ar:      { title: 'تركيب الشواحن',       sub: 'فنيون معتمدون لتركيب الشواحن المنزلية والتجارية بضمان 6 أشهر' },
    en:      { title: 'Charger Installation', sub: 'Certified technicians for home & commercial charger setup with 6-month warranty' },
  },
  {
    icon:    'construct-outline',
    accentA: '#1a8a80',
    accentB: '#0f6b63',
    ar:      { title: 'صيانة متخصصة',    sub: 'جدول فحوصات البطارية وخدمات الصيانة الدورية مع فنيين متخصصين' },
    en:      { title: 'Expert Maintenance', sub: 'Schedule battery checks and routine servicing with specialist EV technicians' },
  },
];

// Animated icon container for each slide
function SlideIcon({ icon, accent }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const glow  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1.06, duration: 1600, useNativeDriver: true }),
          Animated.timing(glow,  { toValue: 1,    duration: 1600, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1,    duration: 1600, useNativeDriver: true }),
          Animated.timing(glow,  { toValue: 0,    duration: 1600, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  const outerOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.22] });

  return (
    <View style={styles.iconStack}>
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.glowRing,
          { borderColor: accent, opacity: outerOpacity },
        ]}
      />
      {/* Inner circle */}
      <Animated.View
        style={[
          styles.iconCircle,
          { backgroundColor: accent + '22', borderColor: accent + '55', transform: [{ scale: pulse }] },
        ]}
      >
        <Ionicons name={icon} size={68} color={accent} />
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen({ onDone }) {
  const { isRTL }  = useApp();
  const insets     = useSafeAreaInsets();
  const [current, setCurrent] = useState(0);
  const flatRef    = useRef(null);
  const dotAnim    = useRef(SLIDES.map(() => new Animated.Value(0))).current;
  const fadeAnim   = useRef(new Animated.Value(1)).current;
  const slideAnim  = useRef(new Animated.Value(0)).current;

  const animateDot = (idx) => {
    dotAnim.forEach((a, i) =>
      Animated.spring(a, {
        toValue: i === idx ? 1 : 0,
        tension: 80,
        friction: 10,
        useNativeDriver: false,
      }).start()
    );
  };

  useEffect(() => { animateDot(0); }, []);

  const transitionTo = (nextIdx) => {
    // Fade out
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: isRTL ? 40 : -40, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      flatRef.current?.scrollToIndex({ index: nextIdx, animated: false });
      setCurrent(nextIdx);
      animateDot(nextIdx);
      slideAnim.setValue(isRTL ? -40 : 40);
      // Fade in
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      ]).start();
    });
  };

  const goNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (current < SLIDES.length - 1) {
      transitionTo(current + 1);
    } else {
      onDone();
    }
  };

  const skip = () => {
    Haptics.selectionAsync();
    onDone();
  };

  const slide = SLIDES[current];

  return (
    <View style={styles.root}>
      {/* Full-screen gradient that morphs per slide */}
      <LinearGradient
        colors={['#091929', slide.accentA + 'bb', '#091929']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Subtle radial-like top accent */}
      <LinearGradient
        colors={[slide.accentA + '40', 'transparent']}
        style={styles.topGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Hidden FlatList — we drive slides programmatically */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={() => <View style={{ width }} />}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Content overlay — animated on transition */}
      <Animated.View
        style={[
          styles.contentArea,
          { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* Logo */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Icon */}
        <SlideIcon icon={slide.icon} accent={slide.accentA} />

        {/* Text */}
        <View style={styles.textBlock}>
          <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'center' }]}>
            {(isRTL ? slide.ar : slide.en).title}
          </Text>
          <Text style={[styles.sub, { textAlign: isRTL ? 'right' : 'center' }]}>
            {(isRTL ? slide.ar : slide.en).sub}
          </Text>
        </View>
      </Animated.View>

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((s, i) => {
          const w  = dotAnim[i].interpolate({ inputRange: [0, 1], outputRange: [7, 22] });
          const bg = dotAnim[i].interpolate({ inputRange: [0, 1], outputRange: ['#ffffff28', s.accentA] });
          return (
            <Animated.View key={i} style={[styles.dot, { width: w, backgroundColor: bg }]} />
          );
        })}
      </View>

      {/* Footer buttons */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 32) }]}>
        <TouchableOpacity onPress={skip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.skipText}>{isRTL ? 'تخطى' : 'Skip'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[slide.accentA, slide.accentB]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextText}>
              {current === SLIDES.length - 1
                ? (isRTL ? 'ابدأ الآن' : 'Get Started')
                : (isRTL ? 'التالي'    : 'Next')}
            </Text>
            <Ionicons
              name={isRTL ? 'arrow-back' : 'arrow-forward'}
              size={17}
              color="#fff"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#091929',
  },

  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.55,
    zIndex: 0,
  },

  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 20,
    zIndex: 1,
  },

  logo: {
    height: 36,
    width: 110,
    marginBottom: 44,
    opacity: 0.92,
  },

  // Icon
  iconStack: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  glowRing: {
    position: 'absolute',
    width: 196,
    height: 196,
    borderRadius: 98,
    borderWidth: 1.5,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text
  textBlock: {
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 35,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.62)',
    lineHeight: 24,
    letterSpacing: 0.1,
    maxWidth: 320,
  },

  // Dots
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
    zIndex: 1,
  },
  dot: {
    height: 7,
    borderRadius: 3.5,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    zIndex: 1,
  },
  skipText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // Next button
  nextBtn: {
    borderRadius: 50,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#3CAEA3',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 26,
    paddingVertical: 14,
  },
  nextText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});

/**
 * TYAR – HomeScreen.js
 * Production-quality EV platform home screen for Saudi Arabia.
 * Features: animated hero with floating particles, animated counters,
 * press-spring service cards, Why TYAR 2x2 grid, testimonial carousel
 * with swipe, FAQ accordion, floating header, dark mode, RTL, haptics.
 */

import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, Dimensions, Animated, PanResponder, StatusBar,
  Platform, I18nManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../constants/AppContext';
import { useNavigation } from '@react-navigation/native';
import FAQAccordion from '../components/FAQAccordion';

const { width: SCREEN_W } = Dimensions.get('window');
const PARTICLE_COUNT = 14;

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = (tr) => [
  { target: 2400, suffix: '+', label: tr.statsClients  },
  { target: 12,   suffix: '',  label: tr.statsCities   },
  { target: 3,    suffix: '',  label: tr.statsServices  },
  { target: 98,   suffix: '%', label: tr.statsSat       },
];

const SERVICES = (tr) => [
  {
    icon: 'car-sport',
    gradient: ['#3CAEA3', '#2a9d8f'],
    title: tr.s1Title,
    desc:  tr.s1Desc,
    screen: 'Marketplace',
    accentBg: 'rgba(60,174,163,0.12)',
  },
  {
    icon: 'flash',
    gradient: ['#2a9d8f', '#1e8c7e'],
    title: tr.s2Title,
    desc:  tr.s2Desc,
    screen: 'Charger',
    accentBg: 'rgba(42,157,143,0.12)',
  },
  {
    icon: 'construct',
    gradient: ['#1a8a80', '#0f6b63'],
    title: tr.s3Title,
    desc:  tr.s3Desc,
    screen: 'Maintenance',
    accentBg: 'rgba(26,138,128,0.12)',
  },
];

const WHY_FEATURES = (isRTL) => [
  {
    icon: 'leaf',
    iconColor: '#22c55e',
    bgColor: 'rgba(34,197,94,0.12)',
    titleAr: 'تقليل الكربون',
    titleEn: 'Carbon Reduction',
    descAr:  'ساهم في بيئة أنظف بالتحول للسيارات الكهربائية',
    descEn:  'Drive green and reduce your carbon footprint',
  },
  {
    icon: 'headset',
    iconColor: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.12)',
    titleAr: 'دعم 24/7',
    titleEn: '24/7 Support',
    descAr:  'فريق متخصص متاح على مدار الساعة لمساعدتك',
    descEn:  'Expert team available around the clock',
  },
  {
    icon: 'shield-checkmark',
    iconColor: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    titleAr: 'جودة موثقة',
    titleEn: 'Certified Quality',
    descAr:  'كل سيارة تخضع لفحص شامل ومعايير صارمة',
    descEn:  'Every vehicle passes rigorous inspection standards',
  },
  {
    icon: 'pricetag',
    iconColor: '#ec4899',
    bgColor: 'rgba(236,72,153,0.12)',
    titleAr: 'أفضل الأسعار',
    titleEn: 'Best Prices',
    descAr:  'أسعار تنافسية وشفافة بدون رسوم خفية',
    descEn:  'Competitive transparent pricing, no hidden fees',
  },
];

const TESTIMONIALS = [
  {
    ar: {
      text: '"تجربة رائعة مع تيار! اشتريت سيارة تسلا بحالة ممتازة وسعر تنافسي جداً."',
      name: 'أحمد السعيد', city: 'الرياض', initials: 'أس',
    },
    en: {
      text: '"Amazing experience with Tyar! Bought a Tesla in excellent condition at a very competitive price."',
      name: 'Ahmed Al-Saeed', city: 'Riyadh', initials: 'AA',
    },
    avatarColor: '#3CAEA3',
  },
  {
    ar: {
      text: '"فريق تيار ركّب الشاحن في منزلي باحترافية عالية وانتهوا خلال 3 ساعات فقط!"',
      name: 'سارة الخالدي', city: 'جدة', initials: 'سخ',
    },
    en: {
      text: '"Tyar installed my home charger professionally and finished in under 3 hours!"',
      name: 'Sara Al-Khalidi', city: 'Jeddah', initials: 'SK',
    },
    avatarColor: '#2a9d8f',
  },
  {
    ar: {
      text: '"خدمة الصيانة ممتازة وسريعة. الفنيون محترفون ويقدمون نصائح مفيدة جداً."',
      name: 'فهد العتيبي', city: 'الدمام', initials: 'فع',
    },
    en: {
      text: '"Excellent and fast maintenance service. The technicians are professional and give very useful advice."',
      name: 'Fahad Al-Otaibi', city: 'Dammam', initials: 'FO',
    },
    avatarColor: '#0f6b63',
  },
];

// ─── Floating Particles ───────────────────────────────────────────────────────

function Particles() {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      x:    Math.random() * SCREEN_W,
      size: 3 + Math.random() * 5,
      anim: new Animated.Value(0),
      delay: i * 280,
      opacity: 0.15 + Math.random() * 0.25,
    }))
  ).current;

  useEffect(() => {
    particles.forEach((p) => {
      const loop = () =>
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.timing(p.anim, {
            toValue: 1, duration: 5000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
        ]).start(() => { p.anim.setValue(0); loop(); });
      loop();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => {
        const translateY = p.anim.interpolate({
          inputRange: [0, 1], outputRange: [0, -220],
        });
        const opacity = p.anim.interpolate({
          inputRange: [0, 0.2, 0.8, 1],
          outputRange: [0, p.opacity, p.opacity, 0],
        });
        const scale = p.anim.interpolate({
          inputRange: [0, 0.5, 1], outputRange: [0.6, 1, 0.6],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              bottom: 30 + Math.random() * 40,
              left: p.x,
              width: p.size, height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: '#3CAEA3',
              transform: [{ translateY }, { scale }],
              opacity,
            }}
          />
        );
      })}
    </View>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix, label, colors }) {
  const val = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const listener = val.addListener(({ value }) =>
      setDisplay(Math.floor(value).toLocaleString())
    );
    Animated.timing(val, {
      toValue: target, duration: 2000,
      delay: 300, useNativeDriver: false,
    }).start();
    return () => val.removeListener(listener);
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 }}>
        {display}{suffix}
      </Text>
      <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4, textAlign: 'center', paddingHorizontal: 4 }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Service Card (spring press animation) ────────────────────────────────────

function ServiceCard({ svc, index, isRTL, colors, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn  = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }], marginBottom: 14 }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          sCard.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        {/* Icon badge */}
        <LinearGradient
          colors={svc.gradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={sCard.iconWrap}
        >
          <Ionicons name={svc.icon} size={26} color="#fff" />
        </LinearGradient>

        {/* Text */}
        <View style={{ flex: 1 }}>
          <Text style={[sCard.title, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {svc.title}
          </Text>
          <Text style={[sCard.desc, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
            {svc.desc}
          </Text>
          <View style={[sCard.link, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>
              {isRTL ? 'اعرف المزيد' : 'Learn More'}
            </Text>
            <Ionicons
              name={isRTL ? 'arrow-back' : 'arrow-forward'}
              size={14} color={colors.primary}
            />
          </View>
        </View>

        {/* Decorative accent */}
        <View style={[sCard.accent, { backgroundColor: svc.accentBg }]} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const sCard = StyleSheet.create({
  card: {
    borderRadius: 18, borderWidth: 1, padding: 18, gap: 16,
    shadowColor: '#000', shadowOpacity: 0.07, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12, elevation: 3, overflow: 'hidden',
  },
  iconWrap: {
    width: 58, height: 58, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 15, fontWeight: '700', marginBottom: 5 },
  desc:  { fontSize: 13, lineHeight: 20, marginBottom: 9 },
  link:  { alignItems: 'center', gap: 5 },
  accent: {
    position: 'absolute', right: -20, bottom: -20,
    width: 90, height: 90, borderRadius: 45,
  },
});

// ─── Why TYAR Feature Card ────────────────────────────────────────────────────

function FeatureCard({ feat, isRTL, colors }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[fCard.wrap, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPressIn={() =>
          Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 60 }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }).start()
        }
        style={[
          fCard.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={[fCard.iconCircle, { backgroundColor: feat.bgColor }]}>
          <Ionicons name={feat.icon} size={22} color={feat.iconColor} />
        </View>
        <Text style={[fCard.title, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? feat.titleAr : feat.titleEn}
        </Text>
        <Text style={[fCard.desc, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? feat.descAr : feat.descEn}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const fCard = StyleSheet.create({
  wrap: { width: (SCREEN_W - 52) / 2 },
  card: {
    borderRadius: 16, borderWidth: 1, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2,
  },
  iconCircle: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  title: { fontSize: 13, fontWeight: '700', marginBottom: 5, lineHeight: 18 },
  desc:  { fontSize: 11, lineHeight: 17, opacity: 0.85 },
});

// ─── Testimonials Carousel ────────────────────────────────────────────────────

function TestimonialsCarousel({ colors, isRTL }) {
  const [idx, setIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  const changeTo = useCallback((next) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setIdx(next);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  }, [fadeAnim]);

  const resetTimer = useCallback((nextIdx) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIdx((prev) => {
        const n = (prev + 1) % TESTIMONIALS.length;
        changeTo(n);
        return prev; // changeTo handles the update via setIdx inside
      });
    }, 4000);
  }, [changeTo]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      changeTo((idx + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [idx]);

  // Swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, { dx }) => {
        if (Math.abs(dx) > 40) {
          const dir = dx > 0 ? -1 : 1;
          const next = (idx + dir + TESTIMONIALS.length) % TESTIMONIALS.length;
          Haptics.selectionAsync();
          changeTo(next);
        }
      },
    })
  ).current;

  const t = TESTIMONIALS[idx];
  const data = isRTL ? t.ar : t.en;

  return (
    <View {...panResponder.panHandlers}>
      <Animated.View
        style={[
          tCard.card,
          { backgroundColor: colors.surface, borderColor: colors.border, opacity: fadeAnim },
        ]}
      >
        {/* Gradient decoration */}
        <LinearGradient
          colors={[colors.primary + '14', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />

        {/* Quote icon */}
        <Ionicons name="chatbubble-ellipses" size={28} color={colors.primary + '50'} style={{ marginBottom: 14 }} />

        {/* Stars */}
        <View style={[tCard.stars, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Ionicons key={s} name="star" size={13} color="#f59e0b" />
          ))}
        </View>

        {/* Quote text */}
        <Text style={[tCard.text, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {data.text}
        </Text>

        {/* Author */}
        <View style={[tCard.author, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[tCard.avatar, { backgroundColor: t.avatarColor }]}>
            <Text style={tCard.initials}>{data.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[tCard.name, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
              {data.name}
            </Text>
            <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}>
              <Ionicons name="location" size={11} color={colors.textMuted} />
              <Text style={[tCard.city, { color: colors.textMuted }]}>{data.city}</Text>
            </View>
          </View>
        </View>

        {/* Dots */}
        <View style={tCard.dots}>
          {TESTIMONIALS.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => { Haptics.selectionAsync(); changeTo(i); }}
            >
              <Animated.View
                style={[
                  tCard.dot,
                  {
                    backgroundColor: i === idx ? colors.primary : colors.border,
                    width: i === idx ? 20 : 8,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const tCard = StyleSheet.create({
  card: {
    borderRadius: 22, borderWidth: 1, padding: 24,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 }, shadowRadius: 16, elevation: 4,
  },
  stars:    { flexDirection: 'row', gap: 3, marginBottom: 14 },
  text:     { fontSize: 14, lineHeight: 24, fontStyle: 'italic', marginBottom: 20 },
  author:   { alignItems: 'center', gap: 14, marginBottom: 20 },
  avatar:   {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  initials: { color: '#fff', fontWeight: '800', fontSize: 15 },
  name:     { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  city:     { fontSize: 12 },
  dots:     { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot:      { height: 8, borderRadius: 4 },
});

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ tag, sub, isRTL, colors }) {
  return (
    <View style={{ marginBottom: 22 }}>
      <View style={[secH.tagRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[secH.dot, { backgroundColor: colors.primary }]} />
        <Text style={[secH.tag, { color: colors.primary }]}>{tag}</Text>
      </View>
      {sub ? (
        <Text style={[secH.sub, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

const secH = StyleSheet.create({
  tagRow: { alignItems: 'center', gap: 8, marginBottom: 6 },
  dot:    { width: 4, height: 18, borderRadius: 2 },
  tag:    { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  sub:    { fontSize: 13, lineHeight: 20 },
});

// ─── Main HomeScreen ──────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { colors, tr, isRTL, isDark, toggleTheme, toggleLang } = useApp();
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();
  const scrollY    = useRef(new Animated.Value(0)).current;

  // Header interpolations
  const headerBg = scrollY.interpolate({
    inputRange: [0, 90],
    outputRange: ['rgba(4,22,40,0)', colors.surface],
    extrapolate: 'clamp',
  });
  const headerShadow = scrollY.interpolate({
    inputRange: [0, 90], outputRange: [0, 0.14], extrapolate: 'clamp',
  });
  const headerBorder = scrollY.interpolate({
    inputRange: [0, 90], outputRange: [0, 1], extrapolate: 'clamp',
  });

  // Hero car icon float animation
  const carFloat = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(carFloat, { toValue: -10, duration: 1800, useNativeDriver: true }),
        Animated.timing(carFloat, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const press = (screen) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screen);
  };

  const hapticPress = (fn) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  const services = SERVICES(tr);
  const stats    = STATS(tr);
  const features = WHY_FEATURES(isRTL);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'light-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* ── Floating Header ── */}
      <Animated.View
        style={[
          hdr.container,
          {
            paddingTop: insets.top + 10,
            backgroundColor: headerBg,
            shadowOpacity: headerShadow,
            borderBottomWidth: headerBorder,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Image
          source={require('../../assets/logo.png')}
          style={hdr.logo}
          resizeMode="contain"
        />
        <View style={hdr.right}>
          <TouchableOpacity
            style={[hdr.iconBtn, { borderColor: colors.border + '99', backgroundColor: colors.surface + 'cc' }]}
            onPress={() => { Haptics.selectionAsync(); toggleTheme(); }}
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={17}
              color={colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[hdr.langBtn, { borderColor: colors.border + '99', backgroundColor: colors.surface + 'cc' }]}
            onPress={() => { Haptics.selectionAsync(); toggleLang(); }}
          >
            <Ionicons name="globe-outline" size={13} color={colors.textSoft} />
            <Text style={[hdr.langText, { color: colors.textSoft }]}>{tr.langToggle}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Scrollable Content ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >

        {/* ══════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════ */}
        <LinearGradient
          colors={['#020d1a', '#041628', '#082d3a', '#0d3d3a']}
          locations={[0, 0.3, 0.65, 1]}
          style={[hero.wrap, { paddingTop: insets.top + 64 }]}
        >
          {/* Floating particles */}
          <Particles />

          {/* Radial glow */}
          <View style={hero.glow} />

          {/* Badge */}
          <View style={[hero.badge, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Ionicons name="leaf" size={11} color="#3CAEA3" />
            <Text style={hero.badgeText}>{tr.heroBadge}</Text>
          </View>

          {/* Floating EV Car Icon */}
          <Animated.View style={[hero.carWrap, { transform: [{ translateY: carFloat }] }]}>
            <LinearGradient
              colors={['rgba(60,174,163,0.18)', 'rgba(60,174,163,0.04)']}
              style={hero.carCircle}
            >
              <Ionicons name="car-sport" size={50} color="#3CAEA3" />
            </LinearGradient>
          </Animated.View>

          {/* Headline */}
          <Text style={[hero.title, { textAlign: isRTL ? 'right' : 'left' }]}>
            {tr.heroTitle}
          </Text>
          <Text style={[hero.desc, { textAlign: isRTL ? 'right' : 'left' }]}>
            {tr.heroDesc}
          </Text>

          {/* CTA Buttons */}
          <View style={[hero.buttons, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              style={hero.btnPrimary}
              onPress={() => press('Marketplace')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#3CAEA3', '#2a9d8f']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={hero.btnGrad}
              >
                <Ionicons name="car-sport" size={15} color="#fff" />
                <Text style={hero.btnPrimaryText}>{tr.browseBtn}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={hero.btnOutline}
              onPress={() => press('Charger')}
              activeOpacity={0.82}
            >
              <Text style={hero.btnOutlineText}>{tr.exploreBtn}</Text>
              <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Scroll hint */}
          <View style={hero.scrollHint}>
            <Ionicons name="chevron-down" size={18} color="rgba(255,255,255,0.3)" />
          </View>
        </LinearGradient>

        {/* ══════════════════════════════════════════
            ANIMATED STATS STRIP
        ══════════════════════════════════════════ */}
        <View style={[stats_.strip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {stats.map((st, i) => (
            <React.Fragment key={i}>
              <AnimatedCounter {...st} colors={colors} />
              {i < stats.length - 1 && (
                <View style={[stats_.divider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ══════════════════════════════════════════
            SERVICES SECTION
        ══════════════════════════════════════════ */}
        <View style={sec.wrap}>
          <SectionHeader
            tag={tr.servicesTitle}
            sub={tr.servicesSub}
            isRTL={isRTL}
            colors={colors}
          />
          {services.map((svc, i) => (
            <ServiceCard
              key={i}
              svc={svc}
              index={i}
              isRTL={isRTL}
              colors={colors}
              onPress={() => press(svc.screen)}
            />
          ))}
        </View>

        {/* ══════════════════════════════════════════
            WHY TYAR – 2x2 FEATURE GRID
        ══════════════════════════════════════════ */}
        <View style={sec.wrap}>
          <SectionHeader
            tag={isRTL ? 'لماذا تيار؟' : 'Why TYAR?'}
            sub={isRTL
              ? 'نقدم تجربة متكاملة تجعل تبني السيارات الكهربائية سهلاً وموثوقاً'
              : 'We make the EV transition easy, reliable, and rewarding'}
            isRTL={isRTL}
            colors={colors}
          />

          {/* 2x2 Grid */}
          <View style={[why.grid]}>
            {features.map((feat, i) => (
              <FeatureCard key={i} feat={feat} isRTL={isRTL} colors={colors} />
            ))}
          </View>
        </View>

        {/* ══════════════════════════════════════════
            TESTIMONIALS CAROUSEL
        ══════════════════════════════════════════ */}
        <View style={sec.wrap}>
          <SectionHeader
            tag={isRTL ? 'آراء عملائنا' : 'Client Reviews'}
            sub={isRTL
              ? 'ثقة آلاف العملاء في المملكة العربية السعودية'
              : 'Trusted by thousands across Saudi Arabia'}
            isRTL={isRTL}
            colors={colors}
          />
          <TestimonialsCarousel colors={colors} isRTL={isRTL} />
        </View>

        {/* ══════════════════════════════════════════
            PROMO BANNER
        ══════════════════════════════════════════ */}
        <View style={[sec.wrap]}>
          <TouchableOpacity
            onPress={() => hapticPress(() => press('Charger'))}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#0f2744', '#0d3d3a']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={promo.card}
            >
              {/* Decorative circles */}
              <View style={promo.circle1} />
              <View style={promo.circle2} />

              <View style={{ flex: 1, zIndex: 1 }}>
                <View style={[promo.badge, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text style={promo.badgeText}>{isRTL ? 'عرض محدود' : 'Limited Offer'}</Text>
                </View>
                <Text style={[promo.title, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'ثبّت شاحنك المنزلي اليوم' : 'Install Your Home Charger Today'}
                </Text>
                <Text style={[promo.sub, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'ضمان 6 أشهر — تركيب خلال 24 ساعة' : '6-month warranty — Install within 24 hours'}
                </Text>
                <View style={[promo.btn, { alignSelf: isRTL ? 'flex-end' : 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={promo.btnText}>{isRTL ? 'احجز الآن' : 'Book Now'}</Text>
                  <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={13} color="#3CAEA3" />
                </View>
              </View>

              <Ionicons name="flash" size={80} color="rgba(60,174,163,0.15)" style={promo.flashIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════
            FAQ SECTION
        ══════════════════════════════════════════ */}
        <View style={sec.wrap}>
          <SectionHeader
            tag={isRTL ? 'الأسئلة الشائعة' : 'FAQ'}
            sub={isRTL
              ? 'إجابات على أكثر الأسئلة شيوعاً'
              : 'Answers to your most common questions'}
            isRTL={isRTL}
            colors={colors}
          />
          <FAQAccordion />
        </View>

        {/* ══════════════════════════════════════════
            FOOTER CTA
        ══════════════════════════════════════════ */}
        <View style={[sec.wrap, { paddingBottom: 0 }]}>
          <LinearGradient
            colors={['#3CAEA3', '#2a9d8f', '#1a8a80']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={footer.card}
          >
            <View style={footer.glow} />
            <Text style={[footer.title, { textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'ابدأ رحلتك الكهربائية' : 'Start Your EV Journey'}
            </Text>
            <Text style={[footer.sub, { textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL
                ? 'انضم إلى آلاف العملاء الراضين في المملكة'
                : 'Join thousands of satisfied EV owners across the Kingdom'}
            </Text>
            <TouchableOpacity
              style={footer.btn}
              onPress={() => hapticPress(() => press('Marketplace'))}
              activeOpacity={0.85}
            >
              <Text style={footer.btnText}>{isRTL ? 'تصفح السيارات' : 'Browse Cars'}</Text>
              <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={15} color="#3CAEA3" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={{ height: 50 + insets.bottom }} />
      </Animated.ScrollView>
    </View>
  );
}

// ─── Shared Style Objects ─────────────────────────────────────────────────────

const hdr = StyleSheet.create({
  container: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowRadius: 10,
    elevation: 6,
  },
  logo:     { height: 32, width: 86 },
  right:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn:  {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  langBtn:  {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderRadius: 50,
    paddingHorizontal: 11, paddingVertical: 6,
  },
  langText: { fontSize: 11, fontWeight: '700' },
});

const hero = StyleSheet.create({
  wrap: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: -60, right: -60,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(60,174,163,0.08)',
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(60,174,163,0.15)',
    borderRadius: 50, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(60,174,163,0.25)',
    marginBottom: 22,
  },
  badgeText: { fontSize: 11, color: '#3CAEA3', fontWeight: '600' },
  carWrap:   { alignItems: 'center', marginBottom: 20 },
  carCircle: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(60,174,163,0.2)',
  },
  title: {
    fontSize: 24, fontWeight: '800', color: '#fff',
    lineHeight: 34, letterSpacing: -0.5, marginBottom: 10,
  },
  desc: {
    fontSize: 13, color: 'rgba(255,255,255,0.68)',
    lineHeight: 21, marginBottom: 22,
  },
  buttons:  { gap: 10, flexWrap: 'wrap', marginBottom: 20 },
  btnPrimary: {
    borderRadius: 13, overflow: 'hidden',
    shadowColor: '#3CAEA3', shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 4,
  },
  btnGrad: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 22, paddingVertical: 14,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  btnOutline: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 13, paddingHorizontal: 22, paddingVertical: 14,
  },
  btnOutlineText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  scrollHint: { alignItems: 'center', opacity: 0.5 },
});

const stats_ = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2,
  },
  divider: { width: 1, marginVertical: 14 },
});

const sec = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 34 },
});

const why = StyleSheet.create({
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },
});

const promo = StyleSheet.create({
  card: {
    borderRadius: 20, padding: 24, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 }, shadowRadius: 16, elevation: 5,
  },
  circle1: {
    position: 'absolute', top: -30, right: 60,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(60,174,163,0.08)',
  },
  circle2: {
    position: 'absolute', bottom: -40, right: -20,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  badge: {
    backgroundColor: 'rgba(60,174,163,0.2)',
    borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4,
    marginBottom: 10,
  },
  badgeText: { fontSize: 10, color: '#3CAEA3', fontWeight: '700' },
  title:     { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 6, lineHeight: 24 },
  sub:       { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 16, lineHeight: 18 },
  btn: {
    alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(60,174,163,0.15)',
    borderWidth: 1, borderColor: 'rgba(60,174,163,0.4)',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
  },
  btnText:   { fontSize: 13, fontWeight: '700', color: '#3CAEA3' },
  flashIcon: { position: 'absolute', right: 10, bottom: -10 },
});

const footer = StyleSheet.create({
  card: {
    borderRadius: 22, padding: 28, overflow: 'hidden',
    shadowColor: '#3CAEA3', shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 6,
  },
  glow: {
    position: 'absolute', top: -40, left: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 10, lineHeight: 30 },
  sub:   { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 22, lineHeight: 20 },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 13,
    alignSelf: 'flex-start',
    shadowColor: '#000', shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3,
  },
  btnText: { fontSize: 14, fontWeight: '700', color: '#3CAEA3' },
});

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Animated, Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../constants/AppContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from '../components/Toast';

const { width } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────────
const TYPICAL_RANGE = 600; // km — for the range bar reference

// ─── Helpers ──────────────────────────────────────────────────────────────────
function batteryColor(pct) {
  if (pct >= 80) return '#22c55e';
  if (pct >= 60) return '#f59e0b';
  return '#ef4444';
}

function batteryLabel(pct, isRTL) {
  if (pct >= 80) return isRTL ? 'ممتازة' : 'Excellent';
  if (pct >= 60) return isRTL ? 'جيدة'   : 'Good';
  return isRTL ? 'منخفضة' : 'Low';
}

// ─── Animated battery bar ─────────────────────────────────────────────────────
function AnimatedBar({ percent, color, height = 8, trackColor = 'rgba(0,0,0,0.1)' }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: percent / 100,
      duration: 900,
      delay:    300,
      useNativeDriver: false,
    }).start();
  }, [percent]);
  const widthInterp = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View style={{ height, backgroundColor: trackColor, borderRadius: height / 2, overflow: 'hidden' }}>
      <Animated.View style={{ width: widthInterp, height, backgroundColor: color, borderRadius: height / 2 }} />
    </View>
  );
}

// ─── Star rating ──────────────────────────────────────────────────────────────
function Stars({ count = 5, filled = 4, size = 14 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < filled ? 'star' : 'star-outline'}
          size={size}
          color={i < filled ? '#f59e0b' : '#d1d5db'}
        />
      ))}
    </View>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionTitle({ label, isRTL, colors }) {
  return (
    <Text style={[sec.title, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
      {label}
    </Text>
  );
}
const sec = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function CarDetailScreen() {
  const { colors, isRTL } = useApp();
  const navigation         = useNavigation();
  const { car }            = useRoute().params;
  const insets             = useSafeAreaInsets();

  const [saved,     setSaved]     = useState(false);
  const [toast,     setToast]     = useState({ visible: false, message: '', type: 'success' });
  const heartScale  = useRef(new Animated.Value(1)).current;

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const handleSave = () => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.4, duration: 130, useNativeDriver: true }),
      Animated.spring(heartScale,  { toValue: 1,   useNativeDriver: true, speed: 25 }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = !saved;
    setSaved(next);
    showToast(
      next
        ? (isRTL ? 'تم الحفظ في المفضلة' : 'Saved to favorites')
        : (isRTL ? 'تمت الإزالة من المفضلة' : 'Removed from favorites'),
      next ? 'success' : 'error',
    );
  };

  const handleContact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showToast(isRTL ? 'سيتواصل معك البائع قريباً' : 'Seller will contact you soon');
  };

  const handleShare = async () => {
    Haptics.selectionAsync();
    try {
      await Share.share({
        message: isRTL
          ? `${car.make} ${car.model} ${car.year} — ${car.price.toLocaleString()} ر.س | تطبيق تيار`
          : `${car.make} ${car.model} ${car.year} — ${car.price.toLocaleString()} SAR | TYAR App`,
      });
    } catch (_) {}
  };

  const bColor   = batteryColor(car.battery);
  const bLabel   = batteryLabel(car.battery, isRTL);
  const rangePct = Math.min((car.range / TYPICAL_RANGE) * 100, 100);

  const SPECS = [
    { icon: 'calendar-outline',         label: isRTL ? 'سنة الصنع'        : 'Year',    value: String(car.year)                                 },
    { icon: 'speedometer-outline',      label: isRTL ? 'المسافة المقطوعة' : 'Mileage', value: `${car.km.toLocaleString()} ${isRTL ? 'كم' : 'km'}` },
    { icon: 'battery-charging-outline', label: isRTL ? 'صحة البطارية'     : 'Battery', value: `${car.battery}% — ${bLabel}`                   },
    { icon: 'flash-outline',            label: isRTL ? 'المدى الكهربائي'  : 'Range',   value: `${car.range} ${isRTL ? 'كم' : 'km'}`           },
    { icon: 'car-outline',              label: isRTL ? 'فئة السيارة'      : 'Type',    value: car.type                                         },
    { icon: 'color-palette-outline',    label: isRTL ? 'اللون'            : 'Color',   value: isRTL ? 'متوفر' : 'Available'                   },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Hero image area ── */}
        <LinearGradient colors={['#041628', '#0b2340', '#0f2a4a']} style={[img.area, { paddingTop: insets.top }]}>
          {/* Back button */}
          <TouchableOpacity
            style={[img.iconBtn, { [isRTL ? 'right' : 'left']: 20 }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={20} color="#fff" />
          </TouchableOpacity>

          {/* Share button */}
          <TouchableOpacity
            style={[img.iconBtn, { right: isRTL ? undefined : 66, left: isRTL ? 66 : undefined }]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Favorite button */}
          <TouchableOpacity
            style={[img.iconBtn, { [isRTL ? 'left' : 'right']: 20 }]}
            onPress={handleSave}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? '#ef4444' : '#fff'} />
            </Animated.View>
          </TouchableOpacity>

          {/* Car icon */}
          <Ionicons name="car-sport-outline" size={96} color="rgba(255,255,255,0.12)" style={{ marginTop: 24 }} />

          {/* Make / model / year */}
          <Text style={img.make}>{car.make} {car.model}</Text>
          <Text style={img.year}>{car.year}</Text>

          {/* Badge */}
          {car.badge && (
            <View style={img.badge}>
              <Text style={img.badgeText}>{isRTL ? car.badge : car.badgeEn}</Text>
            </View>
          )}

          {/* Battery bar */}
          <View style={[img.battWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="battery-charging-outline" size={16} color={bColor} />
            <View style={{ flex: 1 }}>
              <AnimatedBar percent={car.battery} color={bColor} height={6} trackColor="rgba(255,255,255,0.18)" />
            </View>
            <Text style={[img.battTxt, { color: bColor }]}>{car.battery}%</Text>
          </View>
        </LinearGradient>

        {/* ── Price card ── */}
        <View style={[price.card, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[price.label, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'السعر' : 'Asking Price'}
            </Text>
            <Text style={[price.value, { color: colors.primary, textAlign: isRTL ? 'right' : 'left' }]}>
              {car.price.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}
            </Text>
          </View>
          {car.badge && (
            <View style={[price.badge, { backgroundColor: colors.primary }]}>
              <Text style={price.badgeTxt}>{isRTL ? car.badge : car.badgeEn}</Text>
            </View>
          )}
        </View>

        {/* ── Battery health detail ── */}
        <View style={[section.wrap, { marginTop: 4 }]}>
          <SectionTitle label={isRTL ? 'صحة البطارية' : 'Battery Health'} isRTL={isRTL} colors={colors} />
          <View style={[batt.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[batt.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[batt.iconWrap, { backgroundColor: bColor + '1a' }]}>
                <Ionicons name="battery-charging-outline" size={22} color={bColor} />
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                  <Text style={[batt.label, { color: colors.textSoft }]}>
                    {isRTL ? 'مستوى الشحن الحالي' : 'State of Health'}
                  </Text>
                  <Text style={[batt.pct, { color: bColor }]}>{car.battery}% — {bLabel}</Text>
                </View>
                <AnimatedBar percent={car.battery} color={bColor} height={8} trackColor={colors.surface2} />
              </View>
            </View>
          </View>
        </View>

        {/* ── Range visualisation ── */}
        <View style={section.wrap}>
          <SectionTitle label={isRTL ? 'المدى الكهربائي' : 'Electric Range'} isRTL={isRTL} colors={colors} />
          <View style={[batt.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={[batt.label, { color: colors.textSoft }]}>
                {isRTL ? 'مدى هذه السيارة' : 'This vehicle'}
              </Text>
              <Text style={[batt.pct, { color: colors.primary }]}>
                {car.range} {isRTL ? 'كم' : 'km'}
              </Text>
            </View>
            <AnimatedBar percent={rangePct} color={colors.primary} height={8} trackColor={colors.surface2} />
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: 6 }}>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>0</Text>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>
                {isRTL ? `المرجع: ${TYPICAL_RANGE} كم` : `Ref: ${TYPICAL_RANGE} km`}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Specs grid ── */}
        <View style={section.wrap}>
          <SectionTitle label={isRTL ? 'المواصفات' : 'Specifications'} isRTL={isRTL} colors={colors} />
          <View style={grid.wrap}>
            {SPECS.map((spec, i) => (
              <View key={i} style={[grid.cell, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[grid.iconBox, { backgroundColor: colors.primary + '18' }]}>
                  <Ionicons name={spec.icon} size={20} color={colors.primary} />
                </View>
                <Text style={[grid.label, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                  {spec.label}
                </Text>
                <Text style={[grid.value, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                  {spec.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Inspection badge ── */}
        <View style={section.wrap}>
          <LinearGradient
            colors={[colors.primary + '1a', colors.primary + '08']}
            style={[insp.card, { borderColor: colors.primary + '45', flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            <View style={[insp.iconWrap, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[insp.title, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'فحص شامل معتمد ✓' : 'Certified Full Inspection ✓'}
              </Text>
              <Text style={[insp.sub, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL
                  ? 'مرّت بفحص 150 نقطة شامل البطارية، الأجهزة الكهربائية، وسجل الصيانة الكامل.'
                  : 'Passed a 150-point inspection covering battery, electrical systems, and full maintenance history.'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* ── Seller info ── */}
        <View style={section.wrap}>
          <SectionTitle label={isRTL ? 'معلومات البائع' : 'Seller Info'} isRTL={isRTL} colors={colors} />
          <View style={[seller.card, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {/* Avatar */}
            <View style={[seller.avatar, { backgroundColor: colors.primary + '22' }]}>
              <Ionicons name="person-outline" size={26} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[seller.name, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'وكالة تيار للسيارات' : 'TYAR Motors'}
              </Text>
              <Stars filled={4} />
              <Text style={[seller.meta, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? '٤.٨ · ١٢٨ تقييم · عضو موثّق' : '4.8 · 128 reviews · Verified Dealer'}
              </Text>
            </View>
            <View style={[seller.verifiedBadge, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '40' }]}>
              <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
              <Text style={[seller.verifiedTxt, { color: colors.primary }]}>
                {isRTL ? 'موثّق' : 'Verified'}
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* ── Bottom action bar ── */}
      <View style={[actions.bar, { paddingBottom: Math.max(16, insets.bottom) + 8, backgroundColor: colors.surface, borderTopColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {/* Save / heart */}
        <TouchableOpacity
          style={[actions.secondary, { borderColor: saved ? '#ef4444' : colors.primary, backgroundColor: saved ? '#ef444415' : 'transparent' }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={22} color={saved ? '#ef4444' : colors.primary} />
          </Animated.View>
        </TouchableOpacity>

        {/* Contact seller */}
        <TouchableOpacity
          style={[actions.primary, { backgroundColor: colors.primary, flex: 1 }]}
          onPress={handleContact}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#fff" />
          <Text style={actions.primaryTxt}>{isRTL ? 'تواصل مع البائع' : 'Contact Seller'}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Toast ── */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ visible: false, message: '', type: 'success' })}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const img = StyleSheet.create({
  area:     { height: 296, alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: 20 },
  iconBtn:  {
    position: 'absolute', top: 16,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  make:     { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 10 },
  year:     { fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  badge:    { backgroundColor: '#3CAEA3', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 5, marginTop: 8 },
  badgeText:{ fontSize: 12, color: '#fff', fontWeight: '700' },
  battWrap: { alignItems: 'center', gap: 8, marginTop: 16, width: width * 0.7 },
  battTxt:  { fontSize: 13, fontWeight: '700', width: 36, textAlign: 'right' },
});

const price = StyleSheet.create({
  card:     { alignItems: 'center', margin: 16, borderRadius: 18, borderWidth: 1, padding: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  label:    { fontSize: 12, marginBottom: 4 },
  value:    { fontSize: 24, fontWeight: '800' },
  badge:    { borderRadius: 50, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start' },
  badgeTxt: { fontSize: 12, color: '#fff', fontWeight: '700' },
});

const section = StyleSheet.create({
  wrap: { paddingHorizontal: 16, marginBottom: 16 },
});

const batt = StyleSheet.create({
  card:    { borderRadius: 16, borderWidth: 1, padding: 16 },
  row:     { alignItems: 'center', gap: 14 },
  iconWrap:{ width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label:   { fontSize: 13 },
  pct:     { fontSize: 13, fontWeight: '700' },
});

const grid = StyleSheet.create({
  wrap:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cell:    { width: (width - 52) / 2, borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  iconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  label:   { fontSize: 11, color: '#7a94b0' },
  value:   { fontSize: 14, fontWeight: '700' },
});

const insp = StyleSheet.create({
  card:    { alignItems: 'flex-start', gap: 14, borderRadius: 18, borderWidth: 1.5, padding: 18 },
  iconWrap:{ width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title:   { fontSize: 14, fontWeight: '800', marginBottom: 5 },
  sub:     { fontSize: 13, lineHeight: 20 },
});

const seller = StyleSheet.create({
  card:        { alignItems: 'center', gap: 14, borderRadius: 18, borderWidth: 1, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  avatar:      { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  name:        { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  meta:        { fontSize: 12, marginTop: 4 },
  verifiedBadge:{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 50, borderWidth: 1, paddingHorizontal: 9, paddingVertical: 4 },
  verifiedTxt: { fontSize: 11, fontWeight: '700' },
});

const actions = StyleSheet.create({
  bar:        { position: 'absolute', bottom: 0, left: 0, right: 0, gap: 12, padding: 16, borderTopWidth: 1 },
  secondary:  { width: 52, height: 52, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  primary:    { borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingVertical: 15 },
  primaryTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

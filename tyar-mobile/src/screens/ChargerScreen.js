import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Animated, ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../constants/AppContext';
import Toast from '../components/Toast';
import { submitChargerBooking } from '../lib/supabase';

// ─── Data ────────────────────────────────────────────────────────────────────

const TYPES = [
  {
    key: 'home',
    icon: 'home',
    ar: 'شاحن منزلي',
    en: 'Home Charger',
    power: '7.4 kW',
    priceEn: 'SAR 1,800 – 2,500',
    priceAr: '١٨٠٠ – ٢٥٠٠ ر.س',
  },
  {
    key: 'com',
    icon: 'business',
    ar: 'شاحن تجاري',
    en: 'Commercial',
    power: '22 kW',
    priceEn: 'SAR 4,500 – 8,000',
    priceAr: '٤٥٠٠ – ٨٠٠٠ ر.س',
  },
  {
    key: 'fast',
    icon: 'flash',
    ar: 'شاحن سريع',
    en: 'Fast Charger',
    power: '150 kW',
    priceEn: 'SAR 15,000+',
    priceAr: '١٥٠٠٠+ ر.س',
  },
];

const WHY = [
  { icon: 'shield-checkmark', ar: 'فنيون معتمدون',         en: 'Certified Technicians'  },
  { icon: 'time',             ar: 'تركيب خلال 24–48 ساعة', en: '24–48h Installation'    },
  { icon: 'construct',        ar: 'ضمان 6 أشهر',           en: '6-Month Warranty'       },
  { icon: 'call',             ar: 'دعم 24/7',               en: '24/7 Support'           },
];

const STEPS_AR = ['تقديم الطلب', 'الفحص الميداني', 'التركيب', 'الاختبار'];
const STEPS_EN = ['Submit Request', 'Site Inspection', 'Installation', 'Testing'];

const CITIES_AR = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'الخبر'];
const CITIES_EN = ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah', 'Khobar'];

// ─── Animated charger type card ───────────────────────────────────────────────

function TypeCard({ item, isSelected, isRTL, colors, onPress }) {
  const scale = useRef(new Animated.Value(isSelected ? 1.04 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isSelected ? 1.04 : 1,
      useNativeDriver: true,
      friction: 5,
      tension: 180,
    }).start();
  }, [isSelected]);

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={onPress}
        style={[
          typeCardStyle.card,
          {
            backgroundColor: isSelected ? colors.primary : colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
            shadowColor: isSelected ? colors.primary : '#000',
            shadowOpacity: isSelected ? 0.3 : 0.06,
            shadowRadius: isSelected ? 10 : 4,
            shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
            elevation: isSelected ? 8 : 2,
          },
        ]}
      >
        {/* Top accent bar */}
        {isSelected && (
          <View style={[typeCardStyle.accent, { backgroundColor: 'rgba(255,255,255,0.25)' }]} />
        )}
        <View
          style={[
            typeCardStyle.iconWrap,
            {
              backgroundColor: isSelected
                ? 'rgba(255,255,255,0.2)'
                : colors.primary + '18',
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={22}
            color={isSelected ? '#fff' : colors.primary}
          />
        </View>
        <Text
          style={[
            typeCardStyle.label,
            { color: isSelected ? '#fff' : colors.text },
          ]}
          numberOfLines={1}
        >
          {isRTL ? item.ar : item.en}
        </Text>
        <Text
          style={[
            typeCardStyle.power,
            { color: isSelected ? 'rgba(255,255,255,0.8)' : colors.primary },
          ]}
        >
          {item.power}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const typeCardStyle = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 7,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  power: { fontSize: 11, fontWeight: '600' },
});

// ─── Animated price card ──────────────────────────────────────────────────────

function PriceCard({ type, isRTL, colors }) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(12);
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 6, useNativeDriver: true }),
    ]).start();
  }, [type.key]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <LinearGradient
        colors={['#0a2540', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={priceStyle.card}
      >
        {/* Decorative circle */}
        <View style={priceStyle.deco} />
        <View style={[priceStyle.inner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[priceStyle.label, { textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'السعر التقديري' : 'Estimated Price'}
            </Text>
            <Text style={[priceStyle.price, { textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? type.priceAr : type.priceEn}
            </Text>
            <View style={[priceStyle.badge, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="checkmark-circle" size={13} color="#3CAEA3" />
              <Text style={priceStyle.badgeText}>
                {isRTL ? 'فحص موقع مجاني' : 'Free site inspection'}
              </Text>
            </View>
          </View>
          <View style={priceStyle.powerPill}>
            <Text style={priceStyle.powerText}>{type.power}</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const priceStyle = StyleSheet.create({
  card: { borderRadius: 18, padding: 20, overflow: 'hidden', marginBottom: 4 },
  deco: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(60,174,163,0.08)',
    top: -40, right: -40,
  },
  inner: { alignItems: 'center', gap: 12 },
  label: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 4 },
  price: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  badge: { alignItems: 'center', gap: 5, marginTop: 8 },
  badgeText: { fontSize: 12, color: '#3CAEA3', fontWeight: '600' },
  powerPill: {
    backgroundColor: 'rgba(60,174,163,0.2)',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(60,174,163,0.35)',
  },
  powerText: { color: '#3CAEA3', fontWeight: '800', fontSize: 15 },
});

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ selectedType, cityIdx, isRTL, colors, onReset, topInset = 0 }) {
  const checkScale = useRef(new Animated.Value(0)).current;
  const fadeIn     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(checkScale, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }),
        Animated.timing(fadeIn,     { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
      ]),
    ]).start();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const cityLabel = isRTL ? CITIES_AR[cityIdx] : CITIES_EN[cityIdx];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={['#041628', '#0a2240', '#0f2744']} style={[successSt.hero, { paddingTop: topInset + 20 }]}>
        {/* Glow ring */}
        <View style={successSt.glowRing}>
          <Animated.View style={{ transform: [{ scale: checkScale }] }}>
            <LinearGradient
              colors={['#3CAEA3', '#2a9d8f']}
              style={successSt.checkCircle}
            >
              <Ionicons name="checkmark" size={52} color="#fff" />
            </LinearGradient>
          </Animated.View>
        </View>
        <Animated.View style={{ opacity: fadeIn, alignItems: 'center' }}>
          <Text style={successSt.title}>
            {isRTL ? 'تم إرسال طلبك!' : 'Request Sent!'}
          </Text>
          <Text style={successSt.sub}>
            {isRTL
              ? 'سيتواصل معك فريقنا خلال ساعتين'
              : 'Our team will contact you within 2 hours'}
          </Text>
        </Animated.View>
      </LinearGradient>

      <Animated.View style={[{ opacity: fadeIn }, successSt.body]}>
        {/* Order summary */}
        <View
          style={[
            successSt.summaryCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[successSt.summaryTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'ملخص الطلب' : 'Order Summary'}
          </Text>

          <SummaryRow
            label={isRTL ? 'نوع الشاحن' : 'Charger Type'}
            value={isRTL ? selectedType.ar : selectedType.en}
            colors={colors}
            icon="flash"
            isRTL={isRTL}
          />
          <SummaryRow
            label={isRTL ? 'القوة' : 'Power'}
            value={selectedType.power}
            colors={colors}
            icon="speedometer"
            valueTeal
            isRTL={isRTL}
          />
          <SummaryRow
            label={isRTL ? 'المدينة' : 'City'}
            value={cityLabel ?? '—'}
            colors={colors}
            icon="location"
            isRTL={isRTL}
          />
          <SummaryRow
            label={isRTL ? 'السعر التقديري' : 'Est. Price'}
            value={isRTL ? selectedType.priceAr : selectedType.priceEn}
            colors={colors}
            icon="pricetag"
            valueTeal
            isRTL={isRTL}
          />
        </View>

        {/* Contact note */}
        <View
          style={[
            successSt.noteCard,
            { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40', flexDirection: isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          <Ionicons name="information-circle" size={18} color={colors.primary} />
          <Text style={[successSt.noteText, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL
              ? 'سيتم التواصل معك عبر رقم الجوال المسجل لتأكيد الموعد'
              : 'We will reach you via your registered phone number to confirm the appointment'}
          </Text>
        </View>

        <TouchableOpacity
          style={[successSt.resetBtn, { backgroundColor: colors.primary, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          activeOpacity={0.85}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onReset();
          }}
        >
          <Ionicons name="add-circle-outline" size={18} color="#fff" />
          <Text style={successSt.resetText}>
            {isRTL ? 'طلب جديد' : 'New Request'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function SummaryRow({ label, value, colors, icon, valueTeal, isRTL }) {
  return (
    <View style={[successSt.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={[successSt.rowIcon, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons name={icon} size={13} color={colors.primary} />
      </View>
      <Text style={[successSt.rowLabel, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
      <Text
        style={[
          successSt.rowValue,
          { color: valueTeal ? colors.primary : colors.text, textAlign: isRTL ? 'left' : 'right' },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const successSt = StyleSheet.create({
  hero: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 44,
    alignItems: 'center',
    gap: 16,
  },
  glowRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(60,174,163,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(60,174,163,0.25)',
  },
  checkCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 26, fontWeight: '800', color: '#fff' },
  sub:   { fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 20 },
  body:  { padding: 20, gap: 14 },
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  summaryTitle: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  row:          { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowIcon:      { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  rowLabel:     { flex: 1, fontSize: 13 },
  rowValue:     { fontSize: 13, fontWeight: '700' },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
  resetBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  resetText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ChargerScreen() {
  const { colors, tr, isRTL, isDark } = useApp();
  const insets = useSafeAreaInsets();

  // Charger type
  const [selected, setSelected] = useState(0);

  // Form
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [cityIdx, setCityIdx] = useState(null);
  const [notes,   setNotes]   = useState('');
  const [errors,  setErrors]  = useState({});

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast,   setToast]   = useState({ visible: false, message: '', type: 'success' });

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};

    if (!name.trim() || name.trim().length < 3)
      e.name = isRTL ? 'الاسم مطلوب (٣ أحرف على الأقل)' : 'Name required (min 3 chars)';

    if (!phone.trim())
      e.phone = isRTL ? 'رقم الجوال مطلوب' : 'Phone number is required';
    else if (!/^(05\d{8}|009665\d{8}|\+9665\d{8})$/.test(phone.trim().replace(/\s/g, '')))
      e.phone = isRTL ? 'رقم سعودي غير صحيح' : 'Enter a valid Saudi phone number';

    if (cityIdx === null)
      e.city = isRTL ? 'يرجى اختيار مدينتك' : 'Please select your city';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!validate()) {
      setToast({
        visible: true,
        message: isRTL ? 'يرجى تصحيح الأخطاء أولاً' : 'Please fix the errors above',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const type = TYPES[selected];
      await submitChargerBooking({
        name,
        phone,
        city:           isRTL ? CITIES_AR[cityIdx] : CITIES_EN[cityIdx],
        chargerType:    type.key,
        chargerPower:   type.power,
        estimatedPrice: isRTL ? type.priceAr : type.priceEn,
        notes,
      });
      setSuccess(true);
      setToast({
        visible: true,
        message: isRTL ? 'تم إرسال طلبك بنجاح!' : 'Request submitted successfully!',
        type: 'success',
      });
    } catch (e) {
      setToast({
        visible: true,
        message: isRTL ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong, please try again',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Reset ───────────────────────────────────────────────────────────────────

  const handleReset = () => {
    setSuccess(false);
    setName('');
    setPhone('');
    setCityIdx(null);
    setNotes('');
    setErrors({});
    setSelected(0);
  };

  // ── Success screen ──────────────────────────────────────────────────────────

  if (success) {
    return (
      <View style={{ flex: 1 }}>
        <SuccessScreen
          selectedType={TYPES[selected]}
          cityIdx={cityIdx}
          isRTL={isRTL}
          colors={colors}
          onReset={handleReset}
          topInset={insets.top}
        />
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(t => ({ ...t, visible: false }))}
        />
      </View>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────

  const align = isRTL ? 'right' : 'left';
  const rowDir = isRTL ? 'row-reverse' : 'row';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <LinearGradient
          colors={['#030d1c', '#041628', '#0b2340']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s.hero, { paddingTop: insets.top + 16 }]}
        >
          {/* Background decoration */}
          <View style={s.heroDecoBubble1} />
          <View style={s.heroDecoBubble2} />

          {/* Badge */}
          <View style={[s.heroBadge, { flexDirection: rowDir }]}>
            <Ionicons name="flash" size={12} color="#3CAEA3" />
            <Text style={s.heroBadgeText}>
              {isRTL ? 'تيار — الشريك الرسمي لشحن السيارات الكهربائية' : 'Tyar — Saudi Arabia\'s EV Charging Partner'}
            </Text>
          </View>

          <Text style={[s.heroTitle, { textAlign: align }]}>
            {isRTL ? 'تركيب شواحن\nالسيارات الكهربائية' : 'EV Charger\nInstallation'}
          </Text>

          {/* Certified badge */}
          <View style={[s.certBadge, { flexDirection: rowDir, alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Ionicons name="shield-checkmark" size={14} color="#3CAEA3" />
            <Text style={s.certText}>
              {isRTL ? 'فنيون معتمدون — ضمان 6 أشهر على كل تركيب' : 'Certified technicians — 6-month warranty on every install'}
            </Text>
          </View>
        </LinearGradient>

        {/* ── Charger type selector ─────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title={isRTL ? 'نوع الشاحن' : 'Charger Type'}
            colors={colors}
            isRTL={isRTL}
          />
          <View style={[s.typeRow, { flexDirection: rowDir }]}>
            {TYPES.map((t, i) => (
              <TypeCard
                key={t.key}
                item={t}
                isSelected={selected === i}
                isRTL={isRTL}
                colors={colors}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelected(i);
                }}
              />
            ))}
          </View>
        </View>

        {/* ── Animated price card ───────────────────────────────────────────── */}
        <View style={[s.section, { paddingTop: 16 }]}>
          <PriceCard type={TYPES[selected]} isRTL={isRTL} colors={colors} />
        </View>

        {/* ── Why Tyar ─────────────────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title={isRTL ? 'لماذا تيار؟' : 'Why Tyar?'}
            colors={colors}
            isRTL={isRTL}
          />
          <View style={s.whyGrid}>
            {WHY.map((w, i) => (
              <View
                key={i}
                style={[
                  s.whyCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    alignItems: isRTL ? 'flex-end' : 'flex-start',
                  },
                ]}
              >
                <View style={[s.whyIconWrap, { backgroundColor: colors.primary + '18' }]}>
                  <Ionicons name={w.icon} size={20} color={colors.primary} />
                </View>
                <Text style={[s.whyText, { color: colors.textSoft, textAlign: align }]}>
                  {isRTL ? w.ar : w.en}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Process steps ─────────────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title={isRTL ? 'كيف تعمل؟' : 'How It Works'}
            colors={colors}
            isRTL={isRTL}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[s.stepsScroll, { flexDirection: rowDir }]}
          >
            {(isRTL ? STEPS_AR : STEPS_EN).map((step, i, arr) => (
              <React.Fragment key={i}>
                <View style={s.stepItem}>
                  <LinearGradient
                    colors={['#3CAEA3', '#2a9d8f']}
                    style={s.stepBubble}
                  >
                    <Text style={s.stepNum}>{i + 1}</Text>
                  </LinearGradient>
                  <Text style={[s.stepLabel, { color: colors.textSoft, textAlign: 'center' }]}>
                    {step}
                  </Text>
                </View>
                {i < arr.length - 1 && (
                  <View style={s.stepConnector}>
                    <View style={[s.stepLine, { backgroundColor: colors.border }]} />
                    <Ionicons
                      name={isRTL ? 'chevron-back' : 'chevron-forward'}
                      size={12}
                      color={colors.primary}
                    />
                  </View>
                )}
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        {/* ── Booking form ──────────────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title={isRTL ? 'احجز التركيب الآن' : 'Book Installation Now'}
            colors={colors}
            isRTL={isRTL}
          />

          {/* Full name */}
          <FormField
            label={isRTL ? 'الاسم الكامل' : 'Full Name'}
            icon="person-outline"
            error={errors.name}
            colors={colors}
            isRTL={isRTL}
          >
            <TextInput
              style={[s.input, { color: colors.text, textAlign: align }]}
              placeholder={tr.yourName}
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={v => { setName(v); setErrors(e => ({ ...e, name: null })); }}
              returnKeyType="next"
            />
          </FormField>

          {/* Phone */}
          <FormField
            label={isRTL ? 'رقم الجوال' : 'Phone Number'}
            icon="call-outline"
            error={errors.phone}
            colors={colors}
            isRTL={isRTL}
          >
            <TextInput
              style={[s.input, { color: colors.text, textAlign: align }]}
              placeholder={isRTL ? '05xxxxxxxx' : '05xxxxxxxx'}
              placeholderTextColor={colors.textMuted}
              value={phone}
              keyboardType="phone-pad"
              onChangeText={v => { setPhone(v); setErrors(e => ({ ...e, phone: null })); }}
            />
          </FormField>

          {/* City chips */}
          <View style={s.fieldGroup}>
            <Text style={[s.fieldLabel, { color: colors.textSoft, textAlign: align }]}>
              {isRTL ? 'المدينة' : 'City'}
            </Text>
            <View style={[s.cityGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {(isRTL ? CITIES_AR : CITIES_EN).map((city, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.8}
                  style={[
                    s.cityChip,
                    {
                      backgroundColor:
                        cityIdx === i ? colors.primary : colors.surface,
                      borderColor:
                        cityIdx === i
                          ? colors.primary
                          : errors.city
                          ? '#ef4444'
                          : colors.border,
                    },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setCityIdx(i);
                    setErrors(e => ({ ...e, city: null }));
                  }}
                >
                  <Text
                    style={[
                      s.cityText,
                      { color: cityIdx === i ? '#fff' : colors.textSoft },
                    ]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.city && <ErrorText msg={errors.city} isRTL={isRTL} />}
          </View>

          {/* Notes */}
          <View style={s.fieldGroup}>
            <Text style={[s.fieldLabel, { color: colors.textSoft, textAlign: align }]}>
              {isRTL ? 'ملاحظات (اختياري)' : 'Notes (optional)'}
            </Text>
            <View
              style={[
                s.inputWrap,
                s.notesWrap,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <TextInput
                style={[s.input, s.notesInput, { color: colors.text, textAlign: align }]}
                placeholder={
                  isRTL ? 'أي تفاصيل إضافية عن موقعك أو نوع السيارة...' : 'Any additional details about your location or vehicle...'
                }
                placeholderTextColor={colors.textMuted}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[s.submitBtn, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="send" size={16} color="#fff" />
                <Text style={s.submitText}>
                  {isRTL ? 'إرسال الطلب' : 'Submit Request'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 + insets.bottom }} />
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(t => ({ ...t, visible: false }))}
      />
    </View>
  );
}

// ─── Small helper components ──────────────────────────────────────────────────

function SectionHeader({ title, colors, isRTL }) {
  return (
    <View style={[sh.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={[sh.accent, { backgroundColor: colors.primary }]} />
      <Text style={[sh.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

const sh = StyleSheet.create({
  row:    { alignItems: 'center', gap: 8, marginBottom: 16 },
  accent: { width: 4, height: 18, borderRadius: 2 },
  title:  { fontSize: 16, fontWeight: '800' },
});

function FormField({ label, icon, error, colors, isRTL, children }) {
  const hasError = !!error;
  return (
    <View style={s.fieldGroup}>
      <Text style={[s.fieldLabel, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
        {label}
      </Text>
      <View
        style={[
          s.inputWrap,
          {
            backgroundColor: colors.surface,
            borderColor: hasError ? '#ef4444' : colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={16}
          color={hasError ? '#ef4444' : colors.textMuted}
        />
        {children}
      </View>
      {hasError && <ErrorText msg={error} isRTL={isRTL} />}
    </View>
  );
}

function ErrorText({ msg, isRTL }) {
  return (
    <View style={[errSt.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <Ionicons name="alert-circle" size={12} color="#ef4444" />
      <Text style={errSt.text}>{msg}</Text>
    </View>
  );
}

const errSt = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5, marginHorizontal: 4 },
  text: { fontSize: 12, color: '#ef4444' },
});

// ─── Stylesheet ───────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  // Hero
  hero: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 30,
    gap: 12,
    overflow: 'hidden',
  },
  heroDecoBubble1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(60,174,163,0.06)',
    top: -60,
    right: -60,
  },
  heroDecoBubble2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(60,174,163,0.04)',
    bottom: -30,
    left: 20,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(60,174,163,0.15)',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(60,174,163,0.3)',
  },
  heroBadgeText: { fontSize: 11, color: '#3CAEA3', fontWeight: '600' },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  certBadge: {
    alignItems: 'center',
    gap: 6,
  },
  certText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },

  // Sections
  section:      { paddingHorizontal: 20, paddingTop: 28 },
  typeRow:      { gap: 10 },

  // Why
  whyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  whyCard: {
    width: '47.5%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  whyIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyText: { fontSize: 12, lineHeight: 18, fontWeight: '600' },

  // Steps
  stepsScroll: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 0,
  },
  stepItem: { alignItems: 'center', gap: 8, width: 80 },
  stepBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum:   { color: '#fff', fontWeight: '800', fontSize: 15 },
  stepLabel: { fontSize: 11, fontWeight: '600', lineHeight: 15 },
  stepConnector: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 22, marginHorizontal: -2 },
  stepLine:  { width: 16, height: 1.5 },

  // Form
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputWrap: {
    alignItems: 'center',
    gap: 10,
    borderRadius: 13,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  input:     { flex: 1, fontSize: 14, paddingVertical: 12 },
  notesWrap: { paddingVertical: 10 },
  notesInput:{ height: 80, textAlignVertical: 'top', paddingVertical: 0 },

  // City chips
  cityGrid: { flexWrap: 'wrap', gap: 8 },
  cityChip: {
    borderWidth: 1.5,
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cityText: { fontSize: 13, fontWeight: '600' },

  // Submit
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    marginTop: 4,
    shadowColor: '#3CAEA3',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

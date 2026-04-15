import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Animated, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../constants/AppContext';
import Toast from '../components/Toast';
import { submitMaintenanceBooking } from '../lib/supabase';

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    key: 'battery',
    icon: 'battery-charging-outline',
    ar: 'فحص البطارية',
    en: 'Battery Check',
    durationAr: '٤٥ دقيقة',
    durationEn: '45 min',
    priceAr: '١٥٠ ريال',
    priceEn: 'SAR 150',
    price: 150,
    descAr: 'تشخيص شامل لصحة البطارية وخلاياها',
    descEn: 'Full battery health & cell diagnostics',
  },
  {
    key: 'routine',
    icon: 'construct-outline',
    ar: 'الصيانة الدورية',
    en: 'Routine Service',
    durationAr: 'ساعتان',
    durationEn: '2 hrs',
    priceAr: '٣٥٠ ريال',
    priceEn: 'SAR 350',
    price: 350,
    descAr: 'صيانة كاملة وفق توصيات الشركة المصنّعة',
    descEn: 'Full service per manufacturer recommendations',
  },
  {
    key: 'soft',
    icon: 'code-working-outline',
    ar: 'تحديث البرمجيات',
    en: 'Software Update',
    durationAr: '٣٠ دقيقة',
    durationEn: '30 min',
    priceAr: '٢٠٠ ريال',
    priceEn: 'SAR 200',
    price: 200,
    descAr: 'تحديث البرمجيات ونظام إدارة البطارية',
    descEn: 'Firmware & battery management system update',
  },
  {
    key: 'full',
    icon: 'shield-checkmark-outline',
    ar: 'فحص شامل',
    en: 'Full Inspection',
    durationAr: '٣ ساعات',
    durationEn: '3 hrs',
    priceAr: '٥٠٠ ريال',
    priceEn: 'SAR 500',
    price: 500,
    descAr: 'تفتيش ٢٠٠ نقطة لكل مكوّنات المركبة',
    descEn: '200-point inspection of all vehicle systems',
  },
];

const CITIES_AR = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'الخبر'];
const CITIES_EN = ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah', 'Khobar'];

const TIME_SLOTS = [
  { key: 'morning',   ar: 'صباحاً',  en: 'Morning',   icon: 'sunny-outline'      },
  { key: 'afternoon', ar: 'ظهراً',   en: 'Afternoon', icon: 'partly-sunny-outline'},
  { key: 'evening',   ar: 'مساءً',   en: 'Evening',   icon: 'moon-outline'        },
];

const HOW_STEPS = [
  { numAr: '١', numEn: '1', icon: 'calendar-outline',      labelAr: 'احجز',     labelEn: 'Book'    },
  { numAr: '٢', numEn: '2', icon: 'checkmark-done-outline', labelAr: 'تأكيد',   labelEn: 'Confirm' },
  { numAr: '٣', numEn: '3', icon: 'car-outline',            labelAr: 'زيارة',   labelEn: 'Visit'   },
  { numAr: '٤', numEn: '4', icon: 'document-text-outline',  labelAr: 'تقرير',   labelEn: 'Report'  },
];

const STEPS = [
  { ar: 'اختر الخدمة',   en: 'Pick Service'  },
  { ar: 'أدخل البيانات', en: 'Enter Details' },
  { ar: 'تأكيد الحجز',   en: 'Confirmed'     },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function MaintenanceScreen() {
  const { colors, tr, isRTL, isDark } = useApp();
  const insets = useSafeAreaInsets();

  // Form state
  const [selectedSvc, setSelectedSvc] = useState(null);
  const [model,       setModel]       = useState('');
  const [carYear,     setCarYear]     = useState('');
  const [date,        setDate]        = useState('');
  const [timeSlot,    setTimeSlot]    = useState(null);
  const [cityIdx,     setCityIdx]     = useState(null);
  const [notes,       setNotes]       = useState('');
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [toast,       setToast]       = useState({ visible: false, message: '', type: 'success' });

  // Animations — one scale per service card
  const cardScales  = useRef(SERVICES.map(() => new Animated.Value(1))).current;
  const priceSlide  = useRef(new Animated.Value(40)).current;
  const priceOpacity= useRef(new Animated.Value(0)).current;
  const successScale= useRef(new Animated.Value(0)).current;
  const checkmarkRot= useRef(new Animated.Value(0)).current;

  // Derived
  const step = selectedSvc === null ? 0 : success ? 2 : 1;
  const svc  = selectedSvc !== null ? SERVICES[selectedSvc] : null;

  // ── Helpers ────────────────────────────────────────────────────────────────

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const haptic = useCallback((style = 'Light') => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle[style]); } catch (_) {}
  }, []);

  const selectService = useCallback((i) => {
    haptic('Medium');
    // Animate card press
    Animated.sequence([
      Animated.timing(cardScales[i], { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.spring(cardScales[i], { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    setSelectedSvc(i);
    setErrors(e => ({ ...e, svc: null }));

    // Slide price badge in
    priceSlide.setValue(40);
    priceOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(priceSlide,   { toValue: 0, friction: 7, useNativeDriver: true }),
      Animated.timing(priceOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [cardScales, haptic, priceSlide, priceOpacity]);

  const validate = useCallback(() => {
    const e = {};
    if (selectedSvc === null)   e.svc    = isRTL ? 'اختر خدمة'           : 'Select a service';
    if (!model.trim())          e.model  = isRTL ? 'أدخل موديل السيارة'   : 'Enter car model';
    if (!carYear.trim())        e.carYear= isRTL ? 'أدخل سنة الصنع'       : 'Enter car year';
    if (!date.trim())           e.date   = isRTL ? 'أدخل التاريخ'          : 'Enter a date';
    if (timeSlot === null)      e.time   = isRTL ? 'اختر الوقت المفضل'    : 'Select preferred time';
    if (cityIdx  === null)      e.city   = isRTL ? 'اختر مدينتك'           : 'Select a city';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [selectedSvc, model, carYear, date, timeSlot, cityIdx, isRTL]);

  const submit = useCallback(async () => {
    haptic('Medium');
    if (!validate()) {
      showToast(isRTL ? 'يرجى تصحيح الأخطاء' : 'Please fix the errors', 'error');
      return;
    }
    setLoading(true);
    try {
      const svc = SERVICES[selectedSvc];
      await submitMaintenanceBooking({
        serviceType:   svc.key,
        carModel:      model,
        carYear,
        preferredDate: date,
        timeSlot:      TIME_SLOTS[timeSlot]?.key ?? 'morning',
        city:          isRTL ? CITIES_AR[cityIdx] : CITIES_EN[cityIdx],
        notes,
        estimatedCost: isRTL ? svc.priceAr : svc.priceEn,
      });
      setSuccess(true);
      Animated.spring(successScale, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();
      Animated.timing(checkmarkRot, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      showToast(tr.schedSuccess, 'success');
    } catch (e) {
      showToast(isRTL ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong, please try again', 'error');
    } finally {
      setLoading(false);
    }
  }, [haptic, validate, isRTL, showToast, successScale, checkmarkRot, tr, selectedSvc, model, carYear, date, timeSlot, cityIdx, notes]);

  const resetForm = useCallback(() => {
    haptic('Light');
    setSuccess(false);
    setSelectedSvc(null);
    setModel('');
    setCarYear('');
    setDate('');
    setTimeSlot(null);
    setCityIdx(null);
    setNotes('');
    setErrors({});
    priceSlide.setValue(40);
    priceOpacity.setValue(0);
    successScale.setValue(0);
    checkmarkRot.setValue(0);
  }, [haptic, priceSlide, priceOpacity, successScale, checkmarkRot]);

  const s = styles(colors, isRTL, isDark);

  // ── Success Screen ─────────────────────────────────────────────────────────

  if (success) {
    const spin = checkmarkRot.interpolate({ inputRange: [0, 1], outputRange: ['-30deg', '0deg'] });
    const summaryRows = [
      { label: isRTL ? 'الخدمة'         : 'Service',   value: isRTL ? svc.ar : svc.en,                         icon: svc.icon            },
      { label: isRTL ? 'موديل السيارة'   : 'Car Model', value: `${model} ${carYear}`,                            icon: 'car-outline'       },
      { label: isRTL ? 'التاريخ'         : 'Date',      value: date,                                             icon: 'calendar-outline'  },
      { label: isRTL ? 'الوقت'           : 'Time',      value: isRTL ? TIME_SLOTS[timeSlot]?.ar : TIME_SLOTS[timeSlot]?.en, icon: 'time-outline' },
      { label: isRTL ? 'المدينة'         : 'City',      value: isRTL ? CITIES_AR[cityIdx] : CITIES_EN[cityIdx], icon: 'location-outline'  },
      { label: isRTL ? 'التكلفة التقديرية': 'Est. Cost', value: isRTL ? svc.priceAr : svc.priceEn,               icon: 'pricetag-outline'  },
    ];

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Success Hero */}
          <LinearGradient colors={['#041628', '#0b2340', '#0d3b2e']} style={[s.successHero, { paddingTop: insets.top + 28 }]}>
            <Animated.View style={{ transform: [{ scale: successScale }, { rotate: spin }], marginBottom: 20 }}>
              <View style={s.successIconBg}>
                <Ionicons name="checkmark" size={52} color="#3CAEA3" />
              </View>
            </Animated.View>
            <Text style={s.successTitle}>
              {isRTL ? 'تم حجز موعدك!' : 'Appointment Booked!'}
            </Text>
            <Text style={s.successSub}>
              {isRTL
                ? 'سنؤكد موعدك قريباً عبر الجوال'
                : "We'll confirm your appointment shortly via phone"}
            </Text>
          </LinearGradient>

          {/* Summary Card */}
          <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 10 }}>
            <Text style={[s.sectionTitle, { textAlign: isRTL ? 'right' : 'left', marginBottom: 4 }]}>
              {isRTL ? 'ملخص الحجز' : 'Booking Summary'}
            </Text>
            <View style={[s.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {summaryRows.map((row, i) => (
                <View
                  key={i}
                  style={[
                    s.summaryRow,
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                    i < summaryRows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                >
                  <View style={[s.summaryLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={s.summaryIconWrap}>
                      <Ionicons name={row.icon} size={15} color={colors.primary} />
                    </View>
                    <Text style={[s.summaryLabel, { color: colors.textMuted }]}>{row.label}</Text>
                  </View>
                  <Text style={[s.summaryValue, { color: colors.text }]}>{row.value}</Text>
                </View>
              ))}
            </View>

            {/* Calendar placeholder */}
            <TouchableOpacity
              style={[s.calendarBtn, { borderColor: colors.primary, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              onPress={() => { haptic('Light'); showToast(isRTL ? 'قريباً!' : 'Coming soon', 'success'); }}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              <Text style={[s.calendarBtnText, { color: colors.primary }]}>
                {isRTL ? 'أضف إلى التقويم' : 'Add to Calendar'}
              </Text>
            </TouchableOpacity>

            {/* New Booking */}
            <TouchableOpacity style={[s.resetBtn, { backgroundColor: colors.primary, flexDirection: isRTL ? 'row-reverse' : 'row' }]} onPress={resetForm} activeOpacity={0.85}>
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={s.resetBtnText}>{isRTL ? 'حجز جديد' : 'New Booking'}</Text>
            </TouchableOpacity>

            <View style={{ height: 32 + insets.bottom }} />
          </View>
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

  // ── Main Screen ────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <LinearGradient colors={['#041628', '#0b2340', '#072f45']} style={[s.hero, { paddingTop: insets.top + 16 }]}>
          {/* Icon + badge row */}
          <View style={[s.heroBadgeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={s.heroBadgeIcon}>
              <Ionicons name="construct" size={15} color="#3CAEA3" />
            </View>
            <Text style={s.heroBadgeText}>
              {isRTL ? 'فنيون معتمدون · ضمان الجودة' : 'Certified Technicians · Quality Guaranteed'}
            </Text>
          </View>

          <Text style={[s.heroTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {tr.maintTitle}
          </Text>
          <Text style={[s.heroSub, { textAlign: isRTL ? 'right' : 'left' }]}>
            {tr.maintSub}
          </Text>

          {/* Progress Steps */}
          <View style={[s.steps, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {STEPS.map((st, i) => (
              <React.Fragment key={i}>
                <View style={s.stepItem}>
                  <View style={[s.stepCircle, i <= step && s.stepCircleActive]}>
                    {i < step
                      ? <Ionicons name="checkmark" size={13} color="#fff" />
                      : <Text style={[s.stepNum, i <= step && { color: '#fff' }]}>{i + 1}</Text>
                    }
                  </View>
                  <Text style={[s.stepLabel, i <= step && { color: '#3CAEA3' }]}>
                    {isRTL ? st.ar : st.en}
                  </Text>
                </View>
                {i < STEPS.length - 1 && (
                  <View style={[s.stepLine, i < step && { backgroundColor: '#3CAEA3' }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </LinearGradient>

        {/* ── How It Works ─────────────────────────────────────────────────── */}
        <View style={{ paddingTop: 28 }}>
          <Text style={[s.sectionTitle, { textAlign: isRTL ? 'right' : 'left', paddingHorizontal: 20, marginBottom: 14 }]}>
            {isRTL ? 'كيف يعمل؟' : 'How It Works'}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12, flexDirection: isRTL ? 'row-reverse' : 'row' }}
          >
            {HOW_STEPS.map((hs, i) => (
              <View key={i} style={[s.howCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={s.howNum}>
                  <Text style={s.howNumText}>{isRTL ? hs.numAr : hs.numEn}</Text>
                </View>
                <View style={s.howIconWrap}>
                  <Ionicons name={hs.icon} size={22} color={colors.primary} />
                </View>
                <Text style={[s.howLabel, { color: colors.textSoft }]}>
                  {isRTL ? hs.labelAr : hs.labelEn}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── Service Cards ─────────────────────────────────────────────────── */}
        <View style={[s.section, { paddingTop: 28 }]}>
          <Text style={[s.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {tr.selectService}
          </Text>
          {errors.svc && <Text style={s.errorText}>{errors.svc}</Text>}

          <View style={{ gap: 10 }}>
            {SERVICES.map((sv, i) => {
              const isActive = selectedSvc === i;
              return (
                <Animated.View key={sv.key} style={{ transform: [{ scale: cardScales[i] }] }}>
                  <TouchableOpacity
                    style={[
                      s.svcRow,
                      { flexDirection: isRTL ? 'row-reverse' : 'row' },
                      isActive && s.svcRowActive,
                    ]}
                    onPress={() => selectService(i)}
                    activeOpacity={0.85}
                  >
                    {/* Left teal border when active */}
                    {isActive && (
                      <View style={[
                        s.svcActiveBorder,
                        { [isRTL ? 'right' : 'left']: 0 },
                      ]} />
                    )}

                    {/* Icon */}
                    <View style={[s.svcIcon, isActive && { backgroundColor: colors.primary }]}>
                      <Ionicons name={sv.icon} size={22} color={isActive ? '#fff' : colors.primary} />
                    </View>

                    {/* Labels */}
                    <View style={{ flex: 1 }}>
                      <Text style={[s.svcLabel, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                        {isRTL ? sv.ar : sv.en}
                      </Text>
                      <Text style={[s.svcDesc, { textAlign: isRTL ? 'right' : 'left' }]}>
                        {isRTL ? sv.descAr : sv.descEn}
                      </Text>
                    </View>

                    {/* Duration + checkmark */}
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <View style={[s.durationBadge, isActive && { backgroundColor: colors.primary + '22', borderColor: colors.primary }]}>
                        <Ionicons name="time-outline" size={11} color={isActive ? colors.primary : colors.textMuted} />
                        <Text style={[s.durationText, isActive && { color: colors.primary }]}>
                          {isRTL ? sv.durationAr : sv.durationEn}
                        </Text>
                      </View>
                      {isActive && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* ── Pricing Badge ─────────────────────────────────────────────────── */}
        {selectedSvc !== null && (
          <Animated.View
            style={[
              s.priceBadge,
              {
                marginHorizontal: 20,
                marginTop: 12,
                backgroundColor: colors.primary + '14',
                borderColor: colors.primary,
                opacity: priceOpacity,
                transform: [{ translateY: priceSlide }],
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View style={s.priceBadgeLeft}>
              <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
              <Text style={[s.priceBadgeLabel, { color: colors.textSoft }]}>
                {isRTL ? 'التكلفة التقديرية' : 'Estimated Cost'}
              </Text>
            </View>
            <Text style={[s.priceBadgeValue, { color: colors.primary }]}>
              {isRTL ? svc.priceAr : svc.priceEn}
            </Text>
          </Animated.View>
        )}

        {/* ── Booking Form ──────────────────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'تفاصيل الحجز' : 'Booking Details'}
          </Text>

          {/* Car Model */}
          <View style={s.fieldGroup}>
            <Text style={[s.fieldLabel, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'موديل السيارة *' : 'Car Model *'}
            </Text>
            <View style={[
              s.inputWrap,
              { flexDirection: isRTL ? 'row-reverse' : 'row' },
              errors.model && s.inputError,
            ]}>
              <Ionicons name="car-outline" size={16} color={errors.model ? '#ef4444' : colors.textMuted} />
              <TextInput
                style={[s.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={isRTL ? 'مثال: تسلا موديل 3' : 'e.g. Tesla Model 3'}
                placeholderTextColor={colors.textMuted}
                value={model}
                onChangeText={t => { setModel(t); setErrors(e => ({ ...e, model: null })); }}
                returnKeyType="next"
              />
            </View>
            {errors.model && <Text style={s.errorText}>{errors.model}</Text>}
          </View>

          {/* Car Year */}
          <View style={s.fieldGroup}>
            <Text style={[s.fieldLabel, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'سنة الصنع *' : 'Car Year *'}
            </Text>
            <View style={[
              s.inputWrap,
              { flexDirection: isRTL ? 'row-reverse' : 'row' },
              errors.carYear && s.inputError,
            ]}>
              <Ionicons name="calendar-number-outline" size={16} color={errors.carYear ? '#ef4444' : colors.textMuted} />
              <TextInput
                style={[s.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={isRTL ? 'مثال: ٢٠٢٣' : 'e.g. 2023'}
                placeholderTextColor={colors.textMuted}
                value={carYear}
                onChangeText={t => { setCarYear(t); setErrors(e => ({ ...e, carYear: null })); }}
                keyboardType="numeric"
                maxLength={4}
                returnKeyType="next"
              />
            </View>
            {errors.carYear && <Text style={s.errorText}>{errors.carYear}</Text>}
          </View>

          {/* Preferred Date */}
          <View style={s.fieldGroup}>
            <Text style={[s.fieldLabel, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'التاريخ المفضل *' : 'Preferred Date *'}
            </Text>
            <View style={[
              s.inputWrap,
              { flexDirection: isRTL ? 'row-reverse' : 'row' },
              errors.date && s.inputError,
            ]}>
              <Ionicons name="calendar-outline" size={16} color={errors.date ? '#ef4444' : colors.textMuted} />
              <TextInput
                style={[s.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={isRTL ? 'مثال: ٢٠٢٦-٠٦-١٥' : 'e.g. 2026-06-15'}
                placeholderTextColor={colors.textMuted}
                value={date}
                onChangeText={t => { setDate(t); setErrors(e => ({ ...e, date: null })); }}
                returnKeyType="done"
              />
            </View>
            {errors.date && <Text style={s.errorText}>{errors.date}</Text>}
          </View>

          {/* Preferred Time chips */}
          <View style={s.fieldGroup}>
            <Text style={[s.fieldLabel, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'الوقت المفضل *' : 'Preferred Time *'}
            </Text>
            <View style={[s.chipRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {TIME_SLOTS.map((ts, i) => {
                const active = timeSlot === i;
                return (
                  <TouchableOpacity
                    key={ts.key}
                    style={[s.chip, active && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                    onPress={() => { haptic('Light'); setTimeSlot(i); setErrors(e => ({ ...e, time: null })); }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={ts.icon} size={14} color={active ? '#fff' : colors.textSoft} />
                    <Text style={[s.chipText, { color: active ? '#fff' : colors.textSoft }]}>
                      {isRTL ? ts.ar : ts.en}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.time && <Text style={s.errorText}>{errors.time}</Text>}
          </View>

          {/* City */}
          <View style={s.fieldGroup}>
            <Text style={[s.fieldLabel, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'اختر مدينتك *' : 'Select Your City *'}
            </Text>
            <View style={[s.cityGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {(isRTL ? CITIES_AR : CITIES_EN).map((city, i) => (
                <TouchableOpacity
                  key={i}
                  style={[s.cityChip, cityIdx === i && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                  onPress={() => { haptic('Light'); setCityIdx(i); setErrors(e => ({ ...e, city: null })); }}
                  activeOpacity={0.8}
                >
                  <Text style={[s.cityText, { color: cityIdx === i ? '#fff' : colors.textSoft }]}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.city && <Text style={s.errorText}>{errors.city}</Text>}
          </View>

          {/* Special Notes */}
          <View style={s.fieldGroup}>
            <Text style={[s.fieldLabel, { color: colors.textSoft, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'ملاحظات إضافية (اختياري)' : 'Special Notes (optional)'}
            </Text>
            <View style={[s.inputWrap, s.textareaWrap, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-start' }]}>
              <Ionicons name="document-text-outline" size={16} color={colors.textMuted} style={{ marginTop: 2 }} />
              <TextInput
                style={[s.input, s.textarea, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={isRTL ? 'أضف أي ملاحظات أو طلبات خاصة…' : 'Add any notes or special requests…'}
                placeholderTextColor={colors.textMuted}
                value={notes}
                onChangeText={t => t.length <= 200 && setNotes(t)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            <Text style={[s.charCount, { color: colors.textMuted, textAlign: isRTL ? 'left' : 'right' }]}>
              {notes.length}/200
            </Text>
          </View>
        </View>

        {/* ── Technician Info Card ──────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View style={[s.techCard, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={s.techIconWrap}>
              <Ionicons name="people-outline" size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.techTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'فنيونا المعتمدون' : 'Our Certified EV Technicians'}
              </Text>
              <View style={[s.techRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={[s.techStat, { color: colors.textSoft }]}>4.9/5</Text>
                <View style={s.techDot} />
                <Text style={[s.techStat, { color: colors.textSoft }]}>
                  {isRTL ? '+٥٠٠ خدمة منجزة' : '500+ completed services'}
                </Text>
              </View>
            </View>
            <View style={[s.verifiedBadge, { backgroundColor: colors.primary + '18' }]}>
              <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
              <Text style={[s.verifiedText, { color: colors.primary }]}>
                {isRTL ? 'موثّق' : 'Verified'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Submit Button ─────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 40 + insets.bottom }}>
          <TouchableOpacity
            style={[s.submitBtn, loading && { opacity: 0.8 }]}
            onPress={submit}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#3CAEA3', '#2a9d8f']}
              style={s.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="calendar-outline" size={18} color="#fff" />
                  <Text style={s.submitText}>{tr.scheduleBtn}</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(t => ({ ...t, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = (c, isRTL, isDark) => StyleSheet.create({
  // ── Success ────────────────────────────────────────────────────────────────
  successHero: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 52,
    alignItems: 'center',
  },
  successIconBg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(60,174,163,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(60,174,163,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 22,
  },
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  summaryRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  summaryLeft: {
    alignItems: 'center',
    gap: 8,
  },
  summaryIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: c.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 13, fontWeight: '700', maxWidth: '55%', textAlign: 'auto' },
  calendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
  },
  calendarBtnText: { fontWeight: '700', fontSize: 15 },
  resetBtn: {
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
  },
  resetBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // ── Hero ───────────────────────────────────────────────────────────────────
  hero: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 },
  heroBadgeRow: { alignItems: 'center', gap: 8, marginBottom: 14 },
  heroBadgeIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(60,174,163,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 6, lineHeight: 30 },
  heroSub:   { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 22 },

  // Steps
  steps:     { alignItems: 'center' },
  stepItem:  { alignItems: 'center', gap: 5 },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: '#3CAEA3' },
  stepNum:    { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.45)' },
  stepLabel:  { fontSize: 10, color: 'rgba(255,255,255,0.45)', textAlign: 'center', maxWidth: 60 },
  stepLine:   {
    flex: 1, height: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: 14, marginHorizontal: 4,
  },

  // ── How It Works ───────────────────────────────────────────────────────────
  howCard: {
    width: 88,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  howNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: c.primary + '22',
    alignItems: 'center', justifyContent: 'center',
  },
  howNumText: { fontSize: 12, fontWeight: '800', color: c.primary },
  howIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: c.primary + '14',
    alignItems: 'center', justifyContent: 'center',
  },
  howLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },

  // ── Section ────────────────────────────────────────────────────────────────
  section:      { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: c.text, marginBottom: 14 },

  // ── Service Cards ──────────────────────────────────────────────────────────
  svcRow: {
    alignItems: 'center',
    gap: 13,
    backgroundColor: c.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: c.border,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  svcRowActive: {
    borderColor: c.primary,
    backgroundColor: c.primary + '0c',
  },
  svcActiveBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: c.primary,
    borderRadius: 2,
  },
  svcIcon: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: c.primary + '18',
    alignItems: 'center', justifyContent: 'center',
  },
  svcLabel:    { fontSize: 14, fontWeight: '700' },
  svcDesc:     { fontSize: 12, color: c.textMuted, marginTop: 3, lineHeight: 17 },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: c.surface2,
  },
  durationText: { fontSize: 11, fontWeight: '600', color: c.textMuted },

  // ── Price Badge ────────────────────────────────────────────────────────────
  priceBadge: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBadgeLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priceBadgeLabel: { fontSize: 13, fontWeight: '600' },
  priceBadgeValue: { fontSize: 18, fontWeight: '800' },

  // ── Form ───────────────────────────────────────────────────────────────────
  fieldGroup:  { marginBottom: 16 },
  fieldLabel:  { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputWrap: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: c.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: c.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  textareaWrap: { paddingVertical: 12 },
  inputError:  { borderColor: '#ef4444' },
  input:       { flex: 1, fontSize: 14, paddingVertical: 12 },
  textarea:    { height: 90, paddingVertical: 0, textAlignVertical: 'top' },
  charCount:   { fontSize: 11, color: c.textMuted, marginTop: 5 },
  errorText:   { fontSize: 12, color: '#ef4444', marginTop: 5 },

  // Time chips
  chipRow: { flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: c.border,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: c.surface,
  },
  chipText: { fontSize: 13, fontWeight: '600' },

  // City chips
  cityGrid:   { flexWrap: 'wrap', gap: 8 },
  cityChip: {
    borderWidth: 1.5,
    borderColor: c.border,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: c.surface,
  },
  cityText: { fontSize: 13, fontWeight: '600' },

  // ── Technician Card ────────────────────────────────────────────────────────
  techCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  techIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: c.primary + '18',
    alignItems: 'center', justifyContent: 'center',
  },
  techTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  techRow:   { alignItems: 'center', gap: 6 },
  techStat:  { fontSize: 12, fontWeight: '500' },
  techDot:   { width: 3, height: 3, borderRadius: 2, backgroundColor: c.border },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  verifiedText: { fontSize: 11, fontWeight: '700' },

  // ── Submit ─────────────────────────────────────────────────────────────────
  submitBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#3CAEA3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 17,
  },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },
});

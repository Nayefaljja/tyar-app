import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, FlatList,
  StyleSheet, TextInput, Animated, RefreshControl,
  Dimensions, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useApp } from '../constants/AppContext';
import { useNavigation } from '@react-navigation/native';
import SkeletonCard from '../components/SkeletonCard';
import { fetchCars } from '../lib/supabase';

const { width } = Dimensions.get('window');

// ─── Fallback data (shown if Supabase is unreachable) ────────────────────────
const CARS_FALLBACK = [
  { id: 1, make: 'Tesla',    model: 'Model 3',  year: 2022, km: 28000,  price: 142000, type: 'Sedan',     range_km: 560, battery_pct: 92, badge_ar: 'بطارية ممتازة', badge_en: 'Great Battery' },
  { id: 2, make: 'Tesla',    model: 'Model Y',  year: 2023, km: 12000,  price: 198000, type: 'SUV',       range_km: 600, battery_pct: 97, badge_ar: 'شبه جديدة',    badge_en: 'Like New'      },
  { id: 3, make: 'BYD',      model: 'Atto 3',   year: 2023, km: 19000,  price: 110000, type: 'SUV',       range_km: 480, battery_pct: 94, badge_ar: null,           badge_en: null           },
  { id: 4, make: 'Hyundai',  model: 'Ioniq 6',  year: 2022, km: 31000,  price: 128000, type: 'Sedan',     range_km: 610, battery_pct: 89, badge_ar: 'الأكثر طلباً', badge_en: 'Most Popular' },
  { id: 5, make: 'Kia',      model: 'EV6',      year: 2021, km: 44000,  price: 95000,  type: 'Hatchback', range_km: 510, battery_pct: 85, badge_ar: null,           badge_en: null           },
  { id: 6, make: 'Polestar', model: '2',         year: 2022, km: 22000,  price: 155000, type: 'Sedan',     range_km: 540, battery_pct: 91, badge_ar: null,           badge_en: null           },
  { id: 7, make: 'Lucid',    model: 'Air',      year: 2023, km: 8000,   price: 320000, type: 'Sedan',     range_km: 836, battery_pct: 99, badge_ar: 'نادر',         badge_en: 'Rare Find'    },
  { id: 8, make: 'Rivian',   model: 'R1T',      year: 2022, km: 35000,  price: 245000, type: 'Truck',     range_km: 505, battery_pct: 88, badge_ar: null,           badge_en: null           },
];

const FILTERS = [
  { key: 'all',       ar: 'الكل',     en: 'All'       },
  { key: 'Sedan',     ar: 'سيدان',    en: 'Sedan'     },
  { key: 'SUV',       ar: 'SUV',      en: 'SUV'       },
  { key: 'Hatchback', ar: 'هاتشباك', en: 'Hatchback' },
];

const SORT_OPTIONS = [
  { key: 'default',   ar: 'الترتيب',        en: 'Default'      },
  { key: 'priceAsc',  ar: 'السعر: الأقل',   en: 'Price: Low'   },
  { key: 'priceDesc', ar: 'السعر: الأعلى',  en: 'Price: High'  },
  { key: 'yearDesc',  ar: 'الأحدث',         en: 'Newest'       },
  { key: 'kmAsc',     ar: 'أقل كيلومتر',    en: 'Low Mileage'  },
];

// ─── Battery colour helper ────────────────────────────────────────────────────
function batteryColor(pct) {
  if (pct >= 80) return '#22c55e';
  if (pct >= 60) return '#f59e0b';
  return '#ef4444';
}

// ─── Animated chip ────────────────────────────────────────────────────────────
function FilterChip({ label, active, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.91, duration: 80, useNativeDriver: true }),
      Animated.spring(scale,  { toValue: 1,    useNativeDriver: true, speed: 20 }),
    ]).start();
    Haptics.selectionAsync();
    onPress();
  };
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={press}
        activeOpacity={0.85}
        style={[
          chipStyle.chip,
          active && chipStyle.chipActive,
        ]}
      >
        <Text style={[chipStyle.text, active && chipStyle.textActive]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
const chipStyle = StyleSheet.create({
  chip:       { borderWidth: 1.5, borderColor: '#d1e8e5', borderRadius: 50, paddingHorizontal: 18, paddingVertical: 8, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#3CAEA3', borderColor: '#3CAEA3' },
  text:       { fontSize: 13, fontWeight: '600', color: '#7a94b0' },
  textActive: { color: '#fff' },
});

// ─── Heart button with animated scale ─────────────────────────────────────────
function FavButton({ isFav, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const tap   = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.35, duration: 120, useNativeDriver: true }),
      Animated.spring(scale,  { toValue: 1,    useNativeDriver: true, speed: 25 }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };
  return (
    <TouchableOpacity onPress={tap} activeOpacity={0.9} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? '#ef4444' : 'rgba(255,255,255,0.8)'} />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Car card ─────────────────────────────────────────────────────────────────
function CarCard({ item, isFav, onFav, onPress, colors, isRTL }) {
  const bColor = batteryColor(item.battery_pct ?? item.battery);

  return (
    <TouchableOpacity
      style={[card.wrap, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      activeOpacity={0.88}
    >
      {/* ── Image area ── */}
      <View style={[card.imgArea, { backgroundColor: colors.surface2 }]}>
        {/* Car icon centered */}
        <Ionicons name="car-sport-outline" size={80} color={colors.border} />

        {/* Gradient overlay at bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(4,22,40,0.82)']}
          style={card.imgGradient}
        >
          <Text style={[card.imgMake, { textAlign: isRTL ? 'right' : 'left' }]}>
            {item.make} {item.model}
          </Text>
        </LinearGradient>

        {/* Badge top-left / top-right */}
        {(item.badge_ar || item.badge) && (
          <View style={[card.badge, { [isRTL ? 'right' : 'left']: 12 }]}>
            <Text style={card.badgeText}>{isRTL ? (item.badge_ar || item.badge) : (item.badge_en || item.badgeEn)}</Text>
          </View>
        )}

        {/* Fav button opposite corner */}
        <View style={[card.favWrap, { [isRTL ? 'left' : 'right']: 12 }]}>
          <FavButton isFav={isFav} onPress={onFav} />
        </View>
      </View>

      {/* ── Body ── */}
      <View style={card.body}>
        {/* Price row */}
        <View style={[card.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[card.price, { color: colors.primary }]}>
            {item.price.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}
          </Text>
          <View style={[card.typePill, { backgroundColor: colors.primary + '18' }]}>
            <Text style={[card.typeText, { color: colors.primary }]}>{item.type}</Text>
          </View>
        </View>

        {/* Battery bar */}
        <View style={[card.battRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Ionicons name="battery-charging-outline" size={13} color={bColor} />
          <View style={card.battTrack}>
            <View style={[card.battFill, { width: `${item.battery_pct ?? item.battery}%`, backgroundColor: bColor }]} />
          </View>
          <Text style={[card.battPct, { color: bColor }]}>{item.battery_pct ?? item.battery}%</Text>
        </View>

        {/* Meta row: year · km · range */}
        <View style={[card.metaRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={card.metaItem}>
            <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
            <Text style={[card.metaTxt, { color: colors.textMuted }]}>{item.year}</Text>
          </View>
          <View style={[card.dot, { backgroundColor: colors.border }]} />
          <View style={card.metaItem}>
            <Ionicons name="speedometer-outline" size={13} color={colors.textMuted} />
            <Text style={[card.metaTxt, { color: colors.textMuted }]}>
              {item.km.toLocaleString()} {isRTL ? 'كم' : 'km'}
            </Text>
          </View>
          <View style={[card.dot, { backgroundColor: colors.border }]} />
          <View style={card.metaItem}>
            <Ionicons name="flash-outline" size={13} color={colors.textMuted} />
            <Text style={[card.metaTxt, { color: colors.textMuted }]}>
              {item.range_km ?? item.range} {isRTL ? 'كم' : 'km'}
            </Text>
          </View>
        </View>

        {/* View Details button */}
        <TouchableOpacity
          style={[card.btn, { backgroundColor: colors.primary }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="eye-outline" size={15} color="#fff" />
          <Text style={card.btnTxt}>{isRTL ? 'عرض التفاصيل' : 'View Details'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const card = StyleSheet.create({
  wrap:        { borderRadius: 18, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  imgArea:     { height: 178, alignItems: 'center', justifyContent: 'center' },
  imgGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 14, paddingTop: 28, paddingBottom: 12 },
  imgMake:     { fontSize: 16, fontWeight: '800', color: '#fff' },
  badge:       { position: 'absolute', top: 12, backgroundColor: '#3CAEA3', borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:   { fontSize: 11, color: '#fff', fontWeight: '700' },
  favWrap:     { position: 'absolute', top: 12, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 20, padding: 6 },
  body:        { padding: 14 },
  row:         { justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  price:       { fontSize: 18, fontWeight: '800' },
  typePill:    { borderRadius: 50, paddingHorizontal: 10, paddingVertical: 3 },
  typeText:    { fontSize: 11, fontWeight: '700' },
  battRow:     { alignItems: 'center', gap: 7, marginBottom: 11 },
  battTrack:   { flex: 1, height: 5, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' },
  battFill:    { height: 5, borderRadius: 3 },
  battPct:     { fontSize: 11, fontWeight: '700', width: 34, textAlign: 'right' },
  metaRow:     { gap: 6, alignItems: 'center', marginBottom: 13 },
  metaItem:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTxt:     { fontSize: 12 },
  dot:         { width: 3, height: 3, borderRadius: 2 },
  btn:         { borderRadius: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 12 },
  btnTxt:      { color: '#fff', fontWeight: '700', fontSize: 13 },
});

// ─── Sort dropdown ─────────────────────────────────────────────────────────────
function SortBar({ sortKey, onSelect, isRTL, colors }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find(o => o.key === sortKey);
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 4, zIndex: 10 }}>
      <TouchableOpacity
        onPress={() => setOpen(o => !o)}
        style={[sort.trigger, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        activeOpacity={0.8}
      >
        <Ionicons name="funnel-outline" size={14} color={colors.textMuted} />
        <Text style={[sort.triggerTxt, { color: colors.textSoft }]}>
          {isRTL ? current.ar : current.en}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} />
      </TouchableOpacity>

      {open && (
        <View style={[sort.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {SORT_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[sort.option, opt.key === sortKey && { backgroundColor: colors.primary + '14' }]}
              onPress={() => { setOpen(false); onSelect(opt.key); Haptics.selectionAsync(); }}
            >
              <Text style={[sort.optionTxt, { color: opt.key === sortKey ? colors.primary : colors.textSoft }]}>
                {isRTL ? opt.ar : opt.en}
              </Text>
              {opt.key === sortKey && <Ionicons name="checkmark" size={14} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
const sort = StyleSheet.create({
  trigger:    { alignItems: 'center', gap: 8, alignSelf: 'flex-start', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  triggerTxt: { fontSize: 13, fontWeight: '600' },
  dropdown:   { position: 'absolute', top: 44, left: 0, right: 0, borderWidth: 1, borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 6 },
  option:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  optionTxt:  { fontSize: 13, fontWeight: '600' },
});

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ isRTL, colors }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 72, paddingHorizontal: 32 }}>
      <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <Ionicons name="search-outline" size={40} color={colors.border} />
      </View>
      <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
        {isRTL ? 'لا توجد نتائج' : 'No Results Found'}
      </Text>
      <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 21 }}>
        {isRTL
          ? 'جرّب البحث بكلمات مختلفة أو غيّر الفلتر'
          : 'Try different keywords or change the filter'}
      </Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function MarketplaceScreen() {
  const { colors, tr, isRTL } = useApp();
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();

  const [filter,    setFilter]    = useState('all');
  const [search,    setSearch]    = useState('');
  const [sortKey,   setSortKey]   = useState('default');
  const [favorites, setFavorites] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [cars,      setCars]      = useState(CARS_FALLBACK);

  // Search bar animation
  const searchScale = useRef(new Animated.Value(1)).current;

  const loadCars = useCallback(async () => {
    try {
      const data = await fetchCars();
      if (data && data.length > 0) setCars(data);
    } catch (e) {
      console.warn('Supabase fetch failed, using fallback data:', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCars(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCars();
    setRefreshing(false);
  }, [loadCars]);

  const focusSearch = () => {
    Animated.spring(searchScale, { toValue: 1.02, useNativeDriver: true, speed: 20 }).start();
  };
  const blurSearch = () => {
    Animated.spring(searchScale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  const toggleFav = (id) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  // Filter + search
  let filtered = cars.filter(c => {
    const matchType   = filter === 'all' || c.type === filter;
    const q           = search.toLowerCase();
    const matchSearch = !q || `${c.make} ${c.model}`.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortKey) {
      case 'priceAsc':  return a.price - b.price;
      case 'priceDesc': return b.price - a.price;
      case 'yearDesc':  return b.year  - a.year;
      case 'kmAsc':     return a.km    - b.km;
      default:          return a.id    - b.id;
    }
  });

  const favCount = favorites.length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>

      {/* ── Hero with embedded search ── */}
      <LinearGradient colors={['#041628', '#0b2340', '#0f2a4a']} style={[hero.wrap, { paddingTop: insets.top + 16 }]}>
        {/* Title row */}
        <View style={[hero.titleRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[hero.title, { textAlign: isRTL ? 'right' : 'left' }]}>
              {tr.marketTitle}
            </Text>
            <Text style={[hero.sub, { textAlign: isRTL ? 'right' : 'left' }]}>
              {tr.marketSub}
            </Text>
          </View>
          {favCount > 0 && (
            <View style={hero.favBadge}>
              <Ionicons name="heart" size={14} color="#ef4444" />
              <Text style={hero.favCount}>{favCount}</Text>
            </View>
          )}
        </View>

        {/* Search bar */}
        <Animated.View style={[hero.searchWrap, { transform: [{ scale: searchScale }], flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Ionicons name="search-outline" size={17} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={[hero.searchInput, { color: '#fff', textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={isRTL ? 'ابحث: تسلا، BYD، هيونداي...' : 'Search: Tesla, BYD, Hyundai...'}
            placeholderTextColor="rgba(255,255,255,0.38)"
            value={search}
            onChangeText={setSearch}
            onFocus={focusSearch}
            onBlur={blurSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </LinearGradient>

      {/* ── Filter chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[chips.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        style={{ backgroundColor: colors.bg }}
      >
        {FILTERS.map(f => (
          <FilterChip
            key={f.key}
            label={isRTL ? f.ar : f.en}
            active={filter === f.key}
            onPress={() => setFilter(f.key)}
          />
        ))}
      </ScrollView>

      {/* ── Sort bar ── */}
      {!loading && (
        <SortBar sortKey={sortKey} onSelect={setSortKey} isRTL={isRTL} colors={colors} />
      )}

      {/* ── Results count ── */}
      {!loading && (
        <Text style={[results.txt, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL
            ? `${filtered.length} سيارة متاحة`
            : `${filtered.length} vehicle${filtered.length !== 1 ? 's' : ''} available`}
        </Text>
      )}

      {/* ── List ── */}
      {loading ? (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </ScrollView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 32 + insets.bottom }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={<EmptyState isRTL={isRTL} colors={colors} />}
          renderItem={({ item }) => (
            <CarCard
              item={item}
              isFav={favorites.includes(item.id)}
              onFav={() => toggleFav(item.id)}
              onPress={() => navigation.navigate('CarDetail', { car: item })}
              colors={colors}
              isRTL={isRTL}
            />
          )}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const hero = StyleSheet.create({
  wrap:        { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 24 },
  titleRow:    { alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  title:       { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  sub:         { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  favBadge:    { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(239,68,68,0.18)', borderRadius: 50, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(239,68,68,0.35)' },
  favCount:    { fontSize: 13, fontWeight: '800', color: '#ef4444' },
  searchWrap:  { alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  searchInput: { flex: 1, fontSize: 14 },
});

const chips = StyleSheet.create({
  row: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
});

const results = StyleSheet.create({
  txt: { fontSize: 12, fontWeight: '600', paddingHorizontal: 16, marginBottom: 4 },
});

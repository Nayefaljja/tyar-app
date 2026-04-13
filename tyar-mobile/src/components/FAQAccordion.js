import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  Animated, StyleSheet, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../constants/AppContext';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  {
    ar: {
      q: 'كيف أتحقق من جودة السيارة قبل الشراء؟',
      a: 'كل سيارة تمر بفحص شامل للبطارية والأجهزة الكهربائية وسجل الصيانة. نوفر تقريراً مفصلاً قبل الشراء.',
    },
    en: {
      q: 'How do I verify EV quality before buying?',
      a: 'Every car undergoes a full inspection including battery health, electrical systems, and maintenance history. We provide a detailed report before purchase.',
    },
  },
  {
    ar: {
      q: 'كم يستغرق تركيب الشاحن المنزلي؟',
      a: 'عادةً 2–4 ساعات حسب نوع الشاحن والتمديدات الكهربائية الموجودة لديك.',
    },
    en: {
      q: 'How long does home charger installation take?',
      a: 'Typically 2–4 hours depending on the charger type and your existing electrical setup.',
    },
  },
  {
    ar: {
      q: 'ما المدن التي تخدمها تيار؟',
      a: 'نخدم حالياً: الرياض، جدة، الدمام، مكة، المدينة، الخبر. وسنتوسع قريباً.',
    },
    en: {
      q: 'Which cities do you serve?',
      a: 'We currently serve Riyadh, Jeddah, Dammam, Makkah, Madinah, and Khobar — expanding soon.',
    },
  },
  {
    ar: {
      q: 'هل هناك ضمان على خدمات التركيب والصيانة؟',
      a: 'نعم، نقدم ضمان 6 أشهر على جميع أعمال التركيب والصيانة.',
    },
    en: {
      q: 'Is there a warranty on installation and maintenance?',
      a: 'Yes, we provide a 6-month warranty on all installation and maintenance work.',
    },
  },
  {
    ar: {
      q: 'كيف أتواصل مع البائع في سوق السيارات؟',
      a: 'يمكنك التواصل مع البائعين مباشرة عبر نظام المراسلة الآمن في المنصة.',
    },
    en: {
      q: 'How do I contact a seller in the marketplace?',
      a: 'You can contact sellers directly through our secure in-app messaging system.',
    },
  },
];

function Item({ item, isRTL, colors, index, openIndex, setOpenIndex }) {
  const isOpen  = openIndex === index;
  const chevron = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const bgAnim  = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  const toggle = () => {
    Haptics.selectionAsync();

    LayoutAnimation.configureNext({
      duration: 280,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'spring',        springDamping: 0.72 },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });

    const willOpen = !isOpen;
    setOpenIndex(willOpen ? index : null);

    Animated.parallel([
      Animated.spring(chevron, {
        toValue: willOpen ? 1 : 0,
        tension: 90,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(bgAnim, {
        toValue: willOpen ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const data      = isRTL ? item.ar : item.en;
  const rotateDeg = chevron.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  // Subtle background tint when open
  const cardBg = bgAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [colors.surface, colors.primaryGlow ?? colors.surface2],
  });

  const borderColor = isOpen ? colors.primary + '55' : colors.border;

  return (
    <Animated.View
      style={[
        styles.item,
        {
          backgroundColor: cardBg,
          borderColor,
          // Lift open card slightly
          shadowOpacity: isOpen ? 0.10 : 0.04,
          shadowRadius:  isOpen ? 14   : 6,
          shadowOffset:  { width: 0, height: isOpen ? 6 : 2 },
          shadowColor:   colors.navy ?? '#0f2744',
          elevation:     isOpen ? 5 : 1,
        },
      ]}
    >
      {/* Accent bar — shown only when open */}
      {isOpen && (
        <View
          style={[
            styles.accentBar,
            {
              backgroundColor: colors.primary,
              [isRTL ? 'right' : 'left']: 0,
            },
          ]}
        />
      )}

      {/* Question row */}
      <TouchableOpacity
        style={[styles.questionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        onPress={toggle}
        activeOpacity={0.72}
      >
        {/* Numbered badge */}
        <View
          style={[
            styles.numBadge,
            {
              backgroundColor: isOpen ? colors.primary : colors.surface2,
            },
          ]}
        >
          <Text style={[styles.numText, { color: isOpen ? '#fff' : colors.textMuted }]}>
            {index + 1}
          </Text>
        </View>

        <Text
          style={[
            styles.qText,
            {
              color:     isOpen ? colors.text : colors.textSoft,
              textAlign: isRTL ? 'right' : 'left',
              flex: 1,
              fontWeight: isOpen ? '700' : '600',
            },
          ]}
        >
          {data.q}
        </Text>

        {/* Animated chevron */}
        <Animated.View
          style={[
            styles.chevronWrap,
            {
              backgroundColor: isOpen ? colors.primary + '18' : colors.surface2,
              transform: [{ rotate: rotateDeg }],
            },
          ]}
        >
          <Ionicons
            name="chevron-down"
            size={16}
            color={isOpen ? colors.primary : colors.textMuted}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Answer — conditionally rendered; LayoutAnimation handles the height transition */}
      {isOpen && (
        <View style={styles.answerContainer}>
          <View style={[styles.answerDivider, { backgroundColor: colors.border }]} />
          <Text
            style={[
              styles.aText,
              {
                color:     colors.textSoft,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
          >
            {data.a}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

export default function FAQAccordion() {
  const { colors, isRTL } = useApp();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <View style={{ gap: 10 }}>
      {FAQ_DATA.map((item, i) => (
        <Item
          key={i}
          item={item}
          isRTL={isRTL}
          colors={colors}
          index={i}
          openIndex={openIndex}
          setOpenIndex={setOpenIndex}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },

  // Left/right accent bar
  accentBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3.5,
    borderRadius: 2,
    zIndex: 1,
  },

  questionRow: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    gap: 12,
  },

  numBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },

  qText: {
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.1,
  },

  chevronWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  answerDivider: {
    height: 1,
    marginBottom: 12,
    borderRadius: 1,
    opacity: 0.6,
  },
  aText: {
    fontSize: 13.5,
    lineHeight: 22,
    letterSpacing: 0.1,
    paddingLeft: 4,
    paddingRight: 4,
  },
});

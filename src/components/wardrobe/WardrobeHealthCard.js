import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/theme/colors';
import { translateToArabic } from '../../utils/dynamicTranslator';

/**
 * WardrobeHealthCard
 * Props:
 *  itemCount   number
 *  subtitle    string — dynamic AI-generated health text
 */
const WardrobeHealthCard = ({ itemCount = 0, subtitle }) => {
  const { t, i18n } = useTranslation();
  const [translatedSubtitle, setTranslatedSubtitle] = useState('');

  const defaultSubtitle = i18n.language === 'ar'
    ? `لديك ${itemCount} عنصر مزامن. استمر في بناء خزانة ملابسك!`
    : `You have ${itemCount} item${itemCount !== 1 ? 's' : ''} synced. Keep building your wardrobe!`;

  useEffect(() => {
    let active = true;
    const updateTranslation = async () => {
      if (!subtitle) {
        setTranslatedSubtitle('');
        return;
      }
      if (i18n.language === 'ar') {
        const tr = await translateToArabic(subtitle);
        if (active) setTranslatedSubtitle(tr);
      } else {
        if (active) setTranslatedSubtitle(subtitle);
      }
    };
    updateTranslation();
    return () => { active = false; };
  }, [subtitle, i18n.language]);

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="sparkles" size={22} color="#FFFFFF" />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{t('wardrobe.health')}</Text>
        <Text style={styles.subtitle} numberOfLines={3}>
          {translatedSubtitle || subtitle || defaultSubtitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9EBEE',
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 4,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 20,
    lineHeight: 20,
    color: '#121826',
  },
  subtitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 10,
    lineHeight: 10,
    color: '#6B7280',
  },
});

export default WardrobeHealthCard;
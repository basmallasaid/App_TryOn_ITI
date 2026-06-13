// src/components/wardrobe/WardrobeHealthCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
const WardrobeHealthCard = ({ itemCount = 0, subtitle }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const defaultSubtitle = t("wardrobe.health.subtitle", { count: itemCount });

const styles = React.useMemo(() => StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
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
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 10,
    lineHeight: 10,
    color: Colors.textMuted,
  },
}), [themeVersion]);

  return (
    <View style={[styles.card, { flexDirection: 'row' }]}>
      <View style={styles.iconWrap}>
        <Ionicons name="sparkles" size={22} color="#FFFFFF" />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.title, { textAlign: 'left' }]}>{t("wardrobe.health.title")}</Text>
        <Text style={[styles.subtitle, { textAlign: 'left' }]} numberOfLines={3}>
          {subtitle || defaultSubtitle}
        </Text>
      </View>
    </View>
  );
};


export default WardrobeHealthCard;

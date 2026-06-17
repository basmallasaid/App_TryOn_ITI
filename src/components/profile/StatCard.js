// src/components/profile/StatCard.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
const StatCard = ({ icon, title, subtitle, onPress }) => {
  const { themeVersion } = useTheme();
  const { isRTL } = useLanguage();
const styles = React.useMemo(() => StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 70,
    backgroundColor: Colors.white,
  },
  texts: {
    gap: 4,
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    lineHeight: 16.38,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 10,
    lineHeight: 10,
    color: Colors.textPrimary,
  },
}), [themeVersion]);

  return (
    <TouchableOpacity style={[styles.card, { flexDirection: isRTL ? 'row-reverse' : 'row' }]} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={22} color={Colors.textPrimary} />
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};


export default StatCard;
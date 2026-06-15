import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
const HorizontalScrollSection = React.memo(function HorizontalScrollSection({
  title,
  items,
  onViewAll,
  renderItem,
  seeMoreCardStyle,
}) {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:20,
    marginTop:35,
  },
  sectionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: Colors.textPrimary,
  },
  viewAllBtn: {
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  arrowIcon: {
    marginTop: 3,
  },
  scrollContent: {
    paddingRight: 20,
    paddingBottom: 10,
  },
  itemWrapper: {
    marginRight: 12,
  },
  seeMoreCard: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderStyle: 'dashed',
    backgroundColor: Colors.borderDefault,
  },
  seeMoreText: {
    fontFamily: 'Roboto_regular',
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 6,
  },
}), [themeVersion]);

  if (!items || items.length === 0) return null;

  const displayed = items.slice(0, 5);

  return (
    <>
      <View style={[styles.sectionHeader, { flexDirection: 'row' }]}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {displayed.map((item, index) => (
          <View key={index} style={styles.itemWrapper}>
            {renderItem(item, index)}
          </View>
        ))}
        <TouchableOpacity
          style={[styles.seeMoreCard, seeMoreCardStyle]}
          onPress={onViewAll}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="dots-horizontal" size={28} color={Colors.textSecondary} />
          <Text style={styles.seeMoreText}>{t('home.viewAll')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
});

export default HorizontalScrollSection;


import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import Colors from '../../constants/theme/colors';

export const StoreHeader = ({ onFilterPress }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    textContainer: { flex: 1 },
    titleWrap: { flexDirection: 'row' },
    title: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'left' },
    subtitleWrap: { flexDirection: 'row' },
    subtitle: { color: Colors.textMuted, fontSize: 13, marginTop: 12, textAlign: 'left' },
    filterBtn: {
      borderWidth: 1,
      borderColor: Colors.borderDefault,
      padding: 10,
      borderRadius: 12,
    },
  }), [themeVersion]);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.textContainer}>
        <View style={styles.titleWrap}><Text style={styles.title}>{t('store.title')}</Text></View>
        <View style={styles.subtitleWrap}><Text style={styles.subtitle}>{t('store.subtitle')}</Text></View>
      </View>
      <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
        <Ionicons name="options-outline" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};


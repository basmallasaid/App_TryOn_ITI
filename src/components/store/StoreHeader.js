import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export const StoreHeader = ({ onFilterPress }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.headerContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t('store.title')}</Text>
        <Text style={styles.subtitle}>{t('store.subtitle')}</Text>
      </View>
      <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
        <Ionicons name="options-outline" size={22} color="#1A1C24" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  textContainer: { flex: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A1C24' },
  subtitle: { color: '#6B7280', fontSize: 13, marginTop: 12 },
  filterBtn: { borderWidth: 1, borderColor: '#D5D9DE', padding: 10, borderRadius: 12 },
});
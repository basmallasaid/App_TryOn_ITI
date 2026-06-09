import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const getCategoryIcon = (category) => {
  const key = String(category || '').toLowerCase();
  // Top
  if (
    key.includes('top') ||
    key.includes('shirt') ||
    key.includes('tee')
  ) {
    return 'tshirt-crew-outline';
  }

  // Dress
  if (key.includes('dress')) {
    return 'hanger';
  }

  // Bottom
  if (
    key.includes('bottom') ||
    key.includes('pants') ||
    key.includes('short')
  ) {
    return 'human-male-height';
  }

  return null;
};
export const CategoryTabs = ({ categories = [{ id: 'all', name: 'All', icon: null, value: 'all' }], activeCategory = 'all', onCategoryChange }) => {
  const [active, setActive] = useState(activeCategory);

  useEffect(() => {
    setActive(activeCategory);
  }, [activeCategory]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((cat) => {
        const iconName = cat.icon || getCategoryIcon(cat.value || cat.id);

        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => {
              setActive(cat.id);
              onCategoryChange?.(cat.value);
            }}
            style={[styles.tab, active === cat.id && styles.activeTab]}
          >
            {iconName && <MaterialCommunityIcons name={iconName} size={20} color={active === cat.id ? '#FFF' : '#27AE60'} style={{ marginRight: 8 }} />}
            <Text style={[styles.tabText, active === cat.id && styles.activeTabText]}>{cat.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 ,marginTop:25 },
  tab: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginRight: 10, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center' },
  activeTab: { backgroundColor: '#40B9FF', borderColor: '#5CC1FF' },
  tabText: { fontWeight: '600', color: '#666' },
  activeTabText: { color: '#FFF' },
});
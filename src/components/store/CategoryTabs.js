import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const getCategoryIcon = (category) => {
  const key = String(category || '').toLowerCase();
  if (
    key.includes('top') ||
    key.includes('shirt') ||
    key.includes('tee')
  ) {
    return 'tshirt-crew-outline';
  }
  if (key.includes('dress')) {
    return 'hanger';
  }
  if (
    key.includes('bottom') ||
    key.includes('pants') ||
    key.includes('short')
  ) {
    return 'human-male-height';
  }
  return null;
};

export const CategoryTabs = ({ categories: categoriesProp, activeCategory = 'all', onCategoryChange }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const allLabel = t('store.all');
  const defaultCategories = [{ id: 'all', name: allLabel, icon: null, value: 'all' }];
  const categories = categoriesProp || defaultCategories;
  const [active, setActive] = useState(activeCategory);

  useEffect(() => {
    setActive(activeCategory);
  }, [activeCategory]);

const styles = React.useMemo(() => StyleSheet.create({
  container: { marginBottom: 20, marginTop: 25 },
  tab: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginRight: 10, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderDefault, alignItems: 'center' },
  activeTab: { backgroundColor: '#40B9FF', borderColor: '#5CC1FF' },
  tabText: { fontWeight: '600', color: '#666' },
  activeTabText: { color: Colors.textInverse },
}), [themeVersion]);

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
            style={[styles.tab, active === cat.id && styles.activeTab, { flexDirection: 'row' }]}
          >
            {iconName && <MaterialCommunityIcons name={iconName} size={20} color={active === cat.id ? '#FFF' : '#8ED321'} style={{ marginRight: 8 }} />}
            <Text style={[styles.tabText, active === cat.id && styles.activeTabText]}>{cat.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};


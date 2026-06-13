import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
export const StoreHeader = ({ onFilterPress }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();

const styles = React.useMemo(() => StyleSheet.create({
  headerContainer: { justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  textContainer: { flex: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary },
  subtitle: { color: Colors.textMuted, fontSize: 13, marginTop: 12 },
  filterBtn: { borderWidth: 1, borderColor: Colors.borderDefault, padding: 10, borderRadius: 12 },
}), [themeVersion]);

  return (
    <View style={[styles.headerContainer, { flexDirection: 'row' }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { textAlign: 'left' }]}>{t("store.title")}</Text>
        <Text style={[styles.subtitle, { textAlign: 'left' }]}>{t("store.subtitle")}</Text>
      </View>
      <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
        <Ionicons name="options-outline" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};


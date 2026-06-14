// src/components/wardrobe/AddItemCard.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const AddItemCard = ({ onPress }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    card: {
      width: 150,
      height: 237,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: '#6B7280',
      borderStyle: 'dashed',
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.white,
      marginTop: 20,
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 9999,
      backgroundColor: '#E9EDFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 16,
      color: Colors.textMuted,
      textAlign: 'center',
    },
  }), [themeVersion]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconCircle}>
        <Ionicons name="add" size={20} color="#6B7280" />
      </View>
      <Text style={styles.label}>{t('wardrobe.addNewItem')}</Text>
    </TouchableOpacity>
  );
};

export default AddItemCard;

// src/components/wardrobe/CategoryChip.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';

const CategoryChip = ({ label, selected, onPress }) => {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    chip: {
      height: 35,
      paddingHorizontal: 24,
      borderRadius: 8,
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.borderDefault,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chipSelected: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    label: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 16,
      color: '#475569',
      textAlign: 'center',
    },
    labelSelected: {
      color: Colors.textInverse,
      fontFamily: 'Roboto_600SemiBold',
    },
  }), [themeVersion]);

  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryChip;
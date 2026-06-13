// src/components/profile/StyleChip.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
const StyleChip = ({ label, selected, customizeMode, onPress }) => {
  const { themeVersion } = useTheme();
  const isDisabled = customizeMode && !selected;

const styles = React.useMemo(() => StyleSheet.create({
  chip: {
    alignItems: 'center',
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  chipSelected: {
    backgroundColor: '#E5F2FF',
    borderColor: Colors.primary,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    color: Colors.textPrimary,
  },
  labelSelected: {
    color: Colors.textPrimary,
  },
  labelDisabled: {
    color: Colors.textPrimary,
  },
}), [themeVersion]);

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { flexDirection: 'row' },
        selected && styles.chipSelected,
        isDisabled && styles.chipDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {selected && customizeMode && (
        <Ionicons
          name="close"
          size={12}
          color={Colors.textPrimary}
          style={{ marginRight: 4 }}
        />
      )}
      <Text style={[
        styles.label,
        selected && styles.labelSelected,
        isDisabled && styles.labelDisabled,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};


export default StyleChip;
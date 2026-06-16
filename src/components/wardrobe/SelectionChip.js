import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';

const SelectionChip = ({ label, isSelected, onPress }) => {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    chip: {
      width: 80.75,
      height: 37,
      borderRadius: 8,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    chipText: {
      fontFamily: "Roboto_500Medium",
      fontSize: 12,
      textAlign: "center",
    },
  }), [themeVersion]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        { 
          borderColor: isSelected ? Colors.primary : Colors.borderDefault,
          backgroundColor: Colors.white
        },
      ]}
    >
      <Text style={[
        styles.chipText, 
        { color: isSelected ? Colors.primary : Colors.textSecondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SelectionChip;
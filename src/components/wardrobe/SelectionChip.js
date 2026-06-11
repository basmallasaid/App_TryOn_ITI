import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/theme/colors';

const SelectionChip = ({ label, isSelected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      { 
        borderColor: isSelected ? Colors.primary : "#D5D9DE",
        backgroundColor: Colors.white
      },
    ]}
  >
    <Text style={[
      styles.chipText, 
      { color: isSelected ? Colors.primary : "#475569" }
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
});

export default SelectionChip;
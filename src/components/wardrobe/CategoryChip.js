// src/components/wardrobe/CategoryChip.js
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/theme/colors';

/**
 * CategoryChip
 * Props:
 *  label     string
 *  selected  bool
 *  onPress   func
 */
const CategoryChip = ({ label, selected, onPress }) => (
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

const styles = StyleSheet.create({
  chip: {
    height: 35,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D9DE',
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
    color: '#FFFFFF',
    fontFamily: 'Roboto_600SemiBold',
  },
});

export default CategoryChip;
// src/components/profile/StyleChip.js
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';

/**
 * StyleChip
 * Props:
 *  label         string
 *  selected      bool
 *  customizeMode bool  — when true, unselected chips are dimmed + selected show X
 *  onPress       func
 */
const StyleChip = ({ label, selected, customizeMode, onPress }) => {
  const isDisabled = customizeMode && !selected;

  return (
    <TouchableOpacity
      style={[
        styles.chip,
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

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E9EBEE',
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
    color: '#1E1E24',
  },
  labelSelected: {
    color: '#121826',
  },
  labelDisabled: {
    color: '#1E1E24',
  },
});

export default StyleChip;
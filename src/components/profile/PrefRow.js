// src/components/profile/PrefRow.js
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';

/**
 * PrefRow — preference list row
 * Props:
 *  icon          string   — Ionicons name
 *  title         string
 *  right         ReactNode — right side content (switch, arrow, etc.)
 *  onPress       func      — row tap handler
 *  borderBottom  bool      — default true
 */
const PrefRow = ({ icon, title, right, onPress, borderBottom = true }) => (
  <TouchableOpacity
    activeOpacity={onPress ? 0.7 : 1}
    onPress={onPress}
    style={[styles.row, !borderBottom && { borderBottomWidth: 0 }]}
  >
    <View style={styles.left}>
      <Ionicons
        name={icon}
        size={20}
        color={Colors.textPrimary}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={styles.right}>{right}</View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D5D9DE',
    minHeight: 40,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    lineHeight: 15,
    paddingBottom: 2,
    color: Colors.textPrimary,
  },
  right: {
    alignItems: 'flex-end',
  },
});

export default PrefRow;
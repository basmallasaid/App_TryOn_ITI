// src/components/profile/PrefRow.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
const PrefRow = ({ icon, title, right, onPress, borderBottom = true }) => {
  const { themeVersion } = useTheme();
const styles = React.useMemo(() => StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
    minHeight: 40,
  },
  left: {
    alignItems: 'center',
  },
  icon: {
  },
  title: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    lineHeight: 15,
    paddingBottom: 2,
    color: Colors.textPrimary,
  },
  right: {
  },
}), [themeVersion]);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={[{ flexDirection: 'row' }, styles.row, !borderBottom && { borderBottomWidth: 0 }]}
    >
      <View style={[styles.left, { flexDirection: 'row' }]}>
        <Ionicons
          name={icon}
          size={20}
          color={Colors.textPrimary}
          style={[styles.icon, { marginRight: 10, marginLeft: 0 }]}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={[styles.right, { alignItems: 'flex-end' }]}>{right}</View>
    </TouchableOpacity>
  );
};


export default PrefRow;
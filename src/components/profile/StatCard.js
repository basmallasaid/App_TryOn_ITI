// src/components/profile/StatCard.js
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';
/**
 * StatCard
 * Props:
 *  icon      string  — Ionicons name
 *  title     string
 *  subtitle  string
 *  onPress   func
 */
const StatCard = ({ icon, title, subtitle, onPress }) => {
  return (
    <TouchableOpacity style={[styles.card, { flexDirection: 'row' }]} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={22} color={Colors.textPrimary} />
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9EBEE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 70,
    backgroundColor: '#fff',
  },
  texts: {
    gap: 4,
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    lineHeight: 16.38,
    color: '#121826',
  },
  subtitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 10,
    lineHeight: 10,
    color: '#1E1E24',
  },
});

export default StatCard;
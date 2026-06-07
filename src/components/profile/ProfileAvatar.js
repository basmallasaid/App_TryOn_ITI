// src/components/profile/ProfileAvatar.js
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/theme/colors';

/**
 * ProfileAvatar
 * Props:
 *  name  string — uses first letter as fallback
 *  size  number — default 52
 */
const ProfileAvatar = ({ name, size = 52 }) => {
  const fontSize = size * 0.42;
  return (
    <View style={[
      styles.avatar,
      { width: size, height: size, borderRadius: size / 2 }
    ]}>
      <Text style={[styles.letter, { fontSize }]}>
        {name ? name.charAt(0).toUpperCase() : '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontFamily: 'Roboto_700Bold',
    color: '#fff',
  },
});

export default ProfileAvatar;
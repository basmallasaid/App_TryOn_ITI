import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';

const ProfileAvatar = ({ firstName, lastName, imageUri }) => {
  const first = (firstName || '')[0] || '';
  const last = (lastName || '')[0] || '';
  const initials = (first + last).toUpperCase();

  const hasImage = typeof imageUri === 'string' && imageUri.length > 0 && imageUri !== 'null' && imageUri !== 'undefined';

  return (
    <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' }}>
      {hasImage ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 52, height: 52, borderRadius: 26, overflow: 'hidden' }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ color: Colors.textInverse, fontSize: 20, fontWeight: '700' }}>{initials || '?'}</Text>
      )}
      <View style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.primary }}>
        <Ionicons name="camera" size={11} color={Colors.primary} />
      </View>
    </View>
  );
};

export default ProfileAvatar;

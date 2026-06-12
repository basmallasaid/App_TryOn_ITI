import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileAvatar = ({ firstName, lastName, imageUri }) => {
  const first = (firstName || '')[0] || '';
  const last = (lastName || '')[0] || '';
  const initials = (first + last).toUpperCase();

  const hasImage = typeof imageUri === 'string' && imageUri.length > 0 && imageUri !== 'null' && imageUri !== 'undefined';

  return (
    <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#40B9FF', justifyContent: 'center', alignItems: 'center' }}>
      {hasImage ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 52, height: 52, borderRadius: 26, overflow: 'hidden' }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{initials || '?'}</Text>
      )}
      <View style={{ position: 'absolute', bottom: -4, right: -4, width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#40B9FF' }}>
        <Ionicons name="camera" size={11} color="#40B9FF" />
      </View>
    </View>
  );
};

export default ProfileAvatar;

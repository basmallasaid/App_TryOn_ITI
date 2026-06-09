import { TouchableOpacity, View, Text, ImageBackground, StyleSheet } from 'react-native';

const WardrobeItemCard = ({ item, onPress }) => {
  const imageSource = item.image
    ? { uri: item.image }   // base64 or URL both work with uri
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={imageSource}
        style={styles.image}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        {/* Gradient overlay at bottom */}
        <View style={styles.overlay}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.category} numberOfLines={1}>{item.category}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 237,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E9EBEE',
    marginTop:20,
    //marginLeft:20,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    width: 150,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
    backgroundColor: 'transparent',
    // Gradient overlay using shadow layers
    // React Native doesn't support linear-gradient natively without expo-linear-gradient
    // Using a semi-transparent overlay as fallback
    backgroundImage: undefined,
  },
  name: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    lineHeight: 16,
    color: '#FFFFFF',
  },
  category: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 10,
    lineHeight: 10,
    color: 'rgba(255,255,255,0.8)',
  },
});

export default WardrobeItemCard;
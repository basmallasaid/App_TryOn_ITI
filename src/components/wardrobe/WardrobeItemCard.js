import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';

const WardrobeItemCard = ({ item, onPress, isFavorite, onToggleFavorite }) => {
  const imageSource = item.image ? { uri: item.image } : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={imageSource}
        style={styles.image}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.favoriteBtnContainer}
          onPress={onToggleFavorite}
          activeOpacity={0.7}
        >
          <View style={styles.blurCircle}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={16}
              color={isFavorite ? Colors.error : '#FFFFFF'}
            />
          </View>
        </TouchableOpacity>

        {/* Modern Bottom Scrim Overlay */}
        <View style={styles.overlay}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.category} numberOfLines={1}>
              {item.category}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 237,
    borderRadius: 20, // More rounded for modern look
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    // Modern Shadow/Elevation
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 20,
  },
  favoriteBtnContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  blurCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Translucent dark glass
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  overlay: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker, more focused scrim
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  name: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Capsule style badge
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  category: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 9,
    textTransform: 'uppercase', // Boutique look
    letterSpacing: 0.8,
    color: '#FFFFFF',
  },
});

export default WardrobeItemCard;

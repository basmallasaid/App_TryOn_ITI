import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { ImageBackground } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';

const blurhash = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';

const WardrobeItemCardComponent = ({ item, onPress, onLongPress, isFavorite, onToggleFavorite }) => {
  const imageSource = item.image ? { uri: item.image } : null;
  const { themeVersion } = useTheme();

const styles = React.useMemo(() => StyleSheet.create({
  card: {
    width: 150,
    height: 237,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginTop: 20,
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
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  overlay: {
    height: 59,
    padding: 12,
    gap: 4,
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  name: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  category: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.textInverse,
  },
}), [themeVersion]);

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
        placeholder={blurhash}
        transition={300}
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
        <LinearGradient
          colors={["rgba(0,0,0,0.43)", "rgba(0,0,0,0.01)"]}
          style={styles.overlay}
        >
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.category} numberOfLines={1}>
              {item.category}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default React.memo(WardrobeItemCardComponent);

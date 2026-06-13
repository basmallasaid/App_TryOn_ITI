import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
export const ProductCard = ({
  name,
  brand,
  price,
  image,
  badge,
  badgeColor,
  isOutlined,
  onPress,
  isFavorite,
  onToggleFavorite,
  onTryOnPress,
}) => {
  const { themeVersion } = useTheme();
const styles = React.useMemo(() => StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 22,
    marginVertical: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  imageWrapper: {
    height: 180,
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    // backgroundColor: '#F9FAFB',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  overlayHeader: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  heartBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 6,
    borderRadius: 12,
  },
  info: {
    paddingHorizontal: 4,
    marginTop: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  brand: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  footer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
  },
  tryOnLink: {
    color: '#5CC1FF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tryOnBtn: {
    borderWidth: 1,
    borderColor: '#5CC1FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F0F9FF',
  },
  tryOnText: {
    color: '#5CC1FF',
    fontSize: 11,
    fontWeight: 'bold',
  },
}), [themeVersion]);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.img} resizeMode="cover" />
        <View style={[styles.overlayHeader, { flexDirection: 'row' }]}>
          {badge ? (
            <View
              style={[styles.badge, { backgroundColor: badgeColor || '#5CC1FF' }]}
            >
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : (
            <View />
          )}

          <TouchableOpacity style={styles.heartBtn} onPress={onToggleFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#FF8A3D' : Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { textAlign: 'left' }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.brand, { textAlign: 'left' }]} numberOfLines={1}>
          {brand}
        </Text>

        <View style={[styles.footer, { flexDirection: 'row' }]}>
          <Text style={styles.price} numberOfLines={1}>
            {price}
          </Text>

          {isOutlined ? (
            <TouchableOpacity style={styles.tryOnBtn} onPress={onTryOnPress}>
              <Text style={styles.tryOnText}>Try On</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Text style={styles.tryOnLink}>Try-on</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};


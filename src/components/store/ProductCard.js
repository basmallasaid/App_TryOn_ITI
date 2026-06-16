import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Colors from "../../constants/theme/colors";
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../context/ThemeContext";

const blurhash = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';
const ProductCardComponent = ({
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
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const styles = useMemo(() => StyleSheet.create({
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
      borderColor: Colors.borderDefault,
    },
    imageWrapper: {
      height: 180,
      width: '100%',
      borderRadius: 18,
      overflow: 'hidden',
      position: 'relative',
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
      color: Colors.primary,
      fontWeight: 'bold',
      fontSize: 12,
    },
    tryOnBtn: {
      borderWidth: 1,
      borderColor: Colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      backgroundColor: Colors.surfaceElevated,
    },
    tryOnText: {
      color: Colors.primary,
      fontSize: 11,
      fontWeight: 'bold',
    },
  }), [themeVersion]);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.img} resizeMode="cover" placeholder={blurhash} transition={300} />
        <View style={[styles.overlayHeader, { flexDirection: 'row' }]}>
          {badge ? (
            <View
              style={[styles.badge, { backgroundColor: badgeColor || Colors.primary }]}
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
              color={isFavorite ? Colors.accentOrange : Colors.textPrimary}
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
              <Text style={styles.tryOnText}>{t('store.productCard.tryOn')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onTryOnPress}>
              <Text style={styles.tryOnLink}>{t('store.productCard.tryOn')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ProductCard = React.memo(ProductCardComponent);

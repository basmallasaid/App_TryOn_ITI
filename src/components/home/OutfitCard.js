import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { IMAGES } from "../../constants/images/images";
import Colors from "../../constants/theme/colors";
import { getWeatherIcon } from "../../constants/weatherIcons";
import { getItemsList, getCompositeImage } from "../../utils/getItemImage";
import { useTheme } from "../../context/ThemeContext";
import { useWardrobe } from "../../context/WardrobeContext";

const BLURHASH_PLACEHOLDER = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';

const FALLBACK_IMAGE = IMAGES.PICK;

export default function OutfitCard({ onPress, todaysOutfit, todaysWeather }) {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const { items: wardrobeItems } = useWardrobe();

  const compositeImage = getCompositeImage(todaysOutfit);
  const items = getItemsList(todaysOutfit, wardrobeItems);
  const validImages = items.filter(i => i._image);
  const hasOutfit = !!compositeImage || validImages.length > 0;
  const weatherIcon = getWeatherIcon(todaysWeather?.condition).material;
  const temp = todaysWeather?.temperature;
  const label = items.map(i => i._name).filter(Boolean).join(", ");

  const renderImages = () => {
    if (compositeImage) {
      return <Image source={{ uri: compositeImage }} style={styles.fitImage} contentFit="contain" placeholder={BLURHASH_PLACEHOLDER} transition={300} />;
    }
    if (validImages.length === 0) {
      return <Image source={FALLBACK_IMAGE} style={styles.fitImage} contentFit="contain" />;
    }
    return <Image source={{ uri: validImages[0]._image }} style={styles.fitImage} contentFit="contain" placeholder={BLURHASH_PLACEHOLDER} transition={300} />;
  };

const styles = React.useMemo(() => StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    marginVertical: 4,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imageSection: {
    flex: 1.2, 
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fitImage: {
    width: '100%',
    height: '100%',
  },

  contentSection: {
    flex: 1.4,
  },
  title: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: 5,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'left',
    lineHeight: 18,
    marginBottom: 15,
  },
  infoRow: {
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  button: {
    backgroundColor: Colors.primarybrand,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 15,
  },
  buttonText: {
    fontFamily: 'Roboto_700Bold',
    color: Colors.textInverse,
    fontSize: 16,
  },
  arrowIcon: {
    marginTop:3,
  },
}), [themeVersion]);

  return (
    <View style={[styles.card, { flexDirection: 'row' }]}>
      <View style={styles.imageSection}>
        {renderImages()}
      </View>

      <View style={[styles.contentSection, { paddingStart: 10 }]}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <Text style={styles.title} numberOfLines={1}>
            {label || t('home.outfitCard.title')}
          </Text>
        </View>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <Text style={styles.subtitle}>
            {todaysOutfit?.score != null
              ? `${t('home.outfitCard.score')} ${todaysOutfit.score.toFixed(1)}`
              : t('home.outfitCard.subtitle')}
          </Text>
        </View>

        <View style={[styles.infoRow, { flexDirection: 'row' }]}>
          <View style={[styles.infoItem, { flexDirection: 'row' }]}>
            <MaterialCommunityIcons name={weatherIcon} size={22} color={Colors.accentOrange} />
<Text style={[styles.infoText, { marginStart: 5 }]}>
              {temp != null ? t('home.outfitCard.temperature', { temp }) : t('home.outfitCard.temperatureFallback')}
            </Text>
          </View>

          <View style={[styles.infoItem, { flexDirection: 'row' }]}>
            <Ionicons name="location-sharp" size={18} color={Colors.secondary} />
            <Text style={[styles.infoText, { marginStart: 5 }]}>{t('home.outfitCard.location')}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.button, { flexDirection: 'row' }]} activeOpacity={0.8} onPress={onPress}>
          <Text style={styles.buttonText} numberOfLines={1}>{t('home.outfitCard.viewOutfit')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


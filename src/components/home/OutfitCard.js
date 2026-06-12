import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { IMAGES } from "../../constants/images/images";
import Colors from "../../constants/theme/colors";
import { getWeatherIcon } from "../../constants/weatherIcons";
import { getItemsList } from "../../utils/getItemImage";

const FALLBACK_IMAGE = IMAGES.PICK;

export default function OutfitCard({ onPress, todaysOutfit, todaysWeather }) {
  const { t } = useTranslation();

  const items = getItemsList(todaysOutfit);
  const validImages = items.filter(i => i._image);
  const hasOutfit = validImages.length > 0;
  const weatherIcon = getWeatherIcon(todaysWeather?.condition).material;
  const temp = todaysWeather?.temperature;
  const label = items.map(i => i._name).filter(Boolean).join(", ");

  const renderImages = () => {
    if (validImages.length === 0) {
      return <Image source={FALLBACK_IMAGE} style={styles.fitImage} resizeMode="contain" />;
    }
    return <Image source={{ uri: validImages[0]._image }} style={styles.fitImage} resizeMode="contain" />;
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageSection}>
        {renderImages()}
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.title} numberOfLines={1}>
          {label || t('home.outfitCard.title')}
        </Text>
        <Text style={styles.subtitle}>
          {todaysOutfit?.score != null
            ? `${t('home.outfitCard.score')} ${todaysOutfit.score.toFixed(1)}`
            : t('home.outfitCard.subtitle')}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name={weatherIcon} size={22} color="#FF8A3D" />
            <Text style={styles.infoText}>
              {temp != null ? `${temp}°C` : "24° c"}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="location-sharp" size={18} color="#A3C639" />
            <Text style={styles.infoText}>{t('home.outfitCard.location')}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPress}>
          <Text style={styles.buttonText}>{t('home.outfitCard.viewOutfit')}</Text>
          <Ionicons name="arrow-forward" size={18} color="white" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    flexDirection: 'row', 
    alignItems: 'center',
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    paddingLeft: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1C24',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 5,
  },
  button: {
    backgroundColor: Colors.primarybrand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 15,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  arrowIcon: {
    marginTop:3,
    marginLeft: 8,
  },
});

import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { IMAGES } from "../../constants/images/images";
import Colors from "../../constants/theme/colors";
export default function TryOnCard({ imageUri, isFavorite, onToggleFavorite }) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.heartContainer}
        onPress={onToggleFavorite}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite ? Colors.error : Colors.textPrimary}
        />
      </TouchableOpacity>

      <Image
        source={imageUri ? { uri: imageUri } : IMAGES.TRY_ON}
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={[styles.button, { flexDirection: 'row' }]} activeOpacity={0.8}>
        <Text style={styles.buttonText}>{t('home.outfitCard.viewOutfit')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180, 
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  heartContainer: {
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 180,
    marginBottom: 15,
  },
  button: {
    backgroundColor: Colors.primarybrand,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    fontFamily: 'Roboto_600SemiBold',
    color: 'white',
    fontSize: 14,
  },
  arrow: {
    marginTop:4,
  },
});
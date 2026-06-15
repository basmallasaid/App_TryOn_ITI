import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { IMAGES } from "../../constants/images/images";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const blurhash = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';
const TryOnCard = React.memo(function TryOnCard({ imageUri, isFavorite, onToggleFavorite, onViewOutfit }) {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();

const styles = React.useMemo(() => StyleSheet.create({
  card: {
    width: 180, 
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 14,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
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
    color: Colors.textInverse,
    fontSize: 14,
  },
  arrow: {
    marginTop:4,
  },
}), [themeVersion]);

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
        contentFit="contain"
        placeholder={blurhash}
        transition={300}
        cachePolicy="disk"
      />

      <TouchableOpacity style={[styles.button, { flexDirection: 'row' }]} activeOpacity={0.8} onPress={onViewOutfit}>
        <Text style={styles.buttonText}>{t('home.outfitCard.viewOutfit')}</Text>
      </TouchableOpacity>
    </View>
  );
});

export default TryOnCard;

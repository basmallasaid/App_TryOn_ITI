import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { IMAGES } from "../../constants/images/images";
import Colors from "../../constants/theme/colors";
export default function TryOnCard({ imageUri }) {
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <View style={styles.card}>
    
      <TouchableOpacity 
        style={styles.heartContainer} 
        onPress={() => setIsFavorite(!isFavorite)}
      >
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={24} 
          color={isFavorite ? Colors.error : Colors.textPrimary} 
        />
      </TouchableOpacity>

     
      <Image 
        source={IMAGES.TRY_ON} 
        style={styles.image} 
        resizeMode="contain"
      />

    
      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>{t('home.outfitCard.viewOutfit')}</Text>
        <Ionicons name="arrow-forward" size={16} color="white" style={styles.arrow} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  arrow: {
    marginTop:4,
    marginLeft: 5,
  },
});
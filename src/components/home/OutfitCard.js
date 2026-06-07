import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { IMAGES } from "../../constants/images/images";
import Colors from "../../constants/theme/colors";
export default function OutfitCard() {
  return (
    <View style={styles.card}>

      <View style={styles.imageSection}>
        <Image 
          source={IMAGES.PICK}
          style={styles.outfitImage}
          resizeMode="contain"
        />
      </View>

  
      <View style={styles.contentSection}>
        <Text style={styles.title}>Smart casual</Text>
        <Text style={styles.subtitle}>
          Clean,comfortable and perfect for your day
        </Text>

     
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="weather-sunny" size={22} color="#FF8A3D" />
            <Text style={styles.infoText}>24° c</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="location-sharp" size={18} color="#A3C639" />
            <Text style={styles.infoText}>Cairo</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>View outfit</Text>
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
  },
  outfitImage: {
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
    marginLeft: 8,
  },
});
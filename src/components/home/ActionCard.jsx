import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; 
import Colors from "../../constants/theme/colors";
export default function ActionCard({ 
  title, sub, mainIconName, innerIconName, 
  titleColor, iconBgColor, iconColor,
  useIonicons
}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
    
        {useIonicons ? (
          <Ionicons name={mainIconName} size={30} color={iconColor} />
        ) : (
          <MaterialCommunityIcons 
            name={mainIconName} 
            size={innerIconName ? 40 : 32} 
            color={iconColor} 
          />
        )}
        
        {innerIconName && (
          <View style={styles.innerIcon}>
            <MaterialCommunityIcons name={innerIconName} size={20} color={iconColor} />
          </View>
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.cardTitle, { color: titleColor }]}>{title}</Text>
        <Text style={styles.cardSub} numberOfLines={2}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%", 
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  innerIcon: { position: 'absolute' },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  cardSub: { fontSize: 13, color: Colors.disabled, lineHeight: 18 },
});
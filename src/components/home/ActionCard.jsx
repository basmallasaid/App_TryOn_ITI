import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; 
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
export default function ActionCard({ 
  title, sub, mainIconName, innerIconName, 
  titleColor, iconBgColor, iconColor,
  useIonicons, onPress
}) {
  const { themeVersion } = useTheme();
const styles = React.useMemo(() => StyleSheet.create({
  card: {
    width: "48%", 
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
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
  cardSub: { fontSize: 13, color: Colors.disabled, lineHeight: 18, textAlign: 'left' },
}), [themeVersion]);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
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
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.cardTitle, { color: titleColor }]} numberOfLines={1}>{title}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.cardSub} numberOfLines={2}>{sub}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

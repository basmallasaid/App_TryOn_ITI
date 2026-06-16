import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

export default function PhotoInstructionCard({
  title,
  sub,
  mainIconName,
  titleColor,
  iconBgColor,
  iconColor,
}) {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    card: {
      width: "48%",
      backgroundColor: Colors.surfaceElevated,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
     backgroundColor:"transparent",
    },
    cardTitle: {
      fontFamily:"Roboto_600SemiBold",
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 2,
      color:Colors.textPrimary,
    },
    cardSub: {
      fontFamily:"Roboto_regular",
      fontSize: 11,
      color: Colors.textSecondary,
      lineHeight: 16,
    },
  }), [themeVersion]);

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor || "transparent" }]}>
        <MaterialCommunityIcons name={mainIconName} size={22} color={iconColor || Colors.primary} />
      </View>
      <Text style={[styles.cardTitle, { color: titleColor || Colors.textPrimary }]}>{title}</Text>
      <Text style={styles.cardSub} numberOfLines={3}>{sub}</Text>
    </View>
  );
}

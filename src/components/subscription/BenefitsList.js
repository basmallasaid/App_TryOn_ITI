import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

export default function BenefitsList({ title, items, iconColor = Colors.error }) {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      gap: 16,
    },
    title: {
      fontFamily: "Roboto_600SemiBold",
      fontSize: 16,
      lineHeight: 16,
      color: Colors.textPrimary,
    },
    list: {
      gap: 8,
      paddingBottom: 8,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    text: {
      fontFamily: "Roboto_400Regular",
      fontSize: 15,
      lineHeight: 15,
      color: Colors.disabled,
    },
  }), [themeVersion]);
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.list}>
        {items.map((item, index) => (
          <View key={index} style={styles.row}>
            <MaterialCommunityIcons name="check-bold" size={16} color={iconColor} />
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}



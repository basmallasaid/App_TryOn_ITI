import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

export default function StatusBox({ mode, garmentAnalysis }) {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: "#F0FFF0",
      borderRadius: 12,
      padding: 14,
      marginTop: 12,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    modeText: {
      fontFamily: "Roboto_500Medium",
      fontWeight: "500",
      fontSize: 13,
      color: Colors.textPrimary,
    },
    analysisText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 12,
      lineHeight: 18,
      color: Colors.textSecondary,
    },
    seeMore: {
      fontFamily: "Roboto_500Medium",
      fontWeight: "500",
      fontSize: 12,
      color: Colors.primary,
      marginTop: 6,
    },
  }), [themeVersion]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
        <Text style={styles.modeText}>{mode === "single_item" ? t("recycle.singleItem") : t("recycle.multipleItems")}</Text>
      </View>
      <Text style={styles.analysisText} numberOfLines={expanded ? undefined : 4}>
        {garmentAnalysis}
      </Text>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} hitSlop={{ top: 8, bottom: 8 }}>
        <Text style={styles.seeMore}>{expanded ? t("recycle.seeLess") : t("recycle.seeMore")}</Text>
      </TouchableOpacity>
    </View>
  );
}

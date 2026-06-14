import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const OPTIONS = ["Monthly", "Yearly"];

export default function BillingToggle({ selected, onSelect }) {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: "#E9EBEE",
      borderRadius: 999,
      padding: 3,
      alignSelf: "center",
    },
    option: {
      paddingHorizontal: 28,
      paddingVertical: 10,
      borderRadius: 999,
    },
    optionActive: {
      backgroundColor: Colors.white,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    optionText: {
      fontFamily: "Roboto_500Medium",
      fontSize: 14,
      color: Colors.textMuted,
    },
    optionTextActive: {
      fontFamily: "Roboto_600SemiBold",
      color: Colors.textPrimary,
    },
  }), [themeVersion]);
  return (
    <View style={styles.container}>
      {OPTIONS.map((option) => {
        const active = selected === option;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.option, active && styles.optionActive]}
            onPress={() => onSelect(option)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, active && styles.optionTextActive]}>
              {option === "Monthly" ? t("subscription.monthly") : t("subscription.yearly")}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}



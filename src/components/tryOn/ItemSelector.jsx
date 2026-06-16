import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const options = (t) => [
  { id: "Tops", label: t("itemSelector.tops"), icon: "tshirt-crew-outline" },
  { id: "Pants", label: t("itemSelector.pants"), icon: "hanger" },
  { id: "Dresses", label: t("itemSelector.dresses"), icon: "human-female-dance" },
];

export default function ItemSelector({ label, selectedType, onSelectType, disabled, disabledOptions }) {
  const { themeVersion } = useTheme();
  const { t } = useTranslation();
  const styles = React.useMemo(() => StyleSheet.create({
    mainCard: {
      backgroundColor: Colors.white,
      borderRadius: 15,
      padding: 20,
      borderWidth: 1,
      borderColor:Colors.borderStrong,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
     // elevation: 2,
      marginTop: 16,
    },
    title: {
      fontFamily:"Roboto_600SemiBold",
      fontWeight:"600",
      fontSize: 16,
      color: Colors.textPrimary,
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 14,
      color: Colors.textMuted,
      marginBottom: 25,
    },
    optionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 12,
      borderWidth: 1,
      flex: 0.31,
    },
    activeOption: {
      backgroundColor: Colors.white,
      borderColor: Colors.primary,
    },
    inactiveOption: {
      backgroundColor: Colors.white,
      borderColor: Colors.borderDefault,
    },
    iconStyle: {
      marginRight: 8,
    },
    optionText: {
      fontFamily:"Roboto_Medium",
      fontSize: 14,
      fontWeight: "500",
    },
  }), [themeVersion]);

  return (
    <View style={[styles.mainCard, { borderColor: selectedType ? Colors.primary : Colors.borderStrong, opacity: disabled ? 0.5 : 1 }]}>
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.subtitle}>{t("itemSelector.subtitle")}</Text>

      <View style={styles.optionsContainer}>
        {options(t).map((item) => {
          const isActive = selectedType === item.id;
          const isItemDisabled = disabled || disabledOptions?.includes(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (isItemDisabled) return;
                onSelectType(isActive ? null : item.id);
              }}
              activeOpacity={isItemDisabled ? 1 : 0.7}
              style={[
                styles.optionButton,
                isActive ? styles.activeOption : styles.inactiveOption,
                isItemDisabled && { opacity: 0.4 },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color={isItemDisabled ? Colors.disabled : isActive ? Colors.primary : Colors.iconGray}
                style={styles.iconStyle}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: isItemDisabled ? Colors.disabled : isActive ? Colors.textPrimary : Colors.textMuted },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import CustomizeAppButtonFilled from "../common/CustomizeAppButtonFilled";
import CustomizeAppButtonOutlined from "../common/CustomizeAppButtonOutlined";

export default function PlanCard({
  badge,
  name,
  price,
  perUnit,
  description,
  features,
  buttonLabel,
  buttonDisabled,
  buttonOutlined,
  buttonLoading,
  highlighted,
  footerText,
  onButtonPress,
  planNameStyle,
  cardStyle,
  priceStyle,
  perUnitStyle,
  featureTextStyle,
  buttonBorderColor,
  buttonTextColor,
  badgeStyle,
  badgeTextStyle,
  descriptionStyle,
  featuresListStyle,
  footerStyle,
  contentWrapStyle,
}) {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    card: {
      backgroundColor: Colors.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.borderStrong,
      padding: 20,
      gap: 12,
    },
    cardHighlighted: {
      borderColor: Colors.error,
      borderWidth: 2,
    },
    badge: {
      alignSelf: "flex-start",
      backgroundColor: Colors.error,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
    },
    badgeText: {
      fontFamily: "Roboto_600SemiBold",
      fontSize: 11,
      color: Colors.textInverse,
      letterSpacing: 1,
    },
    namePriceWrap: {
      gap: 0,
      marginBottom: 8,
    },
    planName: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      color: Colors.textPrimary,
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    price: {
      fontFamily: "Roboto_700Bold",
      fontSize: 28,
      color: Colors.textPrimary,
    },
    perUnit: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      color: Colors.iconGray,
      lineHeight: 16,
    },
    description: {
      fontFamily: "Roboto_400Regular",
      fontSize: 13,
      color: Colors.textSecondary,
      lineHeight: 18,
    },
    featuresList: {
      gap: 10,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    featureText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 15,
      color: Colors.iconGray,
      lineHeight: 15,
    },
    footerText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 11,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: 15,
    },
  }), [themeVersion]);

  return (
    <View style={[styles.card, highlighted && styles.cardHighlighted, cardStyle]}>
      {badge && (
        <View style={[styles.badge, badgeStyle]}>
          <Text style={[styles.badgeText, badgeTextStyle]}>{badge}</Text>
        </View>
      )}

      <View style={styles.namePriceWrap}>
        <Text style={[styles.planName, planNameStyle]}>{name}</Text>

        {perUnit ? (
          <View style={styles.priceRow}>
            <Text style={[styles.price, priceStyle]}>{price}</Text>
            <Text style={[styles.perUnit, perUnitStyle]}>{perUnit}</Text>
          </View>
        ) : (
          <Text style={[styles.price, priceStyle]}>{price}</Text>
        )}
      </View>

      <View style={contentWrapStyle}>
        {description && <Text style={[styles.description, descriptionStyle]}>{description}</Text>}

        <View style={[styles.featuresList, featuresListStyle]}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <MaterialCommunityIcons name="check-bold" size={16} color={Colors.primary} />
              <Text style={[styles.featureText, featureTextStyle]}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      {buttonOutlined ? (
        <CustomizeAppButtonOutlined
          label={buttonLabel}
          onPress={onButtonPress}
          borderColor={buttonBorderColor || Colors.borderStrong}
          textColor={buttonTextColor || Colors.textMuted}
          disabled
        />
      ) : (
        <CustomizeAppButtonFilled
          label={buttonLabel}
          onPress={onButtonPress}
          backgroundColor={highlighted ? Colors.error : Colors.primary}
          textColor={Colors.textInverse}
          disabled={buttonDisabled}
          loading={buttonLoading}
        />
      )}

      {footerText && <Text style={[styles.footerText, footerStyle]}>{footerText}</Text>}
    </View>
  );
}



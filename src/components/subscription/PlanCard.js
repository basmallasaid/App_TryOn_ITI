import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/theme/colors";
import CustomizeAppButtonFilled from "../common/CustomizeAppButtonFilled";
import CustomizeAppButtonOutlined from "../common/CustomizeAppButtonOutlined";

export default function PlanCard({
  badge,
  name,
  price,
  description,
  features,
  buttonLabel,
  buttonDisabled,
  buttonOutlined,
  buttonLoading,
  highlighted,
  footerText,
  onButtonPress,
}) {
  return (
    <View style={[styles.card, highlighted && styles.cardHighlighted]}>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      <Text style={styles.planName}>{name}</Text>
      <Text style={styles.price}>{price}</Text>

      {description && <Text style={styles.description}>{description}</Text>}

      <View style={styles.featuresList}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {buttonOutlined ? (
        <CustomizeAppButtonOutlined
          label={buttonLabel}
          onPress={onButtonPress}
          borderColor={Colors.borderStrong}
          textColor={Colors.textMuted}
          disabled
        />
      ) : (
        <CustomizeAppButtonFilled
          label={buttonLabel}
          onPress={onButtonPress}
          backgroundColor={highlighted ? Colors.error : Colors.primary}
          textColor={Colors.white}
          disabled={buttonDisabled}
          loading={buttonLoading}
        />
      )}

      {footerText && <Text style={styles.footerText}>{footerText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: Colors.white,
    letterSpacing: 1,
  },
  planName: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    color: Colors.textPrimary,
  },
  price: {
    fontFamily: "Roboto_700Bold",
    fontSize: 28,
    color: Colors.textPrimary,
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
    gap: 8,
  },
  checkmark: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 14,
    color: Colors.success,
    width: 16,
  },
  featureText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 15,
  },
});

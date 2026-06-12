import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";

export default function BenefitsList({ title, items }) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.list}>
        {items.map((item, index) => (
          <View key={index} style={styles.row}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 16,
    color: Colors.textPrimary,
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

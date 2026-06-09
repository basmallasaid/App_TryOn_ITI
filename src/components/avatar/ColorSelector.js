import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";

const ColorSelector = ({ label, options, selectedId, onSelect }) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {options.map((option) => {
          const isSelected = option.id === selectedId;
          return (
            <TouchableOpacity
              key={option.id}
              style={styles.optionWrap}
              onPress={() => onSelect(option.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.colorCircle,
                  { backgroundColor: option.color },
                  isSelected && styles.colorCircleSelected,
                ]}
              >
                {isSelected && (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={
                      option.id === "black" || option.id === "dark-brown" || option.id === "dark"
                        ? Colors.white
                        : Colors.textPrimary
                    }
                  />
                )}
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelSelected,
                ]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Roboto_600SemiBold",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 4,
  },
  optionWrap: {
    alignItems: "center",
    width: 64,
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    marginBottom: 6,
  },
  colorCircleSelected: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  optionLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
  },
  optionLabelSelected: {
    color: Colors.textPrimary,
    fontWeight: "600",
    fontFamily: "Roboto_600SemiBold",
  },
});

export default ColorSelector;

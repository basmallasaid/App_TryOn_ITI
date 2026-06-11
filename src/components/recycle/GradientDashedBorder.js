import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientDashedBorder({ children, style }) {
  return (
    <LinearGradient
      colors={["#FF8C42", "#40B9FF", "#8ED321"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      <View style={styles.inner}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 16,
    padding: 2,
  },
  inner: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
});

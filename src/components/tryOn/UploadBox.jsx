import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Rect, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

export default function UploadBox({ label, onPress, style }) {
  const { themeVersion } = useTheme();
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      width: "90%",
      height: 450,
      alignSelf: "center",
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
      marginVertical: 16,
    },
    inner: {
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    text: {
      fontFamily: "Roboto_500Medium",
      fontSize: 14,
      color: Colors.textMuted,
      textAlign: "center",
      marginTop: 10,
    },
  }), [themeVersion]);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={onPress}
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
    >
      {layout.width > 0 && (
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={Colors.error} />
              <Stop offset="50%" stopColor={Colors.primary} />
              <Stop offset="100%" stopColor={Colors.success} />
            </SvgGradient>
          </Defs>
          <Rect
            x="1.5"
            y="1.5"
            width={layout.width - 3}
            height={layout.height - 3}
            rx="24"
            ry="24"
            stroke="url(#grad)"
            strokeWidth="3"
            strokeDasharray="12, 8"
            fill="none"
          />
        </Svg>
      )}
      <View style={styles.inner}>
        <Ionicons name="cloud-upload-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

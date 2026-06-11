import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Svg, Rect, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import Colors from "../../constants/theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PADDING_HORIZONTAL = 40;
const DEFAULT_WIDTH = SCREEN_WIDTH - PADDING_HORIZONTAL;

export default function DashedGradientBorder({ children, width, height, borderRadius = 16, borderWidth = 2 }) {
  const svgWidth = typeof width === "number" ? width : DEFAULT_WIDTH;

  return (
    <View style={[styles.wrap, { width: svgWidth, height }]}>
      <Svg
        width={svgWidth}
        height={height}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <SvgGradient id="gradDashed" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF8C42" />
            <Stop offset="0.5" stopColor="#40B9FF" />
            <Stop offset="1" stopColor="#8ED321" />
          </SvgGradient>
        </Defs>
        <Rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={svgWidth - borderWidth}
          height={height - borderWidth}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke="url(#gradDashed)"
          strokeWidth={borderWidth}
          strokeDasharray="10 6"
        />
      </Svg>
      <View style={[styles.inner, { borderRadius: borderRadius - 1 }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
  },
  inner: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
});

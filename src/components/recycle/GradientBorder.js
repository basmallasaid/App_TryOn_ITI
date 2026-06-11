import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, Rect, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";

export default function GradientBorder({ children, width, height, borderRadius = 12, borderWidth = 2 }) {
  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg
        width={width}
        height={height}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <SvgGradient id="gradSolid" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#8ED321" />
            <Stop offset="0.5" stopColor="#40B9FF" />
            <Stop offset="1" stopColor="#FF8A3D" />
          </SvgGradient>
        </Defs>
        <Rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={width - borderWidth}
          height={height - borderWidth}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke="url(#gradSolid)"
          strokeWidth={borderWidth}
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
    overflow: "hidden",
  },
});

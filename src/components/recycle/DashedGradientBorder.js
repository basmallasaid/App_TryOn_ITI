import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Svg, Rect, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PADDING_HORIZONTAL = 40;
const DEFAULT_WIDTH = SCREEN_WIDTH - PADDING_HORIZONTAL;

export default function DashedGradientBorder({ children, width, height, borderRadius = 16, borderWidth = 2 }) {
  const { themeVersion } = useTheme();
  const [measuredWidth, setMeasuredWidth] = useState(null);
  const isFlex = !width || width === "100%";
  const svgWidth = isFlex ? (measuredWidth || DEFAULT_WIDTH) : (typeof width === "number" ? width : DEFAULT_WIDTH);

  const styles = React.useMemo(() => StyleSheet.create({
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
  }), [themeVersion]);

  return (
    <View
      style={[styles.wrap, isFlex ? { width: "100%" } : { width: svgWidth }, { height }]}
      onLayout={(e) => {
        if (isFlex) setMeasuredWidth(e.nativeEvent.layout.width);
      }}
    >
      <Svg
        width={svgWidth}
        height={height}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <SvgGradient id={`gradDashed-${svgWidth}`} x1="0" y1="0" x2="1" y2="1">
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
          stroke={`url(#gradDashed-${svgWidth})`}
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

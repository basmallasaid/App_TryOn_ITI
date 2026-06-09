import { useRef, useCallback } from "react";
import { View, Text, PanResponder, StyleSheet, Dimensions } from "react-native";
import Colors from "../../constants/theme/colors";

const TRACK_WIDTH = Dimensions.get("window").width - 80;

const MeasurementSlider = ({ label, value, min, max, step = 1, unit, onChange }) => {
  const trackRef = useRef(null);
  const trackLayoutRef = useRef({ x: 0, width: TRACK_WIDTH });
  const propsRef = useRef({ min, max, step, onChange });
  propsRef.current = { min, max, step, onChange };

  const updateValue = useCallback((pageX) => {
    const { x, width } = trackLayoutRef.current;
    const { min, max, step, onChange } = propsRef.current;
    const range = max - min;
    const locationX = pageX - x;
    let raw = (locationX / width) * range + min;
    raw = Math.round(raw / step) * step;
    raw = Math.max(min, Math.min(max, raw));
    onChange(raw);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (evt) => {
        updateValue(evt.nativeEvent.pageX);
      },
      onPanResponderMove: (evt) => {
        updateValue(evt.nativeEvent.pageX);
      },
    })
  ).current;

  const fraction = (value - min) / (max - min);
  const fillWidth = fraction * TRACK_WIDTH;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>
          {label} ({unit}):
        </Text>
        <Text style={styles.value}>
          {value} {unit}
        </Text>
      </View>

      <View
        ref={trackRef}
        style={styles.track}
        onLayout={() => {
          if (trackRef.current) {
            trackRef.current.measureInWindow((x, y, width) => {
              trackLayoutRef.current = { x, width };
            });
          }
        }}
        {...panResponder.panHandlers}
      >
        <View style={[styles.fill, { width: Math.max(fillWidth, 0) }]} />
        <View
          style={[
            styles.thumb,
            { left: Math.max(fillWidth - 12, 0) },
          ]}
        />
      </View>

      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>
          {min} {unit}
        </Text>
        <Text style={styles.rangeText}>
          {max} {unit}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Roboto_600SemiBold",
    color: Colors.textPrimary,
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Roboto_700Bold",
    color: Colors.primary,
  },
  track: {
    width: TRACK_WIDTH,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E9EBEE",
    position: "relative",
    justifyContent: "center",
    alignSelf: "center",
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    position: "absolute",
    left: 0,
    top: 0,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    position: "absolute",
    top: -9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  rangeText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: "Roboto_400Regular",
  },
});

export default MeasurementSlider;

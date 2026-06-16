import React, { useRef, useEffect } from "react";
import { Modal, View, StyleSheet, Animated, Dimensions } from "react-native";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const SuccessModal = ({ visible, onAnimationComplete, children }) => {
  const { themeVersion } = useTheme();
  // --- Native driver (opacity only) ---
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // --- JS driver (layout properties only) ---
  const cardHeight = useRef(new Animated.Value(320)).current;
  const cardWidth = useRef(new Animated.Value(SCREEN_WIDTH * 0.85)).current;
  const cardBorderRadius = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    if (!visible) return;

    // Reset all values
    backdropOpacity.setValue(0);
    cardOpacity.setValue(0);
    cardHeight.setValue(320);
    cardWidth.setValue(SCREEN_WIDTH * 0.85);
    cardBorderRadius.setValue(8);

    // Step 1: Fade in — native driver only
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {

      // Step 2: After 1.6s — grow height — JS driver only
      setTimeout(() => {
        Animated.spring(cardHeight, {
          toValue: 420,
          tension: 40,
          friction: 10,
          useNativeDriver: false,
        }).start(() => {

          // Step 3: After 1.6s — expand to full screen — JS driver only
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(cardHeight, {
                toValue: SCREEN_HEIGHT,
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(cardWidth, {
                toValue: SCREEN_WIDTH,
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(cardBorderRadius, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
              }),
            ]).start(() => {
              // Step 4: Fade out backdrop separately — native driver only
              Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(() => {
                if (onAnimationComplete) onAnimationComplete();
              });
            });
          }, 500);
        });
      }, 1000);
    });
  }, [visible]);

  const styles = React.useMemo(() => StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      backgroundColor: Colors.white,
      paddingVertical: 36,
      paddingHorizontal: 28,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 12,
      borderWidth: 1,
      borderColor: Colors.borderDefault,
    },
  }), [themeVersion]);

  return (
    <Modal visible={visible} transparent animationType="none">

      {/* Native driver node — opacity only, never mixed with JS props */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />

      <View style={styles.container}>

        {/* Native driver node — opacity only */}
        <Animated.View style={{ opacity: cardOpacity }}>

          {/* JS driver node — width only */}
          <Animated.View style={{ width: cardWidth }}>

            {/* JS driver node — height + borderRadius only */}
            <Animated.View
              style={[
                styles.card,
                {
                  height: cardHeight,
                  borderRadius: cardBorderRadius,
                },
              ]}
            >
              {children}
            </Animated.View>

          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
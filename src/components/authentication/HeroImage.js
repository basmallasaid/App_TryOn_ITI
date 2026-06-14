import React from "react";
import { StyleSheet, View, Image, Platform, Dimensions } from "react-native";
import { IMAGES } from "../../constants/images/images";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HeroImage = () => {
  const { themeVersion } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    imageContainer: {
      paddingTop: Platform.OS === "ios" ? 40 : 25,
      height: Platform.OS === "ios" ? SCREEN_HEIGHT * 0.35 : SCREEN_HEIGHT * 0.25,
      width: "100%",
      backgroundColor: Colors.backgroundColor,
    },

    heroImage: {
      width: "100%",
      height: "100%",
    },
  }), [themeVersion]);

  return (
    <View style={styles.imageContainer}>
      <Image
        source={IMAGES.AUTH_HERO}
        style={styles.heroImage}
        resizeMode="cover"
      />
    </View>
  );
};

export default HeroImage;

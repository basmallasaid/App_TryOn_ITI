import React from "react";
import { StyleSheet, View, Image,Platform,Dimensions } from "react-native";
import { IMAGES } from "../../../constants/images/images";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HeroImage = () => {
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

const styles = StyleSheet.create({
  imageContainer: {
    paddingTop: Platform.OS === "ios" ? 40 : 25,
    height: Platform.OS === "ios" ? SCREEN_HEIGHT * 0.35 : SCREEN_HEIGHT * 0.25,
    width: "100%",
    backgroundColor: "#f4f4f5",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },
});

export default HeroImage;

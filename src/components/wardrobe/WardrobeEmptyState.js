import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useTranslation } from 'react-i18next';
import Colors from "../../constants/theme/colors";
import CustomizeAppButtonFilled from "../common/CustomizeAppButtonFilled";
import { ANIMATIONS } from "../../constants/images/animations";
import LottieView from "lottie-react-native";

const WardrobeEmptyState = ({ onAdd }) => {
  const { t } = useTranslation();
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{t("wardrobe.empty.title")}</Text>

      <Text style={styles.subtitle}>{t("wardrobe.empty.subtitle")}</Text>

      <LottieView
        source={ANIMATIONS.NOT_FOUND}
        autoPlay
        loop
        style={styles.animation}
      />

      <View style={styles.buttonWrapper}>
        <CustomizeAppButtonFilled
          label={t("wardrobe.empty.addButton")}
          onPress={onAdd}
          backgroundColor={Colors.primary}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F7",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 26,
    paddingVertical: 40,
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    color: Colors.textPrimary,
    textAlign: "center",
    paddingBottom:15,
  },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    paddingBottom:20,
  },
  animation: {
    width: 280,
    height: 280,
    alignSelf: 'center',
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 30,
  },
});

export default WardrobeEmptyState;

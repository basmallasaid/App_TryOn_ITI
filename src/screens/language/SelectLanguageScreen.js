import React, { useState } from "react";

import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { IMAGES } from "../../constants/images/images";

import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";

import EnrichTextComponent from "../../components/common/EnrichTextComponent";

import LanguageContainer from "../../components/language/LanguageContainer";

import Typography from "../../constants/theme/typography";

import { useLanguage } from "../../context/LanguageContext";

const SelectLanguageScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const { setLanguage } = useLanguage();

  const handleContinue = async () => {
    if (!selectedLanguage) {
      return;
    }

    await setLanguage(selectedLanguage);

    navigation.replace("Login");
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={IMAGES.REDOLAPY_LOGO} />

        <Text style={styles.title}>Select a Language to get start</Text>

        <LanguageContainer
          label="English"
          flag={IMAGES.ENGLISH_FLAG}
          selected={selectedLanguage === "en"}
          onPress={() => setSelectedLanguage("en")}
        />

        <LanguageContainer
          label="Arabic"
          flag={IMAGES.ARABIC_FLAG}
          selected={selectedLanguage === "ar"}
          onPress={() => setSelectedLanguage("ar")}
        />

        <View style={styles.buttonWrap}>
          <CustomizeAppButtonFilled
            label="Continue"
            disabled={!selectedLanguage}
            onPress={handleContinue}
          />
        </View>

        <EnrichTextComponent
          baseText={
            "You have the choice to switch countries at a later time through the settings"
          }
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 24,
    paddingTop: 124,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...Typography.label,
    fontSize: 24,
    marginBottom: 24,
    marginTop: 20,
    textAlign: "center",
  },
  buttonWrap: {
    marginTop: 50,
    marginBottom: 10,
  },
});

export default SelectLanguageScreen;

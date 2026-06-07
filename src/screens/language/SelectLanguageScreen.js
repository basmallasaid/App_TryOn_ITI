import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { IMAGES } from "../../constants/images/images";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import LanguageContainer from "../../components/language/languageContainer";
import Colors from "../../constants/theme/colors";
import { useLanguage } from "../../context/LanguageContext";
import { setLanguageSeen } from "../../storage/TokenStorage";
import EnrichTextComponent from "../../components/common/EnrichTextComponent";
const { height: H } = Dimensions.get("window");

const LANGUAGES = ["en", "ar"];

const SelectLanguageScreen = ({ navigation }) => {
  const { selectLanguage } = useLanguage();
  const [selected, setSelected] = useState(null);
  const handleContinue = async () => {
    if (!selected) return;
    if (!selected) return;
    await selectLanguage(selected);
    await setLanguageSeen();
    navigation.replace("Onboarding");
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={IMAGES.REDOLAPY_LOGO}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Select a Language to get started</Text>

        {/* Language options */}
        <View style={styles.languagesWrap}>
          {LANGUAGES.map((lang) => (
            <LanguageContainer
              key={lang}
              language={lang}
              selected={selected === lang}
              onPress={() => setSelected(lang)}
            />
          ))}
        </View>

        {/* Continue button — disabled until a language is selected */}
        <View style={styles.buttonWrap}>
          <CustomizeAppButtonFilled
            label="Continue"
            onPress={handleContinue}
            backgroundColor={selected ? Colors.primary : Colors.disabled}
            disabled={!selected}
          />
        </View>
        {/* Footer note */}
        <EnrichTextComponent
          baseText={
            "You can switch languages at any time through the settings."
          }
        ></EnrichTextComponent>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 140,
    marginBottom: 32,
  },
  title: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 20,
    lineHeight: 32,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 46,
  },
  languagesWrap: {
    width: "100%",
    marginBottom: 8,
  },
  buttonWrap: {
    width: "100%",
    marginTop: 70,
    marginBottom: 20,
  },
  footerText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});

export default SelectLanguageScreen;

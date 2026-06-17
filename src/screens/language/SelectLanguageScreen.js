import React, { useState } from "react";
import SafeScreen from "../../components/common/SafeScreen";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  I18nManager,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { IMAGES } from "../../constants/images/images";
import { useTheme } from "../../context/ThemeContext";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import LanguageContainer from "../../components/language/languageContainer";
import Colors from "../../constants/theme/colors";

import { setLanguageSeen, saveLanguage } from "../../storage/TokenStorage";
import EnrichTextComponent from "../../components/common/EnrichTextComponent";
import { ROUTES } from "../../navigation/routes";
import i18n from "../../localization/i18n";
import * as Updates from "expo-updates";
const { height: H } = Dimensions.get("window");

const LANGUAGES = ["en", "ar"];

const SelectLanguageScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDarkMode, themeVersion } = useTheme();
  const [selected, setSelected] = useState(null);

  const styles = React.useMemo(() => StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Colors.backgroundColor,
      justifyContent: "center",
    },
    scroll: {
      flexGrow: 1,
      paddingHorizontal: 24,
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
  }), [themeVersion]);

  const handleContinue = async () => {
    if (!selected) return;
    await setLanguageSeen();
    await saveLanguage(selected);
    i18n.changeLanguage(selected);
    I18nManager.forceRTL(selected === "ar");
    await Updates.reloadAsync();
  };

  return (
    <SafeScreen style={{ flex: 1 }}>
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
        {/* Logo */}
        <Image
          source={isDarkMode ? IMAGES.REDOLAPY_LOGO_Dark : IMAGES.REDOLAPY_LOGO}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>{t('language.title')}</Text>

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
            label={t('language.continue')}
            onPress={handleContinue}
            backgroundColor={selected ? Colors.primary : Colors.disabled}
            disabled={!selected}
          />
        </View>
        {/* Footer note */}
        <EnrichTextComponent
          baseText={t('language.footer')}
        ></EnrichTextComponent>
        </ScrollView>
      </View>
    </SafeScreen>
    );
  };

export default SelectLanguageScreen;

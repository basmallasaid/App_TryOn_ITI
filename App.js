import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import i18n from "./src/localization/i18n";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/AuthContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { Inter_700Bold } from "@expo-google-fonts/inter";
import { resetOnboardingAndLanguage } from "./src/utils/devReset";
import { ProfileProvider } from "./src/context/ProfileContext";
import { WardrobeProvider } from './src/context/WardrobeContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { RecommendationProvider } from './src/context/RecommendationContext';
I18nManager.allowRTL(true);

// DEV ONLY — comment out when done testing
resetOnboardingAndLanguage();

i18n.on("languageChanged", async (lang) => {
  const isRTL = lang === "ar";
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    if (Updates.isEmbeddedLaunch) {
      await Updates.reloadAsync();
    }
  }
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <LanguageProvider>
      <AuthProvider>
        <ProfileProvider>
          <WardrobeProvider>
          <FavoritesProvider>
          <RecommendationProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          </RecommendationProvider>
          </FavoritesProvider>
          </WardrobeProvider>
        </ProfileProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

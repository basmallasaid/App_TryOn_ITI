import { I18nManager } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./src/utils/navigationRef";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
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
import { NotificationProvider } from "./src/context/NotificationContext";
import { FavoritesProvider } from './src/context/FavoritesContext';
import { RecommendationProvider } from './src/context/RecommendationContext';
import { RecentTryOnsProvider } from './src/context/RecentTryOnsContext';
import { RecentRecyclesProvider } from './src/context/RecentRecyclesContext';
import { registerDailyRecommendationTask } from './src/background/DailyRecommendationTask';
I18nManager.allowRTL(true);
// DEV ONLY — comment out when done testing
resetOnboardingAndLanguage();

function RecommendationProviderWithAuthKey({ children }) {
  const { user } = useAuth();
  return (
    <RecommendationProvider key={user?._id || 'guest'}>
      {children}
    </RecommendationProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      registerDailyRecommendationTask();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <LanguageProvider>
      <AuthProvider>
        <ProfileProvider>
          <WardrobeProvider>
            <NotificationProvider>
              <FavoritesProvider>
                <RecentTryOnsProvider>
                  <RecentRecyclesProvider>
                    <RecommendationProviderWithAuthKey>
                  <NavigationContainer ref={navigationRef}>
                    <RootNavigator />
                  </NavigationContainer>
                    </RecommendationProviderWithAuthKey>
                  </RecentRecyclesProvider>
                </RecentTryOnsProvider>
              </FavoritesProvider>
            </NotificationProvider>
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

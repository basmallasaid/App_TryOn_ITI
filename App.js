import { I18nManager } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { navigationRef } from "./src/utils/navigationRef";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import Colors from "./src/constants/theme/colors";
import RootNavigator from "./src/navigation/RootNavigator";
import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { useFonts } from "expo-font";
import { ROUTES } from "./src/navigation/routes";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { Inter_700Bold } from "@expo-google-fonts/inter";

const PlusJakartaSans_400Regular = require("@expo-google-fonts/plus-jakarta-sans/400Regular/PlusJakartaSans_400Regular.ttf");
const PlusJakartaSans_700Bold = require("@expo-google-fonts/plus-jakarta-sans/700Bold/PlusJakartaSans_700Bold.ttf");
import { resetOnboardingAndLanguage } from "./src/utils/devReset";
import { ProfileProvider } from "./src/context/ProfileContext";
import { WardrobeProvider } from './src/context/WardrobeContext';
import { StoreProvider } from './src/context/StoreContext';
import { NotificationProvider } from "./src/context/NotificationContext";
import { FavoritesProvider } from './src/context/FavoritesContext';
import { RecommendationProvider } from './src/context/RecommendationContext';
import { RecentTryOnsProvider } from './src/context/RecentTryOnsContext';
import { RecentRecyclesProvider } from './src/context/RecentRecyclesContext';
import { FeedbackProvider } from './src/context/FeedbackContext';
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

function ThemedApp() {
  const { themeVersion, isDarkMode } = useTheme();

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate(ROUTES.NOTIFICATIONS);
      }
    });
    return () => sub.remove();
  }, []);

  const navTheme = React.useMemo(
    () => ({
      ...(isDarkMode ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
        primary: Colors.primary,
        background: Colors.backgroundColor,
        card: Colors.white,
        text: Colors.textPrimary,
        border: Colors.borderDefault,
        notification: Colors.error,
      },
    }),
    [themeVersion]
  );

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <NavigationContainer ref={navigationRef} theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    Inter_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      registerDailyRecommendationTask();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
      <SafeAreaProvider>
      <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ProfileProvider>
            <WardrobeProvider>
              <StoreProvider>
                <NotificationProvider>
                  <FavoritesProvider>
                    <RecentTryOnsProvider>
                      <RecentRecyclesProvider>
                        <RecommendationProviderWithAuthKey>
                          <FeedbackProvider>
                            <ThemedApp />
                          </FeedbackProvider>
                        </RecommendationProviderWithAuthKey>
                      </RecentRecyclesProvider>
                    </RecentTryOnsProvider>
                  </FavoritesProvider>
                </NotificationProvider>
              </StoreProvider>
            </WardrobeProvider>
          </ProfileProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
    </SafeAreaProvider>
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

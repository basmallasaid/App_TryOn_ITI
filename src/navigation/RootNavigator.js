import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import TryOnStack from './TryOnStack';
import RecycleStack from './RecycleStack';
import MatchingStack from './MatchingStack';
import RecommendationsStack from './RecommendationsStack';
import RecentTryOnsScreen from '../screens/home/RecentTryOnsScreen';
import RecentRecyclesScreen from '../screens/home/RecentRecyclesScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import SplashScreen from '../screens/splash/SplashScreen';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getOnboardingSeen, getLanguageSeen } from '../storage/TokenStorage';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const screenOptions = { headerShown: false };

// Module-level cache so RootNavigator remount (from language change)
// doesn't flash the splash while re-reading SecureStore.
let _cachedOnboardingSeen = null;
let _cachedLanguageSeen = null;

export default function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { loading: langLoading, isRTL } = useLanguage();
  const [onboardingSeen, setOnboardingSeen] = useState(_cachedOnboardingSeen);
  const [languageSeen, setLanguageSeen] = useState(_cachedLanguageSeen);

  useEffect(() => {
    console.log('[RootNavigator] Mounted. authLoading:', authLoading, 'langLoading:', langLoading, 'user:', !!user);
    Promise.all([getOnboardingSeen(), getLanguageSeen()]).then(
      ([onboarding, language]) => {
        _cachedOnboardingSeen = onboarding === 'true';
        _cachedLanguageSeen = language === 'true';
        console.log('[RootNavigator] Flags resolved — onboardingSeen:', _cachedOnboardingSeen, 'languageSeen:', _cachedLanguageSeen);
        setOnboardingSeen(_cachedOnboardingSeen);
        setLanguageSeen(_cachedLanguageSeen);
      },
    );
  }, []);

  if (
    authLoading ||
    langLoading ||
    onboardingSeen === null ||
    languageSeen === null
  ) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {user ? (
        <>
          <Stack.Screen name={ROUTES.MAIN} component={AppStack} />
          <Stack.Screen
            name={ROUTES.TRY_ON}
            component={TryOnStack}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name={ROUTES.RECYCLE}
            component={RecycleStack}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name={ROUTES.MATCHING}
            component={MatchingStack}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name={ROUTES.RECOMMENDATION}
            component={RecommendationsStack}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name={ROUTES.RECENT_TRYONS}
            component={RecentTryOnsScreen}
            options={{ animation: isRTL ? 'slide_from_left' : 'slide_from_right' }}
          />
          <Stack.Screen
            name={ROUTES.RECENT_RECYCLES}
            component={RecentRecyclesScreen}
            options={{ animation: isRTL ? 'slide_from_left' : 'slide_from_right' }}
          />
          <Stack.Screen
            name={ROUTES.NOTIFICATIONS}
            component={NotificationsScreen}
            options={{ animation: isRTL ? 'slide_from_left' : 'slide_from_right' }}
          />
        </>
      ) : (
        <Stack.Screen name={ROUTES.AUTH}>
          {() => {
            const initialRoute = !languageSeen
              ? ROUTES.SELECT_LANGUAGE
              : !onboardingSeen
                ? ROUTES.ONBOARDING
                : ROUTES.LOGIN;
            return <AuthStack initialRoute={initialRoute} />;
          }}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

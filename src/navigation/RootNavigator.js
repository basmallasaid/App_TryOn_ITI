import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import TryOnStack from './TryOnStack';
import RecycleStack from './RecycleStack';
import MatchingStack from './MatchingStack';
import RecommendationsStack from './RecommendationsStack';
import SplashScreen from '../screens/splash/SplashScreen';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getOnboardingSeen, getLanguageSeen } from '../storage/TokenStorage';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const screenOptions = { headerShown: false };

export default function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { loading: langLoading } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingSeen, setOnboardingSeen] = useState(null);
  const [languageSeen, setLanguageSeen] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Promise.all([getOnboardingSeen(), getLanguageSeen()]).then(
      ([onboarding, language]) => {
        setOnboardingSeen(onboarding === 'true');
        setLanguageSeen(language === 'true');
      },
    );
  }, []);

  if (
    showSplash ||
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
        </>
      ) : (
        <Stack.Screen name={ROUTES.AUTH} component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

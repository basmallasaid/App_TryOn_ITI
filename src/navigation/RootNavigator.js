import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '../screens/splash/SplashScreen';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getOnboardingSeen, getLanguageSeen } from '../storage/TokenStorage';
import TryOnStack from './TryOnStack';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { loading: langLoading } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingSeen, setOnboardingSeen] = useState(null);
  const [languageSeen, setLanguageSeen] = useState(null);

  //show splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Check both flags in parallel
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

  if (user) return <AppStack />;

  const initialRoute = !languageSeen
    ? 'SelectLanguage'
    : !onboardingSeen
      ? 'Onboarding'
      : 'Login';

  return <AuthStack initialRoute={initialRoute} />;
}

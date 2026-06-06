import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '../screens/splash/SplashScreen';
import { useState, useEffect } from 'react';
import { getOnboardingSeen } from "../storage/TokenStorage";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingSeen, setOnboardingSeen] = useState(null); 

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getOnboardingSeen().then((val) => {
      setOnboardingSeen(val === 'true');
    });
  }, []);


  if (showSplash || loading || onboardingSeen === null) {
    return <SplashScreen />;
  }

  if (user) return <AppStack />;

  return <AuthStack initialRoute={onboardingSeen ? 'Login' : 'Onboarding'} />;
}
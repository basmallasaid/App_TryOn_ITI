import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '../screens/splash/SplashScreen';
import { useState, useEffect } from 'react';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);

  }, []);

  if (showSplash || loading) {
    return <SplashScreen />;
  }
  return user ? <AppStack /> : <AuthStack />;
}
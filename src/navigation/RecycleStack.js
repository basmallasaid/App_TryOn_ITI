import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RecycleScreen from "../screens/recycle/RecycleScreen";
import RecycleResultScreen from "../screens/recycle/RecycleResultScreen";
import { ROUTES } from './routes';
import { useLanguage } from '../context/LanguageContext';

const Stack = createNativeStackNavigator();

export default function RecycleStack() {
  const { isRTL } = useLanguage();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: isRTL ? 'slide_from_left' : 'slide_from_right' }}>
      <Stack.Screen name={ROUTES.RECYCLE_MAIN} component={RecycleScreen} />
      <Stack.Screen name={ROUTES.RECYCLE_RESULT} component={RecycleResultScreen} />
    </Stack.Navigator>
  );
}

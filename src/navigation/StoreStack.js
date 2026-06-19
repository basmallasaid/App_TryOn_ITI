import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoreScreen from '../screens/store/StoreScreen';
import ProductDetailScreen from '../screens/store/ProductDetailScreen';
import { ROUTES } from './routes';
import { useLanguage } from '../context/LanguageContext';

const Stack = createNativeStackNavigator();

export default function StoreStack() {
  const { isRTL } = useLanguage();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: isRTL ? 'slide_from_left' : 'slide_from_right' }}>
      <Stack.Screen name={ROUTES.STORE_MAIN} component={StoreScreen} />
      <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

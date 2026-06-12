import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoreScreen from '../screens/store/StoreScreen';
import ProductDetailScreen from '../screens/store/ProductDetailScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

export default function StoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.STORE_MAIN} component={StoreScreen} />
      <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

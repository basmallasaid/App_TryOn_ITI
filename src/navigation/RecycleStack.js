import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RecycleScreen from "../screens/recycle/RecycleScreen";
import RecycleResultScreen from "../screens/recycle/RecycleResultScreen";
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

export default function RecycleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.RECYCLE_MAIN} component={RecycleScreen} />
      <Stack.Screen name={ROUTES.RECYCLE_RESULT} component={RecycleResultScreen} />
    </Stack.Navigator>
  );
}

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RecycleScreen from "../screens/recycle/RecycleScreen";
import RecycleResultScreen from "../screens/recycle/RecycleResultScreen";

const Stack = createNativeStackNavigator();

export default function RecycleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecycleMain" component={RecycleScreen} />
      <Stack.Screen name="RecycleResult" component={RecycleResultScreen} />
    </Stack.Navigator>
  );
}

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../constants/theme/colors";
import { useTheme } from "../context/ThemeContext";
import ProfileStack from "../navigation/ProfileStack";
import StoreStack from "./StoreStack";
import HomeScreen from '../screens/home/HomeScreen';
import WardrobeStack from "./WardrobeStack";
import { ROUTES } from "./routes";

const Tab = createBottomTabNavigator();

const TAB_LABELS = {
  [ROUTES.HOME]: "navigation.tab.home",
  [ROUTES.WARDROBE]: "navigation.tab.wardrobe",
  [ROUTES.STORE]: "navigation.tab.store",
  [ROUTES.PROFILE]: "navigation.tab.profile",
};

export default function AppStack() {
  const { themeVersion } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => StyleSheet.create({
    activeIndicator: {
      height: 2,
      width: 40,
      backgroundColor: Colors.primarybrand,
      marginTop: 4,
      borderRadius: 2,
    },
  }), [themeVersion]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primarybrand,
        tabBarInactiveTintColor: Colors.disabled,
        tabBarStyle: {
          height: 70 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.borderDefault,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarLabel: ({ focused, color }) => (
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                color,
                fontSize: 13,
                fontWeight: focused ? "700" : "500",
              }}
            >
              {t(TAB_LABELS[route.name])}
            </Text>
            {focused && <View style={styles.activeIndicator} />}
          </View>
        ),
      })}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      
      <Tab.Screen 
        name={ROUTES.WARDROBE}
        component={WardrobeStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="tshirt-crew-outline"
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.STORE}
        component={StoreStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="store-plus-outline"
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

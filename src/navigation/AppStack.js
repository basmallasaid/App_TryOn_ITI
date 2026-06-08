import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/theme/colors';
import ProfileStack from "../navigation/ProfileStack"
import HomeScreen from '../screens/home/HomeScreen';

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = Colors.primarybrand;
const INACTIVE_COLOR = Colors.disabled;

const TAB_LABELS = {
  Home: 'navigation.tab.home',
  Wardrobe: 'navigation.tab.wardrobe',
  Store: 'navigation.tab.store',
  Profile: 'navigation.tab.profile',
};

export default function AppStack() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        
        tabBarLabel: ({ focused, color }) => (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color, fontSize: 13, fontWeight: focused ? '700' : '500' }}>
              {t(TAB_LABELS[route.name])}
            </Text>
            {focused && <View style={styles.activeIndicator} />}
          </View>
        ),
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Wardrobe" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="tshirt-crew-outline" size={28} color={color} />
          ),
        }}
      />

      <Tab.Screen 
        name="Store" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="store-plus-outline" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen 
        name="Profile" 
        component={ProfileStack} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeIndicator: {
    height: 2,
    width: 40,
    backgroundColor: ACTIVE_COLOR,
    marginTop: 4,
    borderRadius: 2,
  },
});
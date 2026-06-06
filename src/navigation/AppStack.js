import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/theme/colors';

import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();


const ACTIVE_COLOR = Colors.primarybrand;
const INACTIVE_COLOR = Colors.disabled;

export default function AppStack() {
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
              {route.name}
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
        component={ProfileScreen} 
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
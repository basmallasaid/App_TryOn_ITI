import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen    from "../screens/profile/ProfileScreen";
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import NotificationsScreen from "../screens/notifications/NotificationsScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile"     component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
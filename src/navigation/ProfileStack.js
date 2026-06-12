import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile"     component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name={ROUTES.PROFILE_MAIN} component={ProfileScreen} />
      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
      <Stack.Screen name={ROUTES.FAVORITES} component={FavoritesScreen} />
    </Stack.Navigator>
  );
}

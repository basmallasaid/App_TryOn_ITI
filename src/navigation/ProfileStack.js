import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import AvatarDetailScreen from '../screens/profile/AvatarDetailScreen';
import SubscriptionScreen from '../screens/subscription/SubscriptionScreen';
import ManageSubscriptionScreen from '../screens/subscription/ManageSubscriptionScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.PROFILE_MAIN} component={ProfileScreen} />
      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
      <Stack.Screen name={ROUTES.FAVORITES} component={FavoritesScreen} />
      <Stack.Screen name={ROUTES.AVATAR_DETAIL} component={AvatarDetailScreen} />
      <Stack.Screen name={ROUTES.SUBSCRIPTION} component={SubscriptionScreen} />
      <Stack.Screen name={ROUTES.MANAGE_SUBSCRIPTION} component={ManageSubscriptionScreen} />
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import AvatarDetailScreen from '../screens/profile/AvatarDetailScreen';
import SubscriptionScreen from '../screens/subscription/SubscriptionScreen';
import ManageSubscriptionScreen from '../screens/subscription/ManageSubscriptionScreen';
import { ROUTES } from './routes';
import { useLanguage } from '../context/LanguageContext';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  const { isRTL } = useLanguage();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: isRTL ? 'slide_from_left' : 'slide_from_right' }}>
      <Stack.Screen name={ROUTES.PROFILE_MAIN} component={ProfileScreen} />
      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
      <Stack.Screen name={ROUTES.FAVORITES} component={FavoritesScreen} />
      <Stack.Screen name={ROUTES.AVATAR_DETAIL} component={AvatarDetailScreen} />
      <Stack.Screen name={ROUTES.SUBSCRIPTION} component={SubscriptionScreen} />
      <Stack.Screen name={ROUTES.MANAGE_SUBSCRIPTION} component={ManageSubscriptionScreen} />
    </Stack.Navigator>
  );
}

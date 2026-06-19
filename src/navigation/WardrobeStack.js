import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WardrobeScreen from '../screens/wardrobe/WardrobeScreen';
import VerifyItemScreen from '../screens/wardrobe/VerifyItemScreen';
import EditWardrobeScreen from '../screens/wardrobe/EditWardrobeScreen';
import ItemDetailsScreen from '../screens/wardrobe/ItemDetailsScreen';
import { ROUTES } from './routes';
import { useLanguage } from '../context/LanguageContext';

const Stack = createNativeStackNavigator();

export default function WardrobeStack() {
  const { isRTL } = useLanguage();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: isRTL ? 'slide_from_left' : 'slide_from_right' }}>
      <Stack.Screen name={ROUTES.WARDROBE_MAIN} component={WardrobeScreen} />
      <Stack.Screen name={ROUTES.VERIFY_ITEM} component={VerifyItemScreen} />
      <Stack.Screen 
        name={ROUTES.EDIT_WARDROBE}
        component={EditWardrobeScreen} 
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name={ROUTES.ITEM_DETAILS} component={ItemDetailsScreen} />
    </Stack.Navigator>
  );
}

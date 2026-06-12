import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WardrobeScreen from '../screens/wardrobe/WardrobeScreen';
import VerifyItemScreen from '../screens/wardrobe/VerifyItemScreen';
import EditWardrobeScreen from '../screens/wardrobe/EditWardrobeScreen';
import ItemDetailsScreen from '../screens/wardrobe/ItemDetailsScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

export default function WardrobeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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

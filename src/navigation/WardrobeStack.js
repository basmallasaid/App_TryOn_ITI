import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WardrobeScreen from '../screens/wardrobe/WardrobeScreen';
import VerifyItemScreen from '../screens/wardrobe/VerifyItemScreen';
import EditWardrobeScreen from '../screens/wardrobe/EditWardrobeScreen';
import ItemDetailsScreen from '../screens/wardrobe/ItemDetailsScreen'; 
const Stack = createNativeStackNavigator();

export default function WardrobeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WardrobeMain" component={WardrobeScreen} />
      <Stack.Screen name="VerifyItem" component={VerifyItemScreen} />
      <Stack.Screen 
        name="EditWardrobe" 
        component={EditWardrobeScreen} 
        options={{ animation: 'slide_from_bottom' }} // Premium transition
      />
      <Stack.Screen name="ItemDetails"   component={ItemDetailsScreen} /> 
    </Stack.Navigator>
  );
}
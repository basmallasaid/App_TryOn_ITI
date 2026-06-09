import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WardrobeScreen   from '../screens/wardrobe/WardrobeScreen';
import VerifyItemScreen from '../screens/wardrobe/VerifyItemScreen';

const Stack = createNativeStackNavigator();

export default function WardrobeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WardrobeMain"  component={WardrobeScreen} />
      <Stack.Screen name="VerifyItem"    component={VerifyItemScreen} />
    </Stack.Navigator>
  );
}
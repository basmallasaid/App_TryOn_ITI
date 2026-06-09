import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectModelScreen from "../screens/selectModel/SelectModelScreen";
import CreateAvatarScreen from '../screens/avatar/CreateAvatarScreen';

const Stack = createNativeStackNavigator();

export default function TryOnStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SelectModel" component={SelectModelScreen} />
      <Stack.Screen name="CreateAvatar" component={CreateAvatarScreen} />
    </Stack.Navigator>
  );
}

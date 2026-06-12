import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectModelScreen from "../screens/selectModel/SelectModelScreen";
import CreateAvatarScreen from '../screens/avatar/CreateAvatarScreen';
import UploadPhotoScreen from '../screens/tryOn/UploadPhotoScreen';
import TryOnScreen from '../screens/tryOn/TryOnScreen';
import TryOnResultsScreen from '../screens/tryOn/TryOnResultsScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

export default function TryOnStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SELECT_MODEL} component={SelectModelScreen} />
      <Stack.Screen name={ROUTES.CREATE_AVATAR} component={CreateAvatarScreen} />
      <Stack.Screen name={ROUTES.UPLOAD_PHOTO} component={UploadPhotoScreen} />
      <Stack.Screen name={ROUTES.TRY_ON_SCREEN} component={TryOnScreen} />
      <Stack.Screen name={ROUTES.TRY_ON_RESULT} component={TryOnResultsScreen} />
    </Stack.Navigator>
  );
}

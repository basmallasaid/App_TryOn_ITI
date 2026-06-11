import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchingScreen from '../screens/matching/MatchingScreen';
import MatchingResultDetailsScreen from '../screens/matching/MatchingResultDetailsScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

export default function MatchingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.MATCHING_MAIN} component={MatchingScreen} />
      <Stack.Screen name={ROUTES.MATCHING_RESULT_DETAILS} component={MatchingResultDetailsScreen} />
    </Stack.Navigator>
  );
}

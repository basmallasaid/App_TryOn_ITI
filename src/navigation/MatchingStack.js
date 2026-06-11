import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchingScreen from '../screens/matching/MatchingScreen';
import MatchingResultDetailsScreen from '../screens/matching/MatchingResultDetailsScreen';

const Stack = createNativeStackNavigator();

export default function MatchingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MatchingMain" component={MatchingScreen} />
      <Stack.Screen name="MatchingResultDetails" component={MatchingResultDetailsScreen} />
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecommendationScreen from '../screens/recommendations/RecommendationScreen';
import AllRecommendationsScreen from '../screens/recommendations/AllRecommendationsScreen';
import RecommendationDetailsScreen from '../screens/recommendations/RecommendationDetailsScreen';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

export default function RecommendationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.RECOMMENDATIONS_HISTORY} component={RecommendationScreen} />
      <Stack.Screen name={ROUTES.RECOMMENDATIONS_GRID} component={AllRecommendationsScreen} />
      <Stack.Screen name={ROUTES.RECOMMENDATION_DETAIL} component={RecommendationDetailsScreen} />
    </Stack.Navigator>
  );
}

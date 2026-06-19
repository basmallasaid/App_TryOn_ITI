import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecommendationScreen from '../screens/recommendations/RecommendationScreen';
import RecommendationDetailsScreen from '../screens/recommendations/RecommendationDetailsScreen';
import { ROUTES } from './routes';
import { useLanguage } from '../context/LanguageContext';

const Stack = createNativeStackNavigator();

export default function RecommendationsStack() {
  const { isRTL } = useLanguage();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: isRTL ? 'slide_from_left' : 'slide_from_right' }}>
      <Stack.Screen name={ROUTES.RECOMMENDATIONS_HISTORY} component={RecommendationScreen} />
      <Stack.Screen name={ROUTES.RECOMMENDATION_DETAIL} component={RecommendationDetailsScreen} />
    </Stack.Navigator>
  );
}

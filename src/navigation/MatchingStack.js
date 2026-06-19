import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchingScreen from '../screens/matching/MatchingScreen';
import MatchingResultDetailsScreen from '../screens/matching/MatchingResultDetailsScreen';
import ItemDetailsScreen from '../screens/wardrobe/ItemDetailsScreen';
import ProductDetailScreen from '../screens/store/ProductDetailScreen';
import { ROUTES } from './routes';
import { useLanguage } from '../context/LanguageContext';

const Stack = createNativeStackNavigator();

export default function MatchingStack() {
  const { isRTL } = useLanguage();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: isRTL ? 'slide_from_left' : 'slide_from_right' }}>
      <Stack.Screen name={ROUTES.MATCHING_MAIN} component={MatchingScreen} />
      <Stack.Screen name={ROUTES.MATCHING_RESULT_DETAILS} component={MatchingResultDetailsScreen} />
      <Stack.Screen name={ROUTES.MATCHING_ITEM_DETAILS} component={ItemDetailsScreen} />
      <Stack.Screen name={ROUTES.MATCHING_PRODUCT_DETAIL} component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authentication/login/LoginScreen";
import SignUpScreen from "../screens/authentication/signup/SignUpScreen";
import ForgotPasswordScreen from "../screens/authentication/forget_password/ForgotPasswordScreen";
import VerifyOtpScreen from "../screens/authentication/verifyOTP/VerifyOtpScreen";
import ResetPasswordScreen from "../screens/authentication/reset_password/ResetPasswordScreen";
import CheckEmailScreen from "../screens/authentication/check_email/CheckEmailScreen";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";
import SelectLanguageScreen from "../screens/language/SelectLanguageScreen";
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

export default function AuthStack({ initialRoute }) {
  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SELECT_LANGUAGE} component={SelectLanguageScreen} />
      <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.REGISTER} component={SignUpScreen} />
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <Stack.Screen name={ROUTES.VERIFY_OTP} component={VerifyOtpScreen} />
      <Stack.Screen name={ROUTES.RESET_PASSWORD} component={ResetPasswordScreen} />
      <Stack.Screen name={ROUTES.CHECK_EMAIL} component={CheckEmailScreen} />
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authentication/login/LoginScreen";
import SignUpScreen from "../screens/authentication/signup/SignUpScreen";
import ForgotPasswordScreen from "../screens/authentication/forget_password/ForgotPasswordScreen";
import VerifyOtpScreen from "../screens/authentication/verifyOTP/VerifyOtpScreen";
import ResetPasswordScreen from "../screens/authentication/reset_password/ResetPasswordScreen";
import CheckEmailScreen from "../screens/authentication/check_email/CheckEmailScreen";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";
import SelectLanguageScreen from "../screens/language/SelectLanguageScreen";
const Stack = createNativeStackNavigator();

export default function AuthStack({ initialRoute }) {
  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SelectLanguage" component={SelectLanguageScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="CheckEmail" component={CheckEmailScreen} />
    </Stack.Navigator>
  );
}

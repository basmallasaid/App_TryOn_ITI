import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/login/LoginScreen";
import SignUpScreen from "../screens/signup/SignUpScreen";
import ForgotPasswordScreen from "../screens/forget_password/ForgotPasswordScreen";
import VerifyOtpScreen from "../screens/verifyOTP/VerifyOtpScreen";
import ResetPasswordScreen from "../screens/reset_password/ResetPasswordScreen";
import CheckEmailScreen from "../screens/check_email/CheckEmailScreen";


const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="CheckEmail" component={CheckEmailScreen} />
    </Stack.Navigator>
  );
}

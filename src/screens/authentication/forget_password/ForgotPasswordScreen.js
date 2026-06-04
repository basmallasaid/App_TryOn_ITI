import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { useAuth } from "../../../context/AuthContext";
import CustomizeAppButtonFilled from "../../../components/common/CustomizeAppButtonFilled";
import CustomizeTextInput from "../../../components/common/CustomizeTextInput";
import Colors from "../../../constants/theme/colors";
import Typography from "../../../constants/theme/typography";
import { IMAGES } from "../../../constants/images/images";
import {ICONS} from "../../../constants/images/icons";
import { forgotPassword } from '../../../api/auth_services/authServices';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const emailState = error ? 'error' : 'default';

  const handleSend = async () => {
    if (!email.includes('@')) { setError('Enter a valid email'); return; }
    try {
      setLoading(true);
      setError('');
      await forgotPassword(email.toLowerCase().trim());
      navigation.navigate('VerifyOtp', { email: email.toLowerCase().trim() });
    } catch (e) {
      const msg = e.response?.data?.message || '';
      if (msg.toLowerCase().includes('verif')) {
        setError('Verify your email first. Check your inbox for the verification link.');
      } else {
        setError(msg || 'Could not send code. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* Top image — 1/4 of screen */}
      <View style={styles.imageContainer}>
        <Image
          source={IMAGES.AUTH_HERO}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      {/* Bottom sheet — 3/4 of screen */}
      <KeyboardAvoidingView
        style={styles.sheetWrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.sheet}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>No worries! Enter your email and we'll send you a reset link.</Text>

          {/* Email input */}
          <CustomizeTextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            state={emailState}
          />
          {error ? <Text style={styles.errorMsg}>{error}</Text> : null}

        <View style={styles.buttonWrap}>
          <CustomizeAppButtonFilled
            label="Send Code"
            onPress={handleSend}
            loading={loading}
            backgroundColor={Colors.primary}
          />
        </View>
    

        {/* Back to login link */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLinkWrap}>
          <Text style={styles.loginLinkText}>
            <Text style={styles.loginLink}>Back to Login</Text>
          </Text>
        </TouchableOpacity>

     </ScrollView>
          </KeyboardAvoidingView>
        </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f4f4f5", // shows behind image while loading
  },
  imageContainer: {
    paddingTop: 25,
    height: SCREEN_HEIGHT * 0.25,
    width: "100%",
    backgroundColor: "#f4f4f5",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  sheetWrapper: {
    flex: 1,
    marginTop: -40,
    zIndex: 3,
  },
  sheet: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    ...Typography.screenTitleLarge,

  },
  subtitle: {
    ...Typography.screenSubtitle,
    paddingBottom: 10,
    paddingTop:4,
    marginBottom: 32,
  },
  errorMsg: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Colors.error,
    marginBottom: 12,
  },
  buttonWrap: {
    marginTop: "82%",
    marginBottom: 20,
  },
  loginLinkWrap: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Colors.textDark,
  },
  loginLink: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: Colors.success,
  },
});

export default ForgotPasswordScreen;
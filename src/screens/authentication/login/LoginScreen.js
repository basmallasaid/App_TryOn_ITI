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
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Google icon 
const GoogleIcon = () => (
  <View
    style={{
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ddd",
    }}
  >
    <Image source={ICONS.GOOGLE_ICON} style={{ width: 20, height: 20 }} />
  </View>
);

const LoginScreen = ({ route, navigation }) => {
  const { login } = useAuth();
  const successMessage = route?.params?.message ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailState = error ? "error" : "default";
  const passwordState = error ? "error" : "default";

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await login(email.toLowerCase().trim(), password);
    } catch (e) {
      const msg = e.response?.data?.message || "";
      if (msg.toLowerCase().includes("verif")) {
        setError("Please verify your email before signing in.");
      } else {
        setError(msg || "Login failed. Try again.");
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
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Continue your styling Journey</Text>

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

          {/* Password input + forgot password row */}
          <View style={{ marginTop: 10 }}>
            <CustomizeTextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setError("");
              }}
              secureTextEntry
              state={passwordState}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotWrap}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          
          {/* Success message (from register / reset) */}
          {successMessage ? (
            <Text style={styles.successMsg}>{successMessage}</Text>
          ) : null}

          {/* Global error */}
          {error ? <Text style={styles.errorMsg}>{error}</Text> : null}


          {/* Login button */}
          <View style={styles.buttonWrap}>
            <CustomizeAppButtonFilled
              label="Login"
              onPress={handleLogin}
              loading={loading}
              backgroundColor={Colors.primary}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google button */}
          <CustomizeAppButtonFilled
            label="Continue with Google"
            onPress={() => {}}
            outlined
            textColor={Colors.textPrimary}
            icon={<GoogleIcon />}
          />

          {/* Sign up link */}
          <View style={styles.enrichRow}>
            <Text style={styles.enrichBase}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.enrichLink}>sign-up now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f4f4f5",
  },

  imageContainer: {
  paddingTop: Platform.OS === "ios" ? 40 : 25,
  height: Platform.OS === "ios"
    ? SCREEN_HEIGHT * 0.35
    : SCREEN_HEIGHT * 0.25,
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
    paddingTop: 4,
    marginBottom: 32,
  },

  successMsg: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Colors.success,
    backgroundColor: "#F0FDE4",
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },

  errorMsg: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Colors.error,
    marginBottom: 10,
  },

  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 14,
  },

  forgotText: {
    ...Typography.forgotPassword,
    paddingVertical: 5,
  },

  buttonWrap: {
    marginTop: 75,
    marginBottom: 29,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },

  dividerLine: {
    width: "15%",
    height: 1,
    backgroundColor: Colors.primary,
  },

  dividerText: {
    ...Typography.dividerText,
    marginHorizontal: 5,
    marginTop: -9,
  },

  enrichRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    flexWrap: "wrap",
  },

  enrichBase: {
    ...Typography.enrichTextBase,
  },

  enrichLink: {
    ...Typography.enrichTextLink,
  },
});

export default LoginScreen;

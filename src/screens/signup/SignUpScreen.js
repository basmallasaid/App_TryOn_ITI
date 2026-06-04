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
import { useAuth } from "../../context/AuthContext";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import CustomizeTextInput from "../../components/common/CustomizeTextInput";
import Colors from "../../constants/theme/colors";
import Typography from "../../constants/theme/typography";
import { ICONS } from "../../constants/images/icons";
import { IMAGES } from "../../constants/images/images";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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

const SignUpScreen = ({ navigation }) => {
  const { register } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (val) => {
    setForm((f) => ({ ...f, [field]: val }));
    if (field !== "confirmPassword") setError("");
  };

  // Live password match state
  const confirmState = () => {
    if (!form.confirmPassword) return "default";
    return form.password === form.confirmPassword ? "success" : "error";
  };

  const validate = () => {
    if (!form.email.includes("@")) return "Enter a valid email";
    if (form.password.length < 8)
      return "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      return "Password didn't match, try again!";
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const { email, token } = await register(
        form.email.toLowerCase().trim(),
        form.password,
        form.confirmPassword,
      );
      navigation.navigate("CheckEmail", { email, token });
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.message ||
          "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const emailState =
    error && error.toLowerCase().includes("email") ? "error" : "default";
  const passwordState =
    error &&
    error.toLowerCase().includes("password") &&
    !error.includes("match")
      ? "error"
      : "default";

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
          <Text style={styles.title}>Create Your Style Profile</Text>
          <Text style={styles.subtitle}>
            Start building your personalized wardrobe
          </Text>

          {/* Global error (non-field-specific) */}
          {error &&
          !error.toLowerCase().includes("match") &&
          !error.toLowerCase().includes("email") &&
          !error.toLowerCase().includes("password") ? (
            <Text style={styles.errorMsg}>{error}</Text>
          ) : null}

          {/* Email */}
          <CustomizeTextInput
            label="Email"
            placeholder="Enter your email"
            value={form.email}
            onChangeText={update("email")}
            keyboardType="email-address"
            autoCapitalize="none"
            state={emailState}
            errorMessage={emailState === "error" ? error : ""}
          />
          <View style={{ height: 12 }} />
          {/* Password */}
          <CustomizeTextInput
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChangeText={update("password")}
            secureTextEntry
            state={passwordState}
            errorMessage={passwordState === "error" ? error : ""}
          />
          <View style={{ height: 12 }} />
          {/* Confirm Password — live match feedback */}
          <CustomizeTextInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChangeText={update("confirmPassword")}
            secureTextEntry
            state={confirmState()}
            errorMessage={
              confirmState() === "error"
                ? "Password didn't match, try again!"
                : ""
            }
          />

          {/* Sign up button */}
          <View style={styles.buttonWrap}>
            <CustomizeAppButtonFilled
              label="Sign Up"
              onPress={handleRegister}
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

          {/* Login link */}
          <View style={styles.enrichRow}>
            <Text style={styles.enrichBase}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.enrichLink}>login now</Text>
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
    marginTop: 50,
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
export default SignUpScreen;

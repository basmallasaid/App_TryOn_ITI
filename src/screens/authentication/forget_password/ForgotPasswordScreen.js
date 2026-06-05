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
import { ICONS } from "../../../constants/images/icons";
import { forgotPassword } from "../../../api/auth_services/authServices";
import BottomSheetLayout from "../../../components/common/authentication/BottomSheetLayout";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailState = error ? "error" : "default";

  const handleSend = async () => {
    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await forgotPassword(email.toLowerCase().trim());
      navigation.navigate("VerifyOtp", { email: email.toLowerCase().trim() });
    } catch (e) {
      const msg = e.response?.data?.message || "";
      if (msg.toLowerCase().includes("verif")) {
        setError(
          "Verify your email first. Check your inbox for the verification link.",
        );
      } else {
        setError(msg || "Could not send code. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetLayout
      title="Forgot Password?"
      subtitle="No worries! Enter your email and we'll send you a reset link."
    >
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
          label="Send reset link"
          onPress={handleSend}
          loading={loading}
          backgroundColor={Colors.primary}
        />
      </View>

      {/* Back to login link */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.loginLinkWrap}
      >
        <Text style={styles.loginLinkText}>
          <Text style={styles.loginLink}>Back to Login</Text>
        </Text>
      </TouchableOpacity>
    </BottomSheetLayout>
  );
};

const styles = StyleSheet.create({
  errorMsg: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Colors.error,
    marginBottom: 12,
  },
  buttonWrap: {
    marginTop: "82%",
    marginBottom: 20,
  },
  loginLinkWrap: {
    alignItems: "center",
  },
  loginLinkText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Colors.textDark,
  },
  loginLink: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: Colors.success,
  },
});

export default ForgotPasswordScreen;

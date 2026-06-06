import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import {
  verifyOtp,
  forgotPassword,
} from "../../../api/auth_services/authServices";
import CustomizeTextInput from "../../../components/common/CustomizeTextInput";
import CustomizeAppButtonFilled from "../../../components/common/CustomizeAppButtonFilled";
import Colors from "../../../constants/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import Typography from "../../../constants/theme/typography";
import OtpInput from "../../../components/common/OtpInput";

const VerifyOtpScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [expireCountdown, setExpireCountdown] = useState(290);

  useEffect(() => {
    if (countdown === 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (expireCountdown === 0) {
      setError("Verification code has expired.");
      return;
    }

    const timer = setTimeout(() => {
      setExpireCountdown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [expireCountdown]);

  const otpState = error ? "error" : otp.length === 6 ? "success" : "default";
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const handleVerify = async () => {
    if (expireCountdown <= 0) {
      setError("Verification code has expired. Please request a new code.");
      return;
    }
    if (otp.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await verifyOtp(email, otp);
      navigation.navigate("ResetPassword", { email });
    } catch (e) {
      setError(e.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await forgotPassword(email);

      setCountdown(60);
      setExpireCountdown(290);

      setOtp("");
      setError("");
    } catch (e) {
      setError("Could not resend. Try again.");
    }
  };

  return (
    
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Verification</Text>
      <Text style={styles.subtitle}>
        Write down the code sent to your Email !
      </Text>

      <Text style={styles.label}>OTP Code</Text>

      <OtpInput
        value={otp}
        onChange={(value) => {
          setOtp(value);
          setError("");
        }}
        state={otpState}
      />

      {error ? <Text style={styles.errorMsg}>{error}</Text> : null}

      <Text style={styles.expireText}>
        Code won’t be Valid after {formatTime(expireCountdown)}
      </Text>

      <View style={styles.buttonWrap}>
        <CustomizeAppButtonFilled
          label="Verify Code"
          onPress={handleVerify}
          loading={loading}
          backgroundColor={Colors.primary}
        />
      </View>

      {/* Resend */}
      <TouchableOpacity
        onPress={handleResend}
        disabled={countdown > 0}
        style={styles.resendWrap}
      >
        <Text
          style={[styles.resendText, countdown > 0 && styles.resendDisabled]}
        >
          {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
        </Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingTop: 124,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    ...Typography.screenTitleLarge,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.screenSubtitle,
    marginBottom: 28,
    textAlign: "center",
  },
  label: {
    ...Typography.label,
    marginBottom: 16,
    marginTop:30,
  },
  errorMsg: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Colors.error,
    marginBottom: 12,
    marginTop:20,
  },
  expireText: {
    marginTop: 50,
    textAlign: "center",
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Colors.error,
  },
  buttonWrap: {
    marginTop: "80%",
    marginBottom: 20,
  },
  resendWrap: {
    alignItems: "center",
    marginBottom:10
  },
  resendText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 13,
    color: Colors.success,
  },
  resendDisabled: {
    color: Colors.textMuted,
  },
});

export default VerifyOtpScreen;

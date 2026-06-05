import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { resetPassword } from "../../../api/auth_services/authServices";
import CustomizeTextInput from "../../../components/common/CustomizeTextInput";
import CustomizeAppButtonFilled from "../../../components/common/CustomizeAppButtonFilled";
import Colors from "../../../constants/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import BottomSheetLayout from "../../../components/common/authentication/BottomSheetLayout";

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (val) => {
    setForm((f) => ({ ...f, [field]: val }));
    setError("");
  };

  const confirmState = () => {
    if (!form.confirmPassword) return "default";
    return form.password === form.confirmPassword ? "success" : "error";
  };

  const passwordState =
    error && error.toLowerCase().includes("8") ? "error" : "default";

  const handleReset = async () => {
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await resetPassword(email, form.password, form.confirmPassword);

      navigation.navigate("Login", {
        message: "Password reset successfully. Please sign in.",
      });
    } catch (e) {
      setError(e.response?.data?.message || "Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetLayout
      title="Reset password"
      subtitle="Almost done!Set your new password and you are ready to go."
    >
      <CustomizeTextInput
        label="New Password"
        placeholder="Enter new password"
        value={form.password}
        onChangeText={update("password")}
        secureTextEntry
        state={passwordState}
      />

      <View style={{ height: 20 }} />

      <CustomizeTextInput
        label="Confirm Password"
        placeholder="Re-enter new password"
        value={form.confirmPassword}
        onChangeText={update("confirmPassword")}
        secureTextEntry
        state={confirmState()}
        errorMessage={
          confirmState() === "error" ? "Password didn't match, try again!" : ""
        }
      />

      {error ? <Text style={styles.errorMsg}>{error}</Text> : null}

      <View style={styles.buttonWrap}>
        <CustomizeAppButtonFilled
          label="Reset Password"
          onPress={handleReset}
          loading={loading}
          backgroundColor={Colors.primary}
        />
      </View>
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
    marginTop: "auto",
    paddingBottom: 24,
  },
});

export default ResetPasswordScreen;

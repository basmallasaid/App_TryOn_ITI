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
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../../context/AuthContext";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import CustomizeAppButtonFilled from "../../../components/common/CustomizeAppButtonFilled";
import CustomizeTextInput from "../../../components/common/CustomizeTextInput";
import Colors from "../../../constants/theme/colors";
import Typography from "../../../constants/theme/typography";
import { ICONS } from "../../../constants/images/icons";
import { IMAGES } from "../../../constants/images/images";
import BottomSheetLayout from "../../../components/authentication/BottomSheetLayout";
import EnrichTextComponent from "../../../components/common/EnrichTextComponent";

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
  const { t } = useTranslation();
  const { register , updateProfile, loginWithGoogle } = useAuth();
  const { signInWithGoogle } = useGoogleAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
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
    if (!form.email.includes("@")) return t('auth.signup.validEmail');
    if (form.password.length < 8)
      return t('auth.signup.passwordLength');
    if (form.password !== form.confirmPassword)
      return t('auth.signup.passwordMismatch');
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
      await updateProfile(token,form.firstName,form.lastName);
      navigation.navigate("CheckEmail", { email, token });
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.message ||
          t('auth.signup.failed'),
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
    <BottomSheetLayout
      title={t('auth.signup.title')}
      subtitle={t('auth.signup.subtitle')}
    >
      {/* Global error */}
      {error &&
      !error.toLowerCase().includes("match") &&
      !error.toLowerCase().includes("email") &&
      !error.toLowerCase().includes("password") ? (
        <Text style={styles.errorMsg}>{error}</Text>
      ) : null}

      {/* Name */}
      <View style={styles.nameRow}>
        <CustomizeTextInput
          label={t('auth.signup.firstName')}
          placeholder={t('auth.signup.firstNamePlaceholder')}
          value={form.firstName}
          onChangeText={update("firstName")}
          wrapperStyle={styles.halfInput}
        />
        <CustomizeTextInput
          label={t('auth.signup.lastName')}
          placeholder={t('auth.signup.lastNamePlaceholder')}
          value={form.lastName}
          onChangeText={update("lastName")}
          wrapperStyle={styles.halfInput}
        />
      </View>

      <View style={{ height: 12 }} />

      {/* Email */}
      <CustomizeTextInput
        label={t('auth.signup.email')}
        placeholder={t('auth.signup.emailPlaceholder')}
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
        label={t('auth.signup.password')}
        placeholder={t('auth.signup.passwordPlaceholder')}
        value={form.password}
        onChangeText={update("password")}
        secureTextEntry
        state={passwordState}
        errorMessage={passwordState === "error" ? error : ""}
      />
      <View style={{ height: 12 }} />
      {/* Confirm Password — live match feedback */}
      <CustomizeTextInput
        label={t('auth.signup.confirmPassword')}
        placeholder={t('auth.signup.confirmPlaceholder')}
        value={form.confirmPassword}
        onChangeText={update("confirmPassword")}
        secureTextEntry
        state={confirmState()}
        errorMessage={
          confirmState() === "error" ? t('auth.signup.passwordMismatch') : ""
        }
      />

      {/* Sign up button */}
      <View style={styles.buttonWrap}>
        <CustomizeAppButtonFilled
          label={t('auth.signup.signupButton')}
          onPress={handleRegister}
          loading={loading}
          backgroundColor={Colors.primary}
        />
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{t('common.or')}</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Google button */}
      <CustomizeAppButtonFilled
        label={t('auth.signup.continueGoogle')}
        onPress={async () => {
          try {
            const idToken = await signInWithGoogle();
            await loginWithGoogle(idToken);
          } catch (e) {
            setError(e.message || t('auth.signup.failed'));
          }
        }}
        outlined
        textColor={Colors.textPrimary}
        icon={<GoogleIcon />}
      />
      {/* Login link */}
      <EnrichTextComponent
        baseText={t('auth.signup.hasAccount')}
        linkText={t('auth.signup.loginNow')}
        onPress={() => navigation.navigate("Login")}
      />
    </BottomSheetLayout>
  );
};

const styles = StyleSheet.create({
    nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfInput: {
    flex: 1,
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
});
export default SignUpScreen;

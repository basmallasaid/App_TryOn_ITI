import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../../context/AuthContext";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import { useTheme } from "../../../context/ThemeContext";
import CustomizeAppButtonFilled from "../../../components/common/CustomizeAppButtonFilled";
import CustomizeTextInput from "../../../components/common/CustomizeTextInput";
import Colors from "../../../constants/theme/colors";
import { IMAGES } from "../../../constants/images/images";
import { ICONS } from "../../../constants/images/icons";
import EnrichTextComponent from "../../../components/common/EnrichTextComponent";
import BottomSheetLayout from "../../../components/authentication/BottomSheetLayout";
import { ROUTES } from "../../../navigation/routes";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const GoogleIcon = ({ isDarkMode }) => (
  <View
    style={{
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: isDarkMode ? Colors.white : "#fff",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: isDarkMode ? Colors.borderDefault : "#ddd",
    }}
  >
    <Image source={ICONS.GOOGLE_ICON} style={{ width: 20, height: 20 }} />
  </View>
);

const LoginScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { login, loginWithGoogle } = useAuth();
  const { signInWithGoogle } = useGoogleAuth();
  const { themeVersion, isDarkMode } = useTheme();
  const successMessage = route?.params?.message ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailState = error ? "error" : "default";
  const passwordState = error ? "error" : "default";

  const styles = React.useMemo(() => StyleSheet.create({
    successMsg: {
      fontFamily: "Roboto_400Regular",
      fontSize: 12,
      color: Colors.success,
      backgroundColor: isDarkMode ? "#1A2E0A" : "#F0FDE4",
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
      fontFamily: "Roboto_500Medium",
      fontWeight: "500",
      fontSize: 10,
      lineHeight: 10,
      color: Colors.primary,
      textAlign: "right",
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
      fontFamily: "Inter_700Bold",
      fontWeight: "700",
      fontSize: 12,
      lineHeight: 25.6,
      color: Colors.primary,
      textAlign: "center",
      marginHorizontal: 5,
      marginTop: -9,
    },
  }), [themeVersion]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t('auth.login.fillFields'));
      return;
    }
    try {
      setLoading(true);
      setError("");
      await login(email.toLowerCase().trim(), password);
    } catch (e) {
      const msg = e.response?.data?.message || "";
      if (msg.toLowerCase().includes("verif")) {
        setError(t('auth.login.emailError'));
      } else {
        setError(msg || t('auth.login.loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const idToken = await signInWithGoogle();
      await loginWithGoogle(idToken);
    } catch (e) {
      setError(e.message || t('auth.login.loginFailed'));
    }
  }

  return (
    <BottomSheetLayout
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
    >
      {/* Email input */}
      <CustomizeTextInput
        label={t('auth.login.email')}
        placeholder={t('auth.login.emailPlaceholder')}
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
          label={t('auth.login.password')}
          placeholder={t('auth.login.passwordPlaceholder')}
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setError("");
          }}
          secureTextEntry
          state={passwordState}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
          style={styles.forgotWrap}
        >
          <Text style={styles.forgotText}>{t('auth.login.forgotPassword')}</Text>
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
          label={t('auth.login.loginButton')}
          onPress={handleLogin}
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
        label={t('auth.login.continueGoogle')}
        onPress={handleLoginWithGoogle}
        outlined
        textColor={Colors.textPrimary}
        icon={<GoogleIcon isDarkMode={isDarkMode} />}
      />
      {/* Sign up link */}
      <EnrichTextComponent
        baseText={t('auth.login.noAccount')}
        linkText={t('auth.login.signupNow')}
        onPress={() => navigation.navigate(ROUTES.REGISTER)}
      />
    </BottomSheetLayout>
  );
};

export default LoginScreen;

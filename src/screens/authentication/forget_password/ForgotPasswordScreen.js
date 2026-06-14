import React, { useState } from "react";
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
import { useTheme } from "../../../context/ThemeContext";
import CustomizeAppButtonFilled from "../../../components/common/CustomizeAppButtonFilled";
import CustomizeTextInput from "../../../components/common/CustomizeTextInput";
import Colors from "../../../constants/theme/colors";
import { IMAGES } from "../../../constants/images/images";
import { ICONS } from "../../../constants/images/icons";
import { forgotPassword } from "../../../api/auth_services/authServices";
import BottomSheetLayout from "../../../components/authentication/BottomSheetLayout";
import { ROUTES } from "../../../navigation/routes";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ForgotPasswordScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const styles = React.useMemo(() => StyleSheet.create({
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
  }), [themeVersion]);

  const emailState = error ? "error" : "default";

  const handleSend = async () => {
    if (!email.includes("@")) {
      setError(t('auth.forgotPassword.validEmail'));
      return;
    }
    try {
      setLoading(true);
      setError("");
      await forgotPassword(email.toLowerCase().trim());
      navigation.navigate(ROUTES.VERIFY_OTP, { email: email.toLowerCase().trim() });
    } catch (e) {
      const msg = e.response?.data?.message || "";
      if (msg.toLowerCase().includes("verif")) {
        setError(t('auth.forgotPassword.notVerified'));
      } else {
        setError(msg || t('auth.forgotPassword.failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetLayout
      title={t('auth.forgotPassword.title')}
      subtitle={t('auth.forgotPassword.subtitle')}
    >
      {/* Email input */}

      <CustomizeTextInput
        label={t('auth.forgotPassword.email')}
        placeholder={t('auth.forgotPassword.emailPlaceholder')}
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
          label={t('auth.forgotPassword.sendButton')}
          onPress={handleSend}
          loading={loading}
          backgroundColor={Colors.primary}
        />
      </View>

      {/* Back to login link */}
      <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.LOGIN)}
        style={styles.loginLinkWrap}
      >
          <Text style={styles.loginLinkText}>
            <Text style={styles.loginLink}>{t('auth.forgotPassword.backToLogin')}</Text>
          </Text>
      </TouchableOpacity>
    </BottomSheetLayout>
  );
};

export default ForgotPasswordScreen;

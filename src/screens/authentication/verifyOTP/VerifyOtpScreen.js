import React, { useState, useEffect } from "react";
import SafeScreen from "../../../components/common/SafeScreen";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTranslation } from 'react-i18next';
import {
  verifyOtp,
  forgotPassword,
} from "../../../api/auth_services/authServices";
import { useTheme } from "../../../context/ThemeContext";
import CustomizeAppButtonFilled from "../../../components/common/CustomizeAppButtonFilled";
import Colors from "../../../constants/theme/colors";
import OtpInput from "../../../components/common/OtpInput";
import SuccessModal from "../../../components/common/SuccessModal";
import VerificationSucessComponent from "../../../components/authentication/VerificationSucessComponent";
import { ROUTES } from "../../../navigation/routes";

const VerifyOtpScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [expireCountdown, setExpireCountdown] = useState(290);
  const [showModal, setShowModal] = useState(false);

  const styles = React.useMemo(() => StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Colors.backgroundColor,
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    title: {
      fontFamily: "Roboto_700Bold",
      fontWeight: "700",
      fontSize: 24,
      lineHeight: 38.4,
      color: Colors.textPrimary,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontFamily: "Roboto_400Regular",
      fontWeight: "400",
      fontSize: 12,
      lineHeight: 12,
      color: Colors.textSecondary,
      marginBottom: 28,
      textAlign: "center",
    },
    label: {
      fontFamily: "Roboto_600SemiBold",
      fontWeight: "600",
      fontSize: 20,
      lineHeight: 20,
      marginBottom: 16,
      marginTop: 30,
    },
    errorMsg: {
      fontFamily: "Roboto_400Regular",
      fontSize: 12,
      color: Colors.error,
      marginBottom: 12,
      marginTop: 20,
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
      marginBottom: 20,
    },
    resendText: {
      fontFamily: "Roboto_500Medium",
      fontSize: 13,
      color: Colors.success,
    },
    resendDisabled: {
      color: Colors.textMuted,
    },
  }), [themeVersion]);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (expireCountdown === 0) {
      setError(t('auth.verifyOtp.expiredError'));
      return;
    }
    const timer = setTimeout(() => setExpireCountdown((c) => c - 1), 1000);
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
      setError(t('auth.verifyOtp.expiredRequestNew'));
      return;
    }
    if (otp.length !== 6) {
      setError(t('auth.verifyOtp.invalidCode'));
      return;
    }
    try {
      setLoading(true);
      setError("");
      await verifyOtp(email, otp);
      setShowModal(true);
    } catch (e) {
      setError(e.response?.data?.message || t('auth.verifyOtp.failed'));
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
      setError(t('auth.verifyOtp.resendFailed'));
    }
  };

  const handleModalComplete = () => {
    //setShowModal(false);
    navigation.navigate(ROUTES.RESET_PASSWORD, { email });
    setTimeout(() => setShowModal(false), 300);
  };

  return (
    <SafeScreen style={{ flex: 1 }}>
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('auth.verifyOtp.title')}</Text>
        <Text style={styles.subtitle}>
          {t('auth.verifyOtp.subtitle')}
        </Text>

        <Text style={styles.label}>{t('auth.verifyOtp.label')}</Text>

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
          {t('auth.verifyOtp.expireText', { time: formatTime(expireCountdown) })}
        </Text>

        <View style={styles.buttonWrap}>
          <CustomizeAppButtonFilled
            label={t('auth.verifyOtp.verifyButton')}
            onPress={handleVerify}
            loading={loading}
            backgroundColor={Colors.primary}
          />
        </View>

        <TouchableOpacity
          onPress={handleResend}
          disabled={countdown > 0}
          style={styles.resendWrap}
        >
          <Text
            style={[styles.resendText, countdown > 0 && styles.resendDisabled]}
          >
            {countdown > 0 ? t('auth.verifyOtp.resendCountdown', { count: countdown }) : t('auth.verifyOtp.resendCode')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <SuccessModal visible={showModal} onAnimationComplete={handleModalComplete}>
        <VerificationSucessComponent />
      </SuccessModal>
    </View>
    </SafeScreen>
  );
};

export default VerifyOtpScreen;

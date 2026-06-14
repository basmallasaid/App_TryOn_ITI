import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { useTranslation } from 'react-i18next';
import { resetPassword } from "../../../api/auth_services/authServices";
import { useTheme } from "../../../context/ThemeContext";
import CustomizeTextInput from "../../../components/common/CustomizeTextInput";
import CustomizeAppButtonFilled from "../../../components/common/CustomizeAppButtonFilled";
import Colors from "../../../constants/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import BottomSheetLayout from "../../../components/authentication/BottomSheetLayout";
import { ROUTES } from "../../../navigation/routes";

const ResetPasswordScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const { email } = route.params;

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

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
      marginTop: "auto",
      paddingBottom: 24,
    },
  }), [themeVersion]);

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
      setError(t('auth.resetPassword.passwordLength'));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t('auth.resetPassword.passwordMismatch'));
      return;
    }

    try {
      setLoading(true);
      setError("");

      await resetPassword(email, form.password, form.confirmPassword);

      navigation.navigate(ROUTES.LOGIN, {
        message: t('auth.resetPassword.success'),
      });
    } catch (e) {
      setError(e.response?.data?.message || t('auth.resetPassword.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetLayout
      title={t('auth.resetPassword.title')}
      subtitle={t('auth.resetPassword.subtitle')}
    >
      <CustomizeTextInput
        label={t('auth.resetPassword.newPassword')}
        placeholder={t('auth.resetPassword.newPlaceholder')}
        value={form.password}
        onChangeText={update("password")}
        secureTextEntry
        state={passwordState}
      />

      <View style={{ height: 20 }} />

      <CustomizeTextInput
        label={t('auth.resetPassword.confirmPassword')}
        placeholder={t('auth.resetPassword.confirmPlaceholder')}
        value={form.confirmPassword}
        onChangeText={update("confirmPassword")}
        secureTextEntry
        state={confirmState()}
        errorMessage={
          confirmState() === "error" ? t('auth.resetPassword.confirmMismatch') : ""
        }
      />

      {error ? <Text style={styles.errorMsg}>{error}</Text> : null}

      <View style={styles.buttonWrap}>
        <CustomizeAppButtonFilled
          label={t('auth.resetPassword.resetButton')}
          onPress={handleReset}
          loading={loading}
          backgroundColor={Colors.primary}
        />
      </View>
    </BottomSheetLayout>
  );
};

export default ResetPasswordScreen;

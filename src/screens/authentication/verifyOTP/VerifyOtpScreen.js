import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { verifyOtp, forgotPassword } from '../../../api/auth_services/authServices';
import CustomizeTextInput from '../../../components/common/CustomizeTextInput';
import CustomizeAppButtonFilled from '../../../components/common/CustomizeAppButtonFilled';
import Colors from '../../../constants/theme/colors';
import { Ionicons } from '@expo/vector-icons';

const VerifyOtpScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp]             = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown === 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const otpState = error ? 'error' : otp.length === 6 ? 'success' : 'default';

  const handleVerify = async () => {
    if (otp.length !== 6) { setError('Enter the 6-digit code'); return; }
    try {
      setLoading(true);
      setError('');
      await verifyOtp(email, otp);
      navigation.navigate('ResetPassword', { email });
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await forgotPassword(email);
      setCountdown(60);
      setOtp('');
      setError('');
    } catch (e) {
      setError('Could not resend. Try again.');
    }
  };

  return (
    <View style={styles.root}>

      <Text style={styles.title}>Enter Reset Code</Text>
      <Text style={styles.subtitle}>
        We sent a 6-digit code to{'\n'}
        <Text style={styles.emailHighlight}>{email}</Text>
      </Text>

      {error ? <Text style={styles.errorMsg}>{error}</Text> : null}

      <CustomizeTextInput
        label="Verification Code"
        placeholder="000000"
        value={otp}
        onChangeText={(v) => {
          setOtp(v.replace(/\D/g, '').slice(0, 6));
          setError('');
        }}
        keyboardType="number-pad"
        state={otpState}
        autoFocus
      />

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
        <Text style={[styles.resendText, countdown > 0 && styles.resendDisabled]}>
          {countdown > 0
            ? `Resend code in ${countdown}s`
            : 'Resend code'}
        </Text>
      </TouchableOpacity>

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
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    lineHeight: 38.4,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  emailHighlight: {
    fontFamily: 'Roboto_600SemiBold',
    color: Colors.textPrimary,
  },
  errorMsg: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Colors.error,
    marginBottom: 12,
  },
  buttonWrap: {
    marginTop: 24,
    marginBottom: 20,
  },
  resendWrap: {
    alignItems: 'center',
  },
  resendText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: Colors.primary,
  },
  resendDisabled: {
    color: Colors.textMuted,
  },
});

export default VerifyOtpScreen;
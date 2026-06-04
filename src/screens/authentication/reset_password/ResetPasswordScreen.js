import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { resetPassword } from '../../../api/auth_services/authServices';
import CustomizeTextInput from '../../../components/common/CustomizeTextInput';
import CustomizeAppButtonFilled from '../../../components/common/CustomizeAppButtonFilled';
import Colors from '../../../constants/theme/colors';
import { Ionicons } from '@expo/vector-icons';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [form, setForm]       = useState({ password: '', confirmPassword: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (val) => {
    setForm((f) => ({ ...f, [field]: val }));
    setError('');
  };

  // Live confirm match state
  const confirmState = () => {
    if (!form.confirmPassword) return 'default';
    return form.password === form.confirmPassword ? 'success' : 'error';
  };

  const passwordState = error && error.toLowerCase().includes('8') ? 'error' : 'default';

  const handleReset = async () => {
    if (form.password.length < 8)                 { setError('Password must be at least 8 characters'); return; }
    if (form.password !== form.confirmPassword)   { setError('Passwords do not match'); return; }
    try {
      setLoading(true);
      setError('');
      await resetPassword(email, form.password, form.confirmPassword);
      navigation.navigate('Login', { message: 'Password reset successfully. Please sign in.' });
    } catch (e) {
      setError(e.response?.data?.message || 'Reset failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>

      <Text style={styles.title}>Set New Password </Text>
      <Text style={styles.subtitle}>
        Must be at least 8 characters.
      </Text>

      {error ? <Text style={styles.errorMsg}>{error}</Text> : null}

      <CustomizeTextInput
        label="New Password"
        placeholder="Enter new password"
        value={form.password}
        onChangeText={update('password')}
        secureTextEntry
        state={passwordState}
      />

      <View style={{ height: 20 }} />

      <CustomizeTextInput
        label="Confirm Password"
        placeholder="Re-enter new password"
        value={form.confirmPassword}
        onChangeText={update('confirmPassword')}
        secureTextEntry
        state={confirmState()}
        errorMessage={
          confirmState() === 'error' ? "Password didn't match, try again!" : ''
        }
      />

      <View style={styles.buttonWrap}>
        <CustomizeAppButtonFilled
          label="Reset Password"
          onPress={handleReset}
          loading={loading}
          backgroundColor={Colors.primary}
        />
      </View>

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
  errorMsg: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Colors.error,
    marginBottom: 12,
  },
  buttonWrap: {
    marginTop: "90%",
  },
});

export default ResetPasswordScreen;
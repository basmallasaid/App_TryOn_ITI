import { useState } from 'react';
import {
  Linking,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';
import { sendVerification } from '../../../api/auth_services/authServices';
import CustomizeAppButtonFilled from '../../../components/common/CustomizeAppButtonFilled';
import CustomizeAppButtonOutlined from "../../../components/common/CustomizeAppButtonOutlined";
import Colors from '../../../constants/theme/colors';
import Typography  from '../../../constants/theme/typography';
import { ANIMATIONS } from "../../../constants/images/animations";
import { ROUTES } from "../../../navigation/routes";

const CheckEmailScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { email, token } = route.params;
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const openGmail = async () => {
    const supported = await Linking.canOpenURL('googlegmail://');
    Linking.openURL(supported ? 'googlegmail://' : 'https://mail.google.com');
  };

  const handleResend = async () => {
    try {
      setError('');
      await sendVerification(token);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (e) {
      setError(e.response?.data?.message || t('auth.checkEmail.failed'));
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.container}>

        {/* Title */}
        <Text style={styles.title}>{t('auth.checkEmail.title')}</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          {t('auth.checkEmail.subtitle', { email })}
        </Text>

        {/* Lottie animation */}
        <LottieView
          source={ANIMATIONS.CHECK_EMAIL_SUCCESS}
          autoPlay
          loop
          style={styles.animation}
        />

        {/* Resend feedback */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {resent ? <Text style={styles.successText}>{t('auth.checkEmail.resent')}</Text> : null}

        {/* Spam notice */}
        <Text style={styles.spamText}>
          {t('auth.checkEmail.spam')}{' '}
          <Text style={styles.spamBold}>{t('auth.checkEmail.spamBold')}</Text>{' '}
          {t('auth.checkEmail.folder')}
        </Text>

        <View style={styles.gap} />

        {/* Open Gmail */}
        <CustomizeAppButtonFilled
          label={t('auth.checkEmail.openGmail')}
          onPress={openGmail}
          backgroundColor={Colors.primary}
        />

        <View style={styles.gap} />

        {/* Resend email */}
        <CustomizeAppButtonOutlined
          label={t('auth.checkEmail.resendEmail')}
          onPress={handleResend}
          borderColor={Colors.success}
          textColor={Colors.success}
        />

        {/* Back to login link */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTES.LOGIN, {
              message: t('auth.checkEmail.navMessage', { email }),
            })
          }
          style={styles.backWrap}
        >
          <Text style={styles.backLink}>{t('auth.checkEmail.backToLogin')}</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 80 : 124,
    paddingBottom: 36,
  },

  title: {
    ...Typography.screenTitleLarge,
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    ...Typography.screenSubtitle,
    textAlign: 'center',
    marginBottom: 10,
  },

  emailHighlight: {
    fontFamily: 'Roboto_600SemiBold',
    color: Colors.textPrimary,
    textAlign: 'center',

  },

  spamText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 8,
  },

  spamBold: {
    fontFamily: 'Roboto_600SemiBold',
    color: Colors.textSecondary,
  },

  animation: {
    width: 220,
    height: 220,
    marginVertical: 16,
    alignSelf: 'center',
  },

  errorText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },

  successText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Colors.success,
    marginBottom: 12,
    textAlign: 'center',
  },

  gap: {
    height: 20,
  },

  backWrap: {
    marginTop: 24,
  },

  backLink: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: Colors.success,
    textAlign: 'center',
  },
});

export default CheckEmailScreen;
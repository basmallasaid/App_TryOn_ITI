import { View, Text, Image, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfileContext } from '../../context/ProfileContext';
import { ROUTES } from '../../navigation/routes';
import CustomBackButton from '../../components/common/CustomBackButton';
import CustomizeAppButtonFilled from '../../components/common/CustomizeAppButtonFilled';
import Colors from '../../constants/theme/colors';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width - 80;

export default function AvatarDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { profile } = useProfileContext();

  const avatarUri = route?.params?.avatarUri;
  const isSubscribed = !!profile?.subscriptionStatus;

  const handleCustomize = () => {
    if (isSubscribed) {
      navigation.navigate(ROUTES.CREATE_AVATAR);
    } else {
      navigation.navigate(ROUTES.SUBSCRIPTION);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.header, { flexDirection: "row" }]}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { textAlign: "left" }]}>{t('profile.avatarTitle')}</Text>
        <View style={{ width: 56 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} resizeMode="contain" />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="person-circle-outline" size={60} color="#D5D9DE" />
              <Text style={styles.placeholderText}>{t('profile.noAvatar')}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.infoRow, { flexDirection: "row" }]}>
            <Ionicons name="person-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              {profile?.profile?.first_name || ''} {profile?.profile?.last_name || ''}
            </Text>
          </View>
          <View style={[styles.infoRow, { flexDirection: "row" }]}>
            <Ionicons name="shield-checkmark-outline" size={18} color={isSubscribed ? Colors.success : Colors.textSecondary} />
            <Text style={[styles.infoText, isSubscribed && { color: Colors.success }]}>
              {isSubscribed ? t("profile.premium") : t('subscription.subtitle')}
            </Text>
          </View>
        </View>

        <CustomizeAppButtonFilled
          label={t('profile.customizeAvatar')}
          onPress={handleCustomize}
          backgroundColor={Colors.error}
          textColor="#fff"
          icon={<Ionicons name="color-palette-outline" size={18} color="#fff" />}
          iconPosition="right"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F5',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 18,
    color: '#121826',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  imageCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
    marginBottom: 16,
  },
  avatarImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE * 1.2,
    borderRadius: 12,
  },
  placeholder: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE * 1.2,
    borderRadius: 12,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  placeholderText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 42,
    borderWidth: 1,
    borderColor: '#E9EBEE',
  },
  infoRow: {
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

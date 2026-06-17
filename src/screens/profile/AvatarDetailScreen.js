import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import SafeScreen from '../../components/common/SafeScreen';
import { useProfileContext } from '../../context/ProfileContext';
import { ROUTES, SOURCE } from '../../navigation/routes';
import CustomBackButton from '../../components/common/CustomBackButton';
import CustomizeAppButtonFilled from '../../components/common/CustomizeAppButtonFilled';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';

const BLURHASH_PLACEHOLDER = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width - 80;

export default function AvatarDetailScreen() {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { profile, avatarImage } = useProfileContext();
  const [avatarUri, setAvatarUri] = useState(route?.params?.avatarUri || avatarImage || null);

  const isSubscribed = profile?.subscriptionStatus === "active";
  const hasAvatar = profile?.avatars?.length > 0;

  useEffect(() => {
    if (avatarImage) {
      setAvatarUri(avatarImage);
    }
  }, [avatarImage]);

  const handleCustomize = () => {
    if (!hasAvatar || isSubscribed) {
      navigation.navigate(ROUTES.TRY_ON, {
        screen: ROUTES.CREATE_AVATAR,
        params: { source: SOURCE.AVATAR_DETAIL },
      });
    } else {
      navigation.navigate(ROUTES.SUBSCRIPTION);
    }
  };

  return (
    <SafeScreen>
      <View style={[styles.header, { flexDirection: "row" }]}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { textAlign: "center" }]}>{t('profile.avatarTitle')}</Text>
        <View style={{ width: 56 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="contain" placeholder={BLURHASH_PLACEHOLDER} transition={300} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="person-circle-outline" size={60} color={Colors.borderDefault} />
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
          backgroundColor={Colors.primary}
          textColor={Colors.textInverse}
          icon={<Ionicons name="color-palette-outline" size={18} color={Colors.textInverse} />}
          iconPosition="right"
        />
      </ScrollView>
    </SafeScreen>
  );
}

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  imageCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: 16,
  },
  avatarImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE * 1.2,
    borderRadius: 10,
  },
  placeholder: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE * 1.2,
    borderRadius: 10,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  placeholderText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: Colors.disabled,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 42,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
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

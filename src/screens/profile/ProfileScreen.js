import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useProfileContext } from "../../context/ProfileContext";
import { useFavorites } from "../../context/FavoritesContext";
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import StatCard from "../../components/profile/StatCard";
import PrefRow from "../../components/profile/PrefRow";
import StyleChip from "../../components/profile/StyleChip";
import LanguageBottomSheet from "../../components/profile/LanguageBottomSheet";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import CustomizeAppButtonOutlined from "../../components/common/CustomizeAppButtonOutlined";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import Colors from "../../constants/theme/colors";
import { ROUTES } from "../../navigation/routes";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { deleteAccount } from "../../api/user_services/userService";
import { getAvatarById } from "../../api/avatar_services/avatarService";
import AvatarOptionCard from "../../components/avatar/AvatarOptionCard";

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { language, selectLanguage } = useLanguage();
  const {
    profile,
    settings,
    updateNotifications,
    updateDarkMode,
    updateLanguage,
    updateUserImage,
  } = useProfileContext();
  const { items: favorites } = useFavorites();
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [tempLang, setTempLang] = useState(language);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);

  useEffect(() => {
    if (profile?.avatars?.length) {
      const lastId = profile.avatars[profile.avatars.length - 1];
      getAvatarById(lastId)
        .then((res) => {
          const uri = res?.avatar?.image_url || res?.image || res?.imageUrl || res?.url || null;
          setAvatarImage(uri);
        })
        .catch(() => {});
    }
  }, [profile?.avatars]);

  const completionScore = () => {
    if (!profile) return 0;
    const fields = [
      profile.profile?.first_name,
      profile.profile?.last_name,
      profile.profile?.gender,
      profile.profile?.date_of_birth,
      profile.email,
    ];
    return fields.filter(Boolean).length / fields.length;
  };

  const handleLanguageSave = async () => {
    await selectLanguage(tempLang);
    updateLanguage(tempLang);
    setLangModalVisible(false);
  };

  const pickImage = async (pickerFn) => {
    const { status } = await pickerFn();
    if (status !== "granted") return;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
      aspect: [1, 1],
    };
    const result =
      pickerFn === ImagePicker.requestCameraPermissionsAsync
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    if (result?.assets?.[0]?.uri) {
      const manipResult = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300 } }],
        { compress: 0.4, format: SaveFormat.JPEG, base64: true },
      );
      if (manipResult.base64) {
        updateUserImage(`data:image/jpeg;base64,${manipResult.base64}`);
      }
    }
  };

  const handlePickImage = () => {
    Alert.alert(t("profile.changePhoto"), "", [
      {
        text: t("common.camera"),
        onPress: () => pickImage(ImagePicker.requestCameraPermissionsAsync),
      },
      {
        text: t("common.gallery"),
        onPress: () =>
          pickImage(ImagePicker.requestMediaLibraryPermissionsAsync),
      },
      { text: t("common.cancel"), style: "cancel" },
    ]);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount(profile?.email);
      setDeleteModalVisible(false);
      logout();
    } catch (err) {
      setDeleteModalVisible(false);
      Alert.alert(t('common.error'), err.response?.data?.message || t('common.error'));
    } finally {
      setDeleting(false);
    }
  };

  const firstName = profile?.profile?.first_name || t("profile.guestFallback");

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Card 1: Profile ── */}
        <View style={styles.card}>
          {/* Row 1: Avatar + name + edit */}
          <View style={styles.profileRow}>
            <View style={styles.profileLeft}>
              <TouchableOpacity onPress={handlePickImage}>
                <ProfileAvatar
                  firstName={profile?.profile?.first_name}
                  lastName={profile?.profile?.last_name}
                  imageUri={profile?.userImage}
                />
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={styles.hiName}>
                  {t("profile.hi", { name: firstName })}
                </Text>
                <Text style={styles.email}>{profile?.email ?? ""}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
            >
              <Text style={styles.editText}>{t("profile.edit")}</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: Progress */}
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${completionScore() * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {t("profile.completeProfile")}
            </Text>
          </View>

          {/* Row 3: Stat cards */}
          <View style={styles.statRow}>
            <StatCard
              icon="card-outline"
              title={t("profile.credits")}
              subtitle={t("profile.creditsAmount")}
            />
            <StatCard
              icon="heart-outline"
              title={t("profile.wishlist")}
              subtitle={t("profile.wishlistCount", { count: favorites.length })}
              onPress={() => navigation.navigate(ROUTES.FAVORITES)}
            />
          </View>
        </View>

        {/* ── Avatar Card ── */}
        <AvatarOptionCard
          title={profile?.avatars?.length ? t('profile.avatarTitle') : t('profile.noAvatar')}
          description={profile?.avatars?.length ? t('profile.avatarDesc') : t('profile.noAvatarDesc')}
          image={avatarImage ? { uri: avatarImage } : null}
          badge={t('common.edit')}
          onPress={() => navigation.navigate(ROUTES.AVATAR_DETAIL, { avatarUri: avatarImage })}
        />

        {/* ── Card 3: Preferences & Privacy ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("profile.preferences")}</Text>

          <PrefRow
            icon="notifications-outline"
            title={t("profile.notifications")}
            right={
              <Switch
                value={settings.notifications}
                onValueChange={updateNotifications}
                trackColor={{ false: Colors.disabled, true: Colors.primary }}
                thumbColor="#FFFFFF"
                style={styles.switch}
              />
            }
          />
          <PrefRow
            icon="moon-outline"
            title={t("profile.darkMode")}
            right={
              <Switch
                value={settings.darkMode}
                onValueChange={updateDarkMode}
                trackColor={{ false: Colors.disabled, true: Colors.primary }}
                thumbColor="#FFFFFF"
                style={styles.switch}
              />
            }
          />
          
          <PrefRow
            icon="flag-outline"
            title={t("profile.language")}
            onPress={() => {
              setTempLang(language);
              setLangModalVisible(true);
            }}
            right={
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            }
          />

          <PrefRow
            icon="card-outline"
            title={t("profile.payment")}
            borderBottom={false}
            onPress={() => {}}
            right={
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            }
          />
        </View>

        {/* ── Logout & Delete ── */}
        <View style={styles.logoutWrap}>
          <CustomizeAppButtonFilled
            label={t("profile.logout")}
            onPress={logout}
            backgroundColor={Colors.error}
            textColor="#fff"
            iconPosition="right"
            icon={
              <Ionicons name="log-out-outline" size={18} color="#fff" />
            }
          />
          <CustomizeAppButtonOutlined
            label={t("profile.deleteAccount")}
            onPress={() => setDeleteModalVisible(true)}
            borderColor={Colors.error}
            textColor={Colors.error}
            icon={
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
            }
          />
        </View>
      </ScrollView>

      {/* ── Language bottom sheet ── */}
      <LanguageBottomSheet
        visible={langModalVisible}
        tempLang={tempLang}
        onSelect={setTempLang}
        onSave={handleLanguageSave}
        onClose={() => setLangModalVisible(false)}
      />

      {/* ── Delete account confirmation ── */}
      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        loading={deleting}
        title={t('profile.deleteConfirmTitle')}
        subtitle={t('profile.deleteConfirmSubtitle')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4F4F5",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9EBEE",
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 20,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileInfo: {
    gap: 4,
  },
  hiName: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 16,
    lineHeight: 16,
    color: Colors.textPrimary,
  },
  email: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 12,
    color: Colors.textSecondary,
    paddingBottom: 5,
  },
  editBtn: {
    height: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#D5D9DE",
    justifyContent: "center",
    alignItems: "center",
  },
  editText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressWrap: {
    alignItems: "center",
    gap: 8,
  },
  progressTrack: {
    width: 279,
    height: 4,
    borderRadius: 8,
    backgroundColor: "#D5D9DE",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  progressLabel: {
    fontFamily: "Roboto_500Medium",
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  statRow: {
    flexDirection: "row",
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 16,
    lineHeight: 16,
    color: "#121826",
  },
  customizeText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    color: Colors.success,
  },
  styleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  switch: {
    transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }],
  },
  logoutWrap: {
    marginTop: 8,
    gap: 12,
  },
});

export default ProfileScreen;

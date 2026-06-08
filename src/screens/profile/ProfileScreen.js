import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useProfileContext } from "../../context/ProfileContext";
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import StatCard from "../../components/profile/StatCard";
import PrefRow from "../../components/profile/PrefRow";
import StyleChip from "../../components/profile/StyleChip";
import LanguageBottomSheet from "../../components/profile/LanguageBottomSheet";
import CustomizeAppButtonOutlined from "../../components/common/CustomizeAppButtonOutlined";
import Colors from "../../constants/theme/colors";

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { language, selectLanguage, syncLanguage } = useLanguage();
  const { profile } = useProfileContext() ;

  const STYLE_OPTIONS = [
    t('profile.styleOptions.streetwear'),
    t('profile.styleOptions.minimalist'),
    t('profile.styleOptions.avantGarde'),
    t('profile.styleOptions.cyberpunk'),
    t('profile.styleOptions.quietLuxury'),
    t('profile.styleOptions.bohemian'),
  ];


  const [customizeMode, setCustomizeMode] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [notifications, setNotifications] = useState(
    profile?.settings?.notifications_enabled ?? true,
  );
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [tempLang, setTempLang] = useState(language);

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

  const toggleStyle = (style) => {
    if (!customizeMode) return;
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  const handleLanguageSave = async () => {
    await selectLanguage(tempLang);
    syncLanguage();
    setLangModalVisible(false);
  };

  const firstName = profile?.profile?.first_name || "there";

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
              <ProfileAvatar name={profile?.profile?.first_name} />
              <View style={styles.profileInfo}>
                <Text style={styles.hiName}>{t('profile.hi', { name: firstName })}</Text>
                <Text style={styles.email}>{profile?.email ?? ""}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={styles.editText}>{t('profile.edit')}</Text>
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
              {t('profile.completeProfile')}
            </Text>
          </View>

          {/* Row 3: Stat cards */}
          <View style={styles.statRow}>
            <StatCard
              icon="card-outline"
              title={t('profile.credits')}
              subtitle={t('profile.creditsAmount')}
            />
            <StatCard
              icon="heart-outline"
              title={t('profile.wishlist')}
              subtitle={t('profile.wishlistEmpty')}
            />
          </View>
        </View>

        {/* ── Card 2: Style Identity ── */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t('profile.styleIdentity')}</Text>
            <TouchableOpacity onPress={() => setCustomizeMode((v) => !v)}>
              <Text style={styles.customizeText}>
                {customizeMode ? t('profile.done') : t('profile.customize')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.styleGrid}>
            {STYLE_OPTIONS.map((style) => (
              <StyleChip
                key={style}
                label={style}
                selected={selectedStyles.includes(style)}
                customizeMode={customizeMode}
                onPress={() => toggleStyle(style)}
              />
            ))}
          </View>
        </View>

        {/* ── Card 3: Preferences & Privacy ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('profile.preferences')}</Text>

          <PrefRow
            icon="notifications-outline"
            title={t('profile.notifications')}
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: Colors.disabled, true: Colors.primary }}
                thumbColor="#FFFFFF"
                style={styles.switch}
              />
            }
          />

          <PrefRow
            icon="flag-outline"
            title={t('profile.language')}
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
            title={t('profile.payment')}
            borderBottom={false}
            onPress={() => {}}
            right={
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            }
          />
        </View>

        {/* ── Logout ── */}
        <View style={styles.logoutWrap}>
          <CustomizeAppButtonOutlined
            label={t('profile.logout')}
            onPress={logout}
            borderColor={Colors.error}
            textColor={Colors.error}
            icon={
              <Ionicons name="log-out-outline" size={18} color={Colors.error} />
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
    paddingTop: 58,
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
  },
});

export default ProfileScreen;

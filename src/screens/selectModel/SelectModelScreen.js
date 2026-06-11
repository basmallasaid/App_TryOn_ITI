import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  ScrollView
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import Typography from "../../constants/theme/typography";
import AvatarOptionCard from "../../components/avatar/AvatarOptionCard";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import { IMAGES } from "../../constants/images/images";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../api/user_services/userService";
import { getAvatarById } from "../../api/avatar_services/avatarService";
import { ROUTES, SOURCE } from "../../navigation/routes";

const PhotoPlaceholder = () => {
  const { t } = useTranslation();
  return (
    <View style={photoStyles.container}>
      <View style={photoStyles.circle}>
        <Ionicons name="camera" size={24} color="#6B7280" />
      </View>
      <Text style={photoStyles.label}>{t('tryOn.selectModel.tapToUpload')}</Text>
    </View>
  );
};

const photoStyles = StyleSheet.create({
  container: {
    backgroundColor: "#E7EBFE",
    borderRadius: 16,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 130,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
    fontFamily: "Roboto_500Medium",
    textAlign: "center",
  },
});

const SelectModelScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const productImage = route?.params?.productImage;
  const isStoreFlow = !!productImage;

  const MODELS = [
    {
      id: "avatar",
      title: t('tryOn.selectModel.avatarTitle'),
      description: t('tryOn.selectModel.avatarDesc'),
      badge: t('tryOn.selectModel.recommended'),
      image: IMAGES.AVATAR,
    },
    {
      id: "photo",
      title: t('tryOn.selectModel.photoTitle'),
      description: t('tryOn.selectModel.photoDesc'),
      badge: null,
      image: null,
      rightContent: <PhotoPlaceholder />,
    },
  ];

  const handleNext = async () => {
    if (selected === "avatar") {
      setLoading(true);
      try {
        const profile = await getUserProfile(user._id);
        const avatars = profile?.avatars;
        if (avatars && avatars.length > 0) {
          const avatarInfo = avatars[0];
          const avatarId = avatarInfo._id || avatarInfo;
          if (isStoreFlow) {
            const avatarData = await getAvatarById(avatarId);
            const avatarObj = avatarData?.avatar || avatarData;
            const avatarImg = typeof avatarObj === "string"
              ? avatarObj
              : avatarObj?.image_url || avatarObj?.image || avatarObj?.imageUrl || avatarObj?.url || null;
            navigation.navigate(ROUTES.TRY_ON_RESULT, { productImage, avatarImage: avatarImg || avatarId, source: SOURCE.STORE });
          } else {
            navigation.navigate(ROUTES.TRY_ON_SCREEN, { avatarId, source: SOURCE.HOME });
          }
        } else {
          navigation.navigate(ROUTES.CREATE_AVATAR);
        }
      } catch {
        navigation.navigate(ROUTES.CREATE_AVATAR);
      } finally {
        setLoading(false);
      }
    } else if (selected === "photo") {
      navigation.navigate(ROUTES.UPLOAD_PHOTO, isStoreFlow ? { productImage, source: SOURCE.STORE } : { source: SOURCE.HOME });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
  <ScrollView
    contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color={Colors.iconGray}
        />
      </TouchableOpacity>

      <Text style={styles.title}>
        {t('tryOn.selectModel.title')}
      </Text>

      <Text style={styles.subtitle}>
        {t('tryOn.selectModel.subtitle')}
      </Text>

      <View style={styles.optionsWrap}>
        {MODELS.map((model) => (
          <AvatarOptionCard
            key={model.id}
            title={model.title}
            description={model.description}
            badge={model.badge}
            image={model.image}
            rightContent={model.rightContent}
            selected={selected === model.id}
            onPress={() => setSelected(model.id)}
          />
        ))}
      </View>

      <View style={styles.buttonWrap}>
        <CustomizeAppButtonFilled
          label={isStoreFlow ? t('tryOn.virtualTryOn.generate') : t('tryOn.selectModel.next')}
          onPress={handleNext}
          disabled={!selected}
          loading={loading}
          backgroundColor={Colors.primary}
        />
      </View>
    </View>
  </ScrollView>
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    ...Typography.screenTitleLarge,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontWeight: "400",
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: 32,
  },
  optionsWrap: {
    gap: 16,
    paddingTop: 10,
  },
  buttonWrap: {
    paddingBottom: 30,
    paddingTop: 50,
  },
  scrollContent: {
  flexGrow: 1,
},
});

export default SelectModelScreen;

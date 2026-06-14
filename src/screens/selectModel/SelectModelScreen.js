import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
  ScrollView
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import Typography from "../../constants/theme/typography";
import AvatarOptionCard from "../../components/avatar/AvatarOptionCard";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import CustomBackButton from "../../components/common/CustomBackButton";
import { IMAGES } from "../../constants/images/images";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../api/user_services/userService";
import { getAvatarById } from "../../api/avatar_services/avatarService";
import { ROUTES, SOURCE } from "../../navigation/routes";



const photoPlaceholderStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  label: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Colors.iconGray,
    textAlign: "center",
  },
});

const PhotoPlaceholder = () => {
  const { t } = useTranslation();
  return (
    <View style={photoPlaceholderStyles.container}>
      <View style={photoPlaceholderStyles.circle}>
        <Ionicons name="camera" size={24} color={Colors.iconGray} />
      </View>
      <Text style={photoPlaceholderStyles.label}>{t('tryOn.selectModel.tapToUpload')}</Text>
    </View>
  );
};

const SelectModelScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const productImage = route?.params?.productImage;
  const isStoreFlow = !!productImage;

  const styles = React.useMemo(() => StyleSheet.create({
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
}), [themeVersion]);

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
      <CustomBackButton onPress={() => navigation.goBack()} />

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

export default SelectModelScreen;

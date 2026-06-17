import React, { useState } from "react";
import SafeScreen from "../../components/common/SafeScreen";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import AvatarOptionCard from "../../components/avatar/AvatarOptionCard";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import CustomBackButton from "../../components/common/CustomBackButton";
import { IMAGES } from "../../constants/images/images";
import { useAuth } from "../../context/AuthContext";
import { useProfileContext } from "../../context/ProfileContext";
import { ROUTES, SOURCE } from "../../navigation/routes";



const PhotoPlaceholder = ({ styles }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.photoContainer}>
      <View style={styles.photoCircle}>
        <Ionicons name="camera" size={24} color={Colors.iconGray} />
      </View>
      <Text style={styles.photoLabel}>{t('tryOn.selectModel.tapToUpload')}</Text>
    </View>
  );
};

const SelectModelScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const { user } = useAuth();
  const { profile, avatarImage } = useProfileContext();
  const [selected, setSelected] = useState(null);
  const productImage = route?.params?.productImage;
  const isStoreFlow = !!productImage;

  const styles = React.useMemo(() => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 38.4,
    color: Colors.textPrimary,
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
  photoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  photoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.borderDefault,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  photoLabel: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Colors.iconGray,
    textAlign: "center",
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
      rightContent: <PhotoPlaceholder styles={styles} />,
    },
  ];

  const handleNext = () => {
    if (selected === "avatar") {
      const avatars = profile?.avatars;
      if (avatars && avatars.length > 0) {
        const avatarInfo = avatars[avatars.length - 1];
        const avatarId = avatarInfo._id || avatarInfo;
        if (isStoreFlow) {
          navigation.navigate(ROUTES.TRY_ON_RESULT, { productImage, avatarImage: avatarImage || avatarId, source: SOURCE.STORE });
        } else {
          navigation.navigate(ROUTES.TRY_ON_SCREEN, { avatarId, avatarImage, source: SOURCE.HOME });
        }
      } else {
        navigation.navigate(ROUTES.CREATE_AVATAR, {
          source: SOURCE.SELECT_MODEL,
          ...(isStoreFlow && { productImage }),
        });
      }
    } else if (selected === "photo") {
      navigation.navigate(ROUTES.UPLOAD_PHOTO, isStoreFlow ? { productImage, source: SOURCE.STORE } : { source: SOURCE.HOME });
    }
  };


  return (
    <SafeScreen style={styles.safeArea}>
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
          backgroundColor={Colors.primary}
        />
      </View>
    </View>
  </ScrollView>
</SafeScreen>
  );
};

export default SelectModelScreen;

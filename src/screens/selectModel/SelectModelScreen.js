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

const SelectModelScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

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
          navigation.navigate("TryOn", { avatarId: avatars[0]._id || avatars[0] });
        } else {
          navigation.navigate("CreateAvatar");
        }
      } catch {
        navigation.navigate("CreateAvatar");
      } finally {
        setLoading(false);
      }
    } else if (selected === "photo") {
      navigation.navigate("UploadPhoto");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.iconGray} />
        </TouchableOpacity>

        <Text style={styles.title}>{t('tryOn.selectModel.title')}</Text>
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
            label={t('tryOn.selectModel.next')}
            onPress={handleNext}
            disabled={!selected}
            loading={loading}
            backgroundColor={Colors.primary}
          />
        </View>
      </View>
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
});

export default SelectModelScreen;

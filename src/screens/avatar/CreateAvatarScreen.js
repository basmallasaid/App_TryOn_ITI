import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import Typography from "../../constants/theme/typography";
import AvatarPreview from "../../components/avatar/AvatarPreview";
import MeasurementSlider from "../../components/avatar/MeasurementSlider";
import ColorSelector from "../../components/avatar/ColorSelector";
import GenderOptionCard from "../../components/profile/GenderOptionCard";
import AvatarTabs from "../../components/avatar/AvatarTabs";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import CustomBackButton from "../../components/common/CustomBackButton";
import { IMAGES } from "../../constants/images/images";
import { generateAvatar } from "../../api/avatar_services/avatarService";
import { ROUTES, SOURCE } from "../../navigation/routes";

const subStyles = StyleSheet.create({
  tabContent: {
    paddingTop: 8,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Roboto_600SemiBold",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  genderRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
});

const skinTones = (t) => [
  { id: "very-light", color: "#F6DFC8", label: t("avatar.create.skinTones.veryLight") },
  { id: "light", color: "#E5C39B", label: t("avatar.create.skinTones.light") },
  { id: "medium", color: "#D2A46A", label: t("avatar.create.skinTones.medium") },
  { id: "tan", color: "#B88349", label: t("avatar.create.skinTones.tan") },
  { id: "brown", color: "#8E5A2A", label: t("avatar.create.skinTones.brown") },
  { id: "dark", color: "#4D2C12", label: t("avatar.create.skinTones.dark") },
];

const hairColors = (t) => [
  { id: "black", color: "#000000", label: t("avatar.create.hairColors.black") },
  { id: "dark-brown", color: "#3A2414", label: t("avatar.create.hairColors.darkBrown") },
  { id: "brown", color: "#6B4423", label: t("avatar.create.hairColors.brown") },
  { id: "light-brown", color: "#A26B3D", label: t("avatar.create.hairColors.lightBrown") },
  { id: "blonde", color: "#E6C27A", label: t("avatar.create.hairColors.blonde") },
  { id: "red", color: "#A53A2A", label: t("avatar.create.hairColors.red") },
];

const GeneralInfoTab = ({ age, gender, onUpdate }) => {
  const { t } = useTranslation();
  return (
    <View style={subStyles.tabContent}>
      <MeasurementSlider
        label={t("avatar.create.age")}
        value={age}
        min={10}
        max={100}
        step={1}
        unit={t("avatar.create.yrs")}
        onChange={(v) => onUpdate("age", v)}
      />
      <Text style={subStyles.genderLabel}>{t("avatar.create.gender")}</Text>
      <View style={subStyles.genderRow}>
        <GenderOptionCard
          gender={t("avatar.create.male")}
          selected={gender === "Male"}
          onPress={() => onUpdate("gender", "Male")}
        />
        <GenderOptionCard
          gender={t("avatar.create.female")}
          selected={gender === "Female"}
          onPress={() => onUpdate("gender", "Female")}
        />
      </View>
    </View>
  );
};

const MeasurementsTab = ({ height, weight, onUpdate }) => {
  const { t } = useTranslation();
  return (
    <View style={subStyles.tabContent}>
      <MeasurementSlider
        label={t("avatar.create.height")}
        value={height}
        min={120}
        max={220}
        step={1}
        unit={t("avatar.create.cm")}
        onChange={(v) => onUpdate("height", v)}
      />
      <MeasurementSlider
        label={t("avatar.create.weight")}
        value={weight}
        min={30}
        max={200}
        step={1}
        unit={t("avatar.create.kg")}
        onChange={(v) => onUpdate("weight", v)}
      />
    </View>
  );
};

const SkinToneTab = ({ skinTone, onUpdate }) => {
  const { t } = useTranslation();
  return (
    <View style={subStyles.tabContent}>
      <ColorSelector
        label={t("avatar.create.selectSkinTone")}
        options={skinTones(t)}
        selectedId={skinTone}
        onSelect={(v) => onUpdate("skinTone", v)}
      />
    </View>
  );
};

const HairColorTab = ({ hairColor, onUpdate }) => {
  const { t } = useTranslation();
  return (
    <View style={subStyles.tabContent}>
      <ColorSelector
        label={t("avatar.create.selectHairColor")}
        options={hairColors(t)}
        selectedId={hairColor}
        onSelect={(v) => onUpdate("hairColor", v)}
      />
    </View>
  );
};

const tabs = (t) => [
  { key: "general", label: t("avatar.create.general"), component: GeneralInfoTab },
  { key: "measurements", label: t("avatar.create.measurements"), component: MeasurementsTab },
  { key: "skinTone", label: t("avatar.create.skinToneTab"), component: SkinToneTab },
  { key: "hairColor", label: t("avatar.create.hairColorTab"), component: HairColorTab },
];

const CreateAvatarScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const tabList = tabs(t);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const totalSteps = tabList.length;

  const [avatarProfile, setAvatarProfile] = useState({
    height: 175,
    weight: 70,
    age: 25,
    gender: null,
    skinTone: "",
    hairColor: "",
  });

  const updateProfile = useCallback((key, value) => {
    setAvatarProfile((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!avatarProfile.gender || !avatarProfile.skinTone || !avatarProfile.hairColor) {
      Alert.alert(t("avatar.create.missingFields"), t("avatar.create.missingFieldsMessage"));
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        age: `${avatarProfile.age}y`,
        height: `${avatarProfile.height}cm`,
        weight: `${avatarProfile.weight}kg`,
        gender: avatarProfile.gender.toLowerCase(),
        skin_tone: avatarProfile.skinTone,
        face_shape: "oval",
        hair_color: avatarProfile.hairColor,
        eye_color: "brown eyes",
        beard_style: "clean shave",
        facial_expression: "smiling",
      };
      const response = await generateAvatar(payload);
      console.log("Avatar API Response:", JSON.stringify(response, null, 2));
      navigation.navigate(ROUTES.TRY_ON_SCREEN, { avatarImage: response, source: SOURCE.HOME });
    } catch (error) {
      console.error("Avatar generation failed:", error.response?.data || error.message);
      Alert.alert(t("common.error"), error.response?.data?.message || t("avatar.create.failed"));
    } finally {
      setLoading(false);
    }
  }, [avatarProfile, navigation, t]);

  const tabKeys = tabList.map((t) => t.key);
  const activeTab = tabList[currentStep];
  const ActiveComponent = activeTab.component;
  const isLastStep = currentStep === totalSteps - 1;

  const stepValidations = [
    () => avatarProfile.gender !== null,
    () => true,
    () => avatarProfile.skinTone !== "",
    () => avatarProfile.hairColor !== "",
  ];
  const canProceed = stepValidations[currentStep]();

  const handleTabChange = (key) => {
    const index = tabKeys.indexOf(key);
    if (index !== -1) {
      setCurrentStep(index);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      if (canProceed && !loading) handleGenerate();
      return;
    }
    if (!canProceed) return;
    setCurrentStep((prev) => prev + 1);
  };

  const tabsWithProps = tabList.map((tab) => ({
    ...tab,
    label: t(tab.labelKey),
    props: {
      ...avatarProfile,
      onUpdate: updateProfile,
    },
  }));

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
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Roboto_700Bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  stepLabel: {
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: 16,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderDefault,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bodySection: {
    flex: 1,
  },
  buttonWrap: {
    paddingBottom: 30,
    paddingTop: 12,
  },
  scrollContainer: {
  flexGrow: 1,
},
}), [themeVersion]);

  return (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.container}>
        <CustomBackButton onPress={() => navigation.goBack()} />

        <Text style={styles.title}>{t('tryOn.createAvatar.title')}</Text>
        <Text style={styles.stepLabel}>
          {t("avatar.create.step", { current: currentStep + 1, total: totalSteps })}
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / totalSteps) * 100}%` },
            ]}
          />
        </View>

        <View style={styles.bodySection}>
          <AvatarPreview image={IMAGES.AVATAR} />

          <AvatarTabs
            tabs={tabsWithProps}
            activeKey={tabKeys[currentStep]}
            onTabChange={handleTabChange}
            hideContent
          />

          <ActiveComponent {...tabsWithProps[currentStep].props} />
        </View>

        <View style={styles.buttonWrap}>
          <CustomizeAppButtonFilled
            label={isLastStep ? t("avatar.create.generateAvatar") : t("avatar.create.next")}
            onPress={handleNext}
            disabled={!canProceed}
            loading={loading}
            backgroundColor={Colors.primary}
          />
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);
};

export default CreateAvatarScreen;

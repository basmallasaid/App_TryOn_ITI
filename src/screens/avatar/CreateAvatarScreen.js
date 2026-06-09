import { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import Typography from "../../constants/theme/typography";
import AvatarPreview from "../../components/avatar/AvatarPreview";
import AvatarTabs from "../../components/avatar/AvatarTabs";
import MeasurementSlider from "../../components/avatar/MeasurementSlider";
import ColorSelector from "../../components/avatar/ColorSelector";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";

const skinTones = [
  { id: "very-light", color: "#F6DFC8", label: "Very Light" },
  { id: "light", color: "#E5C39B", label: "Light" },
  { id: "medium", color: "#D2A46A", label: "Medium" },
  { id: "tan", color: "#B88349", label: "Tan" },
  { id: "brown", color: "#8E5A2A", label: "Brown" },
  { id: "dark", color: "#4D2C12", label: "Dark" },
];

const hairColors = [
  { id: "black", color: "#000000", label: "Black" },
  { id: "dark-brown", color: "#3A2414", label: "Dark Brown" },
  { id: "brown", color: "#6B4423", label: "Brown" },
  { id: "light-brown", color: "#A26B3D", label: "Light Brown" },
  { id: "blonde", color: "#E6C27A", label: "Blonde" },
  { id: "red", color: "#A53A2A", label: "Red" },
];

const MeasurementsTab = ({ height, weight, onUpdate }) => (
  <View style={styles.tabContent}>
    <MeasurementSlider
      label="Height"
      value={height}
      min={120}
      max={220}
      step={1}
      unit="cm"
      onChange={(v) => onUpdate("height", v)}
    />
    <MeasurementSlider
      label="Weight"
      value={weight}
      min={30}
      max={200}
      step={1}
      unit="kg"
      onChange={(v) => onUpdate("weight", v)}
    />
  </View>
);

const SkinToneTab = ({ skinTone, onUpdate }) => (
  <View style={styles.tabContent}>
    <ColorSelector
      label="Select your skin tone"
      options={skinTones}
      selectedId={skinTone}
      onSelect={(v) => onUpdate("skinTone", v)}
    />
  </View>
);

const HairColorTab = ({ hairColor, onUpdate }) => (
  <View style={styles.tabContent}>
    <ColorSelector
      label="Select your hair color"
      options={hairColors}
      selectedId={hairColor}
      onSelect={(v) => onUpdate("hairColor", v)}
    />
  </View>
);

const tabConfig = [
  { key: "measurements", label: "Measurements", component: MeasurementsTab },
  { key: "skinTone", label: "Skin Tone", component: SkinToneTab },
  { key: "hairColor", label: "Hair Color", component: HairColorTab },
];

const CreateAvatarScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const [avatarProfile, setAvatarProfile] = useState({
    height: 175,
    weight: 70,
    skinTone: "",
    hairColor: "",
  });

  const updateProfile = useCallback((key, value) => {
    setAvatarProfile((prev) => ({ ...prev, [key]: value }));
  }, []);

  const tabs = tabConfig.map((tab) => ({
    ...tab,
    props: {
      height: avatarProfile.height,
      weight: avatarProfile.weight,
      skinTone: avatarProfile.skinTone,
      hairColor: avatarProfile.hairColor,
      onUpdate: updateProfile,
    },
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.iconGray} />
        </TouchableOpacity>

        <Text style={styles.title}>{t('tryOn.createAvatar.title')}</Text>

        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>
            {t('tryOn.createAvatar.step')}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <AvatarPreview />

          <AvatarTabs tabs={tabs} />
        </ScrollView>

        <View style={styles.buttonWrap}>
          <CustomizeAppButtonFilled
            label={t('tryOn.createAvatar.create')}
            onPress={() => {}}
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
    marginBottom: 8,
  },
  title: {
    ...Typography.screenTitleLarge,
    marginBottom: 12,
  },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E9EBEE",
    overflow: "hidden",
  },
  progressFill: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: "Roboto_400Regular",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tabContent: {
    paddingTop: 8,
  },
  buttonWrap: {
    paddingBottom: 30,
    paddingTop: 12,
  },
});

export default CreateAvatarScreen;

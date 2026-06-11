import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Rect, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import Colors from "../../constants/theme/colors";
import Typography from "../../constants/theme/typography";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import PhotoInstructionCard from "../../components/tryOn/PhotoInstructionCard";
import { openGallery } from "../../utils/cameraAccess";

const instructions = [
  {
    key: "fullBody",
    mainIconName: "human",
    iconBgColor: "#DBE8FF",
    titleKey: "tryOn.uploadPhoto.instructions.fullBody.title",
    descKey: "tryOn.uploadPhoto.instructions.fullBody.description",
  },
  {
    key: "goodLighting",
    mainIconName: "weather-sunny",
    iconBgColor: "#FFF3DB",
    titleKey: "tryOn.uploadPhoto.instructions.goodLighting.title",
    descKey: "tryOn.uploadPhoto.instructions.goodLighting.description",
  },
  {
    key: "faceCamera",
    mainIconName: "camera",
    iconBgColor: "#E8F0FE",
    titleKey: "tryOn.uploadPhoto.instructions.faceCamera.title",
    descKey: "tryOn.uploadPhoto.instructions.faceCamera.description",
  },
  {
    key: "cleanWall",
    mainIconName: "image-outline",
    iconBgColor: "#F0EBFF",
    titleKey: "tryOn.uploadPhoto.instructions.cleanWall.title",
    descKey: "tryOn.uploadPhoto.instructions.cleanWall.description",
  },
];

const UploadPhotoScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const [selectedImage, setSelectedImage] = useState(null);
  const productImage = route?.params?.productImage;
  const isStoreFlow = !!productImage;

  const handleUploadPress = async () => {
    if (selectedImage) {
      if (isStoreFlow) {
        navigation.navigate("TryOnResult", { productImage, photoUri: selectedImage });
      } else {
        navigation.navigate("TryOn", { photoUri: selectedImage });
      }
      return;
    }
    const result = await openGallery();
    if (result && !result.canceled) {
      setSelectedImage(result.assets[0].uri);
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>
            {t("tryOn.uploadPhoto.title")}
          </Text>
          <Text style={styles.subtitle}>
            {t("tryOn.uploadPhoto.subtitle")}
          </Text>

          <TouchableOpacity
            style={styles.uploadBoxContainer}
            activeOpacity={0.8}
            onPress={handleUploadPress}
            onLayout={(e) => setLayout(e.nativeEvent.layout)}
          >
            {layout.width > 0 && (
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor={Colors.error} />
                    <Stop offset="50%" stopColor={Colors.primary} />
                    <Stop offset="100%" stopColor={Colors.success} />
                  </SvgGradient>
                </Defs>
                <Rect
                  x="1.5"
                  y="1.5"
                  width={layout.width - 3}
                  height={layout.height - 3}
                  rx="24"
                  ry="24"
                  stroke="url(#grad)"
                  strokeWidth="3"
                  strokeDasharray="12, 8"
                  fill="none"
                />
              </Svg>
            )}
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} resizeMode="contain" />
            ) : (
              <View style={styles.uploadInnerContent}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={48}
                  color={Colors.textMuted}
                />
                <Text style={styles.uploadText}>
                  {t("tryOn.uploadPhoto.uploadLabel")}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.grid}>
            {instructions.map((item) => (
              <PhotoInstructionCard
                key={item.key}
                title={t(item.titleKey)}
                sub={t(item.descKey)}
                mainIconName={item.mainIconName}
                iconBgColor={item.iconBgColor}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonWrap}>
          <CustomizeAppButtonFilled
            label={t("tryOn.uploadPhoto.goToTryOn")}
            onPress={() => {
              if (isStoreFlow) {
                navigation.navigate("TryOnResult", { productImage, photoUri: selectedImage });
              } else {
                navigation.navigate("TryOn", { photoUri: selectedImage });
              }
            }}
            backgroundColor={Colors.primary}
            disabled={!selectedImage}
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
  scrollContent: {
    paddingBottom: 100,
  },
  title: {
    ...Typography.screenTitleLarge,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  uploadBoxContainer: {
    width: "100%",
    height: 220,
    marginBottom: 28,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  uploadInnerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  uploadText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  buttonWrap: {
    paddingBottom: 30,
    paddingTop: 12,
  },
});

export default UploadPhotoScreen;

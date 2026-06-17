import React, { useState, useRef, useCallback } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Svg, Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import CustomBackButton from "../../components/common/CustomBackButton";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { useWardrobe } from "../../context/WardrobeContext";
import { useFeedback } from "../../context/FeedbackContext";
import { analyzeRecycle, generateRecycleIdea } from "../../api/recycle_services/recycleService";
import SourceTab from "../../components/recycle/SourceTab";
import DesignIdeaCard from "../../components/recycle/DesignIdeaCard";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import SparkleIcon from "../../components/recycle/SparkleIcon";
import { ROUTES } from "../../navigation/routes";
import GradientBorder from "../../components/recycle/GradientBorder";
import DashedGradientBorder from "../../components/recycle/DashedGradientBorder";
import { translateDesignIdea } from "../../utils/dynamicTranslator";
import { getUserFriendlyErrorMessage } from "../../utils/errorMessages";
import i18n from "../../localization/i18n";

const MAX_ITEMS = 2;

export default function RecycleScreen({ navigation }) {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const { items: wardrobeItems } = useWardrobe();
  const { showFeedback } = useFeedback();

  const [activeTab, setActiveTab] = useState("Wardrobe");
  const [selectedItems, setSelectedItems] = useState([]);
  const [capturedImages, setCapturedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [apiError, setApiError] = useState(null);

  const scrollViewRef = useRef(null);
  const ideasSectionRef = useRef(null);
  const generateSectionRef = useRef(null);

  const scrollToRef = (ref) => {
    setTimeout(() => {
      ref.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current.scrollTo({ y: y - 20, animated: true });
        },
        () => {}
      );
    }, 100);
  };

  const hasAnalysisProgress = ideas.length > 0 || sessionId !== null;

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;

    if (hasAnalysisProgress) {
      Alert.alert(
        t("recycle.switchMethodTitle"),
        t("recycle.switchMethodMessage"),
        [
          { text: t("recycle.cancel"), style: "cancel" },
          {
            text: t("recycle.continue"),
            style: "destructive",
            onPress: () => {
              resetAnalysisState();
              setActiveTab(newTab);
            },
          },
        ]
      );
    } else {
      setActiveTab(newTab);
    }
  };

  const resetAnalysisState = () => {
    setIdeas([]);
    setSessionId(null);
    setSelectedIdeaId(null);
    setApiError(null);
    setSelectedItems([]);
    setCapturedImages([]);
    setUploadedImages([]);
  };

  const toggleWardrobeItem = (id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= MAX_ITEMS) return prev;
      return [...prev, id];
    });
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("recycle.permissionNeeded"), t("recycle.cameraPermission"));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (capturedImages.length >= MAX_ITEMS) {
      Alert.alert(t("recycle.maxReached"), t("recycle.maxReachedMessage", { max: MAX_ITEMS }));
      return;
    }
    setCapturedImages((prev) => [...prev, { uri: asset.uri, asset }]);
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("recycle.permissionNeeded"), t("recycle.galleryPermission"));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (uploadedImages.length >= MAX_ITEMS) {
      Alert.alert(t("recycle.maxReached"), t("recycle.maxReachedMessage", { max: MAX_ITEMS }));
      return;
    }
    setUploadedImages((prev) => [...prev, { uri: asset.uri, asset }]);
  };

  const removeCapturedImage = (index) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getActiveImages = () => {
    if (activeTab === "Wardrobe") {
      return selectedItems
        .map((id) => wardrobeItems.find((item) => item._id === id))
        .filter(Boolean);
    }
    if (activeTab === "Camera") return capturedImages;
    return uploadedImages;
  };

  const activeImages = getActiveImages();
  const canAnalyze = activeImages.length > 0 && !analyzing;

  const handleAnalyze = async () => {
    setApiError(null);
    setIdeas([]);
    setSessionId(null);
    setSelectedIdeaId(null);
    setAnalyzing(true);

    try {
      const formData = new FormData();

      if (activeTab === "Wardrobe") {
        for (const id of selectedItems) {
          const item = wardrobeItems.find((w) => w._id === id);
          if (item?.image) {
            let localUri = item.image;
            if (item.image.startsWith("http")) {
              const downloadResult = await FileSystem.downloadAsync(
                item.image,
                FileSystem.cacheDirectory + `recycle_${Date.now()}.jpg`
              );
              localUri = downloadResult.uri;
            }
            const compressed = await ImageManipulator.manipulateAsync(
              localUri,
              [{ resize: { width: 800 } }],
              { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );
            const filename = compressed.uri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : "image/jpeg";
            formData.append("images", {
              uri: Platform.OS === "android" ? compressed.uri : compressed.uri.replace("file://", ""),
              name: filename,
              type,
            });
          }
        }
      } else {
        const sourceImages = activeTab === "Camera" ? capturedImages : uploadedImages;
        for (const img of sourceImages) {
          const compressed = await ImageManipulator.manipulateAsync(
            img.uri,
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          const filename = compressed.uri.split("/").pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : "image/jpeg";
          formData.append("images", {
            uri: Platform.OS === "android" ? compressed.uri : compressed.uri.replace("file://", ""),
            name: filename,
            type,
          });
        }
      }

      const result = await analyzeRecycle(formData);

      if (result.success) {
        setSessionId(result.session_id);
        let ideasList = result.ideas || [];
        if (i18n.language === 'ar') {
          ideasList = await Promise.all(ideasList.map(idea => translateDesignIdea(idea, 'ar')));
        }
        setIdeas(ideasList);
        scrollToRef(ideasSectionRef);
      } else {
        const errorMsg = getUserFriendlyErrorMessage({ response: { data: { error: result.error } } }, t);
        setApiError(errorMsg);
        showFeedback({ type: "error", title: t("recycle.analysisFailed"), message: errorMsg });
      }
    } catch (e) {
      const errorMsg = getUserFriendlyErrorMessage(e, t);
      setApiError(errorMsg);
      showFeedback({ type: "error", title: t("recycle.analysisFailed"), message: errorMsg });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedIdeaId || !sessionId) return;
    setGenerating(true);
    setApiError(null);

    try {
      const result = await generateRecycleIdea(sessionId, selectedIdeaId, "qwen-image-2.0-pro");

      if (result.success) {
        const selectedIdea = ideas.find((idea) => idea.id === selectedIdeaId);
        const displayTitle = i18n.language === 'ar' && selectedIdea?.title_ar
          ? selectedIdea.title_ar
          : selectedIdea?.title || t("recommendation.generatedDesign");
        const displayDesc = i18n.language === 'ar' && selectedIdea?.design_description_ar
          ? selectedIdea.design_description_ar
          : selectedIdea?.design_description || "";

        navigation.navigate(ROUTES.RECYCLE_RESULT, {
          resultImageUri: result.image_url,
          designTitle: displayTitle,
          designTitleAr: selectedIdea?.title_ar || null,
          designDescription: displayDesc,
          designDescriptionAr: selectedIdea?.design_description_ar || null,
          sessionId,
          ideaId: selectedIdeaId,
        });
      } else {
        const errorMsg = getUserFriendlyErrorMessage({ response: { data: { error: result.error } } }, t);
        setApiError(errorMsg);
        showFeedback({ type: "error", title: t("recycle.generationFailed"), message: errorMsg });
      }
    } catch (e) {
      const errorMsg = getUserFriendlyErrorMessage(e, t);
      setApiError(errorMsg);
      showFeedback({ type: "error", title: t("recycle.generationFailed"), message: errorMsg });
    } finally {
      setGenerating(false);
    }
  };

  const selectedIdea = ideas.find((idea) => idea.id === selectedIdeaId);
  const canGenerate = selectedIdeaId && sessionId && !generating;

  const handleSelectIdea = (ideaId) => {
    setSelectedIdeaId(ideaId);
    scrollToRef(generateSectionRef);
  };

  const renderWardrobeTab = () => (
    <View>
      {wardrobeItems.length === 0 ? (
        <View style={styles.emptyWrap}>
          <MaterialCommunityIcons name="hanger" size={48} color={Colors.iconGray} />
          <Text style={styles.emptyText}>{t("recycle.wardrobeEmpty")}</Text>
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("recycle.activeWardrobe")}</Text>
          </View>
          <FlatList
            horizontal
            data={wardrobeItems}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.wardrobeList}
            renderItem={({ item }) => {
              const isSelected = selectedItems.includes(item._id);
              const isDisabled = selectedItems.length >= MAX_ITEMS && !isSelected;
              return (
                <TouchableOpacity
                  style={[styles.wardrobeItemWrap, isDisabled && { opacity: 0.5 }]}
                  onPress={() => {
                    if (isDisabled) return;
                    toggleWardrobeItem(item._id);
                  }}
                  activeOpacity={isDisabled ? 1 : 0.8}
                >
                  {isSelected ? (
                    <GradientBorder width={100} height={120} borderRadius={12}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.wardrobeItemImage}
                        resizeMode="cover"
                      />
                      <View style={styles.wardrobeCheck}>
                        <Ionicons name="checkmark" size={14} color={Colors.textInverse} />
                      </View>
                    </GradientBorder>
                  ) : (
                    <View style={styles.wardrobeItemCard}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.wardrobeItemImage}
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  <Text style={styles.wardrobeItemName} numberOfLines={1}>
                    {item.name || t("recommendation.untitled")}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}
    </View>
  );

  const renderCameraTab = () => (
    <View style={styles.cameraSection}>
      {capturedImages.length === 0 ? (
        <TouchableOpacity onPress={handleCamera}>
          <DashedGradientBorder width="100%" height={200}>
            <View style={styles.cameraIconCircle}>
              <Ionicons name="camera" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.cameraPlaceholderText}>{t("recycle.openCamera")}</Text>
          </DashedGradientBorder>
        </TouchableOpacity>
      ) : (
        <View style={styles.galleryRow}>
          {capturedImages.map((item, index) => (
            <View key={index} style={styles.galleryItem}>
              <Image source={{ uri: item.uri }} style={styles.galleryItemImage} resizeMode="cover" />
              <TouchableOpacity
                style={styles.galleryRemoveBtn}
                onPress={() => removeCapturedImage(index)}
              >
                <Ionicons name="close" size={14} color={Colors.textInverse} />
              </TouchableOpacity>
            </View>
          ))}
          {capturedImages.length < MAX_ITEMS && (
            <View style={styles.galleryItem}>
              <DashedGradientBorder width="100%" height={160} borderRadius={12}>
                <TouchableOpacity onPress={handleCamera} style={styles.compactUploadInner}>
                  <View style={styles.cameraIconCircle}>
                    <Ionicons name="camera" size={24} color={Colors.primary} />
                  </View>
                  <Text style={styles.compactUploadText}>{t("recycle.openCamera")}</Text>
                </TouchableOpacity>
              </DashedGradientBorder>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderGalleryTab = () => (
    <View style={styles.cameraSection}>
      {uploadedImages.length === 0 ? (
        <TouchableOpacity onPress={handleGallery}>
          <DashedGradientBorder width="100%" height={200}>
            <View style={styles.cameraIconCircle}>
              <Svg width={33} height={24} viewBox="0 0 33 24" fill="none">
                <Path d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9062 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5C28.725 10.7 30.1562 11.4437 31.2938 12.7312C32.4313 14.0188 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3438 3.73125 18.575 3 16.5 3C14.425 3 12.6562 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25Z" fill={Colors.disabled} />
              </Svg>
            </View>
            <Text style={styles.cameraPlaceholderText}>{t("recycle.uploadFromGallery")}</Text>
          </DashedGradientBorder>
        </TouchableOpacity>
      ) : (
        <View style={styles.galleryRow}>
          {uploadedImages.map((item, index) => (
            <View key={index} style={styles.galleryItem}>
              <Image source={{ uri: item.uri }} style={styles.galleryItemImage} resizeMode="cover" />
              <TouchableOpacity
                style={styles.galleryRemoveBtn}
                onPress={() => removeUploadedImage(index)}
              >
                <Ionicons name="close" size={14} color={Colors.textInverse} />
              </TouchableOpacity>
            </View>
          ))}
          {uploadedImages.length < MAX_ITEMS && (
            <View style={styles.galleryItem}>
              <DashedGradientBorder width="100%" height={160} borderRadius={12}>
                <TouchableOpacity onPress={handleGallery} style={styles.compactUploadInner}>
                  <View style={styles.cameraIconCircle}>
                    <Svg width={24} height={18} viewBox="0 0 33 24" fill="none">
                      <Path d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9062 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5C28.725 10.7 30.1562 11.4437 31.2938 12.7312C32.4313 14.0188 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3438 3.73125 18.575 3 16.5 3C14.425 3 12.6562 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25Z" fill={Colors.disabled} />
                     </Svg>
                   </View>
                   <Text style={styles.compactUploadText}>{t("recycle.uploadFromGallery")}</Text>
                </TouchableOpacity>
              </DashedGradientBorder>
            </View>
          )}
        </View>
      )}
    </View>
  );
  const styles = React.useMemo(() => createStyles(), [themeVersion]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{t("recycle.title")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.subtitle}>{t("recycle.subtitle")}</Text>

        {activeTab === "Wardrobe" && renderWardrobeTab()}
        {activeTab === "Camera" && renderCameraTab()}
        {activeTab === "Gallery" && renderGalleryTab()}

        <View style={styles.tabsRow}>
          <SourceTab
            label={t("recycle.tabs.wardrobe")}
            iconName="shirt-outline"
            isActive={activeTab === "Wardrobe"}
            onPress={() => handleTabChange("Wardrobe")}
          />
          <SourceTab
            label={t("recycle.tabs.camera")}
            iconName="camera-outline"
            isActive={activeTab === "Camera"}
            onPress={() => handleTabChange("Camera")}
          />
          <SourceTab
            label={t("recycle.tabs.gallery")}
            iconName="images-outline"
            isActive={activeTab === "Gallery"}
            onPress={() => handleTabChange("Gallery")}
          />
        </View>

        {activeTab !== "Wardrobe" && (
          <View style={styles.itemsHeader}>
            <Text style={styles.itemsHeaderText}>
              {activeImages.length === 0
                ? t("recycle.noItemsCount")
                : t("recycle.itemsCount", { count: activeImages.length })}
            </Text>
          </View>
        )}

        {activeImages.length === 0 && (
          <View style={styles.emptyStateBox}>
            <View style={styles.emptyStateIconCircle}>
              <Svg width={24} height={20} viewBox="0 0 20 16" fill="none">
                <Path d="M1 16C0.716667 16 0.479167 15.9042 0.2875 15.7125C0.0958333 15.5208 0 15.2833 0 15C0 14.8333 0.0333333 14.6792 0.1 14.5375C0.166667 14.3958 0.266667 14.2833 0.4 14.2L9 7.75V6C9 5.71667 9.1 5.47917 9.3 5.2875C9.5 5.09583 9.74167 5 10.025 5C10.4417 5 10.7917 4.85 11.075 4.55C11.3583 4.25 11.5 3.89167 11.5 3.475C11.5 3.05833 11.3542 2.70833 11.0625 2.425C10.7708 2.14167 10.4167 2 10 2C9.58333 2 9.22917 2.14583 8.9375 2.4375C8.64583 2.72917 8.5 3.08333 8.5 3.5H6.5C6.5 2.53333 6.84167 1.70833 7.525 1.025C8.20833 0.341667 9.03333 0 10 0C10.9667 0 11.7917 0.3375 12.475 1.0125C13.1583 1.6875 13.5 2.50833 13.5 3.475C13.5 4.25833 13.2708 4.95833 12.8125 5.575C12.3542 6.19167 11.75 6.61667 11 6.85V7.75L19.6 14.2C19.7333 14.2833 19.8333 14.3958 19.9 14.5375C19.9667 14.6792 20 14.8333 20 15C20 15.2833 19.9042 15.5208 19.7125 15.7125C19.5208 15.9042 19.2833 16 19 16H1ZM4 14H16L10 9.5L4 14Z" fill={Colors.textPrimary} />
              </Svg>
            </View>
            <View style={styles.emptyStateTextWrap}>
              <Text style={styles.emptyStateTitle}>{t("recycle.noUploadsTitle")}</Text>
              <Text style={styles.emptyStateSub}>{t("recycle.noUploadsSub")}</Text>
            </View>
          </View>
        )}

        {activeImages.length === 1 && (
          <View style={styles.emptyStateBox}>
            <View style={styles.emptyStateIconCircle}>
              <Svg width={24} height={20} viewBox="0 0 20 16" fill="none">
                <Path d="M1 16C0.716667 16 0.479167 15.9042 0.2875 15.7125C0.0958333 15.5208 0 15.2833 0 15C0 14.8333 0.0333333 14.6792 0.1 14.5375C0.166667 14.3958 0.266667 14.2833 0.4 14.2L9 7.75V6C9 5.71667 9.1 5.47917 9.3 5.2875C9.5 5.09583 9.74167 5 10.025 5C10.4417 5 10.7917 4.85 11.075 4.55C11.3583 4.25 11.5 3.89167 11.5 3.475C11.5 3.05833 11.3542 2.70833 11.0625 2.425C10.7708 2.14167 10.4167 2 10 2C9.58333 2 9.22917 2.14583 8.9375 2.4375C8.64583 2.72917 8.5 3.08333 8.5 3.5H6.5C6.5 2.53333 6.84167 1.70833 7.525 1.025C8.20833 0.341667 9.03333 0 10 0C10.9667 0 11.7917 0.3375 12.475 1.0125C13.1583 1.6875 13.5 2.50833 13.5 3.475C13.5 4.25833 13.2708 4.95833 12.8125 5.575C12.3542 6.19167 11.75 6.61667 11 6.85V7.75L19.6 14.2C19.7333 14.2833 19.8333 14.3958 19.9 14.5375C19.9667 14.6792 20 14.8333 20 15C20 15.2833 19.9042 15.5208 19.7125 15.7125C19.5208 15.9042 19.2833 16 19 16H1ZM4 14H16L10 9.5L4 14Z" fill={Colors.textPrimary} />
              </Svg>
            </View>
            <View style={styles.emptyStateTextWrap}>
              <Text style={styles.emptyStateTitle}>{t("recycle.oneItemTitle")}</Text>
              <Text style={styles.emptyStateSub}>{t("recycle.oneItemSub")}</Text>
            </View>
          </View>
        )}

        {activeImages.length === 2 && (
          <View style={styles.emptyStateBox}>
            <View style={styles.emptyStateIconCircle}>
              <Svg width={24} height={20} viewBox="0 0 20 16" fill="none">
                <Path d="M1 16C0.716667 16 0.479167 15.9042 0.2875 15.7125C0.0958333 15.5208 0 15.2833 0 15C0 14.8333 0.0333333 14.6792 0.1 14.5375C0.166667 14.3958 0.266667 14.2833 0.4 14.2L9 7.75V6C9 5.71667 9.1 5.47917 9.3 5.2875C9.5 5.09583 9.74167 5 10.025 5C10.4417 5 10.7917 4.85 11.075 4.55C11.3583 4.25 11.5 3.89167 11.5 3.475C11.5 3.05833 11.3542 2.70833 11.0625 2.425C10.7708 2.14167 10.4167 2 10 2C9.58333 2 9.22917 2.14583 8.9375 2.4375C8.64583 2.72917 8.5 3.08333 8.5 3.5H6.5C6.5 2.53333 6.84167 1.70833 7.525 1.025C8.20833 0.341667 9.03333 0 10 0C10.9667 0 11.7917 0.3375 12.475 1.0125C13.1583 1.6875 13.5 2.50833 13.5 3.475C13.5 4.25833 13.2708 4.95833 12.8125 5.575C12.3542 6.19167 11.75 6.61667 11 6.85V7.75L19.6 14.2C19.7333 14.2833 19.8333 14.3958 19.9 14.5375C19.9667 14.6792 20 14.8333 20 15C20 15.2833 19.9042 15.5208 19.7125 15.7125C19.5208 15.9042 19.2833 16 19 16H1ZM4 14H16L10 9.5L4 14Z" fill={Colors.textPrimary} />
              </Svg>
            </View>
            <View style={styles.emptyStateTextWrap}>
              <Text style={styles.emptyStateTitle}>{t("recycle.twoItemsTitle")}</Text>
              <Text style={styles.emptyStateSub}>{t("recycle.twoItemsSub")}</Text>
            </View>
          </View>
        )}

        {selectedItems.length > 0 && activeTab === "Wardrobe" && (
          <Text style={styles.selectedCount}>{t("recycle.selectedCount", { count: selectedItems.length, max: MAX_ITEMS })}</Text>
        )}

        <View style={styles.analyzeSection}>
          <CustomizeAppButtonFilled
            label={analyzing ? t("recycle.analyzing") : t("recycle.discoverIdeas")}
            onPress={handleAnalyze}
            disabled={!canAnalyze}
            loading={analyzing}
            backgroundColor={Colors.primary}
            icon={!analyzing ? <SparkleIcon size={18} color={Colors.textInverse} /> : null}
          />
        </View>

        {ideas.length > 0 && (
          <View ref={ideasSectionRef} style={styles.ideasSection}>
            <Text style={styles.ideasTitle}>{t("recycle.designIdeas")}</Text>
            <Text style={styles.ideasSubtitle}>{t("recycle.ideasSubtitle")}</Text>
            <FlatList
              horizontal
              data={ideas}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ideasList}
              renderItem={({ item, index }) => (
                <DesignIdeaCard
                  idea={item}
                  index={index}
                  isSelected={selectedIdeaId === item.id}
                  onSelect={() => handleSelectIdea(item.id)}
                />
              )}
            />
          </View>
        )}

        {selectedIdeaId && (
          <View ref={generateSectionRef} style={styles.generateSection}>
            <CustomizeAppButtonFilled
              label={generating ? t("recycle.generating") : t("recycle.generateDesign")}
              onPress={handleGenerate}
              disabled={!canGenerate}
              loading={generating}
              backgroundColor={Colors.success}
              icon={!generating ? <SparkleIcon size={18} color={Colors.textInverse} /> : null}
            />
          </View>
        )}

        <LoadingOverlay visible={analyzing || generating} type="recycle" />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = () => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    fontSize: 20,
    color: Colors.textPrimary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 16,
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Roboto_600SemiBold",
    fontWeight: "600",
    fontSize: 15,
    color: Colors.textPrimary,
  },
  seeAll: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
  },
  wardrobeList: {
    paddingBottom: 8,
    gap: 12,
  },
  wardrobeItemWrap: {
    width: 100,
    alignItems: "center",
  },
  wardrobeItemCard: {
    width: 100,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.white,
    overflow: "hidden",
    position: "relative",
  },
  wardrobeItemImage: {
    width: "100%",
    height: "100%",
  },
  wardrobeCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  wardrobeItemName: {
    fontFamily: "Roboto_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },
  cameraSection: {
    marginTop: 8,
  },
  cameraPlaceholder: {
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    borderStyle: "dashed",
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  cameraIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraPlaceholderText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: Colors.textMuted,
  },
  galleryRow: {
    flexDirection: "row",
    gap: 12,
  },
  galleryItem: {
    flex: 1,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  galleryItemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  galleryRemoveBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  compactUploadInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  compactUploadText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 11,
    color: Colors.primary,
  },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  addMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    backgroundColor: Colors.backgroundColor,
  },
  addMoreText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 13,
    color: Colors.primary,
  },
  emptyStateBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.borderDefault,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  itemsHeader: {
    marginTop: 16,
  },
  itemsHeaderText: {
    fontFamily: "Roboto_600SemiBold",
    fontWeight: "600",
    fontSize: 15,
    color: Colors.textPrimary,
  },
  emptyStateIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateTextWrap: {
    flex: 1,
  },
  emptyStateTitle: {
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  emptyStateSub: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  selectedCount: {
    fontFamily: "Roboto_500Medium",
    fontSize: 13,
    color: Colors.primary,
    marginTop: 12,
  },
  analyzeSection: {
    marginTop: 20,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.accentLight,
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  errorText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: Colors.error,
    flex: 1,
  },
  ideasSection: {
    marginTop: 24,
  },
  ideasTitle: {
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  ideasSubtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  ideasList: {
    paddingRight: 20,
  },
  generateSection: {
    marginTop: 20,
  },
  generatingOverlay: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 12,
  },
  generatingText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: Colors.primary,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});

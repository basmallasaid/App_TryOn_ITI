import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import Colors from "../../constants/theme/colors";
import { useWardrobe } from "../../context/WardrobeContext";
import { analyzeRecycle, generateRecycleIdea } from "../../api/recycle_services/recycleService";
import SourceTab from "../../components/recycle/SourceTab";
import DesignIdeaCard from "../../components/recycle/DesignIdeaCard";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import SparkleIcon from "../../components/recycle/SparkleIcon";
import GradientBorder from "../../components/recycle/GradientBorder";
import DashedGradientBorder from "../../components/recycle/DashedGradientBorder";

const MAX_ITEMS = 2;

export default function RecycleScreen({ navigation }) {
  const { t } = useTranslation();
  const { items: wardrobeItems } = useWardrobe();

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
      if (prev.length >= MAX_ITEMS) {
        Alert.alert(t("recycle.maxReached"), t("recycle.maxReachedMessage", { max: MAX_ITEMS }));
        return prev;
      }
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
        setIdeas(result.ideas || []);
        scrollToRef(ideasSectionRef);
      } else {
        setApiError(result.error || t("recycle.analysisFailed"));
      }
    } catch (e) {
      setApiError(e.response?.data?.error || e.response?.data?.message || t("recycle.analysisFailed"));
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
        navigation.navigate("RecycleResult", {
          resultImageUri: result.image_url,
          designTitle: selectedIdea?.title || "Generated Design",
          designTitleAr: selectedIdea?.title_ar || null,
          designDescription: selectedIdea?.design_description || "",
          designDescriptionAr: selectedIdea?.design_description_ar || null,
          sessionId,
          ideaId: selectedIdeaId,
        });
      } else {
        setApiError(result.error || t("recycle.generationFailed"));
      }
    } catch (e) {
      setApiError(e.response?.data?.error || t("recycle.generationFailed"));
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
          <MaterialCommunityIcons name="hanger" size={48} color="#D5D9DE" />
          <Text style={styles.emptyText}>{t("recycle.wardrobeEmpty")}</Text>
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("recycle.activeWardrobe")}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{t("tryOn.virtualTryOn.seeAll")}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={wardrobeItems}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.wardrobeList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.wardrobeItemWrap}
                onPress={() => toggleWardrobeItem(item._id)}
                activeOpacity={0.8}
              >
                {selectedItems.includes(item._id) ? (
                  <GradientBorder width={100} height={120} borderRadius={12}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.wardrobeItemImage}
                      resizeMode="cover"
                    />
                    <View style={styles.wardrobeCheck}>
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
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
                  {item.name || "Untitled"}
                </Text>
              </TouchableOpacity>
            )}
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
            <Text style={styles.cameraPlaceholderText}>{t("recycle.tapToCapture")}</Text>
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
                <Ionicons name="close" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
          {capturedImages.length < MAX_ITEMS && (
            <View style={styles.galleryItem}>
              <DashedGradientBorder width="100%" height={160} borderRadius={12}>
                <TouchableOpacity onPress={handleCamera} style={styles.compactUploadInner}>
                  <Ionicons name="add" size={24} color={Colors.primary} />
                  <Text style={styles.compactUploadText}>{t("recycle.addMore")}</Text>
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
              <Ionicons name="images" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.cameraPlaceholderText}>{t("recycle.tapToSelect")}</Text>
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
                <Ionicons name="close" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
          {uploadedImages.length < MAX_ITEMS && (
            <View style={styles.galleryItem}>
              <DashedGradientBorder width="100%" height={160} borderRadius={12}>
                <TouchableOpacity onPress={handleGallery} style={styles.compactUploadInner}>
                  <Ionicons name="add" size={24} color={Colors.primary} />
                  <Text style={styles.compactUploadText}>{t("recycle.addMore")}</Text>
                </TouchableOpacity>
              </DashedGradientBorder>
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.iconGray} />
        </TouchableOpacity>
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
            icon={!analyzing ? <SparkleIcon size={18} color="#FFFFFF" /> : null}
          />
        </View>

        {apiError && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={16} color="#FF4444" />
            <Text style={styles.errorText}>{apiError}</Text>
          </View>
        )}

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
              icon={!generating ? <SparkleIcon size={18} color="#FFFFFF" /> : null}
            />
          </View>
        )}

        {generating && (
          <View style={styles.generatingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.generatingText}>{t("recycle.generatingText")}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    fontSize: 20,
    color: Colors.textPrimary,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F6F7",
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
    backgroundColor: Colors.primary,
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
    backgroundColor: "#E6F2FF",
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
    backgroundColor: "#FF4444",
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
    backgroundColor: "#FF4444",
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
    backgroundColor: "#F5FAFF",
  },
  addMoreText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 13,
    color: Colors.primary,
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
    backgroundColor: "#FFF0F0",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  errorText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: "#FF4444",
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

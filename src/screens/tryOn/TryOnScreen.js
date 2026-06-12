import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { File, Directory, Paths } from "expo-file-system";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { IMAGES } from "../../constants/images/images";
import ActionTab from "../../components/tryOn/ActionTab";
import WardrobeCard from "../../components/tryOn/WardrobeCard";
import UploadBox from "../../components/tryOn/UploadBox";
import ItemSelector from "../../components/tryOn/ItemSelector";
import { openCamera, openGallery } from "../../utils/cameraAccess";
import { useWardrobe } from "../../context/WardrobeContext";
import { getAvatarById } from "../../api/avatar_services/avatarService";
import { virtualTryOn, virtualTryOnOutfit } from "../../api/virtual_tryon_services/virtualTryonService";
import { ROUTES } from "../../navigation/routes";

export default function TryOnScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { items: wardrobeItems } = useWardrobe();
  const photoUri = route?.params?.photoUri;
  const avatarImage = route?.params?.avatarImage;
  const avatarId = route?.params?.avatarId;
  const [avatarFetchedUri, setAvatarFetchedUri] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const avatarUri =
    typeof avatarImage === "string"
      ? avatarImage
      : avatarImage?.avatar?.image_url
      || avatarImage?.image
      || avatarImage?.imageUrl
      || avatarImage?.url
      || null;

  useEffect(() => {
    if (avatarId) {
      setAvatarLoading(true);
      getAvatarById(avatarId)
        .then((res) => {
          const avatar = res?.avatar || res;
          const uri = typeof avatar === "string" ? avatar : avatar?.image_url || avatar?.image || avatar?.imageUrl || avatar?.url || null;
          setAvatarFetchedUri(uri);
        })
        .catch(() => {})
        .finally(() => setAvatarLoading(false));
    }
  }, [avatarId]);

  const displayUri = avatarUri || avatarFetchedUri || photoUri;

  const [activeTab, setActiveTab] = useState("My Wardrobe");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedWardrobeIds, setSelectedWardrobeIds] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [cameraImages, setCameraImages] = useState([]);
  const [cameraItemTypes, setCameraItemTypes] = useState([]);
  const [galleryItemTypes, setGalleryItemTypes] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  const handleCameraCapture = async () => {
    const result = await openCamera();
    if (result && !result.canceled) {
      const uri = result.assets[0].uri;
      setCameraImages((prev) => [...prev, uri]);
      setCameraItemTypes((prev) => [...prev, null]);
    }
  };

  const removeCameraImage = (index) => {
    const uri = cameraImages[index];
    setCameraImages((prev) => prev.filter((_, i) => i !== index));
    setCameraItemTypes((prev) => prev.filter((_, i) => i !== index));
    setSelectedItems((prev) => prev.filter((id) => id !== uri));
  };

  const handleGalleryPick = async () => {
    const result = await openGallery();
    if (result && !result.canceled) {
      const uri = result.assets[0].uri;
      setGalleryImages((prev) => [...prev, uri]);
      setGalleryItemTypes((prev) => [...prev, null]);
    }
  };

  const removeGalleryImage = (index) => {
    const uri = galleryImages[index];
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryItemTypes((prev) => prev.filter((_, i) => i !== index));
    setSelectedItems((prev) => prev.filter((id) => id !== uri));
  };

  const handleSelectCameraType = (index, type) => {
    const prevType = cameraItemTypes[index];
    setCameraItemTypes((prev) => {
      const updated = [...prev];
      updated[index] = type;
      return updated;
    });
    if (type && !prevType && cameraImages[index]) {
      setSelectedItems((prev) =>
        prev.length >= 2 ? prev : [...prev, cameraImages[index]]
      );
    } else if (!type && prevType && cameraImages[index]) {
      setSelectedItems((prev) => prev.filter((id) => id !== cameraImages[index]));
    }
  };

  const handleSelectGalleryType = (index, type) => {
    const prevType = galleryItemTypes[index];
    setGalleryItemTypes((prev) => {
      const updated = [...prev];
      updated[index] = type;
      return updated;
    });
    if (type && !prevType && galleryImages[index]) {
      setSelectedItems((prev) =>
        prev.length >= 2 ? prev : [...prev, galleryImages[index]]
      );
    } else if (!type && prevType && galleryImages[index]) {
      setSelectedItems((prev) => prev.filter((id) => id !== galleryImages[index]));
    }
  };

  const toggleItem = (id) => {
    if (selectedWardrobeIds.includes(id)) {
      setSelectedWardrobeIds(selectedWardrobeIds.filter((i) => i !== id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } else if (selectedWardrobeIds.length < 2 && selectedItems.length < 2) {
      setSelectedWardrobeIds([...selectedWardrobeIds, id]);
      setSelectedItems((prev) => [...prev, id]);
    }
  };

  const resolveToFile = async (uri) => {
    if (!uri) return null;

    if (uri.startsWith("data:image")) {
      const matches = uri.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) return uri;
      const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
      const file = new File(Paths.cache, `garment_${Date.now()}.${ext}`);
      file.create({ idempotent: true });
      file.write(Uint8Array.from(atob(matches[2]), (c) => c.charCodeAt(0)));
      return file.uri;
    }

    if (uri.startsWith("http")) {
      const file = await File.downloadFileAsync(uri, new Directory(Paths.cache), { idempotent: true });
      return file.uri;
    }

    return uri;
  };

  const resolveItem = async (itemId) => {
    let uri, type;

    if (selectedWardrobeIds.includes(itemId)) {
      const item = wardrobeItems.find((i) => i._id === itemId || i.id === itemId);
      uri = typeof item?.image === "string" ? item.image : null;
      type = item?.category || null;
    } else if (cameraImages.includes(itemId)) {
      const idx = cameraImages.indexOf(itemId);
      uri = itemId;
      type = cameraItemTypes[idx] || null;
    } else if (galleryImages.includes(itemId)) {
      const idx = galleryImages.indexOf(itemId);
      uri = itemId;
      type = galleryItemTypes[idx] || null;
    }

    if (!uri) throw new Error("Could not resolve item image");
    return { uri: await resolveToFile(uri), type };
  };

  const classifyPosition = (type) => {
    if (!type) return null;
    const t = type.toLowerCase();
    if (["tops", "top", "tshirt", "shirt", "jacket", "blouse", "hoodie", "sweater"].includes(t)) return "top";
    if (["pants", "bottom", "jeans", "trousers", "skirt", "shorts", "leggings"].includes(t)) return "bottom";
    if (["dresses", "dress", "jumpsuit", "overall", "gown", "robe"].includes(t)) return "bottom";
    return null;
  };

  const appendToFormData = (fd, fieldName, uri) => {
    const name = uri.split("/").pop() || `${fieldName}.jpg`;
    fd.append(fieldName, {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      name,
      type: `image/${name.split(".").pop() || "jpeg"}`,
    });
  };

  const handleGenerate = async () => {
    if (selectedItems.length === 0 || !displayUri) return;
    setGenerating(true);
    setGenerateError(null);

    try {
      const personUri = await resolveToFile(displayUri);
      const items = await Promise.all(selectedItems.map(resolveItem));

      const formData = new FormData();
      appendToFormData(formData, "personImage", personUri);

      let result;
      if (items.length === 1) {
        appendToFormData(formData, "garmentImage", items[0].uri);
        result = await virtualTryOn(formData);
      } else {
        const classified = items.map((it) => ({ ...it, position: classifyPosition(it.type) }));
        const topItem = classified.find((p) => p.position === "top") || classified[0];
        const bottomItem = classified.find((p) => p.position === "bottom") || classified[classified.length - 1];
        appendToFormData(formData, "topImage", topItem.uri);
        appendToFormData(formData, "bottomImage", bottomItem.uri);
        result = await virtualTryOnOutfit(formData);
      }

      navigation.navigate(ROUTES.TRY_ON_RESULT, { result });
    } catch (e) {
      const serverMsg = e.response?.data?.message || e.response?.data?.error || JSON.stringify(e.response?.data);
      const msg = serverMsg || e.message || "Virtual try-on failed";
      setGenerateError(msg);
      Alert.alert("Error", msg);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.iconGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("tryOn.virtualTryOn.title")}
        </Text>
        <Ionicons name="help-circle-outline" size={24} color={Colors.iconGray} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === "Camera" ? (
          <>
            {cameraImages.length > 0 ? (
              <View style={styles.galleryRow}>
                {cameraImages.map((uri, index) => (
                  <View key={index} style={styles.galleryItem}>
                    <Image source={{ uri }} style={styles.galleryItemImage} resizeMode="cover" />
                    <TouchableOpacity style={styles.galleryRemoveBtn} onPress={() => removeCameraImage(index)}>
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
                {cameraImages.length < 2 && (
                  <View style={styles.galleryItem}>
                    <UploadBox label="Open Camera" onPress={handleCameraCapture} style={styles.compactUploadBox} />
                  </View>
                )}
              </View>
            ) : (
              <UploadBox label="Open Camera" onPress={handleCameraCapture} />
            )}
          </>
        ) : activeTab === "Gallery" ? (
          <>
            {galleryImages.length > 0 ? (
              <View style={styles.galleryRow}>
                {galleryImages.map((uri, index) => (
                  <View key={index} style={styles.galleryItem}>
                    <Image source={{ uri }} style={styles.galleryItemImage} resizeMode="cover" />
                    <TouchableOpacity style={styles.galleryRemoveBtn} onPress={() => removeGalleryImage(index)}>
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
                {galleryImages.length < 2 && (
                  <View style={styles.galleryItem}>
                    <UploadBox label="Upload image here" onPress={handleGalleryPick} style={styles.compactUploadBox} />
                  </View>
                )}
              </View>
            ) : (
              <UploadBox label={t("tryOn.uploadPhoto.uploadLabel")} onPress={handleGalleryPick} />
            )}
          </>
        ) : (
          <View style={styles.modelContainer}>
            {avatarLoading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : displayUri ? (
              <Image
                source={{ uri: displayUri }}
                style={styles.modelImage}
                resizeMode="contain"
              />
            ) : !avatarId ? (
              <Image
                source={IMAGES.MODEL}
                style={styles.modelImage}
                resizeMode="contain"
              />
            ) : null}
          </View>
        )}

        <View style={styles.tabsRow}>
          <ActionTab
            label={t("tryOn.virtualTryOn.myWardrobe")}
            iconName="shirt-outline"
            isActive={activeTab === "My Wardrobe"}
            onPress={() => setActiveTab("My Wardrobe")}
          />
          <ActionTab
            label={t("tryOn.virtualTryOn.camera")}
            iconName="camera-outline"
            isActive={activeTab === "Camera"}
            onPress={() => setActiveTab("Camera")}
          />
          <ActionTab
            label={t("tryOn.virtualTryOn.gallery")}
            iconName="images-outline"
            isActive={activeTab === "Gallery"}
            onPress={() => setActiveTab("Gallery")}
          />
        </View>

        {activeTab === "My Wardrobe" && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t("tryOn.virtualTryOn.activeWardrobe")}
              </Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.MAIN, { screen: ROUTES.WARDROBE, params: { screen: ROUTES.WARDROBE_MAIN } })}>
            <Text style={styles.seeAll}>
              {t("tryOn.virtualTryOn.seeAll")}
            </Text>
          </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={wardrobeItems}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20 }}
              ListEmptyComponent={
                <View style={styles.emptyWardrobe}>
                  <Text style={styles.emptyWardrobeText}>{t("tryOn.virtualTryOn.noItemsTitle")}</Text>
                </View>
              }
              renderItem={({ item }) => (
                <WardrobeCard
                  item={item}
                  isSelected={selectedWardrobeIds.includes(item._id)}
                  onToggle={toggleItem}
                  disabled={selectedItems.length >= 2}
                />
              )}
            />
          </>
        )}

        <View style={styles.selectedSection}>
          <Text style={styles.sectionTitle}>
            {t("tryOn.virtualTryOn.selectedItems", { count: selectedItems.length })}
          </Text>

          <View style={styles.noItemsBox}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="hanger" size={24} color="#1A202C" />
            </View>
            <View>
              <Text style={styles.noItemsTitle}>
                {t("tryOn.virtualTryOn.noItemsTitle")}
              </Text>
              <Text style={styles.noItemsSub}>
                {t("tryOn.virtualTryOn.noItemsSub")}
              </Text>
            </View>
          </View>
        </View>

        {activeTab === "Camera" && cameraImages.length > 0 ? (
          <View style={{ paddingHorizontal: 20 }}>
            {cameraImages.map((_, index) => (
              <ItemSelector
                key={index}
                label={index === 0 ? "First Image" : "Second Image"}
                selectedType={cameraItemTypes[index]}
                onSelectType={(type) => handleSelectCameraType(index, type)}
                disabled={selectedItems.length >= 2 && !cameraItemTypes[index]}
              />
            ))}
          </View>
        ) : activeTab === "Gallery" && galleryImages.length > 0 ? (
          <View style={{ paddingHorizontal: 20 }}>
            {galleryImages.map((_, index) => (
              <ItemSelector
                key={index}
                label={index === 0 ? "First Image" : "Second Image"}
                selectedType={galleryItemTypes[index]}
                onSelectType={(type) => handleSelectGalleryType(index, type)}
                disabled={selectedItems.length >= 2 && !galleryItemTypes[index]}
              />
            ))}
          </View>
        ) : null}

        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={[
              styles.generateBtn,
              (selectedItems.length > 0 && !generating) ? styles.activeBtn : styles.disabledBtn,
            ]}
            onPress={handleGenerate}
            disabled={selectedItems.length === 0 || generating}
          >
            {generating ? (
              <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
            ) : (
              <MaterialCommunityIcons
                name="auto-fix"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
            )}
            <Text style={styles.generateBtnText}>
              {generating ? t("tryOn.virtualTryOn.generating") || "Generating..." : t("tryOn.virtualTryOn.generate")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1A202C" },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  modelContainer: {
    width: "100%",
    height: 450,
    justifyContent: "center",
    alignItems: "center",
  },
  modelImage: { width: "90%", height: "100%" },
  galleryRow: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 16,
    flexDirection: "row",
    gap: 12,
  },
  galleryItem: {
    flex: 1,
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  galleryItemImage: {
    width: "100%",
    height: "100%",
  },
  galleryCameraCard: {
    backgroundColor: "#E8EFFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  galleryCameraIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  galleryCameraText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  galleryRemoveBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  compactUploadBox: {
    width: "100%",
    height: "100%",
    alignSelf: "stretch",
    marginVertical: 0,
    borderRadius: 16,
  },
  cameraImageContainer: {
    width: "90%",
    height: 450,
    alignSelf: "center",
    marginVertical: 16,
    position: "relative",
    backgroundColor: "#000",
  },
  capturedImage: {
    width: "100%",
    height: "100%",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#00AEEF",
    borderWidth: 3.5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  retakeBtn: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00AEEF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  tabsRow: { flexDirection: "row", justifyContent: "space-around", padding: 20 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1A202C" },
  seeAll: { color: "#718096", fontSize: 14 },

  selectedSection: { paddingHorizontal: 20, marginTop: 25 },
  noItemsBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4FF",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#DBE9FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  noItemsTitle: { fontWeight: "700", color: "#1A202C", fontSize: 14 },
  noItemsSub: { color: "#718096", fontSize: 12 },

  emptyWardrobe: {
    width: 200,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  emptyWardrobeText: {
    color: "#A0AEC0",
    fontSize: 14,
  },

  generateBtn: {
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#A0AEC0" },
  activeBtn: { backgroundColor: "#40B9FF" },
  generateBtnText: { color: "white", fontWeight: "700", fontSize: 16 },
});

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
} from "react-native";
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
  const [galleryImages, setGalleryImages] = useState([]);
  const [cameraImages, setCameraImages] = useState([]);
  const [cameraItemTypes, setCameraItemTypes] = useState([]);
  const [galleryItemTypes, setGalleryItemTypes] = useState([]);

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
    const wasNull = !cameraItemTypes[index];
    setCameraItemTypes((prev) => {
      const updated = [...prev];
      updated[index] = type;
      return updated;
    });
    if (wasNull && cameraImages[index]) {
      setSelectedItems((prev) => [...prev, cameraImages[index]]);
    }
  };

  const handleSelectGalleryType = (index, type) => {
    const wasNull = !galleryItemTypes[index];
    setGalleryItemTypes((prev) => {
      const updated = [...prev];
      updated[index] = type;
      return updated;
    });
    if (wasNull && galleryImages[index]) {
      setSelectedItems((prev) => [...prev, galleryImages[index]]);
    }
  };

  const toggleItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
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
                  <View style={[styles.galleryItem, { marginLeft: 10 }]}>
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
                  <View style={[styles.galleryItem, { marginLeft: 10 }]}>
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
          <TouchableOpacity onPress={() => navigation.navigate("Wardrobe", { screen: "WardrobeMain" })}>
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
                  isSelected={selectedItems.includes(item._id)}
                  onToggle={toggleItem}
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
              />
            ))}
          </View>
        ) : null}

        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={[
              styles.generateBtn,
              selectedItems.length > 0 ? styles.activeBtn : styles.disabledBtn,
            ]}
          >
            <MaterialCommunityIcons
              name="auto-fix"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.generateBtnText}>
              {t("tryOn.virtualTryOn.generate")}
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
  },
  galleryItem: {
    flex: 1,
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    marginRight: 0,
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

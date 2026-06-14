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
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { getItemImage } from "../../utils/getItemImage";
import CustomBackButton from "../../components/common/CustomBackButton";
import ActionTab from "../../components/tryOn/ActionTab";
import UploadBox from "../../components/tryOn/UploadBox";
import ItemSelector from "../../components/tryOn/ItemSelector";
import { openCamera, openGallery } from "../../utils/cameraAccess";
import { useWardrobe } from "../../context/WardrobeContext";
import GradientBorder from "../../components/recycle/GradientBorder";
import {
  getWardrobeMatches,
  analyzeImage,
  getMatchesByAnalysis,
} from "../../api/matching_services/matchingService";
import { getAllProducts } from "../../api/user_services/userService";
import { useFavorites } from "../../context/FavoritesContext";
import { ROUTES } from "../../navigation/routes";
import { translateMatch } from "../../utils/dynamicTranslator";
import { useFeedback } from "../../context/FeedbackContext";
import { getUserFriendlyErrorMessage } from "../../utils/errorMessages";
import LoadingOverlay from "../../components/common/LoadingOverlay";

export default function MatchingScreen({ navigation }) {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const { showFeedback } = useFeedback();
  const { items: wardrobeItems } = useWardrobe();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [activeTab, setActiveTab] = useState("My Wardrobe");
  const [selectedWardrobeId, setSelectedWardrobeId] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [cameraItemType, setCameraItemType] = useState(null);
  const [galleryImage, setGalleryImage] = useState(null);
  const [galleryItemType, setGalleryItemType] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [wardrobeMatches, setWardrobeMatches] = useState([]);
  const [storeMatches, setStoreMatches] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Dynamic translation state for match results
  const [translatedWardrobeMatches, setTranslatedWardrobeMatches] = useState(
    [],
  );
  const [translatedStoreMatches, setTranslatedStoreMatches] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then((data) => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleCameraCapture = async () => {
    const result = await openCamera();
    if (result && !result.canceled) {
      setShowResults(false);
      setCameraImage(result.assets[0].uri);
      setCameraItemType(null);
    }
  };

  const removeCameraImage = () => {
    setShowResults(false);
    setCameraImage(null);
    setCameraItemType(null);
  };

  const handleGalleryPick = async () => {
    const result = await openGallery();
    if (result && !result.canceled) {
      setShowResults(false);
      setGalleryImage(result.assets[0].uri);
      setGalleryItemType(null);
    }
  };

  const removeGalleryImage = () => {
    setShowResults(false);
    setGalleryImage(null);
    setGalleryItemType(null);
  };

  const toggleItem = (id) => {
    setShowResults(false);
    setWardrobeMatches([]);
    setStoreMatches([]);
    setSelectedWardrobeId((prev) => (prev === id ? null : id));
  };

  const isButtonReady =
    activeTab === "My Wardrobe"
      ? !!selectedWardrobeId
      : activeTab === "Camera"
        ? !!(cameraImage && cameraItemType)
        : !!(galleryImage && galleryItemType);

  const hasCameraItem = !!(cameraImage && cameraItemType);
  const hasGalleryItem = !!(galleryImage && galleryItemType);
  const hasWardrobeItem = !!selectedWardrobeId;
  const hasItem = hasCameraItem || hasGalleryItem || hasWardrobeItem;

  const selectedTitle = hasItem
    ? t("matching.selectedItemsOne")
    : t("matching.noItemsSelected");
  const selectedSubtitle = hasItem
    ? hasWardrobeItem
      ? t("matching.itemFromWardrobe")
      : t("matching.itemFromCamera")
    : t("matching.selectItemHint");

  const processMatches = async (raw) => {
    const list =
      raw?.matches || raw?.data?.matches || (Array.isArray(raw) ? raw : []);
    const wMatches = list.filter((m) => m.item?.source === "wardrobe");
    const sMatches = list.filter((m) => m.item?.source === "store");
    setWardrobeMatches(wMatches);
    setStoreMatches(sMatches);

    // Dynamically translate match content sequentially to avoid rate limiting
    const translatedW = [];
    for (const m of wMatches) {
      translatedW.push(await translateMatch(m));
    }

    const translatedS = [];
    for (const m of sMatches) {
      translatedS.push(await translateMatch(m));
    }

    setTranslatedWardrobeMatches(translatedW);
    setTranslatedStoreMatches(translatedS);
  };

  const handleSeeMatching = async () => {
    setGenerating(true);
    try {
      if (hasWardrobeItem) {
        const res = await getWardrobeMatches(selectedWardrobeId);
        processMatches(res);
      } else if (hasCameraItem) {
        const analysisRes = await analyzeImage(cameraImage);
        const analysisId =
          analysisRes?.analysis_id ||
          analysisRes?.id ||
          analysisRes?.data?.analysis_id;
        if (analysisId) {
          const matchRes = await getMatchesByAnalysis(
            analysisId,
            30.0444,
            31.2357,
          );
          processMatches(matchRes);
        }
      } else if (hasGalleryItem) {
        const analysisRes = await analyzeImage(galleryImage);
        const analysisId =
          analysisRes?.analysis_id ||
          analysisRes?.id ||
          analysisRes?.data?.analysis_id;
        if (analysisId) {
          const matchRes = await getMatchesByAnalysis(
            analysisId,
            30.0444,
            31.2357,
          );
          processMatches(matchRes);
        }
      }
    } catch (e) {
      showFeedback({
        type: "error",
        title: t("matching.matchError"),
        message: getUserFriendlyErrorMessage(e, t),
      });
      setWardrobeMatches([]);
      setStoreMatches([]);
      setTranslatedWardrobeMatches([]);
      setTranslatedStoreMatches([]);
    } finally {
      setGenerating(false);
    }
    setShowResults(true);
  };

  const getImageSource = (item) => {
    if (!item) return null;
    const uri =
      getItemImage(item) ||
      (typeof item.image === "string" ? item.image : item.image?.uri);
    return uri ? { uri } : null;
  };

  const getMatchImage = (match) => {
    if (!match?.item) return null;
    const directUri = getItemImage(match.item);
    if (directUri) return { uri: directUri };
    const source = match.item.source;
    if (source === "wardrobe") {
      const wardrobeItem = wardrobeItems.find(
        (wi) => wi._id === match.item.id || wi.id === match.item.id,
      );
      if (wardrobeItem) {
        const uri =
          getItemImage(wardrobeItem) ||
          (typeof wardrobeItem.image === "string"
            ? wardrobeItem.image
            : wardrobeItem.image?.uri);
        if (uri) return { uri };
      }
      return null;
    }
    if (source === "store") {
      const productId = match.item.id?.replace("store_", "");
      const product = allProducts.find(
        (p) => p._id === productId || p.id === productId,
      );
      if (product) {
        const raw = product.images || product.image;
        const first = Array.isArray(raw) ? raw[0] : raw;
        const uri =
          typeof first === "string" ? first : first?.url || first?.uri;
        if (uri) return { uri };
      }
      return null;
    }
    return null;
  };
  const styles = React.useMemo(() => createStyles(), [themeVersion]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <CustomBackButton
          onPress={() => navigation.goBack()}
          iconColor={Colors.iconGray}
        />
        <Text style={styles.headerTitle}>{t("matching.title")}</Text>
        <TouchableOpacity>
          <Feather name="help-circle" size={24} color={Colors.iconGray} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionPadding}>
          <Text style={styles.sectionTitle}>{t("home.actions.matching")}</Text>
          <Text style={styles.sectionSubtitle}>
            {t("home.actions.matchingSub")}
          </Text>
        </View>

        <View style={styles.uploadOptions}>
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

        {activeTab === "Camera" &&
          (cameraImage ? (
            <>
              <View style={styles.singleImageContainer}>
                <Image
                  source={{ uri: cameraImage }}
                  style={styles.singleImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={removeCameraImage}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.selectorPadding}>
                <ItemSelector
                  label={t("matching.whatIsThisItem")}
                  selectedType={cameraItemType}
                  onSelectType={(type) =>
                    setCameraItemType(type === cameraItemType ? null : type)
                  }
                  disabled={false}
                />
              </View>
            </>
          ) : (
            <UploadBox
              label={t("matching.openCamera")}
              onPress={handleCameraCapture}
            />
          ))}

        {activeTab === "Gallery" &&
          (galleryImage ? (
            <>
              <View style={styles.singleImageContainer}>
                <Image
                  source={{ uri: galleryImage }}
                  style={styles.singleImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={removeGalleryImage}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.selectorPadding}>
                <ItemSelector
                  label={t("matching.whatIsThisItem")}
                  selectedType={galleryItemType}
                  onSelectType={(type) =>
                    setGalleryItemType(type === galleryItemType ? null : type)
                  }
                  disabled={false}
                />
              </View>
            </>
          ) : (
            <UploadBox
              label={t("matching.uploadImageHere")}
              onPress={handleGalleryPick}
            />
          ))}

        {activeTab === "My Wardrobe" && (
          <>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitleSmall}>
                {t("matching.selectFromWardrobe")}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ROUTES.MAIN, {
                    screen: ROUTES.WARDROBE,
                    params: { screen: ROUTES.WARDROBE_MAIN },
                  })
                }
              >
                <Text style={styles.seeAllText}>{t("matching.seeAll")}</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={wardrobeItems}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.wardrobeList}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    {t("tryOn.virtualTryOn.noItemsTitle")}
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const isSelected = selectedWardrobeId === item._id;
                const imageSrc = getImageSource(item);
                return (
                  <TouchableOpacity
                    onPress={() => toggleItem(item._id)}
                    activeOpacity={0.7}
                  >
                    {isSelected ? (
                      <View style={{ marginRight: 12 }}>
                        <GradientBorder
                          width={90}
                          height={110}
                          borderRadius={12}
                          borderWidth={2}
                        >
                          <View style={styles.selectedContent}>
                            {imageSrc && (
                              <Image
                                source={imageSrc}
                                style={styles.wardrobeImg}
                                resizeMode="contain"
                              />
                            )}
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color={Colors.secondary}
                              style={styles.checkIcon}
                            />
                          </View>
                        </GradientBorder>
                      </View>
                    ) : (
                      <View style={styles.wardrobeItemCard}>
                        {imageSrc && (
                          <Image
                            source={imageSrc}
                            style={styles.wardrobeImg}
                            resizeMode="contain"
                          />
                        )}
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={Colors.disabled}
                          style={styles.checkIcon}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </>
        )}

        <View style={styles.selectedSection}>
          <View style={styles.noItemsBox}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="hanger"
                size={24}
                color={Colors.textPrimary}
              />
            </View>
            <View>
              <Text style={styles.noItemsTitle}>{selectedTitle}</Text>
              <Text style={styles.noItemsSub}>{selectedSubtitle}</Text>
            </View>
          </View>
        </View>

        {showResults && (
          <>
            <View style={styles.sectionPadding}>
              <Text style={styles.sectionTitleSmall}>
                {t("matching.itemsMatch")}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.matchList}
            >
              {(translatedWardrobeMatches.length > 0
                ? translatedWardrobeMatches
                : wardrobeMatches
              ).length === 0 ? (
                <View style={styles.emptyMatches}>
                  <Text style={styles.emptyMatchesText}>
                    {t("matching.noMatches")}
                  </Text>
                </View>
              ) : (
                (translatedWardrobeMatches.length > 0
                  ? translatedWardrobeMatches
                  : wardrobeMatches
                ).map((match, index) => {
                  const originalMatch = wardrobeMatches[index] || match;
                  const imgSrc = getMatchImage(originalMatch);
                  const imageUri = imgSrc?.uri;
                  const wardrobeItem = wardrobeItems.find(
                    (wi) => wi._id === originalMatch.item?.id || wi.id === originalMatch.item?.id,
                  );
                  return (
                    <TouchableOpacity
                      key={match.item?.id || index}
                      onPress={() =>
                        navigation.navigate(ROUTES.MATCHING_ITEM_DETAILS, {
                          itemId: wardrobeItem?._id || originalMatch.item?.id,
                          analysisId: wardrobeItem?.analysis_id,
                          source: "matching",
                        })
                      }
                    >
                      <View style={styles.matchCard}>
                        <View style={styles.scoreBadge}>
                          <Text style={styles.scoreText}>{String(match.score ?? 0)}%</Text>
                        </View>
                        {imgSrc ? (
                          <Image
                            source={imgSrc}
                            style={styles.matchImg}
                            resizeMode="contain"
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="tshirt-crew-outline"
                            size={40}
                            color={Colors.disabled}
                          />
                        )}
                        <Text style={styles.matchItemName} numberOfLines={1}>
                          {String(match.item?.name ?? "")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            <View style={styles.sectionPadding}>
              <Text style={styles.sectionTitleSmall}>
                {t("matching.storeMatches")}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.matchList}
            >
              {(translatedStoreMatches.length > 0
                ? translatedStoreMatches
                : storeMatches
              ).length === 0 ? (
                <View style={styles.emptyMatches}>
                  <Text style={styles.emptyMatchesText}>
                    {t("matching.noStoreMatches")}
                  </Text>
                </View>
              ) : (
                (translatedStoreMatches.length > 0
                  ? translatedStoreMatches
                  : storeMatches
                ).map((match, index) => {
                  const originalMatch = storeMatches[index] || match;
                  const imgSrc = getMatchImage(originalMatch);
                  const imageUri = imgSrc?.uri;
                  return (
                    <TouchableOpacity
                      key={match.item?.id || index}
                      onPress={() =>
                        navigation.navigate(ROUTES.MATCHING_PRODUCT_DETAIL, {
                          productId: originalMatch.item?.id?.replace("store_", ""),
                          source: "matching",
                        })
                      }
                    >
                      <View style={styles.matchCard}>
                        <View style={styles.scoreBadge}>
                          <Text style={styles.scoreText}>{String(match.score ?? 0)}%</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.heartIcon}
                          onPress={async () => {
                            const rawId = match.item?.id;
                            if (!rawId) return;
                            const id = rawId.replace("store_", "");
                            try {
                              await toggleFavorite(id, "PRODUCT");
                            } catch (e) {
                            }
                          }}
                        >
                          <Ionicons
                            name={
                              isFavorite(match.item?.id?.replace("store_", ""))
                                ? "heart"
                                : "heart-outline"
                            }
                            size={18}
                            color={
                              isFavorite(match.item?.id?.replace("store_", ""))
                                ? Colors.accentOrange
                                : Colors.textPrimary
                            }
                          />
                        </TouchableOpacity>
                        {imgSrc ? (
                          <Image
                            source={imgSrc}
                            style={styles.matchImg}
                            resizeMode="contain"
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="tshirt-crew-outline"
                            size={40}
                            color={Colors.disabled}
                          />
                        )}
                        <Text style={styles.matchItemName} numberOfLines={1}>
                          {String(match.item?.name ?? "")}
                        </Text>
                        {match.item?.price != null && (
                          <Text style={styles.matchPrice}>
                            {String(match.item?.currency || "$")} {String(match.item?.price)}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.mainButton, isButtonReady && styles.activeButton]}
          onPress={handleSeeMatching}
          disabled={!isButtonReady || generating}
        >
          <MaterialCommunityIcons name="auto-fix" size={20} color={Colors.white} />
          <Text style={styles.buttonText}>{t("matching.seeMatching")}</Text>
        </TouchableOpacity>
      </View>

      <LoadingOverlay visible={generating} type="general" />
    </SafeAreaView>
  );
}

const createStyles = () =>
  StyleSheet.create({
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
      fontSize: 22,
      fontWeight: "bold",
      color: Colors.textPrimary,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    sectionPadding: {
      paddingHorizontal: 20,
      marginTop: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: Colors.textPrimary,
    },
    sectionSubtitle: {
      fontSize: 13,
      color: Colors.textMuted,
      marginTop: 4,
    },
    uploadOptions: {
      flexDirection: "row",
      paddingHorizontal: 15,
      marginTop: 25,
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginTop: 20,
      marginBottom: 10,
    },
    sectionTitleSmall: {
      fontSize: 16,
      fontWeight: "bold",
      color: Colors.textPrimary,
      marginBottom: 10,
    },
    seeAllText: {
      fontSize: 12,
      color: Colors.textPrimary,
    },
    wardrobeList: {
      paddingLeft: 20,
      marginTop: 5,
    },
    wardrobeItemCard: {
      width: 90,
      height: 110,
      backgroundColor: Colors.white,
      borderRadius: 12,
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors.borderDefault,
    },
    wardrobeImg: {
      width: 70,
      height: 80,
    },
    checkIcon: {
      position: "absolute",
      top: 5,
      right: 5,
    },
    selectedContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    matchList: {
      paddingLeft: 20,
      marginTop: 5,
    },
    matchCard: {
      width: 150,
      height: 180,
      backgroundColor: Colors.white,
      borderRadius: 15,
      marginRight: 15,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: Colors.secondaryLight,
      position: "relative",
    },
    matchImg: {
      width: 100,
      height: 110,
    },
    matchItemName: {
      fontSize: 11,
      fontWeight: "600",
      color: Colors.textPrimary,
      textAlign: "center",
      marginTop: 6,
      paddingHorizontal: 8,
      textTransform: "capitalize",
    },
    matchPrice: {
      fontSize: 12,
      fontWeight: "700",
      color: Colors.textPrimary,
      marginTop: 2,
    },
    scoreBadge: {
      position: "absolute",
      top: 10,
      left: 10,
      backgroundColor: Colors.secondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      zIndex: 1,
    },
    scoreText: {
      color: Colors.textInverse,
      fontSize: 11,
      fontWeight: "bold",
    },
    heartIcon: {
      position: "absolute",
      top: 12,
      right: 10,
      zIndex: 1,
    },
    selectedSection: {
      paddingHorizontal: 20,
      marginTop: 25,
    },
    noItemsBox: {
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
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: Colors.backgroundColor,
      justifyContent: "center",
      alignItems: "center",
    },
    noItemsTitle: {
      fontFamily: "Roboto_700Bold",
      fontWeight: "700",
      color: Colors.textPrimary,
      fontSize: 14,
      marginBottom: 2,
    },
    noItemsSub: {
      fontFamily: "Roboto_400Regular",
      color: Colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
    },

    emptyMatches: {
      width: 200,
      height: 120,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyMatchesText: {
      color: Colors.disabled,
      fontSize: 14,
    },
    emptyState: {
      width: 200,
      height: 120,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyStateText: {
      color: Colors.disabled,
      fontSize: 14,
    },
    singleImageContainer: {
      width: "90%",
      height: 450,
      alignSelf: "center",
      marginVertical: 16,
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
    },
    singleImage: {
      width: "100%",
      height: "100%",
    },
    removeBtn: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    selectorPadding: {
      paddingHorizontal: 20,
    },
    compactUploadBox: {
      width: "100%",
      height: "100%",
      alignSelf: "stretch",
      marginVertical: 0,
      borderRadius: 16,
    },
    bottomContainer: {
      position: "absolute",
      bottom: 25,
      width: "100%",
      paddingHorizontal: 20,
    },
    mainButton: {
      backgroundColor: Colors.disabled,
      flexDirection: "row",
      height: 55,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      gap: 8,
    },
    activeButton: {
      backgroundColor: Colors.primary,
    },
    buttonText: {
      color: Colors.textInverse,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

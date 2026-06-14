import React, {  useState, useRef, useCallback  } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { useWardrobe } from "../../context/WardrobeContext";
import SelectionChip from "../../components/wardrobe/SelectionChip";
import QuestionGroup from "../../components/wardrobe/QuestionGroup";
import CustomizeTextInput from "../../components/common/CustomizeTextInput";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import CustomBackButton from "../../components/common/CustomBackButton"; // Added Import
import { useTranslation } from 'react-i18next';
import { ROUTES } from "../../navigation/routes";
import { saveToWardrobe, editWardrobeItem } from "../../api/wardrobe_services/wardrobeService";
import { useFeedback } from "../../context/FeedbackContext";
const { height: SCREEN_H } = Dimensions.get("window");

const SHEET_EXPANDED_H = SCREEN_H * 0.65;
const SHEET_PEEK_H = 80; 

const CATEGORIES = [
  "Bottom",
  "Top",
  "Dress",
  "Suit",
  "Bag",
  "Shoes",
  "Jacket",
  "Accessories",
];
const SEASONS = ["Summer", "Winter", "Spring", "Fall"];
const STYLES = ["Casual", "Basic", "Formal","Mart-Casual"];

const normalize = (value) => {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr.map((v) =>
    v
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("-")
  );
};

const matchToOptions = (values, options) =>
  values.filter((v) => options.includes(v));

const VerifyItemScreen = ({ route, navigation }) => {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { imageUri, analysisResult } = route.params;
  const garment = analysisResult?.garments?.[0] ?? {};
  const { refetch, updateItem } = useWardrobe();
  const { t } = useTranslation();
  const { showFeedback } = useFeedback();

  const categoryLabels = {
    Bottom: t("wardrobe.categories.bottom"),
    Top: t("wardrobe.categories.top"),
    Dress: t("wardrobe.categories.dress"),
    Suit: t("wardrobe.categories.suit"),
    Bag: t("wardrobe.categories.bag"),
    Shoes: t("wardrobe.categories.shoes"),
    Jacket: t("wardrobe.categories.jacket"),
    Accessories: t("wardrobe.categories.accessories"),
  };
  const seasonLabels = {
    Summer: t("wardrobe.seasons.summer"),
    Winter: t("wardrobe.seasons.winter"),
    Spring: t("wardrobe.seasons.spring"),
    Fall: t("wardrobe.seasons.fall"),
  };
  const styleLabels = {
    Casual: t("wardrobe.styles.casual"),
    Basic: t("wardrobe.styles.basic"),
    Formal: t("wardrobe.styles.formal"),
    "Mart-Casual": t("wardrobe.styles.martCasual"),
  };

  const [form, setForm] = useState({
    name: garment.specificType || "",
    color: garment.colors?.[0]?.color || "",
    categories: matchToOptions(normalize(garment.category), CATEGORIES),
    seasons: matchToOptions(normalize(garment.season), SEASONS),
    styles: matchToOptions(normalize(garment.style), STYLES),
  });
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const sheetAnim = useRef(new Animated.Value(0)).current;

  const expandSheet = useCallback(() => {
    setIsExpanded(true);
    Animated.spring(sheetAnim, {
      toValue: 1,
      useNativeDriver: false,
      bounciness: 4,
    }).start();
  }, [sheetAnim]);

  const collapseSheet = useCallback(() => {
    setIsExpanded(false);
    Animated.spring(sheetAnim, {
      toValue: 0,
      useNativeDriver: false,
      bounciness: 4,
    }).start();
  }, [sheetAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, g) => {
        if (g.dy < -20) expandSheet(); 
        if (g.dy > 20) collapseSheet(); 
      },
    }),
  ).current;

  const sheetHeight = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SHEET_PEEK_H, SHEET_EXPANDED_H],
  });

  const overlayOpacity = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.75],
  });

  const toggleSelection = (field, value) => {
    setForm((prev) => {
      const current = prev[field];
      const isSelected = current.includes(value);
      if (field === "seasons") {
        return {
          ...prev,
          [field]: isSelected
            ? current.filter((item) => item !== value)
            : [...current, value],
        };
      }
      return {
        ...prev,
        [field]: isSelected ? [] : [value],
      };
    });
  };

  // const handleSave = async () => {
  //   try {
  //     setLoading(true);
  //     await saveToWardrobe(analysisResult.analysis_id, 0);
  //     await refetch();
    //     navigation.navigate(ROUTES.WARDROBE_MAIN);
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
   const handleSave = async () => {
    try {
      setLoading(true);

      // 1. Prepare the user's manual selections (safe defaults)
      const rawCategory = form.categories[0] || garment.category || "top";
      // Server wardrobe enum rejects "basic" — remap to a valid fallback
      const category = rawCategory.toLowerCase() === "basic" ? "top" : rawCategory;
      const updateData = {
        name: form.name || garment.specificType || "",
        category,
        style: form.styles[0] || garment.style || "casual",
        season: form.seasons.length ? form.seasons : (garment.season || ["summer"]),
      };

      // 2. First UPDATE the analysis with user corrections, so the AI's bad
      //    category (e.g. "basic") is replaced before saving to wardrobe
      await editWardrobeItem(analysisResult.analysis_id, garment, updateData);

      // 3. Now save the (corrected) analysis to wardrobe
      const saveResponse = await saveToWardrobe(analysisResult.analysis_id, 0);
      const wardrobeItemId = saveResponse._id || saveResponse.item?._id || saveResponse.analysis?._id;

      // 4. Sync context and go home
      if (wardrobeItemId) {
        updateItem(wardrobeItemId, {
          name: updateData.name,
          category: updateData.category.toLowerCase(),
        });
      }
      await refetch();
      navigation.navigate(ROUTES.WARDROBE_MAIN);
    } catch (e) {
      console.log("Save failed:", e.config?.url, "status:", e.response?.status, "body:", JSON.stringify(e.response?.data));
      if (e.response) console.log("full response:", JSON.stringify(e.response));
      console.log("request data:", JSON.stringify(e.config?.data));
      const msg =
        e.response?.data?.error ||
        e.response?.data?.message ||
        `Server error (${e.response?.status || "network connection"})`;
      showFeedback({ type: "error", title: t("common.error"), message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      {/* ── Header: stacked layout ── */}
      <View style={styles.header}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{t("wardrobe.verify.title")}</Text>
          <Text style={styles.subtitle}>{t("wardrobe.verify.analysis")}</Text>
        </View>
      </View>

      {/* ── Image ── */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {isExpanded && (
        <TouchableWithoutFeedback onPress={collapseSheet}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              styles.overlay,
              { opacity: overlayOpacity },
            ]}
            pointerEvents={isExpanded ? "auto" : "none"}
          />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.sheet, { height: sheetHeight }]}>
        <TouchableOpacity
          style={styles.handleWrap}
          onPress={isExpanded ? collapseSheet : expandSheet}
          activeOpacity={0.8}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          {!isExpanded && (
            <Text style={styles.peekHint}>{t("wardrobe.verify.swipeUp")}</Text>
          )}
        </TouchableOpacity>

        {isExpanded && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.sheetContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputGap}>
                <CustomizeTextInput
                  label={t("wardrobe.verify.name")}
                  placeholder={t("wardrobe.verify.namePlaceholder")}
                  value={form.name}
                  onChangeText={(v) =>
                    setForm((prev) => ({ ...prev, name: v }))
                  }
                />
              </View>

              <View style={styles.inputGap}>
                <CustomizeTextInput
                  label={t("wardrobe.verify.primaryColor")}
                  placeholder="—"
                  value={form.color}
                  onChangeText={() => {}} 
                  editable={false}
                  state="default"
                />
              </View>

              <QuestionGroup title={t("wardrobe.verify.categoryQuestion")}>
                {CATEGORIES.map((cat) => (
                  <SelectionChip
                    key={cat}
                    label={categoryLabels[cat] || cat}
                    isSelected={form.categories.includes(cat)}
                    onPress={() => toggleSelection("categories", cat)}
                  />
                ))}
              </QuestionGroup>

              <QuestionGroup title={t("wardrobe.verify.seasonQuestion")}>
                {SEASONS.map((s) => (
                  <SelectionChip
                    key={s}
                    label={seasonLabels[s] || s}
                    isSelected={form.seasons.includes(s)}
                    onPress={() => toggleSelection("seasons", s)}
                  />
                ))}
              </QuestionGroup>

              <QuestionGroup title={t("wardrobe.verify.styleQuestion")}>
                {STYLES.map((s) => (
                  <SelectionChip
                    key={s}
                    label={styleLabels[s] || s}
                    isSelected={form.styles.includes(s)}
                    onPress={() => toggleSelection("styles", s)}
                  />
                ))}
              </QuestionGroup>

              <View style={styles.footer}>
                <CustomizeAppButtonFilled
                  label={t("wardrobe.verify.save")}
                  onPress={handleSave}
                  loading={loading}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Animated.View>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    paddingTop:
      Platform.OS === "ios" ? 60 : (StatusBar.currentHeight ?? 32) + 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerText: {
    alignItems: "center",
    marginTop: 10,
    gap: 4,
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 24,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
  },
  imageContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: SHEET_PEEK_H + 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.borderDefault,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    backgroundColor: Colors.textPrimary,
    zIndex: 10,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 12,
  },
  handleWrap: {
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderDefault,
  },
  peekHint: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  inputGap: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 24,
  },
});

export default VerifyItemScreen;
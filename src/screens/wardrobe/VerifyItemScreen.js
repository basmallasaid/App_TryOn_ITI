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
import { useWardrobe } from "../../context/WardrobeContext";
import SelectionChip from "../../components/wardrobe/SelectionChip";
import QuestionGroup from "../../components/wardrobe/QuestionGroup";
import CustomizeTextInput from "../../components/common/CustomizeTextInput";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import CustomBackButton from "../../components/common/CustomBackButton"; // Added Import
import { ROUTES } from "../../navigation/routes";
import { saveToWardrobe, editWardrobeItem } from "../../api/wardrobe_services/wardrobeService";
const { height: SCREEN_H } = Dimensions.get("window");

const SHEET_EXPANDED_H = SCREEN_H * 0.65;
const SHEET_PEEK_H = 80; 

const CATEGORIES = [
  "Basic",
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
const STYLES = ["Casual", "Basic", "Formal"];

const normalize = (value) => {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr.map((v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase());
};

const matchToOptions = (values, options) =>
  values.filter((v) => options.includes(v));

const VerifyItemScreen = ({ route, navigation }) => {
  const { imageUri, analysisResult } = route.params;
  const garment = analysisResult?.garments?.[0] ?? {};
  const { refetch } = useWardrobe();

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

      // 1. First, save the analyzed item to the wardrobe to get a permanent ID
      // This endpoint usually returns the created item/analysis record
      const saveResponse = await saveToWardrobe(analysisResult.analysis_id, 0);
      const newItemId = saveResponse.analysis?._id || analysisResult.analysis_id;

      // 2. Prepare the user's manual selections
      const updateData = {
        name: form.name,
        category: form.categories[0] || garment.category, // single select
        style: form.styles[0] || garment.style,           // single select
        season: form.seasons,                             // multi-select array
      };

      // 3. Call the edit endpoint to update the wardrobe item with user's choices
      await editWardrobeItem(newItemId, garment, updateData);

      // 4. Sync context and go home
      await refetch();
      navigation.navigate(ROUTES.WARDROBE_MAIN);
    } catch (e) {
      console.log("Logically failed to save:", e);
      alert("Failed to save item. Please try again.");
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
          <Text style={styles.title}>Add to Wardrobe</Text>
          <Text style={styles.subtitle}>Analysis</Text>
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
            <Text style={styles.peekHint}>Swipe up to review details</Text>
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
                  label="Name"
                  placeholder="Enter item name"
                  value={form.name}
                  onChangeText={(v) =>
                    setForm((prev) => ({ ...prev, name: v }))
                  }
                />
              </View>

              <View style={styles.inputGap}>
                <CustomizeTextInput
                  label="Primary Color"
                  placeholder="—"
                  value={form.color}
                  onChangeText={() => {}} 
                  editable={false}
                  state="default"
                />
              </View>

              <QuestionGroup title="What is this item?">
                {CATEGORIES.map((cat) => (
                  <SelectionChip
                    key={cat}
                    label={cat}
                    isSelected={form.categories.includes(cat)}
                    onPress={() => toggleSelection("categories", cat)}
                  />
                ))}
              </QuestionGroup>

              <QuestionGroup title="For which season?">
                {SEASONS.map((s) => (
                  <SelectionChip
                    key={s}
                    label={s}
                    isSelected={form.seasons.includes(s)}
                    onPress={() => toggleSelection("seasons", s)}
                  />
                ))}
              </QuestionGroup>

              <QuestionGroup title="Which style?">
                {STYLES.map((s) => (
                  <SelectionChip
                    key={s}
                    label={s}
                    isSelected={form.styles.includes(s)}
                    onPress={() => toggleSelection("styles", s)}
                  />
                ))}
              </QuestionGroup>

              <View style={styles.footer}>
                <CustomizeAppButtonFilled
                  label="Save to Wardrobe"
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F6F7",
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
    color: "#6B7280",
    textAlign: "center",
  },
  imageContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: SHEET_PEEK_H + 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#E9EBEE",
    borderWidth: 1,
    borderColor: "#E9EBEE",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    backgroundColor: "#0C0C0C",
    zIndex: 10,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#D5D9DE",
  },
  peekHint: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: "#6B7280",
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
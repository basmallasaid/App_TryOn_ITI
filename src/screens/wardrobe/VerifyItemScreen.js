import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import Colors from "../../constants/theme/colors";
import { useWardrobe } from "../../context/WardrobeContext";
import { saveToWardrobe } from "../../api/wardrobe_services/wardrobeService";
import SelectionChip from "../../components/wardrobe/SelectionChip";
import QuestionGroup from "../../components/wardrobe/QuestionGroup";
import CustomizeTextInput from "../../components/common/CustomizeTextInput";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import CustomizeAppButtonOutlined from "../../components/common/CustomizeAppButtonOutlined";
import CustomBackButton from "../../components/common/CustomBackButton";

const CATEGORIES = ["Basic", "Bottom", "Top", "Bag", "Shoes", "Jacket", "Accessories"];
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
    categories: matchToOptions(normalize(garment.category), CATEGORIES),
    seasons: matchToOptions(normalize(garment.season), SEASONS),
    styles: matchToOptions(normalize(garment.style), STYLES),
  });

  const [loading, setLoading] = useState(false);

  const toggleSelection = (field, value) => {
    setForm((prev) => {
      const current = prev[field];
      const isSelected = current.includes(value);
      return {
        ...prev,
        [field]: isSelected
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveToWardrobe(analysisResult.analysis_id, 0);
      await refetch();
      navigation.navigate("WardrobeMain");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1. Back Arrow - Wrapped in View to ensure zIndex and absolute position work */}
      <View style={styles.backBtnWrapper}>
        <CustomBackButton
          onPress={() => navigation.goBack()}
          iconColor={Colors.borderDefault}
          borderColor={Colors.textMuted}
          backgroundColor={"transparent"}
        />
      </View>

      {/* 2. Header - Behind the overlay */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Add to Wardrobe</Text>
        <Text style={styles.subtitle}>Review & confirm details</Text>
      </View>

      {/* ── Image ── */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* ── Dark overlay + bottom sheet ── */}
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.bottomSheet}>
            <ScrollView
              contentContainerStyle={styles.sheetContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.handle} />
              <View style={styles.inputGap}>
                <CustomizeTextInput
                  label="Name"
                  placeholder="Enter item name"
                  value={form.name}
                  onChangeText={(v) => setForm((prev) => ({ ...prev, name: v }))}
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
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  headerContainer: {
    paddingTop: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight ?? 40) + 12,
    alignItems: "center",
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
  },
  backBtnWrapper: {
    position: "absolute",
    left: 16,
    top: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight ?? 40) + 12,
    zIndex: 20, // Above overlay
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 22,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  imageContainer: {
    width: "90%",
    height: 280,
    marginTop: 140,
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12,12,12,0.75)",
    justifyContent: "flex-end",
    zIndex: 10,
  },
  keyboardView: {
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "65%",
    width: "100%",
  },
  sheetContent: {
    padding: 24,
    paddingBottom: 30,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D5D9DE",
    alignSelf: "center",
  },
  inputGap: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 60,
  },
});

export default VerifyItemScreen;
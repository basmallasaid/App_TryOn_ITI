import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { saveToWardrobe } from "../../api/wardrobe_services/wardrobeService";
import CustomizeTextInput from "../../components/common/CustomizeTextInput";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import SaveResultModal from "../../components/wardrobe/SaveResultModal";
import Colors from "../../constants/theme/colors";
import { useWardrobe} from "../../context/WardrobeContext";

const VerifyItemScreen = ({ route, navigation }) => {
  const { imageUri, analysisResult } = route.params;
  // analysisResult = { analysis_id, garments[], detectionType }
  const garment = analysisResult?.garments?.[0] ?? {};
  const { refetch } = useWardrobe();
  const [form, setForm] = useState({
    name: garment.specificType || "",
    category: garment.category || "",
    style: garment.style || "",
    season: garment.season?.join(", ") || "",
    color: garment.colors?.[0]?.color || "",
  });

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const update = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveToWardrobe(analysisResult.analysis_id, 0);
      await refetch(); // sync wardrobe context — all features get updated data
      setSaveSuccess(true);
    } catch (e) {
      setSaveSuccess(false);
      setSaveMessage(e.response?.data?.message || "Failed to save item.");
    } finally {
      setLoading(false);
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (saveSuccess) {
      navigation.navigate("WardrobeMain"); // go back to wardrobe
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Back */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Verify Item Details</Text>
        <Text style={styles.subtitle}>
          Review the details we detected. You can edit anything before saving.
        </Text>

        {/* Image preview */}
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.preview}
            resizeMode="cover"
          />
        )}

        {/* Editable fields */}
        <View style={styles.form}>
          <CustomizeTextInput
            label="Name"
            placeholder="Item name"
            value={form.name}
            onChangeText={update("name")}
          />
          <CustomizeTextInput
            label="Category"
            placeholder="e.g. dress, shirt"
            value={form.category}
            onChangeText={update("category")}
          />
          <CustomizeTextInput
            label="Style"
            placeholder="e.g. casual, formal"
            value={form.style}
            onChangeText={update("style")}
          />
          <CustomizeTextInput
            label="Season"
            placeholder="e.g. spring, summer"
            value={form.season}
            onChangeText={update("season")}
          />
          <CustomizeTextInput
            label="Primary Color"
            placeholder="e.g. light blue"
            value={form.color}
            onChangeText={update("color")}
          />
        </View>

        {/* Colors breakdown */}
        {garment.colors?.length > 0 && (
          <View style={styles.colorsWrap}>
            <Text style={styles.colorsTitle}>Detected Colors</Text>
            <View style={styles.colorsList}>
              {garment.colors.map((c, i) => (
                <View key={i} style={styles.colorChip}>
                  <Text style={styles.colorText}>
                    {c.color} {c.percentage}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Save button */}
        <View style={styles.buttonWrap}>
          <CustomizeAppButtonFilled
            label="Save to Wardrobe"
            onPress={handleSave}
            loading={loading}
            backgroundColor={Colors.primary}
          />
        </View>
      </ScrollView>

      <SaveResultModal
        visible={modalVisible}
        success={saveSuccess}
        message={saveMessage}
        onClose={handleModalClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F6F7",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  back: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 24,
    color: "#121826",
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 18,
  },
  preview: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "#E9EBEE",
  },
  form: {
    gap: 4,
  },
  colorsWrap: {
    marginTop: 16,
    marginBottom: 8,
  },
  colorsTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 13,
    color: "#121826",
    marginBottom: 10,
  },
  colorsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#E9EBEE",
  },
  colorText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: "#475569",
    textTransform: "capitalize",
  },
  buttonWrap: {
    marginTop: 28,
  },
});

export default VerifyItemScreen;

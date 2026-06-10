import { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useProfileContext } from "../../context/ProfileContext";
import { analyzeGarment } from "../../api/wardrobe_services/wardrobeService";
import { getCategoriesByGender } from "../../constants/wardrobe/wardrobeCategories";
import WardrobeHealthCard from "../../components/wardrobe/WardrobeHealthCard";
import CategoryChip from "../../components/wardrobe/CategoryChip";
import AddItemCard from "../../components/wardrobe/AddItemCard";
import WardrobeItemCard from "../../components/wardrobe/WardrobeItemCard";
import Colors from "../../constants/theme/colors";
import { useWardrobe } from "../../context/WardrobeContext";
import * as ImageManipulator from "expo-image-manipulator";
import { openCamera, openGallery } from "../../utils/cameraAccess";
import SelectionModal from "../../components/wardrobe/SelectionModal";

const WardrobeScreen = ({ navigation }) => {
  const { items, loading, error, refetch } = useWardrobe();
  const { profile } = useProfileContext();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [analyzing, setAnalyzing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Refetch when screen comes back into focus (after adding item)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Gender-based categories
  const gender = profile?.profile?.gender ?? null;
  const categories = getCategoriesByGender(gender);

  // Filter items by selected category
  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter(
          (item) =>
            item.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );

  const listData = [{ _id: "add-item", type: "add" }, ...filteredItems];

  const handleAddItem = () => {
    if (Platform.OS === "ios") {
      // iOS: Use native Alert
      Alert.alert("Add Item", "Choose a source", [
        { text: "Camera", onPress: () => pickImage("camera") },
        { text: "Gallery", onPress: () => pickImage("gallery") },
        { text: "Cancel", style: "cancel" },
      ]);
    } else {
      // Android: Show custom SelectionModal
      setIsModalVisible(true);
    }
  };

  const pickImage = async (source) => {
    // Only call this for Android; it's harmless on iOS
    if (Platform.OS === "android") {
      setIsModalVisible(false);
    }

    try {
      const result =
        source === "camera" ? await openCamera() : await openGallery();

      if (!result || result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      await handleAnalyze(asset);
    } catch (err) {
      console.error("Picker Error Details:", err);
      Alert.alert("Error", "An error occurred while selecting the image.");
    }
  };

  // Analyze image
  const handleAnalyze = async (asset) => {
    try {
      setAnalyzing(true);

      // 1. Compress the image
      const compressed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 800 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      // 2. Prepare Form Data
      const formData = new FormData();

      // Create the file object
      // In React Native, the object must have 'uri', 'name', and 'type'
      const filename = compressed.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("image", {
        uri:
          Platform.OS === "android"
            ? compressed.uri
            : compressed.uri.replace("file://", ""),
        name: filename,
        type: type,
      });

      // 3. Send to API
      const analysisResult = await analyzeGarment(formData);

      navigation.navigate("VerifyItem", {
        imageUri: compressed.uri,
        analysisResult,
      });
    } catch (e) {
      console.log("Full Error Object:", e);
      if (e.response) {
        console.log("Server Data Error:", e.response.data);
      }
      Alert.alert(
        "Analysis Failed",
        e.response?.data?.error ||
          e.response?.data?.message ||
          "Could not analyze this image.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <View style={styles.root}>
       {/* 1. Conditionally render Modal only for Android */}
      {Platform.OS === "android" && (
        <SelectionModal
          visible={isModalVisible}
          title="Add Item"
          subtitle="Choose a source"
          onClose={() => setIsModalVisible(false)}
          onCamera={() => pickImage("camera")}
          onGallery={() => pickImage("gallery")}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]} // make category filter sticky
        contentContainerStyle={styles.scroll}
      >
        {/* Health card */}
        <View style={styles.section}>
          <WardrobeHealthCard itemCount={items.length} />
        </View>

        {/* Sticky category filter */}
        <View style={styles.categoryBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onPress={() => setSelectedCategory(cat)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Loading state */}
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        {/* Analyzing overlay */}
        {analyzing && (
          <View style={styles.analyzingWrap}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.analyzingText}>Analyzing your item...</Text>
          </View>
        )}

        {/* Error state */}
        {error && !loading && <Text style={styles.errorText}>{error}</Text>}

        {/* Grid */}
        {!loading && (
          <FlatList
            data={listData}
            keyExtractor={(item) => item._id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              if (item.type === "add") {
                return <AddItemCard onPress={handleAddItem} />;
              }

              return <WardrobeItemCard item={item} />;
            }}
            style={styles.grid}
            columnWrapperStyle={styles.row}
          />
        )}

        {/* Empty state */}
        {!loading && filteredItems.length === 0 && (
          <View style={styles.emptyWrap}>
            <Ionicons name="shirt-outline" size={48} color="#D5D9DE" />
            <Text style={styles.emptyText}>
              {selectedCategory === "All"
                ? "Your wardrobe is empty.\nTap + to add your first item!"
                : `No ${selectedCategory} items yet.`}
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 30,
  },
  categoryBar: {
    backgroundColor: "#F5F6F7",
    paddingTop: 8,
    paddingBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  row: {
    gap:12,
    //justifyContent: "space-between",
    marginBottom: 16,
  },
  loadingWrap: {
    paddingTop: 60,
    alignItems: "center",
  },
  analyzingWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
    backgroundColor: "#E5F2FF",
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  analyzingText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 13,
    color: Colors.primary,
  },
  errorText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: Colors.error,
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 32,
  },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 48,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default WardrobeScreen;

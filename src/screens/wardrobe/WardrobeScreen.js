// import React, { useState, useCallback, useMemo } from "react";
// import {
//   View,
//   FlatList,
//   StyleSheet,
//   Text,
//   Alert,
//   Platform,
//   StatusBar,
//   ActivityIndicator,
//   Dimensions,
// } from "react-native";
// import { useFocusEffect } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import { useProfileContext } from "../../context/ProfileContext";
// import { analyzeGarment } from "../../api/wardrobe_services/wardrobeService";
// import { getCategoriesByGender } from "../../constants/wardrobe/wardrobeCategories";
// import WardrobeHealthCard from "../../components/wardrobe/WardrobeHealthCard";
// import CategoryChip from "../../components/wardrobe/CategoryChip";
// import AddItemCard from "../../components/wardrobe/AddItemCard";
// import WardrobeItemCard from "../../components/wardrobe/WardrobeItemCard";
// import Colors from "../../constants/theme/colors";
// import { useWardrobe } from "../../context/WardrobeContext";
// import * as ImageManipulator from "expo-image-manipulator";
// import { openCamera, openGallery } from "../../utils/cameraAccess";
// import SelectionModal from "../../components/wardrobe/SelectionModal";

// const { width } = Dimensions.get("window");

// const WardrobeScreen = ({ navigation }) => {
//   const { items, loading, error, refetch } = useWardrobe();
//   const { profile } = useProfileContext();

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [analyzing, setAnalyzing] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   useFocusEffect(
//     useCallback(() => {
//       refetch();
//     }, [refetch])
//   );

//   const gender = profile?.profile?.gender ?? null;
//   const categories = getCategoriesByGender(gender);

//   const filteredItems = useMemo(() => {
//     return selectedCategory === "All"
//       ? items
//       : items.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase());
//   }, [items, selectedCategory]);

//   const listData = useMemo(() => [{ _id: "add-item", type: "add" }, ...filteredItems], [filteredItems]);

//   const handleAddItem = () => {
//     if (Platform.OS === "ios") {
//       Alert.alert("Add Item", "Choose a source", [
//         { text: "Camera", onPress: () => pickImage("camera") },
//         { text: "Gallery", onPress: () => pickImage("gallery") },
//         { text: "Cancel", style: "cancel" },
//       ]);
//     } else {
//       setIsModalVisible(true);
//     }
//   };

//   const pickImage = async (source) => {
//     if (Platform.OS === "android") setIsModalVisible(false);
//     try {
//       const result = source === "camera" ? await openCamera() : await openGallery();
//       if (!result || result.canceled || !result.assets) return;
//       await handleAnalyze(result.assets[0]);
//     } catch (err) {
//       Alert.alert("Error", "An error occurred while selecting the image.");
//     }
//   };

//   const handleAnalyze = async (asset) => {
//     try {
//       setAnalyzing(true);
//       const compressed = await ImageManipulator.manipulateAsync(
//         asset.uri,
//         [{ resize: { width: 800 } }],
//         { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
//       );

//       const formData = new FormData();
//       const filename = compressed.uri.split("/").pop();
//       const match = /\.(\w+)$/.exec(filename);
//       const type = match ? `image/${match[1]}` : `image/jpeg`;

//       formData.append("image", {
//         uri: Platform.OS === "android" ? compressed.uri : compressed.uri.replace("file://", ""),
//         name: filename,
//         type: type,
//       });

//       const analysisResult = await analyzeGarment(formData);
//       navigation.navigate("VerifyItem", { imageUri: compressed.uri, analysisResult });
//     } catch (e) {
//       Alert.alert("Analysis Failed", e.response?.data?.error || "Could not analyze this image.");
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   const renderHeader = () => (
//     <View style={styles.headerContainer}>
//       <View style={styles.section}>
//         <WardrobeHealthCard itemCount={items.length} />
//       </View>

//       <View style={styles.categoryBar}>
//         <FlatList
//           horizontal
//           data={categories}
//           keyExtractor={(item) => item}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoryScroll}
//           renderItem={({ item }) => (
//             <CategoryChip
//               label={item}
//               selected={selectedCategory === item}
//               onPress={() => setSelectedCategory(item)}
//             />
//           )}
//           style={{alignSelf:"center"}}
//         />
//       </View>

//       {analyzing && (
//         <View style={styles.analyzingWrap}>
//           <ActivityIndicator size="small" color={Colors.primary} />
//           <Text style={styles.analyzingText}>Analyzing your item...</Text>
//         </View>
//       )}

//       {loading && (
//         <View style={styles.loadingWrap}>
//           <ActivityIndicator size="large" color={Colors.primary} />
//         </View>
//       )}

//       {error && !loading && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );

//   const renderEmpty = () => {
//     if (loading) return null;
//     return (
//       <View style={styles.emptyWrap}>
//         <Ionicons name="shirt-outline" size={48} color="#D5D9DE" />
//         <Text style={styles.emptyText}>
//           {selectedCategory === "All"
//             ? "Your wardrobe is empty.\nTap + to add your first item!"
//             : `No ${selectedCategory} items yet.`}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.root}>
//       {Platform.OS === "android" && (
//         <SelectionModal
//           visible={isModalVisible}
//           onClose={() => setIsModalVisible(false)}
//           onCamera={() => pickImage("camera")}
//           onGallery={() => pickImage("gallery")}
//           title="Add Item"
//           subtitle="Choose a source"
//         />
//       )}

//       {!loading && (<FlatList
//         data={listData}
//         keyExtractor={(item) => item._id}
//         numColumns={2}
//         ListHeaderComponent={renderHeader}
//         ListEmptyComponent={renderEmpty}
//         renderItem={({ item }) =>
//           item.type === "add" ? (
//             <AddItemCard onPress={handleAddItem} />
//           ) : (
//             <WardrobeItemCard item={item} />
//           )
//         }
//         columnWrapperStyle={styles.row}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       />)}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: "#F5F6F7",
//     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//   },
//   scrollContent: {
//     paddingBottom: 30,
//   },
//   headerContainer: {
//     backgroundColor: "#F5F6F7",
//   },
//   section: {
//     paddingHorizontal: 16,
//     paddingTop: 30,
//     paddingBottom: 10,
//   },
//   categoryBar: {
//     paddingVertical: 10,
//   },
//   categoryScroll: {
//     paddingHorizontal: 16,
//     gap: 8,
//   },
//   row: {
//     paddingHorizontal: 16,
//     gap:15,
//   },
//   loadingWrap: {
//     paddingVertical: 40,
//     alignItems: "center",
//   },
//   analyzingWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     paddingVertical: 12,
//     backgroundColor: "#E5F2FF",
//     marginHorizontal: 16,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   analyzingText: {
//     fontFamily: "Roboto_500Medium",
//     fontSize: 13,
//     color: Colors.primary,
//   },
//   errorText: {
//     color: Colors.error,
//     textAlign: "center",
//     padding: 20,
//   },
//   emptyWrap: {
//     alignItems: "center",
//     paddingTop: 60,
//   },
//   emptyText: {
//     color: "#6B7280",
//     textAlign: "center",
//     marginTop: 10,
//   },
// });

// export default WardrobeScreen;
import React, { useState, useCallback, useMemo } from "react";
import { View, FlatList, StyleSheet, Text, Alert, Platform, StatusBar, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useProfileContext } from "../../context/ProfileContext";
import { analyzeGarment } from "../../api/wardrobe_services/wardrobeService";
import { getCategoriesByGender } from "../../constants/wardrobe/wardrobeCategories";
import WardrobeHealthCard from "../../components/wardrobe/WardrobeHealthCard";
import CategoryChip from "../../components/wardrobe/CategoryChip";
import AddItemCard from "../../components/wardrobe/AddItemCard";
import WardrobeItemCard from "../../components/wardrobe/WardrobeItemCard";
import WardrobeEmptyState from "../../components/wardrobe/WardrobeEmptyState"; 
import SelectionModal from "../../components/wardrobe/SelectionModal";
import Colors from "../../constants/theme/colors";
import { useWardrobe } from "../../context/WardrobeContext";
import * as ImageManipulator from "expo-image-manipulator";
import { openCamera, openGallery } from "../../utils/cameraAccess";

const WardrobeScreen = ({ navigation }) => {
  const { items, loading, error, refetch } = useWardrobe();
  const { profile } = useProfileContext();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [analyzing, setAnalyzing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const gender = profile?.profile?.gender ?? null;
  const categories = getCategoriesByGender(gender);

  const filteredItems = useMemo(() => {
    return selectedCategory === "All"
      ? items
      : items.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [items, selectedCategory]);

  const listData = useMemo(() => [{ _id: "add-item", type: "add" }, ...filteredItems], [filteredItems]);

  const handleAddItem = () => {
    if (Platform.OS === "ios") {
      Alert.alert("Add Item", "Choose a source", [
        { text: "Camera", onPress: () => pickImage("camera") },
        { text: "Gallery", onPress: () => pickImage("gallery") },
        { text: "Cancel", style: "cancel" },
      ]);
    } else {
      setIsModalVisible(true);
    }
  };

  const pickImage = async (source) => {
    if (Platform.OS === "android") setIsModalVisible(false);
    try {
      const result = source === "camera" ? await openCamera() : await openGallery();
      if (!result || result.canceled || !result.assets) return;
      await handleAnalyze(result.assets[0]);
    } catch (err) {
      Alert.alert("Error", "An error occurred while selecting the image.");
    }
  };

  const handleAnalyze = async (asset) => {
    try {
      setAnalyzing(true);
      const compressed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const formData = new FormData();
      const filename = compressed.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("image", {
        uri: Platform.OS === "android" ? compressed.uri : compressed.uri.replace("file://", ""),
        name: filename,
        type: type,
      });

      const analysisResult = await analyzeGarment(formData);
      navigation.navigate("VerifyItem", { imageUri: compressed.uri, analysisResult });
    } catch (e) {
      Alert.alert("Analysis Failed", e.response?.data?.error || "Could not analyze this image.");
    } finally {
      setAnalyzing(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.section}>
        <WardrobeHealthCard itemCount={items.length} />
      </View>
      <View style={styles.categoryBar}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          renderItem={({ item }) => (
            <CategoryChip
              label={item}
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
            />
          )}
          style={{ alignSelf: "center" }}
        />
      </View>
      {analyzing && (
        <View style={styles.analyzingWrap}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.analyzingText}>Analyzing your item...</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.root}>
      {/* SelectionModal must be available for Android users on this screen */}
      {Platform.OS === "android" && (
        <SelectionModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onCamera={() => pickImage("camera")}
          onGallery={() => pickImage("gallery")}
          title="Add Item"
          subtitle="Choose a source"
        />
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : items.length === 0 ? (
        /* Render separate component if wardrobe is empty */
        <WardrobeEmptyState onAdd={handleAddItem} />
      ) : (
        /* Render Grid if items exist */
        <FlatList
          data={listData}
          keyExtractor={(item) => item._id}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) =>
            item.type === "add" ? (
              <AddItemCard onPress={handleAddItem} />
            ) : (
              <WardrobeItemCard item={item} />
            )
          }
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F6F7",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerContainer: {
    backgroundColor: "#F5F6F7",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
  },
  categoryBar: {
    paddingVertical: 10,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  row: {
    paddingHorizontal: 16,
    gap: 15,
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
    marginBottom: 10,
  },
  analyzingText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 13,
    color: Colors.primary,
  },
});

export default WardrobeScreen;
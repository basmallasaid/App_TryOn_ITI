import React, { useState } from "react";
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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { IMAGES } from "../../constants/images/images";
import ActionTab from "../../components/tryOn/ActionTab";
import WardrobeCard from "../../components/tryOn/WardrobeCard";

const WARDROBE_DATA = [
  { id: "1", image: IMAGES.ITEM_1 },
  { id: "2", image: IMAGES.ITEM_3 },
];

export default function TryOnScreen({ navigation }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("My Wardrobe");
  const [selectedItems, setSelectedItems] = useState([]);

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
        <View style={styles.modelContainer}>
          <Image
            source={IMAGES.MODEL}
            style={styles.modelImage}
            resizeMode="contain"
          />
        </View>

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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t("tryOn.virtualTryOn.activeWardrobe")}
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>
              {t("tryOn.virtualTryOn.seeAll")}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={WARDROBE_DATA}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20 }}
          renderItem={({ item }) => (
            <WardrobeCard
              item={item}
              isSelected={selectedItems.includes(item.id)}
              onToggle={toggleItem}
            />
          )}
        />

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

  generateBtn: {
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#A0AEC0" },
  activeBtn: { backgroundColor: "#1A202C" },
  generateBtnText: { color: "white", fontWeight: "700", fontSize: 16 },
});

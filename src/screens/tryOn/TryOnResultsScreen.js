import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { File, Directory, Paths } from 'expo-file-system';
import { saveLatestTryon } from '../../api/user_services/userService';
import { virtualTryOn } from '../../api/virtual_tryon_services/virtualTryonService';
import { ROUTES, SOURCE } from '../../navigation/routes';
import { useTranslation } from "react-i18next";
import CustomBackButton from '../../components/common/CustomBackButton';

const { width } = Dimensions.get('window');

const TryOnResult = ({ navigation, route }) => {
  const { t } = useTranslation();
  const result = route?.params?.result || {};
  const productImage = route?.params?.productImage;
  const avatarImage = route?.params?.avatarImage;
  const photoUri = route?.params?.photoUri;
  const personImage = avatarImage || photoUri;
  const isStoreFlow = !!(productImage && personImage);
  const resultImage = result?.image_url || result?.image || result?.imageUrl || result?.url || null;
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [storeResult, setStoreResult] = useState(null);
  const [generateError, setGenerateError] = useState(null);

  const displayImage = storeResult?.image_url || storeResult?.image || storeResult?.imageUrl || storeResult?.url || resultImage;

  useEffect(() => {
    if (isStoreFlow) {
      handleStoreGenerate();
    }
  }, []);

  const resolveToFile = async (uri) => {
    if (!uri) return null;
    if (uri.startsWith("data:image")) {
      const matches = uri.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) return uri;
      const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
      const file = new File(Paths.cache, `store_garment_${Date.now()}.${ext}`);
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

  const appendToFormData = (fd, fieldName, uri) => {
    const name = uri.split("/").pop() || `${fieldName}.jpg`;
    fd.append(fieldName, {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      name,
      type: `image/${name.split(".").pop() || "jpeg"}`,
    });
  };

  const handleStoreGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const personUri = await resolveToFile(personImage);
      const garmentUri = await resolveToFile(productImage);
      const formData = new FormData();
      appendToFormData(formData, "personImage", personUri);
      appendToFormData(formData, "garmentImage", garmentUri);
      const res = await virtualTryOn(formData);
      setStoreResult(res);
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.error || e.message || t("tryOn.results.generationFailed");
      setGenerateError(msg);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!displayImage) return;
    setSaving(true);
    try {
      await saveLatestTryon({
        imageUrl: displayImage,
        taskId: (storeResult || result)?.taskId,
        model: (storeResult || result)?.model,
      });
      Alert.alert(t("tryOn.results.saved"), t("tryOn.results.savedMessage"));
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.error || e.message || t("tryOn.results.saveFailed");
      Alert.alert(t("common.error"), msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.header, { flexDirection: "row" }]}>
          <CustomBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>{t("tryOn.results.title")}</Text>
          <TouchableOpacity>
            <Icon name="help-circle-outline" size={28} color="#546e7a" />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          {generating ? (
            <View style={styles.generatingOverlay}>
              <ActivityIndicator size="large" color="#4AB8FF" />
              <Text style={styles.generatingText}>{t("tryOn.results.generating")}</Text>
            </View>
          ) : generateError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{generateError}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={handleStoreGenerate}>
                <Text style={styles.retryBtnText}>{t("tryOn.results.retry")}</Text>
              </TouchableOpacity>
            </View>
          ) : displayImage ? (
            <Image
              source={{ uri: displayImage }}
              style={styles.mainImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.placeholderText}>{t("tryOn.results.noResultImage")}</Text>
          )}
        </View>

        <View style={[styles.footer, { flexDirection: "row" }]}>
          <TouchableOpacity
            style={[styles.saveButton, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>{t("tryOn.results.save")}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => {
              if (isStoreFlow) {
                navigation.navigate(ROUTES.TRY_ON, { screen: ROUTES.SELECT_MODEL, params: { productImage, source: SOURCE.STORE } });
              } else {
                navigation.navigate(ROUTES.SELECT_MODEL);
              }
            }}
          >
            <Text style={styles.tryAgainText}>{t("tryOn.results.tryAgain")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#101828',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  mainImage: {
    width: width * 0.9,
    height: '100%',
  },
  placeholderText: {
    color: '#718096',
    fontSize: 16,
  },
  footer: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 30,
    paddingTop: 10,
  },
  generatingOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  generatingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#718096',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#4AB8FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4AB8FF',
    flex: 1,
    marginRight: 10,
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  tryAgainButton: {
    backgroundColor: '#F9FAF3',
    flex: 1,
    marginLeft: 10,
    height: 55,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#9ACD32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tryAgainText: {
    color: '#9ACD32',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TryOnResult;

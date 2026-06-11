import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { saveLatestTryon } from '../../api/user_services/userService';

const { width } = Dimensions.get('window');

const TryOnResult = ({ navigation, route }) => {
  const result = route?.params?.result || {};
  const resultImage = result?.image_url || result?.image || result?.imageUrl || result?.url || null;
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!resultImage) return;
    setSaving(true);
    try {
      await saveLatestTryon({
        imageUrl: resultImage,
        taskId: result?.taskId,
        model: result?.model,
      });
      Alert.alert("Saved", "Try-on result saved successfully.");
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.error || e.message || "Failed to save";
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#546e7a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Try-On Result</Text>
        <TouchableOpacity>
          <Icon name="help-circle-outline" size={28} color="#546e7a" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {resultImage ? (
          <Image
            source={{ uri: resultImage }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.placeholderText}>No result image available</Text>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tryAgainButton}
          onPress={() => navigation.navigate("SelectModel")}
        >
          <Text style={styles.tryAgainText}>Try again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 30,
    paddingTop: 10,
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

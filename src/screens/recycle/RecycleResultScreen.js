import React, { useState, useEffect } from "react";
import SafeScreen from "../../components/common/SafeScreen";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Svg, Path, Defs, ClipPath, Rect } from "react-native-svg";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import CustomBackButton from "../../components/common/CustomBackButton";
import { saveRecycleResult, getLatestRecycle } from "../../api/recycle_services/recycleService";
import { useFeedback } from "../../context/FeedbackContext";
import { getUserFriendlyErrorMessage } from "../../utils/errorMessages";
import { useRecentRecycles } from "../../context/RecentRecyclesContext";
import { useProfileContext } from "../../context/ProfileContext";
import { ROUTES, SOURCE } from '../../navigation/routes';

export default function RecycleResultScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const { showFeedback } = useFeedback();
  const { refresh: refreshRecentRecycles } = useRecentRecycles();
  const { refreshProfile } = useProfileContext();
  const [saving, setSaving] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);
  const {
    resultImageUri,
    designTitle,
    designTitleAr,
    designDescription,
    designDescriptionAr,
  } = route.params || {};

  const displayTitle = designTitle;
  const displayDescription = designDescription;

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const data = await getLatestRecycle();
        const exists = data.latestRecycle?.some((item) => item.imageUrl === resultImageUri);
        if (exists) setAlreadySaved(true);
      } catch (e) {
        // ignore
      }
    };
    if (resultImageUri) checkIfSaved();
  }, [resultImageUri]);

  const handleSaveToWardrobe = async () => {
    setSaving(true);
    try {
      await saveRecycleResult({
        imageUrl: resultImageUri,
        designTitle,
        designTitleAr,
        designDescription,
        designDescriptionAr,
      });
      setAlreadySaved(true);
      await Promise.all([refreshRecentRecycles(), refreshProfile()]);
      showFeedback({ type: "success", title: t("recycleResult.saved"), message: t("recycleResult.savedMessage") });
      navigation.popToTop();
    } catch (error) {
      if (error.response?.status === 409) {
        setAlreadySaved(true);
        showFeedback({ type: "success", title: t("recycleResult.alreadySaved"), message: t("recycleResult.alreadySavedMessage") });
      } else {
        showFeedback({ type: "error", title: t("recycleResult.saveFailed"), message: t("recycleResult.saveFailedMessage") });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTryAgain = () => {
    navigation.goBack();
  };
  const styles = React.useMemo(() => createStyles(), [themeVersion]);

  return (
    <SafeScreen style={styles.safeArea}>
      <View style={styles.header}>
        <CustomBackButton onPress={() => navigation.navigate(ROUTES.MAIN, { screen: ROUTES.HOME })} />
        <Text style={styles.headerTitle}>{t("recycleResult.title")}</Text>
        <TouchableOpacity style={styles.infoBtn}>
          <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <Path
              d="M9.95 16C10.3 16 10.5958 15.8792 10.8375 15.6375C11.0792 15.3958 11.2 15.1 11.2 14.75C11.2 14.4 11.0792 14.1042 10.8375 13.8625C10.5958 13.6208 10.3 13.5 9.95 13.5C9.6 13.5 9.30417 13.6208 9.0625 13.8625C8.82083 14.1042 8.7 14.4 8.7 14.75C8.7 15.1 8.82083 15.3958 9.0625 15.6375C9.30417 15.8792 9.6 16 9.95 16ZM9.05 12.15H10.9C10.9 11.6 10.9625 11.1667 11.0875 10.85C11.2125 10.5333 11.5667 10.1 12.15 9.55C12.5833 9.11667 12.925 8.70417 13.175 8.3125C13.425 7.92083 13.55 7.45 13.55 6.9C13.55 5.96667 13.2083 5.25 12.525 4.75C11.8417 4.25 11.0333 4 10.1 4C9.15 4 8.37917 4.25 7.7875 4.75C7.19583 5.25 6.78333 5.85 6.55 6.55L8.2 7.2C8.28333 6.9 8.47083 6.575 8.7625 6.225C9.05417 5.875 9.5 5.7 10.1 5.7C10.6333 5.7 11.0333 5.84583 11.3 6.1375C11.5667 6.42917 11.7 6.75 11.7 7.1C11.7 7.43333 11.6 7.74583 11.4 8.0375C11.2 8.32917 10.95 8.6 10.65 8.85C9.91667 9.5 9.46667 9.99167 9.3 10.325C9.13333 10.6583 9.05 11.2667 9.05 12.15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
              fill={Colors.iconGray}
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: resultImageUri }}
            style={styles.resultImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.designTitle}>{displayTitle}</Text>
          {displayDescription ? (
            <Text style={styles.designDescription}>{displayDescription}</Text>
          ) : null}
        </View>

        <View style={styles.buttonSection}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonSave}>
              <CustomizeAppButtonFilled
                label={alreadySaved ? t("recycleResult.alreadySaved") : saving ? t("recycleResult.saving") : t("recycleResult.save")}
                onPress={handleSaveToWardrobe}
                disabled={saving || alreadySaved}
                loading={saving}
                backgroundColor={Colors.primary}
              />
            </View>
            <View style={styles.buttonTry}>
              <CustomizeAppButtonFilled
                label={t("recycleResult.tryAgain")}
                onPress={handleTryAgain}
                outlined
                borderColor={Colors.success}
                textColor={Colors.success}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const createStyles = () => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  headerTitle: {
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    fontSize: 20,
    color: Colors.textPrimary,
  },
  infoBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 20,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  resultImage: {
    width: "100%",
    height: "100%",
  },
  detailsSection: {
    marginTop: 20,
  },
  designTitle: {
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  designDescription: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  buttonSection: {
    marginTop: 28,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  buttonSave: {
    flex: 1,
  },
  buttonTry: {
    flex: 1,
  },
});

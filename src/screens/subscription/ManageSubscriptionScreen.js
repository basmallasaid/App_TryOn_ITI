import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import i18n from "../../localization/i18n";
import CustomBackButton from "../../components/common/CustomBackButton";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import BenefitsList from "../../components/subscription/BenefitsList";
import CancelSubscriptionModal from "../../components/subscription/CancelSubscriptionModal";
import CancellationSuccessModal from "../../components/subscription/CancellationSuccessModal";
import * as paymentService from "../../api/payment_services/paymentService";
import { ROUTES } from "../../navigation/routes";
import { useAuth } from "../../context/AuthContext";
import { useFeedback } from "../../context/FeedbackContext";
import { getUserFriendlyErrorMessage } from "../../utils/errorMessages";

export default function ManageSubscriptionScreen({ navigation }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { themeVersion } = useTheme();
  const { showFeedback } = useFeedback();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

    const styles = React.useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: Colors.backgroundColor,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
        container: {
          flex: 1,
          paddingHorizontal: 20,
        },
        scrollContent: {
          paddingBottom: 50,
        },
        centered: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        header: {
          alignItems: "center",
          gap: 4,
          marginTop: 20,
          marginBottom: 24,
        },
        title: {
          fontFamily: "Roboto_700Bold",
          fontSize: 24,
          lineHeight: 38.4,
          color: Colors.textPrimary,
        },
        subtitle: {
          fontFamily: "Roboto_400Regular",
          fontSize: 12,
          lineHeight: 12,
          color: Colors.iconGray,
          textAlign: "center",
        },
        outerWrap: {
          gap: 39,
        },
        infoSection: {
          gap: 24,
        },
        contentCard: {
          backgroundColor: Colors.white,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: Colors.borderStrong,
          padding: 24,
          gap: 32,
        },
        benefitsSection: {
          gap: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: Colors.borderStrong,
        },
        badgeRow: {
          flexDirection: "row",
        },
        activeBadge: {
          backgroundColor: Colors.success,
          paddingHorizontal: 14,
          paddingVertical: 5,
          borderRadius: 999,
        },
        activeBadgeText: {
          fontFamily: "Roboto_600SemiBold",
          fontSize: 10,
          color: Colors.textInverse,
          letterSpacing: 0.5,
        },
        planWrap: {
          gap: 12,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: Colors.borderStrong,
        },
        planName: {
          fontFamily: "Roboto_700Bold",
          fontSize: 24,
          lineHeight: 38.4,
          color: Colors.textPrimary,
          textAlign: "left",
        },
        planSubtitle: {
          fontFamily: "Roboto_400Regular",
          fontSize: 12,
          lineHeight: 12,
          color: Colors.iconGray,
          textAlign: "left",
        },
        infoRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 16,
          paddingBottom: 24,
          borderBottomWidth: 1,
          borderBottomColor: Colors.borderStrong,
        },
        infoBox: {
          flex: 1,
          backgroundColor: Colors.white,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: Colors.borderStrong,
          paddingTop: 8,
          paddingRight: 16,
          paddingBottom: 8,
          paddingLeft: 16,
          gap: 8,
        },
        infoLabel: {
          fontFamily: "Roboto_600SemiBold",
          fontSize: 16,
          lineHeight: 16,
          color: Colors.textPrimary,
        },
        infoValue: {
          fontFamily: "Roboto_500Medium",
          fontSize: 14,
          lineHeight: 16.38,
          color: Colors.textSecondary,
        },
      }),
    [themeVersion],
  );

  const fetchSubscription = async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await paymentService.syncSubscription(user._id);

      if (data.subscriptionStatus === "active") {
        setSubscription(data);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !subscription) {
      navigation.navigate(ROUTES.SUBSCRIPTION);
    }
  }, [loading, subscription]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "\u2014";
    const d = new Date(dateStr);
    const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return d.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatBilling = (sub) => {
    const interval = sub?.interval || sub?.subscriptionInterval;
    const amount = sub?.amount || sub?.subscriptionAmount;
    const perUnit = interval === "year" ? t("subscription.perYear") : t("subscription.perMonth");
    if (amount) {
      const num = parseFloat(amount);
      return `$${num.toFixed(2)}${perUnit}`;
    }
    const price = interval === "year" ? t("subscriptionPrices.proYearly") : t("subscriptionPrices.proMonthly");
    return `${price}${perUnit}`;
  };

  const handleCancelConfirm = async () => {
    if (!user?._id) return;
    setCancelling(true);
    try {
      await paymentService.cancelSubscription(user._id);
      setModalVisible(false);
      setSuccessVisible(true);
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err, t);
      showFeedback({ type: "error", title: t("common.error"), message });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.error} />
        </View>
      </SafeAreaView>
    );
  }

  if (!subscription) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CustomBackButton
          onPress={() => navigation.navigate(ROUTES.PROFILE_MAIN)}
          iconColor={Colors.iconGray}
        />

        <View style={styles.header}>
          <Text style={styles.title}>{t("subscription.manageTitle")}</Text>
          <Text style={styles.subtitle}>
            {subscription.subscriptionPlan === "pro"
              ? t("subscription.manageSubtitle")
              : t("subscription.premiumSubtitle")}
          </Text>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.outerWrap}>
            <View style={styles.infoSection}>
              <View style={styles.planWrap}>
                <View style={styles.badgeRow}>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>{t("subscription.active")}</Text>
                  </View>
                </View>

                <Text style={styles.planName}>
                  {subscription.subscriptionPlan === "pro"
                    ? t("subscription.proStylist")
                    : t("subscription.premium")}
                </Text>
                <Text style={styles.planSubtitle}>{t("subscription.currentPlanLabel")}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>{t("subscription.billing")}</Text>
                  <Text style={styles.infoValue}>
                    {formatBilling(subscription)}
                  </Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>{t("subscription.renews")}</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(subscription.subscriptionEndDate)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.benefitsSection}>
              <BenefitsList
                title={t("subscription.yourBenefits")}
                items={t("subscription.benefitsList", { returnObjects: true })}
                iconColor={Colors.disabled}
              />
            </View>
          </View>

          <CustomizeAppButtonFilled
            label={t("subscription.cancelSubscription")}
            onPress={() => setModalVisible(true)}
            backgroundColor={Colors.error}
          />
        </View>
      </ScrollView>

      <CancelSubscriptionModal
        visible={modalVisible}
        keepLabel={t("subscription.keepSubscription")}
        confirmLabel={t("subscription.confirmCancellation")}
        onKeep={() => setModalVisible(false)}
        onConfirm={handleCancelConfirm}
        loading={cancelling}
        endDate={subscription.subscriptionEndDate}
      />

      <CancellationSuccessModal
        visible={successVisible}
        onClose={() => {
          setSuccessVisible(false);
          navigation.navigate(ROUTES.SUBSCRIPTION);
        }}
      />
    </SafeAreaView>
  );
}
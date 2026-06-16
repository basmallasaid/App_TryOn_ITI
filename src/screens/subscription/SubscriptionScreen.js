import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  Alert,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import CustomBackButton from "../../components/common/CustomBackButton";
import BillingToggle from "../../components/subscription/BillingToggle";
import PlanCard from "../../components/subscription/PlanCard";
import { ROUTES } from "../../navigation/routes";
import { useAuth } from "../../context/AuthContext";
import * as paymentService from "../../api/payment_services/paymentService";
import { useFeedback } from "../../context/FeedbackContext";
import { getUserFriendlyErrorMessage } from "../../utils/errorMessages";

export default function SubscriptionScreen({ navigation }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { themeVersion } = useTheme();
  const { showFeedback } = useFeedback();
  const [billing, setBilling] = useState("Monthly");
  const [loading, setLoading] = useState(false);

  const FEATURES_ESSENTIAL = t("subscription.featuresEssential", {
    returnObjects: true,
  });
  const FEATURES_PRO = t("subscription.featuresPro", { returnObjects: true });

  const isYearly = billing === "Yearly";
  const proPrice = isYearly ? t("subscriptionPrices.proYearly") : t("subscriptionPrices.proMonthly");
  const proPerUnit = isYearly
    ? t("subscription.perYear")
    : t("subscription.perMonth");
  const proFooter = isYearly
    ? t("subscription.footerYearly")
    : t("subscription.footerMonthly");

  const isSubscribed = false;

  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      if (url.startsWith("redolapy://subscription")) {
        paymentService.syncSubscription(user?._id).then(() => {
          navigation.navigate(ROUTES.MANAGE_SUBSCRIPTION);
        });
      }
    };
    const sub = Linking.addEventListener("url", handleDeepLink);
    return () => sub.remove();
  }, []);

  const handleSubscribe = async () => {
    if (!user?.token) {
      Alert.alert(t("subscription.authRequiredTitle"), t("subscription.authRequiredMessage"));
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = "redolapy://subscription/success";
      const data = await paymentService.createCheckoutSession(
        user._id,
        "pro",
        billing.toLowerCase() === "yearly" ? "year" : "month",
        redirectUrl,
        redirectUrl,
      );

      if (data.url) {
        try {
          await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        } catch {
          await WebBrowser.openBrowserAsync(data.url);
        }
      }

      await paymentService.syncSubscription(user._id);
      navigation.navigate(ROUTES.MANAGE_SUBSCRIPTION);
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err, t);
      showFeedback({ type: "error", title: t("subscription.checkoutError"), message });
    } finally {
      setLoading(false);
    }
  };

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
      header: {
        alignItems: "center",
        gap: 6,
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
        color: Colors.iconGray,
        textAlign: "center",
      },
      plansGap: {
        height: 16,
      },
      divider: {
        height: 1,
        backgroundColor: Colors.borderDefault,
        marginVertical: 24,
      },
      disclaimer: {
        fontFamily: "Roboto_400Regular",
        fontSize: 12,
        color: Colors.iconGray,
        textAlign: "center",
        lineHeight: 12,
        letterSpacing: 0,
      },
    }),
  [themeVersion],
);


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
          <Text style={styles.title}>{t("subscription.choosePlan")}</Text>
          <Text style={styles.subtitle}>{t("subscription.choosePlanSub")}</Text>
        </View>

        <BillingToggle selected={billing} onSelect={setBilling} />

        <View style={styles.plansGap} />

        <PlanCard
          name={t("subscription.essential")}
          price={t("subscriptionPrices.essentialPrice")}
          perUnit={t("subscriptionPrices.essentialPerUnit")}
          features={FEATURES_ESSENTIAL}
          buttonLabel={t("subscription.currentPlan")}
          buttonDisabled
          buttonOutlined
          cardStyle={{ padding: 24, backgroundColor: "transparent", gap: 8 }}
          priceStyle={{
            fontFamily: "PlusJakartaSans_700Bold",
            fontSize: 36,
            lineHeight: 38,
          }}
          planNameStyle={{ paddingBottom: 0 }}
          featuresListStyle={{ marginBottom: 22 }}
          buttonBorderColor={Colors.borderStrong}
          buttonTextColor={Colors.iconGray}
        />

        <View style={styles.plansGap} />

        <PlanCard
          badge={t("subscription.popular")}
          name={t("subscription.proStylist")}
          price={proPrice}
          perUnit={proPerUnit}
          description={t("subscription.includesEverything")}
          features={FEATURES_PRO}
          buttonLabel={
            isSubscribed
              ? t("subscription.manageSubscription")
              : t("subscription.subscribeNow")
          }
          highlighted
          footerText={proFooter}
          buttonLoading={loading}
          planNameStyle={{
            fontFamily: "PlusJakartaSans_400Regular",
            fontSize: 16,
            lineHeight: 24,
            paddingBottom: 0,
          }}
          cardStyle={{ padding: 24, backgroundColor: "transparent", gap: 8 }}
          priceStyle={{
            fontFamily: "PlusJakartaSans_700Bold",
            fontSize: 36,
            lineHeight: 38,
          }}
          badgeStyle={{
            width: 116,
            height: 23,
            borderRadius: 8,
            paddingVertical: 4,
            paddingHorizontal: 12,
            marginBottom: 16,
          }}
          badgeTextStyle={{
            fontFamily: "Roboto_500Medium",
            fontSize: 12,
            lineHeight: 12,
            letterSpacing: 0,
            textAlign: "center",
          }}
          descriptionStyle={{
            fontFamily: "Roboto_600SemiBold",
            fontSize: 16,
            lineHeight: 16,
            color: Colors.primary,
          }}
          featuresListStyle={{ gap: 8, paddingBottom: 8 }}
          featureTextStyle={{
            fontSize: 16,
            lineHeight: 16,
            color: Colors.textPrimary,
          }}
          contentWrapStyle={{ width: 315, gap: 24, marginBottom: 22 }}
          footerStyle={{
            marginTop: 16,
            fontFamily: "Roboto_400Regular",
            fontSize: 16,
            lineHeight: 16,
            letterSpacing: 0,
            color: Colors.iconGray,
            textAlign: "center",
          }}
          onButtonPress={
            isSubscribed
              ? () => navigation.navigate(ROUTES.MANAGE_SUBSCRIPTION)
              : handleSubscribe
          }
        />

        <View style={styles.divider} />

        <Text style={styles.disclaimer}>{t("subscription.disclaimer")}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
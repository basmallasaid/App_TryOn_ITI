import { useState, useEffect } from "react";
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
import CustomBackButton from "../../components/common/CustomBackButton";
import BillingToggle from "../../components/subscription/BillingToggle";
import PlanCard from "../../components/subscription/PlanCard";
import { ROUTES } from "../../navigation/routes";
import { useAuth } from "../../context/AuthContext";
import * as paymentService from "../../api/payment_services/paymentService";

const FEATURES_ESSENTIAL = [
  "AI Wardrobe Sync",
  "3 Daily Lookbooks",
  "Basic Virtual Try-On",
];

const FEATURES_PRO = [
  "Unlimited Lookbooks",
  "Hyper-Realistic Try-On",
  "Personal Style Coaching",
  "Early Access to Collections",
];

export default function SubscriptionScreen({ navigation }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [billing, setBilling] = useState("Monthly");
  const [loading, setLoading] = useState(false);

  const isYearly = billing === "Yearly";
  const proPrice = isYearly ? "$12.19/yr" : "$16.19/mo";
  const proFooter = isYearly
    ? "7 days free, then $12.19/year. Cancel anytime."
    : "7 days free, then $16.19/month. Cancel anytime.";

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
      Alert.alert("Authentication Required", "Please log in to subscribe.");
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
        redirectUrl
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
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      Alert.alert("Checkout Error", message);
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Unlock the full potential of your digital atelier.
          </Text>
        </View>

        <BillingToggle selected={billing} onSelect={setBilling} />

        <View style={styles.plansGap} />

        <PlanCard
          name="Essential"
          price="$0/mo"
          features={FEATURES_ESSENTIAL}
          buttonLabel="Current Plan"
          buttonDisabled
          buttonOutlined
        />

        <View style={styles.plansGap} />

        <PlanCard
          badge="POPULAR"
          name="Pro Stylist"
          price={proPrice}
          description="Includes everything in Essential, plus:"
          features={FEATURES_PRO}
          buttonLabel={isSubscribed ? "Manage Subscription" : "Subscribe Now"}
          highlighted
          footerText={proFooter}
          buttonLoading={loading}
          onButtonPress={isSubscribed ? () => navigation.navigate(ROUTES.MANAGE_SUBSCRIPTION) : handleSubscribe}
        />

        <View style={styles.divider} />

        <Text style={styles.disclaimer}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          Subscriptions will automatically renew unless canceled at least 24
          hours before the end of the current period.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
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
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
});

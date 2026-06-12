import { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import CustomBackButton from "../../components/common/CustomBackButton";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import BenefitsList from "../../components/subscription/BenefitsList";
import CancelSubscriptionModal from "../../components/subscription/CancelSubscriptionModal";
import CancellationSuccessModal from "../../components/subscription/CancellationSuccessModal";
import * as paymentService from "../../api/payment_services/paymentService";
import { ROUTES } from "../../navigation/routes";
import { useAuth } from "../../context/AuthContext";

const BENEFITS = [
  "Unlimited Lookbooks",
  "Hyper-Realistic Lookbooks",
  "Personal Style Coaching",
  "Early Access to Collections",
];

export default function ManageSubscriptionScreen({ navigation }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  // const fetchSubscription = async () => {
  //   if (!user?._id) {
  //     setLoading(false);
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const data = await paymentService.syncSubscription(user._id);
  //     if (data.subscriptionStatus === "active") {
  //       setSubscription(data);
  //     } else {
  //       setSubscription(null);
  //     }
  //   } catch {
  //     setSubscription(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchSubscription = async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await paymentService.syncSubscription(user._id);

      console.log("SYNC_SUBSCRIPTION RESPONSE:", JSON.stringify(data, null, 2));

      console.log("subscriptionInterval:", data?.subscriptionInterval);
      console.log("subscriptionPlan:", data?.subscriptionPlan);
      console.log("subscriptionStatus:", data?.subscriptionStatus);

      if (data.subscriptionStatus === "active") {
        setSubscription(data);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.log("SYNC_SUBSCRIPTION ERROR:", error);
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
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatBilling = (sub) => {
    const interval = sub?.interval || sub?.subscriptionInterval;
    const amount = sub?.amount || sub?.subscriptionAmount;
    if (amount) {
      const num = parseFloat(amount);
      return interval === "year"
        ? `$${num.toFixed(2)}/yr`
        : `$${num.toFixed(2)}/mo`;
    }
    return interval === "year" ? "$12.19/yr" : "$16.19/mo";
  };

  const handleCancelConfirm = async () => {
    if (!user?._id) return;
    setCancelling(true);
    try {
      await paymentService.cancelSubscription(user._id);
      setModalVisible(false);
      setSuccessVisible(true);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to cancel subscription.";
      Alert.alert("Error", message);
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
          <Text style={styles.title}>Manage Subscription</Text>
          <Text style={styles.subtitle}>
            {subscription.subscriptionPlan === "pro"
              ? "Pro Stylist Plan"
              : "Premium Plan"}
          </Text>
        </View>

        <View style={styles.subscriptionCard}>
          <View style={styles.badgeRow}>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE</Text>
            </View>
          </View>

          <Text style={styles.planName}>
            {subscription.subscriptionPlan === "pro"
              ? "Pro Stylist"
              : "Premium"}
          </Text>
          <Text style={styles.planSubtitle}>Your current plan</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Billing</Text>
              <Text style={styles.infoValue}>
                {formatBilling(subscription)}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Renews</Text>
              <Text style={styles.infoValue}>
                {formatDate(subscription.subscriptionEndDate)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.benefitsSection}>
          <BenefitsList
            title="Your benefits"
            items={BENEFITS}
            iconColor={Colors.disabled}
          />
        </View>

        <View style={styles.cancelWrap}>
          <CustomizeAppButtonFilled
            label="Cancel Subscription"
            onPress={() => setModalVisible(true)}
            backgroundColor={Colors.error}
          />
        </View>
      </ScrollView>

      <CancelSubscriptionModal
        visible={modalVisible}
        keepLabel="Keep Subscription"
        confirmLabel="Confirm Cancellation"
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  subscriptionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    padding: 20,
    gap: 12,
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
    color: Colors.white,
    letterSpacing: 0.5,
  },
  planName: {
    fontFamily: "Roboto_700Bold",
    fontSize: 22,
    color: Colors.textPrimary,
    textTransform: "uppercase",
  },
  planSubtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  infoBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    padding: 14,
    gap: 6,
  },
  infoLabel: {
    fontFamily: "Roboto_500Medium",
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 14,
    color: Colors.textPrimary,
  },
  benefitsSection: {
    marginTop: 28,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    padding: 20,
  },
  cancelWrap: {
    marginTop: 32,
  },
});

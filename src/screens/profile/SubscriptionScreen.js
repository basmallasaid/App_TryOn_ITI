import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/theme/colors';

const PLANS = [
  { id: 'monthly', price: '$9.99', period: 'month' },
  { id: 'yearly', price: '$79.99', period: 'year', badge: 'Best Value' },
];

export default function SubscriptionScreen() {
  const { t } = useTranslation();

  const handleSubscribe = (plan) => {
    Alert.alert("Demo", t("subscription.selectedPlan", { plan: plan.id }));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>{t('subscription.title')}</Text>
        <Text style={styles.subtitle}>{t('subscription.subtitle')}</Text>

        {PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => handleSubscribe(plan)}
            activeOpacity={0.85}
          >
            <View style={[styles.planHeader, { flexDirection: "row" }]}>
              <Text style={styles.planName}>{plan.id === 'monthly' ? t("subscription.monthly") : t("subscription.yearly")}</Text>
              {plan.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{t("subscription.bestValue")}</Text>
                </View>
              )}
            </View>
            <Text style={styles.planPrice}>{plan.price}<Text style={styles.planPeriod}>{plan.period === 'month' ? t("subscription.perMonth") : t("subscription.perYear")}</Text></Text>
            <View style={[styles.subscribeBtn, { flexDirection: "row" }]}>
              <Text style={styles.subscribeText}>{t('subscription.subscribe')}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 28,
    color: '#121826',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9EBEE',
  },
  planHeader: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  planName: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 18,
    color: '#121826',
  },
  badge: {
    backgroundColor: '#40B9FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    color: '#fff',
  },
  planPrice: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 32,
    color: '#121826',
    marginBottom: 16,
  },
  planPeriod: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  subscribeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.error,
    paddingVertical: 14,
    borderRadius: 8,
  },
  subscribeText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});

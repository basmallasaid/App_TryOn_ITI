import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useNotifications } from "../../context/NotificationContext";
import CustomBackButton from "../../components/common/CustomBackButton";
import Colors from "../../constants/theme/colors";

const NOTIF_ICONS = {
  tryon: { name: "tshirt-outline", color: "#40B9FF", bg: "#E9F7FE" },
  recycle: { name: "recycle", color: "#A6E22E", bg: "#F1F8E9" },
  outfit: { name: "sparkles", color: "#FF7D9A", bg: "#FFF0F3" },
  matching: { name: "shuffle", color: "#FF8A3D", bg: "#FFF3E0" },
};

function getNotifMeta(title = "") {
  const lower = title.toLowerCase();
  if (lower.includes("try") || lower.includes("tryon")) return NOTIF_ICONS.tryon;
  if (lower.includes("recycle")) return NOTIF_ICONS.recycle;
  if (lower.includes("outfit") || lower.includes("recommend")) return NOTIF_ICONS.outfit;
  if (lower.includes("match")) return NOTIF_ICONS.matching;
  return { name: "notifications-outline", color: "#6B7280", bg: "#F3F4F6" };
}

function formatRelativeTime(dateString) {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return new Date(dateString).toLocaleDateString();
}

export default function NotificationsScreen({ navigation }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchNotifications]);

  const handlePress = useCallback(
    (item) => {
      if (!item.read) markAsRead(item._id);
    },
    [markAsRead],
  );

  const handleDelete = useCallback(
    (id) => deleteNotification(id),
    [deleteNotification],
  );

  const handleMarkAll = useCallback(() => markAllAsRead(), [markAllAsRead]);

  const hasUnread = notifications.some((n) => !n.read);

  const renderItem = useCallback(
    ({ item }) => {
      const meta = getNotifMeta(item.title);
      return (
        <TouchableOpacity
          style={[styles.card, !item.read && styles.cardUnread]}
          onPress={() => handlePress(item)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.name} size={20} color={meta.color} />
          </View>

          <View style={styles.cardBody}>
            <View style={styles.cardTop}>
              <Text
                style={[styles.cardTitle, !item.read && styles.cardTitleBold]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            {item.body ? (
              <Text style={styles.cardBodyText} numberOfLines={2}>
                {item.body}
              </Text>
            ) : null}
            <Text style={styles.cardTime}>
              {formatRelativeTime(item.createdAt)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item._id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={16} color="#D5D9DE" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [handlePress, handleDelete],
  );

  const renderHeader = useCallback(() => {
    if (notifications.length === 0) return null;
    return (
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderCount}>
          {notifications.length}{" "}
          {t("notifications.title")?.toLowerCase() || "notifications"}
        </Text>
        {hasUnread ? (
          <TouchableOpacity style={styles.markAllChip} onPress={handleMarkAll}>
            <Ionicons name="checkmark-done" size={14} color={Colors.primary} />
            <Text style={styles.markAllText}>
              {t("notifications.markAllRead") || "Mark all read"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }, [notifications.length, hasUnread, t, handleMarkAll]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIconRing}>
          <Ionicons
            name="notifications-off-outline"
            size={36}
            color={Colors.white}
          />
        </View>
        <Text style={styles.emptyTitle}>
          {t("notifications.emptyTitle") || "All caught up"}
        </Text>
        <Text style={styles.emptySub}>
          {t("notifications.emptySubtitle") || "No notifications yet"}
        </Text>
      </View>
    );
  }, [loading, t]);

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>
          {t("notifications.title") || "Notifications"}
        </Text>
        <View style={{ width: 56 }} />
      </View>

      {loading && notifications.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            notifications.length === 0 ? styles.emptyContainer : styles.listPad
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F6F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: "Roboto_700Bold",
    fontSize: 18,
    color: Colors.textPrimary,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listPad: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyWrap: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: "Roboto_700Bold",
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  listHeaderCount: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 14,
    color: Colors.textMuted,
    textTransform: "capitalize",
  },
  markAllChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E9EBEE",
  },
  markAllText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    color: Colors.primary,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardUnread: {
    backgroundColor: "#F8FBFF",
    borderColor: "#E0F0FF",
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 15,
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  cardTitleBold: {
    fontFamily: "Roboto_700Bold",
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.primary,
  },
  cardBodyText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  cardTime: {
    fontFamily: "Roboto_400Regular",
    fontSize: 11,
    color: "#B0B5C0",
    marginTop: 6,
  },
  deleteBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 12,
  },
});

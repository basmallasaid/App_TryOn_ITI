import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useNotifications } from "../../context/NotificationContext";
import Colors from "../../constants/theme/colors";

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
  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchNotifications]);

  const handleNotificationPress = useCallback(
    (notification) => {
      if (!notification.read) {
        markAsRead(notification._id);
      }
    },
    [markAsRead],
  );

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const renderNotification = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.read && styles.notificationItemUnread,
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationDot}>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <View style={styles.notificationContent}>
          <Text
            style={[styles.notificationTitle, !item.read && styles.boldText]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {item.body ? (
            <Text style={styles.notificationBody} numberOfLines={2}>
              {item.body}
            </Text>
          ) : null}
          <Text style={styles.notificationTime}>
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={Colors.iconGray}
          style={styles.chevron}
        />
      </TouchableOpacity>
    ),
    [handleNotificationPress],
  );

  const keyExtractor = useCallback((item) => item._id, []);

  const hasUnread = notifications.some((n) => !n.read);

  const renderListHeader = useCallback(() => {
    if (notifications.length === 0) return null;
    return (
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>{t("notifications.title")}</Text>
        {hasUnread ? (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>
              {t("notifications.markAllRead")}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }, [notifications.length, hasUnread, t, handleMarkAllRead]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="notifications-off-outline"
          size={64}
          color={Colors.disabled}
        />
        <Text style={styles.emptyTitle}>
          {t("notifications.emptyTitle")}
        </Text>
        <Text style={styles.emptySubtitle}>
          {t("notifications.emptySubtitle")}
        </Text>
      </View>
    );
  }, [loading, t]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("notifications.title")}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {loading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            notifications.length === 0
              ? styles.emptyContainer
              : styles.listContent
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
  container: {
    flex: 1,
    backgroundColor: "#F4F4F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 58,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listHeaderTitle: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 16,
    color: Colors.textPrimary,
  },
  markAllText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 13,
    color: Colors.primary,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
    color: Colors.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  notificationItemUnread: {
    backgroundColor: "#F0F9FF",
  },
  notificationDot: {
    width: 20,
    alignItems: "center",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 8,
  },
  notificationTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 15,
    color: Colors.textPrimary,
  },
  boldText: {
    fontFamily: "Roboto_700Bold",
  },
  notificationBody: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  notificationTime: {
    fontFamily: "Roboto_400Regular",
    fontSize: 11,
    color: Colors.iconGray,
    marginTop: 4,
  },
  chevron: {
    marginLeft: 8,
  },
});

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useNotifications } from "../../context/NotificationContext";
import CustomBackButton from "../../components/common/CustomBackButton";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { translateNotification } from "../../utils/dynamicTranslator";
import i18n from "../../localization/i18n";

function getNotifMeta(title = "") {
  const lower = title.toLowerCase();
  if (lower.includes("try") || lower.includes("tryon")) return { name: "tshirt-outline", color: Colors.primary, bg: Colors.primaryLight };
  if (lower.includes("recycle")) return { name: "recycle", color: Colors.secondary, bg: Colors.secondaryLight };
  if (lower.includes("outfit") || lower.includes("recommend")) return { name: "sparkles", color: Colors.accent, bg: Colors.accentLight };
  if (lower.includes("match")) return { name: "shuffle", color: Colors.accentOrange, bg: Colors.accentLight };
  return { name: "notifications-outline", color: Colors.iconGray, bg: Colors.backgroundColor };
}

function formatRelativeTime(dateString, t) {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t("notifications.now");
  if (diffMins < 60) return t("notifications.minutesAgo", { count: diffMins });
  if (diffHours < 24) return t("notifications.hoursAgo", { count: diffHours });
  if (diffDays < 7) return t("notifications.daysAgo", { count: diffDays });
  return new Date(dateString).toLocaleDateString();
}

function formatFullDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const RECENT_DAYS = 20;

function isRecent(dateString) {
  const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
  return new Date(dateString).getTime() > cutoff;
}

export default function NotificationsScreen({ navigation }) {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
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
  const [expandedIds, setExpandedIds] = useState({});
  const [translatedNotifications, setTranslatedNotifications] = useState([]);

  const recentNotifications = useMemo(
    () => {
      const base = translatedNotifications.length > 0 ? translatedNotifications : notifications;
      return base.filter((n) => isRecent(n.createdAt));
    },
    [notifications, translatedNotifications],
  );

  useEffect(() => {
    const translateAll = async () => {
      if (i18n.language !== 'ar' || notifications.length === 0) return;
      const results = await Promise.all(
        notifications.map(n => translateNotification(n, 'ar'))
      );
      setTranslatedNotifications(results);
    };
    translateAll();
  }, [notifications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchNotifications]);

  const toggleExpand = useCallback((id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handlePress = useCallback(
    (item) => {
      if (!item.read) markAsRead(item._id);
      toggleExpand(item._id);
    },
    [markAsRead, toggleExpand],
  );

  const handleDelete = useCallback(
    (id) => deleteNotification(id),
    [deleteNotification],
  );

  const handleMarkAll = useCallback(() => markAllAsRead(), [markAllAsRead]);

  const hasUnread = recentNotifications.some((n) => !n.read);

  const renderItem = useCallback(
    ({ item }) => {
      const meta = getNotifMeta(item.title);
      const isExpanded = expandedIds[item._id] || false;
      const hasBody = !!item.body;

      return (
        <View style={[styles.card, !item.read && styles.cardUnread]}>
          <View style={[styles.iconCircle, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.name} size={20} color={meta.color} />
          </View>

          <Pressable
            style={styles.cardBody}
            onPress={() => handlePress(item)}
          >
            <View style={styles.cardTop}>
              <Text
                style={[styles.cardTitle, !item.read && styles.cardTitleBold]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>

            {hasBody ? (
              <Text
                style={styles.cardBodyText}
                numberOfLines={isExpanded ? undefined : 2}
              >
                {item.body}
              </Text>
            ) : null}

            {hasBody ? (
              <Text style={styles.expandToggle}>
                {isExpanded ? t("notifications.showLess") : t("notifications.showMore")}
              </Text>
            ) : null}

            <View style={styles.cardBottom}>
              <Text style={styles.cardTime}>
                {formatRelativeTime(item.createdAt, t)}
              </Text>
              {isExpanded ? (
                <Text style={styles.cardFullDate}>
                  {formatFullDate(item.createdAt)}
                </Text>
              ) : null}
            </View>
          </Pressable>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item._id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={16} color={Colors.iconGray} />
          </TouchableOpacity>
        </View>
      );
    },
    [handlePress, handleDelete, expandedIds, t],
  );

  const renderHeader = useCallback(() => {
    if (recentNotifications.length === 0) return null;
    return (
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderCount}>
          {recentNotifications.length}{" "}
          {t("notifications.title")?.toLowerCase() || t("notifications.title")}
        </Text>
        {hasUnread ? (
          <TouchableOpacity style={styles.markAllChip} onPress={handleMarkAll}>
            <Ionicons name="checkmark-done" size={14} color={Colors.primary} />
            <Text style={styles.markAllText}>
              {t("notifications.markAllRead")}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }, [recentNotifications.length, hasUnread, t, handleMarkAll]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIconRing}>
          <Ionicons
            name="notifications-off-outline"
            size={36}
            color={Colors.textInverse}
          />
        </View>
        <Text style={styles.emptyTitle}>
          {t("notifications.emptyTitle")}
        </Text>
        <Text style={styles.emptySub}>
          {t("notifications.emptySubtitle")}
        </Text>
      </View>
    );
  }, [loading, t]);

  const styles = React.useMemo(() => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
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
    backgroundColor: Colors.borderDefault,
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
    borderColor: Colors.borderDefault,
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
    borderColor: Colors.borderDefault,
  },
  cardUnread: {
    backgroundColor: Colors.backgroundColor,
    borderColor: Colors.borderDefault,
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
  expandToggle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  cardTime: {
    fontFamily: "Roboto_400Regular",
    fontSize: 11,
    color: Colors.disabled,
  },
  cardFullDate: {
    fontFamily: "Roboto_400Regular",
    fontSize: 11,
    color: Colors.disabled,
  },
  deleteBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 12,
  },
}), [themeVersion]);

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>
          {t("notifications.title")}
        </Text>
        <View style={{ width: 56 }} />
      </View>

      {loading && recentNotifications.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={recentNotifications}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            recentNotifications.length === 0 ? styles.emptyContainer : styles.listPad
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
          extraData={expandedIds}
        />
      )}
    </View>
  );
}

import { useCallback } from "react";
import { useNotifications as useNotifContext } from "../context/NotificationContext";
import { clearAllNotifications } from "../api/notification_services/notificationService";

export default function useNotifications() {
  const ctx = useNotifContext();

  const clearAll = useCallback(async () => {
    try {
      await clearAllNotifications();
      ctx.fetchNotifications();
    } catch {
      ctx.fetchNotifications();
    }
  }, [ctx.fetchNotifications]);

  return {
    notifications: ctx.notifications,
    unreadCount: ctx.unreadCount,
    loading: ctx.loading,
    expoPushToken: ctx.expoPushToken,
    fetchNotifications: ctx.fetchNotifications,
    markAsRead: ctx.markAsRead,
    deleteNotification: ctx.deleteNotification,
    markAllAsRead: ctx.markAllAsRead,
    clearAll,
  };
}

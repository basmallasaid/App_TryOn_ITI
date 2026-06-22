import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { AppState } from "react-native";
import { useAuth } from "./AuthContext";
import {
  requestPermissionsAndGetTokenAsync,
  setupNotificationListeners,
} from "../services/notificationService";
import * as notificationApi from "../api/notification_services/notificationService";
import { navigationRef } from "../utils/navigationRef";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState(null);
  const cleanupRef = useRef(null);
  const fetchRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const data = await notificationApi.getNotifications();
      const list = data.notifications || [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.read).length);
    } catch {
      // notification fetch failed silently
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  fetchRef.current = fetchNotifications;

  useEffect(() => {
    if (!user?.token) {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      setNotifications([]);
      setUnreadCount(0);
      setExpoPushToken(null);
      return;
    }

    let isMounted = true;

    const init = async () => {
      const token = await requestPermissionsAndGetTokenAsync();
      if (token && isMounted) {
        setExpoPushToken(token);
        try {
          await notificationApi.registerPushToken(token);
        } catch {
          // token registration failed silently
        }
      }

      if (isMounted) {
        const cleanup = setupNotificationListeners(
          () => {
            if (fetchRef.current) fetchRef.current();
          },
          () => {
            if (fetchRef.current) fetchRef.current();
            if (navigationRef.isReady()) {
              navigationRef.navigate("Profile", {
                screen: "Notifications",
              });
            }
          },
        );
        cleanupRef.current = cleanup;
      }
    };

    init();

    return () => {
      isMounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
    }
  }, [user?.token, fetchNotifications]);

  const appStateRef = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        fetchNotifications();
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationId) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      try {
        await notificationApi.markAsRead(notificationId);
      } catch {
        fetchRef.current?.();
      }
    },
    [],
  );

  const deleteNotification = useCallback(async (notificationId) => {
    let removedUnread = false;
    setNotifications((prev) =>
      prev.filter((n) => {
        if (n._id === notificationId) {
          if (!n.read) removedUnread = true;
          return false;
        }
        return true;
      }),
    );
    if (removedUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    try {
      await notificationApi.deleteNotification(notificationId);
    } catch {
      fetchRef.current?.();
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await notificationApi.markAllAsRead();
    } catch {
      fetchRef.current?.();
    }
  }, []);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    expoPushToken,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  }), [notifications, unreadCount, loading, expoPushToken, fetchNotifications, markAsRead, deleteNotification, markAllAsRead]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

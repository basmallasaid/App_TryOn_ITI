import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  try {
    await Notifications.setNotificationChannelAsync("default", {
      name: "ReDolapy",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default",
    });
  } catch (e) {
    // channel creation failed silently
  }
}

ensureAndroidChannel();

export async function requestPermissionsAndGetTokenAsync() {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    return null;
  }

  try {
    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;

    return token;
  } catch {
    return null;
  }
}

export function setupNotificationListeners(onReceived, onResponse) {
  const receivedSubscription =
    Notifications.addNotificationReceivedListener(onReceived);
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener(onResponse);

  return function cleanup() {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}

export async function scheduleLocalNotificationAsync({ content, trigger }) {
  return Notifications.scheduleNotificationAsync({
    content,
    trigger,
  });
}

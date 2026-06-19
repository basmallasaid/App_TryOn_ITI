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

export async function ensureAndroidChannel() {
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

export async function requestPermissionsAndGetTokenAsync() {
  if (!Device.isDevice) {
    console.warn("[Push] requestPermissionsAndGetTokenAsync: Not a physical device (emulator/simulator). Token registration skipped.");
    return null;
  }

  await ensureAndroidChannel();

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn(`[Push] requestPermissionsAndGetTokenAsync: Permission not granted. Status: ${finalStatus}`);
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    "f230f9f4-bc47-42d1-a245-df8407bd6bff"; // Fallback to app.json's projectId

  if (!projectId) {
    console.error("[Push] requestPermissionsAndGetTokenAsync: EAS Project ID not found in Constants config.");
    return null;
  }

  try {
    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;

    console.log(`[Push] requestPermissionsAndGetTokenAsync: Successfully obtained token: ${token}`);
    return token;
  } catch (error) {
    console.error("[Push] requestPermissionsAndGetTokenAsync: Error fetching Expo push token:", error.message || error);
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

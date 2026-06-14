import {
  requestPermissionsAndGetTokenAsync,
  setupNotificationListeners,
  scheduleLocalNotificationAsync,
} from "./notificationService";

export const getExpoPushToken = requestPermissionsAndGetTokenAsync;
export { setupNotificationListeners, scheduleLocalNotificationAsync };

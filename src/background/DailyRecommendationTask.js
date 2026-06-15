import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import * as SecureStore from 'expo-secure-store';
import {
  getAllRecommendations,
  requestRecommendations,
} from '../api/recommendations_services/recommendationsServices';
import { getToken, getUserId } from '../storage/TokenStorage';

const TASK_NAME = 'daily-recommendation-fetch';
const DAILY_OUTFIT_DATE_KEY = 'daily_outfit_date';
const DAILY_OUTFIT_DATA_KEY = 'daily_outfit_data';

const dailyKey = (key, userId) => userId ? `${key}_${userId}` : key;

function toUTCDateKey(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const token = await getToken();
    if (!token) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const userId = await getUserId();
    if (!userId) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const currentHour = new Date().getHours();
    if (currentHour < 6) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    // Step 1: Fetch history from server
    const { history: serverHistory } = await getAllRecommendations();

    // Step 2: Check if today's recommendation exists in server history
    const today = toUTCDateKey(new Date());
    const todayEntry = (serverHistory || []).find((entry) => {
      const rawDate = entry.created_at || entry.createdAt || null;
      if (!rawDate) return false;
      return toUTCDateKey(new Date(rawDate)) === today;
    });

    if (todayEntry) {
      // Today's recommendation already exists on server — nothing to do
      // Cache locally for offline fallback
      await SecureStore.setItemAsync(dailyKey(DAILY_OUTFIT_DATE_KEY, userId), today);
      await SecureStore.setItemAsync(dailyKey(DAILY_OUTFIT_DATA_KEY, userId), JSON.stringify(todayEntry));
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    // Step 3: No today entry — request new recommendation
    const result = await requestRecommendations();

    // Step 4: Cache locally
    await SecureStore.setItemAsync(dailyKey(DAILY_OUTFIT_DATE_KEY, userId), today);
    await SecureStore.setItemAsync(dailyKey(DAILY_OUTFIT_DATA_KEY, userId), JSON.stringify(result));

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (e) {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerDailyRecommendationTask() {
  try {
    const status = await BackgroundTask.getStatusAsync();
    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (isRegistered) {
      return;
    }

    await BackgroundTask.registerTaskAsync(TASK_NAME, {
      minimumInterval: 15,
    });
  } catch (e) {
  }
}

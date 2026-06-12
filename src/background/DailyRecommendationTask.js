import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import * as SecureStore from 'expo-secure-store';
import { requestRecommendations } from '../api/recommendations_services/recommendationsServices';
import { getToken, getUserId } from '../storage/TokenStorage';

const TASK_NAME = 'daily-recommendation-fetch';
const DAILY_OUTFIT_DATE_KEY = 'daily_outfit_date';
const DAILY_OUTFIT_DATA_KEY = 'daily_outfit_data';

const dailyKey = (key, userId) => userId ? `${key}_${userId}` : key;

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const token = await getToken();
    if (!token) {
      console.log('[BackgroundTask] No token, skipping');
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const today = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();

    if (currentHour < 6) {
      console.log('[BackgroundTask] Before 6am, skipping');
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const userId = await getUserId();
    const lastDate = await SecureStore.getItemAsync(dailyKey(DAILY_OUTFIT_DATE_KEY, userId));

    if (lastDate === today) {
      console.log('[BackgroundTask] Already fetched today');
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    console.log('[BackgroundTask] Fetching daily recommendation');
    const result = await requestRecommendations();
    console.log(`[BackgroundTask] POST succeeded, outfits=${result.outfits?.length}`);

    await SecureStore.setItemAsync(dailyKey(DAILY_OUTFIT_DATE_KEY, userId), today);
    await SecureStore.setItemAsync(dailyKey(DAILY_OUTFIT_DATA_KEY, userId), JSON.stringify(result));

    console.log('[BackgroundTask] Cache saved');
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (e) {
    console.error('[BackgroundTask] Failed', e);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerDailyRecommendationTask() {
  try {
    const status = await BackgroundTask.getStatusAsync();
    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
      console.warn('[BackgroundTask] Background tasks are restricted on this device');
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (isRegistered) {
      console.log('[BackgroundTask] Already registered');
      return;
    }

    await BackgroundTask.registerTaskAsync(TASK_NAME, {
      minimumInterval: 15,
    });
    console.log('[BackgroundTask] Registered successfully');
  } catch (e) {
    console.error('[BackgroundTask] Registration failed', e);
  }
}

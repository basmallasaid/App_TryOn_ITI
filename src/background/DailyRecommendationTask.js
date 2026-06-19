import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { getAllRecommendations, requestRecommendations } from '../api/recommendations_services/recommendationsServices';
import { getToken, getUserId, setDailyOutfitDate, setDailyOutfitData, getDailyOutfitDate } from '../storage/TokenStorage';

const LOG_TAG = "[BG-Recommendation]";
const TASK_NAME = 'daily-recommendation-fetch';

function toLocalDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getEntryDate(entry) {
  return entry?.created_at || entry?.createdAt || null;
}

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log(LOG_TAG, "Task started");

    const token = await getToken();
    if (!token) {
      console.log(LOG_TAG, "No token — skipping");
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const userId = await getUserId();
    if (!userId) {
      console.log(LOG_TAG, "No userId — skipping");
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const currentHour = new Date().getHours();
    if (currentHour < 6) {
      console.log(LOG_TAG, `Before 6AM (hour=${currentHour}) — skipping`);
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const todayKey = toLocalDateKey(new Date());
    console.log(LOG_TAG, `today=${todayKey}, hour=${currentHour}, userId=${userId}`);

    // ── Step 1: Fetch history from server ──
    let serverHistory = [];
    try {
      const result = await getAllRecommendations();
      serverHistory = result.history || [];
      console.log(LOG_TAG, `Server history: ${serverHistory.length} entries`);
      serverHistory.forEach((e) => {
        const rawDate = getEntryDate(e);
        const dk = rawDate ? toLocalDateKey(new Date(rawDate)) : "null";
        console.log(LOG_TAG, `  [History] _id=${e._id} created_at=${rawDate} dateKey=${dk}`);
      });
    } catch (e) {
      console.log(LOG_TAG, "GET history failed:", e.message);
      return BackgroundTask.BackgroundTaskResult.Failed;
    }

    // ── Step 2: Check if today exists in history ──
    const todayEntry = serverHistory.find((entry) => {
      const rawDate = getEntryDate(entry);
      return rawDate && toLocalDateKey(new Date(rawDate)) === todayKey;
    });

    if (todayEntry) {
      console.log(LOG_TAG, `Today (${todayKey}) found in history — no POST needed`);
      await setDailyOutfitDate(todayKey, userId);
      await setDailyOutfitData(todayEntry, userId);
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    // ── Step 2.5: Also check local cache (prevents race-condition duplicates) ──
    const cachedDate = await getDailyOutfitDate(userId);
    if (cachedDate === todayKey) {
      console.log(LOG_TAG, `Local cache already has outfit for ${todayKey} — skipping POST`);
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    // ── Step 3: No today entry — POST new recommendation ──
    console.log(LOG_TAG, `No match for ${todayKey} — POSTing new recommendation`);
    const result = await requestRecommendations();

    await setDailyOutfitDate(todayKey, userId);
    await setDailyOutfitData(result, userId);

    console.log(LOG_TAG, "POST complete, cached locally");
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (e) {
    console.log(LOG_TAG, "Task failed:", e.message);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerDailyRecommendationTask() {
  try {
    const status = await BackgroundTask.getStatusAsync();
    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
      console.log(LOG_TAG, "Background tasks restricted — not registering");
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (isRegistered) {
      console.log(LOG_TAG, "Task already registered");
      return;
    }

    await BackgroundTask.registerTaskAsync(TASK_NAME, {
      minimumInterval: 15,
    });
    console.log(LOG_TAG, "Task registered successfully");
  } catch (e) {
    console.log(LOG_TAG, "Registration failed:", e.message);
  }
}

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { useAuth } from "./AuthContext";
import { getUserProfile, getUserSettings, updateLanguage, updateNotifications, updateDarkMode, updateUserImage } from "../api/user_services/userService";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [settings, setSettings] = useState({
    language: 'en',
    notifications: true,
    darkMode: false,
    mobile: {},
  });

  const refreshProfile = useCallback(async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getUserProfile(user._id);
      setProfile(data);

      const settingsData = await getUserSettings(data.email);
      setSettings(prev => ({
        ...prev,
        language: settingsData.language || prev.language,
        notifications: settingsData.notifications ?? prev.notifications,
        darkMode: settingsData.darkMode ?? prev.darkMode,
        mobile: settingsData.mobile || prev.mobile,
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  const handleUpdateLanguage = async (language) => {
    try {
      await updateLanguage(language);
      setSettings(prev => ({ ...prev, language }));
    } catch (err) {
      console.warn('[ProfileContext] updateLanguage error:', err.message);
    }
  };

  const handleUpdateNotifications = async (enabled) => {
    try {
      await updateNotifications(enabled);
      setSettings(prev => ({ ...prev, notifications: enabled }));
    } catch (err) {
      console.warn('[ProfileContext] updateNotifications error:', err.message);
    }
  };

  const handleUpdateDarkMode = async (darkMode) => {
    try {
      await updateDarkMode(darkMode);
      setSettings(prev => ({ ...prev, darkMode }));
    } catch (err) {
      console.warn('[ProfileContext] updateDarkMode error:', err.message);
    }
  };

  const handleUpdateUserImage = async (userImage) => {
    try {
      const result = await updateUserImage(userImage);
      setProfile(prev => prev ? { ...prev, userImage: result.userImage } : prev);
      return result;
    } catch (err) {
      console.warn('[ProfileContext] updateUserImage error:', err.message);
      throw err;
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refreshProfile,
        setProfile,
        settings,
        updateLanguage: handleUpdateLanguage,
        updateNotifications: handleUpdateNotifications,
        updateDarkMode: handleUpdateDarkMode,
        updateUserImage: handleUpdateUserImage,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () =>
  useContext(ProfileContext);
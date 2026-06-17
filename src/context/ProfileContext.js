import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { useAuth } from "./AuthContext";
import { getUserProfile, getUserSettings, updateLanguage, updateNotifications, updateDarkMode, updateUserImage } from "../api/user_services/userService";
import { getAvatarById } from "../api/avatar_services/avatarService";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);

  const [settings, setSettings] = useState({
    language: 'en',
    notifications: true,
    darkMode: false,
    mobile: {},
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

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

      if (data?.avatars?.length) {
        const lastId = data.avatars[data.avatars.length - 1];
        const id = lastId?._id || lastId;
        try {
          const avatarData = await getAvatarById(id);
          const uri = avatarData?.avatar?.image_url || avatarData?.image || avatarData?.imageUrl || avatarData?.url || null;
          setAvatarImage(uri);
        } catch {
          setAvatarImage(null);
        }
      } else {
        setAvatarImage(null);
      }

      const settingsData = await getUserSettings(data.email);
      setSettings(prev => ({
        ...prev,
        language: settingsData.language || prev.language,
        notifications: settingsData.notifications ?? prev.notifications,
        darkMode: settingsData.darkMode ?? prev.darkMode,
        mobile: settingsData.mobile || prev.mobile,
      }));
      setSettingsLoaded(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  const handleUpdateLanguage = useCallback(async (language) => {
    try {
      await updateLanguage(language);
      setSettings(prev => ({ ...prev, language }));
    } catch (err) {
    }
  }, []);

  const handleUpdateNotifications = useCallback(async (enabled) => {
    try {
      await updateNotifications(enabled);
      setSettings(prev => ({ ...prev, notifications: enabled }));
    } catch (err) {
    }
  }, []);

  const handleUpdateDarkMode = useCallback(async (darkMode) => {
    try {
      await updateDarkMode(darkMode);
      setSettings(prev => ({ ...prev, darkMode }));
    } catch (err) {
    }
  }, []);

  const handleUpdateUserImage = useCallback(async (userImage) => {
    try {
      const result = await updateUserImage(userImage);
      setProfile(prev => prev ? { ...prev, userImage: result.userImage } : prev);
      return result;
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const value = useMemo(() => ({
    profile,
    loading,
    error,
    refreshProfile,
    setProfile,
    settings,
    settingsLoaded,
    avatarImage,
    setAvatarImage,
    updateLanguage: handleUpdateLanguage,
    updateNotifications: handleUpdateNotifications,
    updateDarkMode: handleUpdateDarkMode,
    updateUserImage: handleUpdateUserImage,
  }), [profile, loading, error, refreshProfile, setProfile, settings, settingsLoaded, avatarImage, handleUpdateLanguage, handleUpdateNotifications, handleUpdateDarkMode, handleUpdateUserImage]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () =>
  useContext(ProfileContext);
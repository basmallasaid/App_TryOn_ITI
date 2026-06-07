import { useState, useEffect, useCallback } from 'react';
import { getUserProfile } from '../api/user_services/userService';
import { useAuth } from '../context/AuthContext';
 
const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
 
  const fetchProfile = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile(user._id);
      setProfile(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);
 
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
 
  return { profile, loading, error, refetch: fetchProfile };
};
 
export default useProfile;
 
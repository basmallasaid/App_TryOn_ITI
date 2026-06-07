import React, { useState, useEffect } from "react";
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../api/user_services/userService';
import Colors from '../../constants/theme/colors';

export default function Header() {
  const { user }    = useAuth();
  const [isNotification, setIsNotification] = useState(false);
  const [firstName, setFirstName]           = useState('');
  const [profileImage, setProfileImage]     = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    let mounted = true;

    (async () => {
      try {
        const data = await getUserProfile(user._id);
        if (!mounted || !data) return;

        // first_name lives inside profile object based on our API response
        const name = data.profile?.first_name || '';
        setFirstName(name ? String(name).split(' ')[0] : '');

        // avatars is an array in the API response
        const imageUrl = data.avatars?.[0] || null;
        if (imageUrl) setProfileImage({ uri: imageUrl });
      } catch (e) {
        console.log('Failed to load profile:', e);
      }
    })();

    return () => { mounted = false; };
  }, [user?._id]);

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {profileImage ? (
          <Image
            source={profileImage}
            style={styles.profileImage}
            onError={() => setProfileImage(null)}
          />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profilePlaceholderText}>
              {firstName ? firstName.charAt(0).toUpperCase() : 'G'}
            </Text>
          </View>
        )}

        <View style={styles.headerText}>
          <View style={styles.helloRow}>
            <Text style={styles.helloText}>Hello</Text>
            <Text style={styles.wave}>👋</Text>
          </View>
          <Text style={styles.userName}>{firstName || 'Guest'}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => setIsNotification((v) => !v)}>
        <Ionicons
          name="notifications"
          size={26}
          color={isNotification ? Colors.error : Colors.disabled}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 25,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  profilePlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: Colors.disabled,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholderText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  headerText: {
    marginLeft: 12,
  },
  helloRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helloText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  wave: {
    fontSize: 16,
    marginLeft: 5,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
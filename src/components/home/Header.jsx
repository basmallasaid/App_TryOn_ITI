import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from 'react-i18next';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useProfileContext } from "../../context/ProfileContext";
import Colors from "../../constants/theme/colors";


export default function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isNotification, setIsNotification] = useState(false);
  const { profile } = useProfileContext();
  const firstName = profile?.profile?.first_name?.split(" ")[0] || "";

  const profileImage = profile?.avatars?.[0]
    ? { uri: profile.avatars[0] }
    : null;

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {profileImage ? (
          <Image
            source={profileImage}
            style={styles.profileImage}

          />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profilePlaceholderText}>
              {firstName ? firstName.charAt(0).toUpperCase() : t('home.guestInitial')}
            </Text>
          </View>
        )}

        <View style={styles.headerText}>
          <View style={styles.helloRow}>
            <Text style={styles.helloText}>{t('home.hello')}</Text>
            <Text style={styles.wave}>👋</Text>
          </View>
          <Text style={styles.userName}>{firstName || t('home.guest')}</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 25,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  profilePlaceholderText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  headerText: {
    marginLeft: 12,
  },
  helloRow: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "700",
    color: Colors.textPrimary,
  },
});

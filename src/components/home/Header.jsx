import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from 'react-i18next';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../navigation/routes";
import { useProfileContext } from "../../context/ProfileContext";
import Colors from "../../constants/theme/colors";


export default function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigation = useNavigation();
  const { profile, settings } = useProfileContext();

  const firstName = profile?.profile?.first_name?.split(" ")[0] || "";
  const lastName = profile?.profile?.last_name || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || t('home.guestInitial');

  const [imgErr, setImgErr] = useState(false);
  const rawImage = profile?.userImage;
  const isValid = typeof rawImage === 'string' && rawImage.length > 0 && rawImage !== 'null' && rawImage !== 'undefined';
  const showImage = isValid && !imgErr;

  console.log('[Header] profile:', !!profile, 'showImage:', showImage, 'rawImage:', rawImage, 'initials:', initials, 'firstName:', firstName);

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {showImage ? (
          <Image
            source={{ uri: rawImage }}
            style={styles.profileImage}
            onError={() => setImgErr(true)}
          />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profilePlaceholderText}>{initials}</Text>
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

      <TouchableOpacity onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}>
        <Ionicons
          name="notifications"
          size={26}
          color={settings?.notifications ? Colors.error : Colors.disabled}
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

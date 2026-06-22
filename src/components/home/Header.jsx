import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useTranslation } from 'react-i18next';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../navigation/routes";
import { useProfileContext } from "../../context/ProfileContext";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";

const BLURHASH_PLACEHOLDER = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';


export default function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigation = useNavigation();
  const { profile, settings } = useProfileContext();
  const { themeVersion } = useTheme();
  const { unreadCount } = useNotifications();

  const firstName = profile?.profile?.first_name?.split(" ")[0] || "";
  const lastName = profile?.profile?.last_name || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || t('home.guestInitial');

  const [imgErr, setImgErr] = useState(false);
  const rawImage = profile?.userImage;
  const isValid = typeof rawImage === 'string' && rawImage.length > 0 && rawImage !== 'null' && rawImage !== 'undefined';
  const showImage = isValid && !imgErr;

  const styles = React.useMemo(() => StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 25,
      overflow: "visible",
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
      color: Colors.textInverse,
      fontSize: 20,
      fontWeight: "700",
    },
    headerText: {
      marginStart: 12,
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
      marginStart: 5,
    },
    userName: {
      fontSize: 22,
      fontWeight: "700",
      color: Colors.textPrimary,
    },
    badge: {
      position: 'absolute',
      top: -10,
      right: -6,
      backgroundColor: Colors.error,
      borderRadius: 9,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
      borderWidth: 1.5,
      borderColor: Colors.backgroundColor,
    },
    badgeText: {
      color: Colors.textInverse,
      fontSize: 10,
      fontWeight: '700',
    },
  }), [themeVersion]);

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {showImage ? (
          <Image
            source={{ uri: rawImage }}
            style={styles.profileImage}
            contentFit="cover"
            placeholder={BLURHASH_PLACEHOLDER}
            transition={300}
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

      <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
        style={{marginTop:-15, overflow:'visible'}}
        activeOpacity={0.7}
      >
        <View style={{overflow:'visible',right:5,top:3}}>
          <Ionicons
            name="notifications"
            size={26}
            color={settings?.notifications ? Colors.error : Colors.disabled}
          />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

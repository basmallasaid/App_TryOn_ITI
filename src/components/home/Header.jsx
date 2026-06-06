import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IMAGES } from "../../constants/images/images";
import Colors from "../../constants/theme/colors";

export default function Header() {
  const [isNotification, setIsNotification] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={IMAGES.PERSON}
          style={styles.profileImage}
        />

        <View style={styles.headerText}>
          <View style={styles.helloRow}>
            <Text style={styles.helloText}>Hello</Text>
            <Text style={styles.wave}>👋</Text>
          </View>

          <Text style={styles.userName}>Basmala</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setIsNotification(!isNotification)}
      >
        <Ionicons
          name="notifications"
          size={26}
          color={ isNotification? Colors.error: Colors.disabled}
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
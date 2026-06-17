import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import HeroImage from "./HeroImage";

const BottomSheetLayout = ({ title, subtitle, children }) => {
  const { themeVersion } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Colors.backgroundColor,
      paddingTop: insets.top,
    },

    sheetWrapper: {
      flex: 1,
      marginTop: -40,
      zIndex: 3,
    },

    sheet: {
      flexGrow: 1,
      backgroundColor: Colors.white,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 40,
      borderWidth: 1,
      borderColor: Colors.borderDefault,

      // iOS
      shadowColor: "#9A9A9B",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 1,
      shadowRadius: 1,

      // Android
      elevation: 1,
    },

    title: {
      fontFamily: "Roboto_700Bold",
      fontWeight: "700",
      fontSize: 24,
      lineHeight: 38.4,
      color: Colors.textPrimary,
      textAlign: "center",
    },

    subtitle: {
      fontFamily: "Roboto_400Regular",
      fontWeight: "400",
      fontSize: 12,
      lineHeight: 12,
      color: Colors.textSecondary,
      paddingBottom: 10,
      paddingTop: 4,
      marginBottom: 32,
      textAlign: "center",
    },
  }), [themeVersion]);

  return (
    <View style={styles.root}>
      <HeroImage />

      <KeyboardAvoidingView
        style={styles.sheetWrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.sheet}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default BottomSheetLayout;

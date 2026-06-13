import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import HeroImage from "./HeroImage";
import Typography from "../../constants/theme/typography";

const BottomSheetLayout = ({ title, subtitle, children }) => {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: "#f4f4f5",
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
      ...Typography.screenTitleLarge,
      textAlign: "center",
    },

    subtitle: {
      ...Typography.screenSubtitle,
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

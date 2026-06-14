import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const EnrichTextComponent = ({
  baseText,
  linkText,
  onPress,
}) => {
  const { themeVersion } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    enrichRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      flexWrap: "wrap",
    },

    enrichBase: {
      fontFamily: "Roboto_400Regular",
      fontWeight: "400",
      fontSize: 12,
      lineHeight: 12,
      color: Colors.textDark,
      textAlign: "center",
    },

    enrichLink: {
      fontFamily: "Roboto_500Medium",
      fontWeight: "500",
      fontSize: 14,
      lineHeight: 16.38,
      color: Colors.primary,
      textAlign: "center",
    },
  }), [themeVersion]);

  return (
    <View style={styles.enrichRow}>
      <Text style={styles.enrichBase}>{baseText}</Text>

      <TouchableOpacity onPress={onPress}>
        <Text style={styles.enrichLink}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EnrichTextComponent;
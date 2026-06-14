import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const QuestionGroup = ({ title, children }) => {
  const { themeVersion } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    container: { marginTop: 24 },
    title: {
      fontFamily: "Roboto_600SemiBold",
      fontSize: 16,
      color: Colors.textPrimary,
      marginBottom: 16,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
  }), [themeVersion]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>{children}</View>
    </View>
  );
};

export default QuestionGroup;
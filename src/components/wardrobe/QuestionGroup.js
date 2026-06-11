import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QuestionGroup = ({ title, children }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.grid}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: { marginTop: 24 },
  title: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 16,
    color: "#131B2E",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});

export default QuestionGroup;
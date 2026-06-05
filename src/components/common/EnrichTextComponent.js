import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Typography from "../../constants/theme/typography";

const EnrichTextComponent = ({
  baseText,
  linkText,
  onPress,
}) => {
  return (
    <View style={styles.enrichRow}>
      <Text style={styles.enrichBase}>{baseText}</Text>

      <TouchableOpacity onPress={onPress}>
        <Text style={styles.enrichLink}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
   enrichRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    flexWrap: "wrap",
  },

  enrichBase: {
    ...Typography.enrichTextBase,
  },

  enrichLink: {
    ...Typography.enrichTextLink,
  },
});

export default EnrichTextComponent;
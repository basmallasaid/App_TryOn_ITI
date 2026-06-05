import React, { useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";

import Colors from "../../constants/theme/colors";

const OtpInput = ({
  value,
  onChange,
  state = "default",
  length = 6,
}) => {
  const inputs = useRef([]);

  const borderColor =
    state === "error"
      ? Colors.error
      : state === "success"
      ? Colors.success
      : Colors.borderStrong;

  const handleChange = (text, index) => {
    const digit = text.replace(/\D/g, "");

    const otpArray = value.split("");

    otpArray[index] = digit;

    const newOtp = otpArray.join("");

    onChange(newOtp);

    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (key, index) => {
    if (
      key === "Backspace" &&
      !value[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {[...Array(length)].map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          style={[
            styles.box,
            {
              borderColor,
            },
          ]}
          keyboardType="number-pad"
          maxLength={1}
          value={value[index] || ""}
          onChangeText={(text) =>
            handleChange(text, index)
          }
          onKeyPress={({ nativeEvent }) =>
            handleBackspace(
              nativeEvent.key,
              index
            )
          }
          textAlign="center"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  box: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 22,
    textAlign: "center",
    color: Colors.textPrimary,
  },
});

export default OtpInput;
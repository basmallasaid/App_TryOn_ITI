import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import Typography from "../../constants/theme/typography";
import { Ionicons } from "@expo/vector-icons";
const CustomizeTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  state = "default",
  errorMessage,
  keyboardType = "default",
  autoCapitalize = "none",
  autoFocus = false,
  wrapperStyle,

  rightIcon,
  onRightIconPress,
  editable = true,
}) => {
  const { themeVersion } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [hidden, setHidden] = useState(secureTextEntry);

  const borderColor =
    state === "error"
      ? Colors.error
      : state === "success"
        ? Colors.success
        : Colors.borderStrong;

  const stateColor =
    state === "error"
      ? Colors.error
      : state === "success"
        ? Colors.success
        : Colors.textPrimary;

  const iconColor = state === "default" ? Colors.iconGray : stateColor;

const styles = React.useMemo(() => StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },

  label: {
    ...Typography.inputLabel,
    marginBottom: 6,
  },

  container: {
    width: "100%",
    height: 40,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
  },

  input: {
    flex: 1,
    fontFamily: "Roboto_400Regular",
    fontWeight: "400",
    fontSize: 12,
    padding: 0,
  },

  eyeWrap: {
    paddingLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    fontFamily: "Roboto_400Regular",
    fontWeight: "400",
    fontSize: 11,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 2,
  },
  rightSection: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
}), [themeVersion]);

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      {label ? (
        <Text
          style={[
            styles.label,
            {
              color: stateColor,
            },
          ]}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.container,
          { borderColor },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: stateColor,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={
            state === "error" ? Colors.error : Colors.textMuted
          }
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
          editable={editable}
        />
        <View style={[styles.rightSection, { alignSelf: "center" }]}>
          {secureTextEntry && (
            <TouchableOpacity onPress={() => setHidden((h) => !h)}>
              <Ionicons
                name={hidden ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
          {!secureTextEntry && rightIcon}
        </View>
      </View>

      {state === "error" && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};


export default CustomizeTextInput;

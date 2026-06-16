import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
const CustomizeAppButtonFilled = ({
  label,
  onPress,
  backgroundColor,
  textColor,
  outlined = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
}) => {
  const { themeVersion } = useTheme();
  const isDisabled = disabled || loading;

  const resolvedBg = isDisabled
    ? Colors.disabled
    : outlined
    ? Colors.white
    : (backgroundColor ?? Colors.primary);

  const resolvedText = outlined
    ? (textColor ?? Colors.textPrimary)
    : (textColor ?? Colors.textInverse);

const styles = React.useMemo(() => StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  disabledOpacity: {
    opacity: 0.7,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  iconWrap: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 16,
    textAlign: 'center',
    paddingVertical:5,
  },
}), [themeVersion]);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: resolvedBg },
        outlined && styles.outlined,
        isDisabled && styles.disabledOpacity,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={resolvedText} />
      ) : (
        <View style={[styles.inner, { flexDirection: 'row' }]}>
          {icon && iconPosition === 'left' ? <View style={styles.iconWrap}>{icon}</View> : null}
          <Text style={[styles.label, { color: resolvedText }]}>{label}</Text>
          {icon && iconPosition === 'right' ? <View style={styles.iconWrap}>{icon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};


export default CustomizeAppButtonFilled;
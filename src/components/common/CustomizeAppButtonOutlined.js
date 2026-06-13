
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import Colors from '../../constants/theme/colors';
const CustomizeAppButtonOutlined = ({
  label,
  onPress,
  borderColor,
  textColor,
  loading = false,
  disabled = false,
  icon,
}) => {
  const isDisabled = disabled || loading;
  const resolvedBorder = borderColor ?? Colors.success;
  const resolvedText   = textColor   ?? Colors.success;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { borderColor: resolvedBorder },
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
          <Text style={[styles.label, { color: resolvedText }]}>{label}</Text>
          {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  disabledOpacity: {
    opacity: 0.6,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomizeAppButtonOutlined;
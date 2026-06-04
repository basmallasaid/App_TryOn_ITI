import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from "../../constants/theme/colors";
import Typography from "../../constants/theme/typography";
import { Ionicons } from '@expo/vector-icons';


const CustomizeTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  state = 'default',
  errorMessage,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoFocus = false,
}) => {
  const [hidden, setHidden] = useState(secureTextEntry);

  const borderColor =
    state === 'error'   ? Colors.error   :
    state === 'success' ? Colors.success :
    Colors.borderStrong;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.container, { borderColor }]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} style={styles.eyeWrap}>
            {/* Eye icon — open */}
            {hidden ? (
               <Ionicons name="eye-off-outline" size={20} color={Colors.iconGray} />
            ) : (
              <Ionicons name="eye-outline" size={20} color={Colors.iconGray} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {state === 'error' && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    ...Typography.inputLabel,
    marginBottom: 6,
  },
  container: {
    width: '100%',
    height: 40,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontWeight: '400',
    fontSize: 12,
    color: Colors.textPrimary,
    padding: 0,
  },
  eyeWrap: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Roboto_400Regular',
    fontWeight: '400',
    fontSize: 11,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 2,
  },
});

export default CustomizeTextInput;

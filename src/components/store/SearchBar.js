import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
export const SearchBar = ({
  value,
  onChangeText,
  onSearch,
}) => {
  const { themeVersion } = useTheme();
const styles = React.useMemo(() => StyleSheet.create({
  searchContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: 15,
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
}), [themeVersion]);

  return (
    <View style={[styles.searchContainer, { flexDirection: 'row' }]}>
      <Ionicons name="search-outline" size={20} color="#9BA5B0" />

      <TextInput
        placeholder="Tap to search"
        style={[styles.input, { textAlign: 'left', marginLeft: 10, marginRight: 0 }]}
        placeholderTextColor="#9BA5B0"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={() => onSearch?.()}
      />
    </View>
  );
};


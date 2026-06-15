import React, { useMemo } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from 'react-i18next';

export const SearchBar = React.memo(({
  value,
  onChangeText,
  onSearch,
}) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const styles = useMemo(() => StyleSheet.create({
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
      flexDirection: 'row',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: Colors.textPrimary,
      marginLeft: 10,
      marginRight: 0,
    },
  }), [themeVersion]);

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={20} color="#9BA5B0" />

      <TextInput
        placeholder={t('store.searchPlaceholder')}
        style={styles.input}
        placeholderTextColor="#9BA5B0"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={() => onSearch?.()}
      />
    </View>
  );
});

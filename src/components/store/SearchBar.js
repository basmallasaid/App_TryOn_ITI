import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SearchBar = ({
  value,
  onChangeText,
  onSearch,
}) => (
  <View style={styles.searchContainer}>
    <Ionicons name="search-outline" size={20} color="#9BA5B0" />

    <TextInput
      placeholder="Tap to search"
      style={styles.input}
      placeholderTextColor="#9BA5B0"
      value={value}
      onChangeText={onChangeText}
      returnKeyType="search"
      onSubmitEditing={() => onSearch?.()}
    />
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D5D9DE',
    paddingHorizontal: 15,
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1A1C24',
  },
});
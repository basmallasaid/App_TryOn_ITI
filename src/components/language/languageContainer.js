import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native';

import Colors from '../../constants/theme/colors';

const LanguageContainer = ({
  label,
  flag,
  selected,
  onPress,
}) => {

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
    >
      <Image
        source={flag}
        style={styles.flag}
      />

      <Text
        style={[
          styles.label,
          selected && styles.selectedLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

  container: {
    borderWidth: 1,
    borderColor: Colors.disabled,

    borderRadius: 8,

    paddingHorizontal: 16,

    height: 56,

    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 12,
  },

  selectedContainer: {
    borderColor: Colors.success,
  },

  flag: {
    width: 28,
    height: 28,
    marginRight: 12,
  },

  label: {
    color: Colors.mutedText,
    fontSize: 16,
  },

  selectedLabel: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },

});

export default LanguageContainer;

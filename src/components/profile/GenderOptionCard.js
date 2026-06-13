import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/theme/colors';
const GenderOptionCard = ({
  gender,
  selected,
  onPress,
}) => {
  const { t } = useTranslation();

  const isMale =
    gender === 'Male';

  const backgroundColor =
    !selected
      ? '#E9EBEE'
      : isMale
      ? '#E5F2FF'
      : '#FDEDF5';

  const iconColor =
    !selected
      ? '#A0A6B2'
      : isMale
      ? '#121826'
      : '#FF6B8A';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor,
          flexDirection: 'row',
        },
      ]}
    >
      <Ionicons
        name={
          isMale
            ? 'man'
            : 'woman'
        }
        size={18}
        color={iconColor}
      />

      <Text
        style={[
          styles.title,
          {
            color: iconColor,
          },
        ]}
      >
        {isMale ? t('editProfile.male') : t('editProfile.female')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

  container: {
    width: 130,
    height: 40,

    borderRadius: 8,

    paddingHorizontal: 8,

    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,
  },

  title: {
    fontSize: 12,
    fontWeight: '600',
  },

});

export default GenderOptionCard;
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
const FLAG = {
  en: '🇬🇧',
  ar: '🇪🇬',
};

const LanguageContainer = ({ language, selected = false, onPress }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();

  const LABEL = {
    en: t('language.english'),
    ar: t('language.arabic'),
  };

const styles = React.useMemo(() => StyleSheet.create({
  container: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.disabled,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  containerSelected: {
    borderColor: Colors.success,
    //backgroundColor: '#F6FDE8',
  },
  flag: {
    fontSize: 24,
  },
  label: {
    flex: 1,
    fontFamily: 'Roboto_500Medium',
    fontSize: 15,
    color: Colors.textMuted,
  },
  labelSelected: {
    color: Colors.textPrimary,
    fontFamily: 'Roboto_600SemiBold',
  },
 
}), [themeVersion]);

  return (
    <TouchableOpacity
      style={[styles.container, { flexDirection: 'row' }, selected && styles.containerSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.flag, { marginRight: 14, marginLeft: 0 }]}>{FLAG[language]}</Text>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {LABEL[language]}
      </Text>
    </TouchableOpacity>
  );
};


export default LanguageContainer;
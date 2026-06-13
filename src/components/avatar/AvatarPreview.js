import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';

const AvatarPreview = ({ image, children }) => {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      marginBottom: 12,
    },
    image: {
      width: 210,
      height: 280,
    },
    placeholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#F4F4F5',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: Colors.borderDefault,
    },
  }), [themeVersion]);

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={styles.placeholder}>{children}</View>
      )}
    </View>
  );
};

export default AvatarPreview;

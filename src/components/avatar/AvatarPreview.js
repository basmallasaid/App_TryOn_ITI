import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';

const BLURHASH_PLACEHOLDER = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';

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
      backgroundColor: Colors.surfaceElevated,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: Colors.borderDefault,
    },
  }), [themeVersion]);

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={image} style={styles.image} contentFit="contain" placeholder={BLURHASH_PLACEHOLDER} transition={300} />
      ) : (
        <View style={styles.placeholder}>{children}</View>
      )}
    </View>
  );
};

export default AvatarPreview;

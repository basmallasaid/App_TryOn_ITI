import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { IMAGES } from '../../constants/images/images';

const BLURHASH_PLACEHOLDER = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const OutfitViewModal = ({ visible, onClose, imageUri, isFavorite, onToggleFavorite }) => {
  const { themeVersion } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.85)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: SCREEN_WIDTH * 0.85,
      height: SCREEN_HEIGHT * 0.6,
      backgroundColor: Colors.white,
      borderRadius: 24,
      overflow: 'hidden',
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.white,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    closeBtn: {
      position: 'absolute',
      top: 12,
      start: 12,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    favoriteBtn: {
      position: 'absolute',
      top: 12,
      end: 12,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }), [themeVersion]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <View style={styles.imageContainer}>
            <Image
              source={imageUri ? { uri: imageUri } : IMAGES.TRY_ON}
              style={styles.image}
              contentFit="contain"
              placeholder={imageUri ? BLURHASH_PLACEHOLDER : undefined}
              transition={300}
            />
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.favoriteBtn} onPress={onToggleFavorite} activeOpacity={0.7}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? Colors.error : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default OutfitViewModal;

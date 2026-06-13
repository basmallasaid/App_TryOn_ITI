// src/components/wardrobe/SaveResultModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';

const SaveResultModal = ({ visible, success, message, onClose }) => {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconSuccess: {
    backgroundColor: Colors.success,
  },
  iconError: {
    backgroundColor: Colors.error,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  btnSuccess: {
    backgroundColor: Colors.primary,
  },
  btnError: {
    backgroundColor: Colors.error,
  },
  btnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: Colors.textInverse,
  },
}), [themeVersion]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={[styles.iconWrap, success ? styles.iconSuccess : styles.iconError]}>
            <Ionicons
              name={success ? 'checkmark' : 'close'}
              size={32}
              color="#FFFFFF"
            />
          </View>
          <Text style={styles.title}>
            {success ? 'Item Added!' : 'Something went wrong'}
          </Text>
          <Text style={styles.message}>
            {message || (success
              ? 'Your item has been saved to your wardrobe successfully.'
              : 'We couldn\'t save this item. Please try again.'
            )}
          </Text>
          <TouchableOpacity
            style={[styles.btn, success ? styles.btnSuccess : styles.btnError]}
            onPress={onClose}
          >
            <Text style={styles.btnText}>
              {success ? 'View Wardrobe' : 'Try Again'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SaveResultModal;
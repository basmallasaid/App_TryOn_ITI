import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';
import CustomizeAppButtonFilled from '../common/CustomizeAppButtonFilled';
import CustomizeAppButtonOutlined from '../common/CustomizeAppButtonOutlined';

const DeleteConfirmationModal = ({ visible, onClose, onConfirm, loading }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name="trash" size={24} color="#FF8A3D" />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>Are you sure you want to delete the selected products?</Text>
            <Text style={styles.subtitle}>This action cannot be undone.</Text>
          </View>

          <View style={styles.footer}>
            <View style={{ flex: 1 }}>
              <CustomizeAppButtonOutlined label="Cancel" onPress={onClose} />
            </View>
            <View style={{ flex: 1 }}>
              <CustomizeAppButtonFilled 
                label="Delete" 
                backgroundColor={Colors.error} 
                onPress={onConfirm} 
                loading={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: {
    width: 343,
    height: 207,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D5D9DE',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconContainer: { marginTop: 4 },
  textContainer: { gap: 8, alignItems: 'center' },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    color: '#121826'
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'center',
    color: '#6B7280'
  },
  footer: { flexDirection: 'row', gap: 12, width: '100%' }
});

export default DeleteConfirmationModal;
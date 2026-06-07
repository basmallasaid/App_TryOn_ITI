// src/components/profile/LanguageBottomSheet.js
import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LanguageContainer from '../language/languageContainer';
import Colors from '../../constants/theme/colors';

const { height: H } = Dimensions.get('window');

const LANGUAGES = ['en', 'ar'];

/**
 * LanguageBottomSheet
 * Props:
 *  visible     bool
 *  tempLang    string   — currently selected (uncommitted) language
 *  onSelect    func(lang)
 *  onSave      func
 *  onClose     func
 */
const LanguageBottomSheet = ({ visible, tempLang, onSelect, onSave, onClose }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <Pressable style={styles.overlay} onPress={onClose} />
    <View style={styles.sheet}>
      <View style={styles.handle} />
      <Text style={styles.title}>Select Language</Text>

      {LANGUAGES.map((lang) => (
        <LanguageContainer
          key={lang}
          language={lang}
          selected={tempLang === lang}
          onPress={() => onSelect(lang)}
        />
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 60,
    minHeight: H * 0.4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D5D9DE',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});

export default LanguageBottomSheet;
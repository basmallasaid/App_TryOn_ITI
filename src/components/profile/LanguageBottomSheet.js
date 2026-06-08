import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTranslation } from 'react-i18next';
import LanguageContainer from "../language/languageContainer";
import Colors from "../../constants/theme/colors";

const { height: H } = Dimensions.get("window");

const LANGUAGES = ["en", "ar"];

const LanguageBottomSheet = ({
  visible,
  tempLang,
  onSelect,
  onSave,
  onClose,
}) => {
  const { t } = useTranslation();
  return (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <Text style={styles.title}>{t('language.selectLanguage')}</Text>

        {LANGUAGES.map((lang) => (
          <LanguageContainer
            key={lang}
            language={lang}
            selected={tempLang === lang}
            onPress={() => onSelect(lang)}
          />
        ))}

        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>{t('language.save')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 60,

    minHeight: H * 0.4,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 20,
    backgroundColor: "#D5D9DE",
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 16,
  },

  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  saveText: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 16,
    color: "#fff",
  },
});

export default LanguageBottomSheet;

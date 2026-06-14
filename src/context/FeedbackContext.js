import React, { createContext, useContext, useState, useCallback } from "react";
import { Platform, Alert } from "react-native";
import FeedbackModal from "../components/common/FeedbackModal";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const showFeedback = useCallback(({ type = "success", title, message }) => {
    if (Platform.OS === "ios") {
      Alert.alert(title, message);
      return;
    }
    setConfig({ type, title, message });
    setVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <FeedbackContext.Provider value={{ showFeedback }}>
      {children}
      <FeedbackModal
        visible={visible}
        onClose={handleClose}
        type={config.type}
        title={config.title}
        message={config.message}
      />
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);

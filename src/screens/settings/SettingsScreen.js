import React from 'react';
import SafeScreen from '../../components/common/SafeScreen';
import { StyleSheet } from 'react-native';
import Colors from "../../constants/theme/colors";

const SettingsScreen = () => {
    return (
        <SafeScreen style={styles.container}>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
})

export default SettingsScreen;

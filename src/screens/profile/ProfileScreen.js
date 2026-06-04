// src/screens/user/profile/ProfileScreen.js
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from "../../context/AuthContext";

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  email:      { fontSize: 15, color: '#888', marginBottom: 32 },
  button:     { borderWidth: 1.5, borderColor: '#e53e3e', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 40 },
  buttonText: { color: '#e53e3e', fontWeight: '600', fontSize: 15 },
});

export default ProfileScreen;

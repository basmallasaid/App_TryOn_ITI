import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from "../../constants/theme/colors";

export default function EditProfileScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.title}>Edit Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 56 },
  back:  { width: 40, height: 40, justifyContent: 'center', marginBottom: 24 },
  title: { fontFamily: 'Roboto_700Bold', fontSize: 24, color: Colors.textPrimary },
});

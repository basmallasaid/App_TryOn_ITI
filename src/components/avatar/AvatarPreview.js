import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";

const AvatarPreview = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarCircle}>
        {children || (
          <Ionicons name="person" size={48} color={Colors.disabled} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E9EBEE",
  },
});

export default AvatarPreview;

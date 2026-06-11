// import React from "react";
// import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
// import Colors from "../../constants/theme/colors";
// import CustomizeAppButtonFilled from "../common/CustomizeAppButtonFilled";
// import { ANIMATIONS } from "../../constants/images/animations";
// import LottieView from "lottie-react-native";

// const { width } = Dimensions.get("window");

// const WardrobeEmptyState = ({ onAdd }) => {
//   return (
//     <View style={styles.container}>
//       <ScrollView >
//         {/* Title */}
//         <Text style={styles.title}>Your wardrobe is empty</Text>

//         {/* Subtitle */}
//         <Text style={styles.subtitle}>Add your clothes to get started</Text>

//         {/* Illustration */}
//         <LottieView
//           source={ANIMATIONS.NOT_FOUND}
//           autoPlay
//           loop
//           style={styles.animation}
//         />

//         {/* Action Button */}
//         <View style={styles.buttonWrapper}>
//           <CustomizeAppButtonFilled
//             label="Add to wardrobe"
//             onPress={onAdd}
//             backgroundColor={Colors.primary}
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F6F7",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 26,
//   },
//   title: {
//     fontFamily: "Roboto_700Bold",
//     fontSize: 24,
//     lineHeight: 38.4,
//     color: Colors.textPrimary,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontFamily: "Roboto_400Regular",
//     fontSize: 16,
//     lineHeight: 16, // line-height 100% of 16px
//     color: "#6B7280",
//     textAlign: "center",
//     marginTop: 8,
//     marginBottom: 40,
//     paddingBottom: 12,
//   },
//   animation: {
//     width: 250,
//     height: 280,
//   },
//   buttonWrapper: {
//     width: "100%",
//     marginTop: "40%",
//   },
// });

// export default WardrobeEmptyState;
import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import Colors from "../../constants/theme/colors";
import CustomizeAppButtonFilled from "../common/CustomizeAppButtonFilled";
import { ANIMATIONS } from "../../constants/images/animations";
import LottieView from "lottie-react-native";

const WardrobeEmptyState = ({ onAdd }) => {
  return (
    <ScrollView 
      style={styles.container}
      // flexGrow: 1 is key to making justifyContent work inside a ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text style={styles.title}>Your wardrobe is Empty</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Add your clothes to get started</Text>

      {/* Illustration */}
      <LottieView
        source={ANIMATIONS.NOT_FOUND}
        autoPlay
        loop
        style={styles.animation}
      />

      {/* Action Button */}
      <View style={styles.buttonWrapper}>
        <CustomizeAppButtonFilled
          label="Add to wardrobe"
          onPress={onAdd}
          backgroundColor={Colors.primary}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F7",
  },
  scrollContent: {
    flexGrow: 1, // Allows content to fill the screen to center vertically
    justifyContent: "center", // Vertically centers content if it fits on one screen
    alignItems: "center", // Horizontally centers content
    paddingHorizontal: 26,
    paddingVertical: 40, // Ensures space at top/bottom on very small screens
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    color: Colors.textPrimary,
    textAlign: "center",
    paddingBottom:15,
  },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    paddingBottom:20, // Reduced from 40 to keep it tighter
  },
  animation: {
    width: 280,
    height: 280,
    alignSelf: 'center',
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 30, // Changed from 40% to a fixed margin for consistency
  },
});

export default WardrobeEmptyState;
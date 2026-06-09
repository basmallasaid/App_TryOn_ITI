import { View, Image, StyleSheet } from 'react-native';

const AvatarPreview = ({ image, children }) => {
  return (
    <View style={styles.container}>
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={styles.placeholder}>{children}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginBottom: 12,
  },
  image: {
    width: 210,
    height: 280,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9EBEE',
  },
});

export default AvatarPreview;

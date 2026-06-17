import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { IMAGES } from '../../constants/images/images';

const BLURHASH_PLACEHOLDER = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';
const AvatarOptionCard = ({
  title,
  description,
  badge,
  image,
  rightContent,
  selected,
  onPress,
}) => {
  const { themeVersion } = useTheme();
const styles = React.useMemo(() => StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    gap: 5,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceElevated,
  },
  leftContent: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Roboto_700Bold',
    color: Colors.textPrimary,
  },
  titleSelected: {
    color: Colors.primary,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 16,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Roboto_700Bold',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto_400Regular',
    color: Colors.textMuted,
    lineHeight: 20,
  },
  descriptionSelected: {
    color: Colors.textSecondary,
  },
  rightContainer: {
  },
  imageWrap: {
    width: 100,
    height: 130,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  image: {
    width: '100%',
    height: 180,
    position: 'absolute',
    top: 0,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
  },
}), [themeVersion]);

  return (
    <TouchableOpacity
      style={[styles.card, { flexDirection: 'row' }, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.leftContent}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.title, selected && styles.titleSelected, { textAlign: 'left' }]}>
            {title}
          </Text>
        </View>

        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[styles.description, selected && styles.descriptionSelected, { textAlign: 'left' }]}
          >
            {description}
          </Text>
        </View>
      </View>

      {rightContent ? (
        <View style={[styles.rightContainer, { marginStart: 12 }]}>{rightContent}</View>
      ) : image ? (
        <View style={[styles.imageWrap, { marginStart: 12 }]}>
          <Image source={image} style={styles.image} contentFit="cover" placeholder={BLURHASH_PLACEHOLDER} transition={300} />
        </View>
      ) : null}

      {selected && (
        <View style={[styles.checkmark, { end: 12 }]}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};


export default AvatarOptionCard;

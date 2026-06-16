import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { IMAGES } from '../../constants/images/images';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 20;
const SLIDE_WIDTH = width - (CONTAINER_PADDING * 2);
const IMG_W = 140;

const Slide = React.memo(({ item, isRTL, styles }) => (
  <View style={{ width: SLIDE_WIDTH }}>
    <View style={[styles.banner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={[styles.textContent, isRTL ? { paddingRight: 25, paddingLeft: 10 } : { paddingLeft: 25, paddingRight: 10 }]}>
        <Text style={[styles.bannerTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{item.title}</Text>
        <Text style={[styles.bannerSub, { textAlign: isRTL ? 'right' : 'left' }]}>{item.subtitle}</Text>
      </View>
      <Image
        source={item.image}
        style={[styles.bannerImg]}
        resizeMode="contain"
      />
    </View>
  </View>
));

export const PromoBanner = () => {
  const { t, i18n } = useTranslation();
  const { themeVersion } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const isRTL = i18n.dir() === 'rtl';
  const scrollX = useRef(new Animated.Value(0)).current;
  const currentIndex = useRef(0);

  const BANNERS = useMemo(() => [
    {
      id: '1',
      title: t('store.promoBanner.summerEssentials'),
      subtitle: t('store.promoBanner.summerSubtitle'),
      image: IMAGES.Store,
    },
    {
      id: '2',
      title: t('store.promoBanner.newCollection'),
      subtitle: t('store.promoBanner.newCollectionSubtitle'),
      image: IMAGES.PICK,
    },
  ], [t]);

  const snapToIndex = useCallback((index) => {
    const clamped = Math.max(0, Math.min(index, BANNERS.length - 1));
    Animated.spring(scrollX, {
      toValue: -clamped * SLIDE_WIDTH,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
    currentIndex.current = clamped;
    setActiveIndex(clamped);
  }, [scrollX, BANNERS.length]);

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      Math.abs(gesture.dx) > 5 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderMove: (_, gesture) => {
      scrollX.setValue(-currentIndex.current * SLIDE_WIDTH + gesture.dx);
    },
    onPanResponderRelease: (_, gesture) => {
      const threshold = SLIDE_WIDTH * 0.25;
      if (gesture.dx < -threshold) {
        snapToIndex(currentIndex.current + 1);
      } else if (gesture.dx > threshold) {
        snapToIndex(currentIndex.current - 1);
      } else {
        snapToIndex(currentIndex.current);
      }
    },
  }), [scrollX, SLIDE_WIDTH, snapToIndex]);

  const styles = useMemo(() => StyleSheet.create({
    mainWrapper: {
      marginVertical: 10,
      position: 'relative',
      alignItems: 'center',
    },
    banner: {
      width: SLIDE_WIDTH,
      height: 200,
      backgroundColor: Colors.backgroundColor,
      borderRadius: 25,
      borderWidth: 1.5,
      borderColor: Colors.borderDefault,
      overflow: 'hidden',
    },
    textContent: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 25,
    },
    bannerTitle: {
      fontSize: 24,
      fontWeight: '900',
      color: Colors.textPrimary,
      lineHeight: 30,
      letterSpacing: -0.5,
    },
    bannerSub: {
      fontSize: 12,
      color: Colors.textMuted,
      marginTop: 10,
      lineHeight: 18,
    },
    bannerImg: {
      width: IMG_W,
      height: 160,
      alignSelf: 'flex-end',
      marginBottom: 5,
    },
    pagination: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 15,
      alignSelf: 'center',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.borderDefault,
      marginHorizontal: 3,
    },
    dotActive: {
      width: 14,
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.textPrimary,
    },
  }), [themeVersion]);

  return (
    <View style={styles.mainWrapper}>
      <View
        style={{ width: SLIDE_WIDTH, height: 200, overflow: 'hidden' }}
        {...panResponder.panHandlers}
      >
        {BANNERS.map((item, index) => (
          <Animated.View
            key={item.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: SLIDE_WIDTH,
              height: 200,
              transform: [{
                translateX: Animated.add(scrollX, index * SLIDE_WIDTH),
              }],
            }}
          >
            <Slide item={item} isRTL={isRTL} styles={styles} />
          </Animated.View>
        ))}
      </View>

      <View style={styles.pagination}>
        {BANNERS.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => snapToIndex(index)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <View
              style={[
                styles.dot,
                activeIndex === index && styles.dotActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

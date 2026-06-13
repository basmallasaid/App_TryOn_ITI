import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { IMAGES } from '../../constants/images/images';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 20;
const SLIDE_WIDTH = width - (CONTAINER_PADDING * 2);

const BANNERS = [
  {
    id: '1',
    title: 'Summer\nEssentials ✨',
    subtitle: 'Up to 30% off on curated\npicks just for you.',
    image: IMAGES.Store,
  },
  {
    id: '2',
    title: 'New\nCollection ✨',
    subtitle: 'Discover the latest trends\nfor this season.',
    image: IMAGES.PICK,
  },
];

export const PromoBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={[styles.banner, { flexDirection: 'row' }]}>
        <View style={styles.textContent}>
          <Text style={[styles.bannerTitle, { textAlign: 'left' }]}>{item.title}</Text>
          <Text style={[styles.bannerSub, { textAlign: 'left' }]}>{item.subtitle}</Text>
        </View>

        <Image
          source={item.image}
          style={[styles.bannerImg, { right: -5, left: undefined }]}
          resizeMode="contain"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.mainWrapper}>
      <FlatList
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        snapToAlignment="center"
        decelerationRate="fast"
      />

      <View style={styles.pagination}>
        {BANNERS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    marginVertical: 10,
    position: 'relative', 
    alignItems: 'center',
  },
  slide: {
    alignItems: 'center', 
  },
  banner: {
    width: SLIDE_WIDTH,
    height: 200,
    backgroundColor: '#F3F4F5',
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#E9EBEE',
    padding: 25,
    alignItems: 'center',
    overflow: 'hidden',
  },
  textContent: {
    flex: 1.2,
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1C24',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  bannerSub: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 10,
    lineHeight: 18,
    width: '90%',
  },
  bannerImg: {
    width: 160,
    height: 160,
    position: 'absolute',
    right: -5,
    bottom: 5,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15, // وضع النقط داخل الـ Banner من تحت
    alignSelf: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 3,
  },
  dotActive: {
    width: 14,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1A1C24',
  },
});
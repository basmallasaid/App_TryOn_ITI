import { useRef, useState, useEffect } from 'react';
import {
  View, Text, Animated,
  StyleSheet, Dimensions, StatusBar, PanResponder,
} from 'react-native';
import CustomizeAppButtonFilled from '../../components/common/CustomizeAppButtonFilled';
import CustomizeAppButtonOutlined from '../../components/common/CustomizeAppButtonOutlined';
import Colors from '../../constants/theme/colors';
import { IMAGES } from '../../constants/images/images';
import { setOnboardingSeen } from '../../storage/TokenStorage';

const { width: W, height: H } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    image: IMAGES.ONBOARDING_ONE,
    title: 'Discover Your Style',
    subtitle: 'Get personalized outfit ideas that match your unique vibe.',
  },
  {
    id: '2',
    image: IMAGES.ONBOARDING_TWO,
    title: 'Try Before You Buy',
    subtitle: 'See how clothes look on you with realistic AI try-on.',
  },
  {
    id: '3',
    image: IMAGES.ONBOARDING_THREE,
    title: 'Your Smart Wardrobe',
    subtitle: 'Organize, mix & match your looks all in one place.',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex]         = useState(0);
  const [previousIndex, setPreviousIndex]     = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // One opacity per slide — image AND text share the same value
  const opacities = useRef(
    SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;

  const activeIndexRef      = useRef(0);
  const isTransitioningRef  = useRef(false);

  useEffect(() => { activeIndexRef.current = activeIndex; },       [activeIndex]);
  useEffect(() => { isTransitioningRef.current = isTransitioning; }, [isTransitioning]);

  const isLast    = activeIndex === SLIDES.length - 1;
  const goToLogin =async () => {
    await setOnboardingSeen();
    navigation.replace('Login');};

  const transitionTo = (nextIndex) => {
    if (isTransitioningRef.current) return;
    if (nextIndex === activeIndexRef.current) return;
    if (nextIndex < 0 || nextIndex >= SLIDES.length) return;

    const current = activeIndexRef.current;
    setIsTransitioning(true);
    setPreviousIndex(current);

    Animated.parallel([
      Animated.timing(opacities[current], {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacities[nextIndex], {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveIndex(nextIndex);
      setPreviousIndex(null);
      setIsTransitioning(false);
    });
  };

  const handleNext = () => {
    if (isLast) goToLogin();
    else transitionTo(activeIndexRef.current + 1);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 12 && Math.abs(g.dy) < 40,
      onPanResponderRelease: (_, g) => {
        if (g.dx < -50)
          transitionTo(Math.min(activeIndexRef.current + 1, SLIDES.length - 1));
        else if (g.dx > 50)
          transitionTo(Math.max(activeIndexRef.current - 1, 0));
      },
    })
  ).current;

  return (
    <View style={styles.root} {...panResponder.panHandlers}>
      <StatusBar backgroundColor="#F2F2F3" barStyle="dark-content" />

      {/* Stacked slides — image + text per slide, all in same position */}
      <View style={styles.slidesArea}>
        {SLIDES.map((slide, i) => {
          const isVisible = i === activeIndex || i === previousIndex;
          if (!isVisible) return null;
          return (
            <Animated.View
              key={slide.id}
              style={[styles.slideStack, { opacity: opacities[i] }]}
            >
              {/* Image */}
              <Animated.Image
                source={slide.image}
                style={styles.image}
                resizeMode="contain"
              />
              {/* Text */}
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </Animated.View>
          );
        })}
      </View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map(({ id }, i) => (
          <View key={id} style={styles.dotContainer}>
            <View style={styles.dotInactive} />
            <Animated.View style={[styles.dotActive, { opacity: opacities[i] }]} />
          </View>
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonsRow}>
        {isLast ? (
          <View style={styles.fullWidth}>
            <CustomizeAppButtonFilled
              label="Get Started"
              onPress={goToLogin}
              backgroundColor={Colors.primary}
            />
          </View>
        ) : (
          <>
            <View style={styles.halfBtn}>
              <CustomizeAppButtonOutlined
                label="Skip"
                onPress={goToLogin}
              />
            </View>
            <View style={styles.halfBtn}>
              <CustomizeAppButtonFilled
                label="Next"
                onPress={handleNext}
                backgroundColor={Colors.primary}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F2F3',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    marginTop:40,
  },
  slidesArea: {
  height: H * 0.72, 
  width: W,
  alignItems: 'center',
  justifyContent: 'center',
},
  slideStack: {
    position: 'absolute',
    width: W,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  image: {
    width: W * 0.82,
    height: H * 0.42,
    marginBottom: 36,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 32,
    lineHeight: 38,
    color: '#121826',
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#1E1E24',
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    marginTop:16,
    gap:2
  },
  dotContainer: {
    width: 24,
    height: 12,
    position: 'relative',
  },
  dotInactive: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C4C4C4',
    left: 0,
    top: 2,
  },
  dotActive: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    left: -2,
    top: 0,
  },
  buttonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    width: '100%',
  },
  halfBtn:   { flex: 1 },
  fullWidth: { flex: 1 },
});

export default OnboardingScreen;
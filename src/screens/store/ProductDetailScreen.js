import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert, SafeAreaView, Dimensions, StatusBar, Linking, Platform 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { File, Directory, Paths } from 'expo-file-system';
import { getProductById } from '../../api/user_services/userService'; 
import { useNavigation } from '@react-navigation/native';
import { useWardrobe } from '../../context/WardrobeContext';
import { analyzeImage, getMatchesByAnalysis } from '../../api/matching_services/matchingService';
import { ROUTES, SOURCE } from '../../navigation/routes';
import CustomBackButton from '../../components/common/CustomBackButton';
import { useTranslation } from 'react-i18next';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { translateProduct, translateToArabic } from '../../utils/dynamicTranslator';

const { width } = Dimensions.get('window');
export default function ProductDetailScreen({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { productId } = route.params || { productId: "6a25cff029dabdceae5bbe12" };
  
  const [product, setProduct] = useState(null);
  const [displayProduct, setDisplayProduct] = useState(null); // translated version
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const { items: wardrobeItems } = useWardrobe();
  const [wardrobeMatches, setWardrobeMatches] = useState([]);
  const [matchingLoading, setMatchingLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
        setDisplayProduct(data);
        if (data.color_tags?.length > 0) setSelectedColor(data.color_tags[0]);
        // Translate product details dynamically when in Arabic
        const translated = await translateProduct(data);
        setDisplayProduct(translated);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const resolveImage = async (uri) => {
    if (!uri?.startsWith("http")) return uri;
    const file = await File.downloadFileAsync(uri, new Directory(Paths.cache), { idempotent: true });
    return file.uri;
  };

  useEffect(() => {
    if (!product?.images?.[0]) {
      setMatchingLoading(false);
      return;
    }
    setMatchingLoading(true);
    const fetchMatches = async () => {
      try {
        const localUri = await resolveImage(product.images[0]);
        const analysisRes = await analyzeImage(localUri);
        const analysisId = analysisRes?.analysis_id || analysisRes?.id || analysisRes?.data?.analysis_id;
        if (analysisId) {
          const matchRes = await getMatchesByAnalysis(analysisId, 30.0444, 31.2357);
          const list = matchRes?.matches || matchRes?.data?.matches || (Array.isArray(matchRes) ? matchRes : []);
          setWardrobeMatches(list.filter((m) => m.item?.source === "wardrobe"));
        }
      } catch (e) {
        const msg = e.response?.data || e.message;
        Alert.alert(t('store.matchError'), typeof msg === "string" ? msg : JSON.stringify(msg));
        setWardrobeMatches([]);
      } finally {
        setMatchingLoading(false);
      }
    };
    fetchMatches();
  }, [product, wardrobeItems]);

  const openUrl = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }
  };

  const getMatchImage = (match) => {
    if (!match?.item) return null;
    if (match.item.image) {
      const uri = typeof match.item.image === "string" ? match.item.image : match.item.image?.uri;
      if (uri) return { uri };
    }
    const wardrobeItem = wardrobeItems.find((wi) => wi._id === match.item.id || wi.id === match.item.id);
    if (wardrobeItem) {
      const uri = typeof wardrobeItem.image === "string" ? wardrobeItem.image : wardrobeItem.image?.uri;
      if (uri) return { uri };
    }
    return null;
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#5CC1FF" />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" translucent />
      <View style={styles.headerFixed}>
        <SafeAreaView>
          <View style={[styles.headerContent, { flexDirection: "row" }]}>
            <CustomBackButton onPress={() => navigation.goBack()} borderColor={Colors.borderDefault} />
            <View style={[styles.headerRight, { flexDirection: "row" }]}>
              <TouchableOpacity style={[styles.iconCircle, { marginLeft: 12, marginRight: 0 }]}>
                <Ionicons name="heart-outline" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product?.images?.[0] }} style={styles.mainImage} resizeMode="contain" />
        </View>

        <View style={styles.contentBody}>
          <View style={styles.indicator} />
          
          <View style={[styles.rowBetween, { flexDirection: "row" }]}>
            <View style={{flex: 1}}>
              <Text style={styles.productTitle}>{displayProduct?.name || product?.name}</Text>
              <TouchableOpacity onPress={() => openUrl(product?.purchase_url)}>
                <Text style={styles.brandName}>{product?.store_id?.name || t('store.officialStore')} <Ionicons name="open-outline" size={12} /></Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.priceContainer, { alignItems: "flex-end" }]}>
              <Text style={styles.priceText}>{product?.price}</Text>
              <Text style={styles.currency}>{product?.currency || t("store.currency")}</Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('store.description')}</Text>
            <Text style={styles.description} numberOfLines={showFullDescription ? undefined : 2}>
              {displayProduct?.description || product?.description}
            </Text>
            <TouchableOpacity style={styles.moreBtn} onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.moreText}>{showFullDescription ? t('store.showLess') : t('store.seeMore')}</Text>
              <Ionicons name={showFullDescription ? "chevron-up" : "chevron-down"} size={14} color="#5CC1FF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('store.color')} <Text style={styles.selectedSub}>{selectedColor}</Text></Text>
            <View style={styles.optionsRow}>
              {product?.color_tags?.map((color, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => setSelectedColor(color)}
                  style={[styles.colorRing, selectedColor === color && { borderColor: '#5CC1FF' }]}
                >
                  <View 
                    style={[
                      styles.colorInside, 
                      { 
                        backgroundColor: color.toLowerCase().trim().replace(/\s+/g, '') || '#EEE' 
                      }
                    ]} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('store.size')} <Text style={styles.selectedSub}>{selectedSize}</Text></Text>
            <View style={styles.optionsRow}>
              {sizes.map((size) => (
                <TouchableOpacity 
                  key={size} 
                  onPress={() => setSelectedSize(size)}
                  style={[styles.sizeBox, selectedSize === size && styles.activeSizeBox]}
                >
                  <Text style={[styles.sizeLabel, selectedSize === size && styles.activeSizeLabel]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('store.wardrobeMatches')}</Text>
            {matchingLoading ? (
              <ActivityIndicator size="small" color="#5CC1FF" style={{ marginVertical: 20 }} />
            ) : wardrobeMatches.length === 0 ? (
              <Text style={styles.noMatchText}>{t('store.noMatches')}</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.matchScroll}>
                {wardrobeMatches.map((match, index) => {
                  const imgSrc = getMatchImage(match);
                  return (
                    <TouchableOpacity
                      key={match.item?.id || index}
                      onPress={() => navigation.navigate(ROUTES.MATCHING, { screen: ROUTES.MATCHING_RESULT_DETAILS, params: { match, imageUri: imgSrc?.uri } })}
                    >
                      <View style={styles.matchCard}>
                        <View style={styles.scoreBadge}>
                          <Text style={styles.scoreText}>{match.score}%</Text>
                        </View>
                        {imgSrc ? (
                          <Image source={imgSrc} style={styles.matchImg} resizeMode="contain" />
                        ) : (
                          <MaterialCommunityIcons name="tshirt-crew-outline" size={40} color={Colors.disabled} />
                        )}
                        <Text style={styles.matchItemName} numberOfLines={1}>{match.item?.name}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.mainBtn} activeOpacity={0.8} onPress={() => navigation.navigate(ROUTES.TRY_ON, { screen: ROUTES.SELECT_MODEL, params: { source: SOURCE.STORE, itemId: productId, itemType: product?.category, productImage: product?.images?.[0], productName: product?.name } })}>
              <Ionicons name="sparkles" size={20} color="white" />
              <Text style={styles.mainBtnText}>{t('store.generateTryOn')}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = () => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerFixed: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    zIndex: 100,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  headerContent: { justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  headerRight: { },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  scrollContent: { 
    paddingBottom: Platform.OS === 'ios' ? 40 : 20 
  },

  imageWrapper: { width: width, height: 420, backgroundColor: Colors.backgroundColor, justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '80%', height: '80%' },

  contentBody: { flex: 1, backgroundColor: Colors.white, borderTopLeftRadius: 35, borderTopRightRadius: 35, marginTop: -35, padding: 25 },
  indicator: { width: 40, height: 4, backgroundColor: Colors.borderDefault, borderRadius: 2, alignSelf: 'center', marginBottom: 25 },
  
  rowBetween: { justifyContent: 'space-between', alignItems: 'flex-start' },
  productTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  brandName: { color: '#5CC1FF', fontSize: 13, fontWeight: '700', marginTop: 4 },
  
  priceContainer: { },
  priceText: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary },
  currency: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },

  sectionContainer: { marginTop: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  selectedSub: { fontSize: 14, fontWeight: '400', color: Colors.textMuted },
  description: { fontSize: 14, color: Colors.textMuted, lineHeight: 22 },
  moreBtn: { alignItems: 'center', marginTop: 4 },
  moreText: { color: '#5CC1FF', fontWeight: 'bold', fontSize: 13 },

  optionsRow: { alignItems: 'center' },
  colorRing: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  colorInside: { width: 28, height: 28, borderRadius: 14, elevation: 1 },
  
  sizeBox: { width: 50, height: 48, borderRadius: 12, backgroundColor: Colors.backgroundColor, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: Colors.borderDefault },
  activeSizeBox: { backgroundColor: '#40B9FF' },
  sizeLabel: { fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary },
  activeSizeLabel: { color: Colors.textInverse },

  // Matching
  matchScroll: { marginTop: 5 },
  matchCard: { width: 150, height: 180, backgroundColor: Colors.white, borderRadius: 15, marginRight: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#E0F4BE', position: 'relative' },
  matchImg: { width: 100, height: 110 },
  matchItemName: { fontSize: 11, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center', marginTop: 6, paddingHorizontal: 8, textTransform: 'capitalize' },
  scoreBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#A5E142', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, zIndex: 1 },
  scoreText: { color: Colors.textInverse, fontSize: 11, fontWeight: 'bold' },
  noMatchText: { color: Colors.textMuted, fontSize: 14, marginVertical: 10 },

  // Footer Actions
  actionRow: { alignItems: 'center', marginTop: 35, paddingBottom: 20 },
  mainBtn: { flex: 1, backgroundColor: '#5CC1FF', height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#5CC1FF', shadowOpacity: 0.25, shadowRadius: 8 },
  mainBtnText: { color: Colors.textInverse, fontSize: 16, fontWeight: '800' }
});
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

const { width } = Dimensions.get('window');
export default function ProductDetailScreen({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { productId } = route.params || { productId: "6a25cff029dabdceae5bbe12" };
  
  const [product, setProduct] = useState(null);
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
        if (data.color_tags?.length > 0) setSelectedColor(data.color_tags[0]);
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
        Alert.alert(t("store.productDetail.matchError"), typeof msg === "string" ? msg : JSON.stringify(msg));
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
            <CustomBackButton onPress={() => navigation.goBack()} borderColor="#D5D9DE" />
            <View style={[styles.headerRight, { flexDirection: "row" }]}>
              <TouchableOpacity style={[styles.iconCircle, { marginLeft: 12, marginRight: 0 }]}>
                <Ionicons name="heart-outline" size={24} color="#1A1C24" />
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
              <Text style={[styles.productTitle, { textAlign: "left" }]}>{product?.name}</Text>
              <TouchableOpacity onPress={() => openUrl(product?.purchase_url)}>
                <Text style={styles.brandName}>{product?.store_id?.name || t("store.productDetail.officialStore")} <Ionicons name="open-outline" size={12} /></Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.priceContainer, { alignItems: "flex-end" }]}>
              <Text style={styles.priceText}>{product?.price}</Text>
              <Text style={styles.currency}>{product?.currency || t("store.currency")}</Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t("store.productDetail.description")}</Text>
            <Text style={styles.description} numberOfLines={showFullDescription ? undefined : 2}>
              {product?.description}
            </Text>
            <TouchableOpacity style={[styles.moreBtn, { flexDirection: "row" }]} onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.moreText}>{showFullDescription ? t("store.productDetail.showLess") : t("store.productDetail.seeMore")}</Text>
              <Ionicons name={showFullDescription ? "chevron-up" : "chevron-down"} size={14} color="#5CC1FF" style={{ marginLeft: 4, marginRight: 0 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t("store.productDetail.color")} <Text style={styles.selectedSub}>{selectedColor}</Text></Text>
            <View style={[styles.optionsRow, { flexDirection: "row" }]}>
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
            <Text style={styles.sectionTitle}>{t("store.productDetail.size")} <Text style={styles.selectedSub}>{selectedSize}</Text></Text>
            <View style={[styles.optionsRow, { flexDirection: "row" }]}>
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
            <Text style={styles.sectionTitle}>{t("store.productDetail.wardrobeMatches")}</Text>
            {matchingLoading ? (
              <ActivityIndicator size="small" color="#5CC1FF" style={{ marginVertical: 20 }} />
            ) : wardrobeMatches.length === 0 ? (
              <Text style={styles.noMatchText}>{t("store.productDetail.noMatches")}</Text>
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
                          <MaterialCommunityIcons name="tshirt-crew-outline" size={40} color="#CBD5E0" />
                        )}
                        <Text style={styles.matchItemName} numberOfLines={1}>{match.item?.name}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          <View style={[styles.actionRow, { flexDirection: "row" }]}>
            <TouchableOpacity style={[styles.mainBtn, { flexDirection: "row" }]} activeOpacity={0.8} onPress={() => navigation.navigate(ROUTES.TRY_ON, { screen: ROUTES.SELECT_MODEL, params: { source: SOURCE.STORE, itemId: productId, itemType: product?.category, productImage: product?.images?.[0], productName: product?.name } })}>
              <Ionicons name="sparkles" size={20} color="white" />
              <Text style={[styles.mainBtnText, { marginLeft: 10, marginRight: 0 }]}>{t("store.productDetail.generateTryOn")}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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

  imageWrapper: { width: width, height: 420, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '80%', height: '80%' },

  contentBody: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, marginTop: -35, padding: 25 },
  indicator: { width: 40, height: 4, backgroundColor: '#F0F0F0', borderRadius: 2, alignSelf: 'center', marginBottom: 25 },
  
  rowBetween: { justifyContent: 'space-between', alignItems: 'flex-start' },
  productTitle: { fontSize: 24, fontWeight: '800', color: '#1A1C24', letterSpacing: -0.5 },
  brandName: { color: '#5CC1FF', fontSize: 13, fontWeight: '700', marginTop: 4 },
  
  priceContainer: { },
  priceText: { fontSize: 26, fontWeight: '900', color: '#1A1C24' },
  currency: { fontSize: 12, fontWeight: '700', color: '#ABB5BE' },

  sectionContainer: { marginTop: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1C24', marginBottom: 12 },
  selectedSub: { fontSize: 14, fontWeight: '400', color: '#ABB5BE' },
  description: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  moreBtn: { alignItems: 'center', marginTop: 4 },
  moreText: { color: '#5CC1FF', fontWeight: 'bold', fontSize: 13 },

  optionsRow: { alignItems: 'center' },
  colorRing: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  colorInside: { width: 28, height: 28, borderRadius: 14, elevation: 1 },
  
  sizeBox: { width: 50, height: 48, borderRadius: 12, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  activeSizeBox: { backgroundColor: '#40B9FF' },
  sizeLabel: { fontSize: 15, fontWeight: 'bold', color: '#1A1C24' },
  activeSizeLabel: { color: '#FFFFFF' },

  // Matching
  matchScroll: { marginTop: 5 },
  matchCard: { width: 150, height: 180, backgroundColor: '#FFF', borderRadius: 15, marginRight: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#E0F4BE', position: 'relative' },
  matchImg: { width: 100, height: 110 },
  matchItemName: { fontSize: 11, fontWeight: '600', color: '#1A2530', textAlign: 'center', marginTop: 6, paddingHorizontal: 8, textTransform: 'capitalize' },
  scoreBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#A5E142', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, zIndex: 1 },
  scoreText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  noMatchText: { color: '#718096', fontSize: 14, marginVertical: 10 },

  // Footer Actions
  actionRow: { alignItems: 'center', marginTop: 35, paddingBottom: 20 },
  mainBtn: { flex: 1, backgroundColor: '#5CC1FF', height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#5CC1FF', shadowOpacity: 0.25, shadowRadius: 8 },
  mainBtnText: { color: 'white', fontSize: 16, fontWeight: '800' }
});
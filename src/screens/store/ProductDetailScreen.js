import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, 
  ActivityIndicator, SafeAreaView, Dimensions, StatusBar, Linking, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { getProductById } from '../../api/user_services/userService'; 
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
export default function ProductDetailScreen({ route }) {
  const navigation = useNavigation();
  const { productId } = route.params || { productId: "6a25cff029dabdceae5bbe12" };
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

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

  const openUrl = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }
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
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="#1A1C24" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={[styles.iconCircle, {marginLeft: 12}]}>
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
          
          <View style={styles.rowBetween}>
            <View style={{flex: 1}}>
              <Text style={styles.productTitle}>{product?.name}</Text>
              <TouchableOpacity onPress={() => openUrl(product?.purchase_url)}>
                <Text style={styles.brandName}>{product?.store_id?.name || 'Official Store'} <Ionicons name="open-outline" size={12} /></Text>
              </TouchableOpacity>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>{product?.price}</Text>
              <Text style={styles.currency}>{product?.currency || 'EGP'}</Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description} numberOfLines={showFullDescription ? undefined : 2}>
              {product?.description}
            </Text>
            <TouchableOpacity style={styles.moreBtn} onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.moreText}>{showFullDescription ? 'Show Less' : 'See More'}</Text>
              <Ionicons name={showFullDescription ? "chevron-up" : "chevron-down"} size={14} color="#5CC1FF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Color <Text style={styles.selectedSub}>{selectedColor}</Text></Text>
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
            <Text style={styles.sectionTitle}>Size <Text style={styles.selectedSub}>{selectedSize}</Text></Text>
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
            <Text style={styles.sectionTitle}>Wardrobe Matches ✨</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.matchScroll}>
              {[100, 95, 85].map((val, i) => (
                <View key={i} style={styles.matchCard}>
                  <View style={styles.matchPercent}><Text style={styles.matchPercentText}>{val}%</Text></View>
                  <Image source={{ uri: product?.images?.[0] }} style={styles.matchImg} />
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.mainBtn} activeOpacity={0.8} onPress={() => navigation.navigate('TryOn', { screen: 'SelectModel', params: { productImage: product?.images?.[0], productName: product?.name } })}>
              <Ionicons name="sparkles" size={20} color="white" />
              <Text style={styles.mainBtnText}>Generate Try-on</Text>
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
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  headerRight: { flexDirection: 'row' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  scrollContent: { 
    paddingBottom: Platform.OS === 'ios' ? 40 : 20 
  },

  imageWrapper: { width: width, height: 420, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '80%', height: '80%' },

  contentBody: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, marginTop: -35, padding: 25 },
  indicator: { width: 40, height: 4, backgroundColor: '#F0F0F0', borderRadius: 2, alignSelf: 'center', marginBottom: 25 },
  
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productTitle: { fontSize: 24, fontWeight: '800', color: '#1A1C24', letterSpacing: -0.5 },
  brandName: { color: '#5CC1FF', fontSize: 13, fontWeight: '700', marginTop: 4 },
  
  priceContainer: { alignItems: 'flex-end' },
  priceText: { fontSize: 26, fontWeight: '900', color: '#1A1C24' },
  currency: { fontSize: 12, fontWeight: '700', color: '#ABB5BE' },

  sectionContainer: { marginTop: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1C24', marginBottom: 12 },
  selectedSub: { fontSize: 14, fontWeight: '400', color: '#ABB5BE' },
  description: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  moreBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  moreText: { color: '#5CC1FF', fontWeight: 'bold', fontSize: 13 },

  optionsRow: { flexDirection: 'row', alignItems: 'center' },
  colorRing: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  colorInside: { width: 28, height: 28, borderRadius: 14, elevation: 1 },
  
  sizeBox: { width: 50, height: 48, borderRadius: 12, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  activeSizeBox: { backgroundColor: '#40B9FF' },
  sizeLabel: { fontSize: 15, fontWeight: 'bold', color: '#1A1C24' },
  activeSizeLabel: { color: '#FFFFFF' },

  // Matching
  matchScroll: { marginTop: 5 },
  matchCard: { width: 110, height: 130, backgroundColor: '#F9FAFB', borderRadius: 20, marginRight: 12, padding: 8, justifyContent: 'center', alignItems: 'center', borderColor: '#8ED321', borderWidth: 1 },
  matchImg: { width: '85%', height: '85%', resizeMode: 'contain' },
  matchPercent: { position: 'absolute', top: 8, right: 8, backgroundColor: '#8ED321', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6, zIndex: 1 },
  matchPercentText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  // Footer Actions
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 35, paddingBottom: 20 },
  mainBtn: { flex: 1, backgroundColor: '#5CC1FF', height: 60, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#5CC1FF', shadowOpacity: 0.25, shadowRadius: 8 },
  mainBtnText: { color: 'white', fontSize: 16, fontWeight: '800', marginLeft: 10 }
});
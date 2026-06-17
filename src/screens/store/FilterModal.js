import React, { useEffect, useState } from 'react';
import SafeScreen from '../../components/common/SafeScreen';
import { ActivityIndicator, Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomBackButton from '../../components/common/CustomBackButton';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

export const FilterModal = ({
  visible,
  onClose,
  onApply,
  initialBrands = [],
  initialSeasons = [],
  initialCategories = [],
  initialColors = [],
  initialPrice = 1000,
  products = [],
}) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const [price, setPrice] = useState(initialPrice);
  const [loading, setLoading] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState(initialBrands);
  const [selectedSeasons, setSelectedSeasons] = useState(initialSeasons);
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [selectedColors, setSelectedColors] = useState(initialColors);
  const [availableColors, setAvailableColors] = useState([]);

  const toggleValue = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const loadAvailableColors = React.useCallback(() => {
    const colors = new Set();
    products.forEach((product) => {
      Array.isArray(product.color_tags) &&
        product.color_tags.forEach((tag) => {
          if (tag) colors.add(tag.toLowerCase());
        });
    });
    setAvailableColors(Array.from(colors).sort());
  }, [products]);

  useEffect(() => {
    if (visible) {
      loadAvailableColors();
      setSelectedBrands(initialBrands);
      setSelectedSeasons(initialSeasons);
      setSelectedCategories(initialCategories);
      setSelectedColors(initialColors);
      setPrice(initialPrice);
    }
  }, [visible]);

  const CheckboxItem = ({ label, selected, onPress }) => (
    <TouchableOpacity style={[styles.checkboxRow, { flexDirection: "row" }]} onPress={onPress}>
      <View style={[styles.checkboxBox, selected && styles.checkboxBoxSelected]} />
      <Text style={[styles.checkboxLabel, selected && styles.checkboxLabelSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  const FilterSection = ({ title, children }) => (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { flexDirection: "row" }]}>
        <Text style={styles.sectionTitle}>{title}</Text>
          <Ionicons name="chevron-down" size={20} color={Colors.iconGray} />
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );

  const handleApplyFilters = () => {
    setLoading(true);
    try {
      onApply?.({
        brands: selectedBrands,
        seasons: selectedSeasons,
        categories: selectedCategories,
        colors: selectedColors,
        price,
      });
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeScreen>
        <View style={[styles.header, { flexDirection: "row" }]}>
          <CustomBackButton onPress={onClose} />
          <Text style={styles.headerTitle}>{t("store.filters.title")}</Text>
          <View style={{ width: 28 }} /> 
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Brands */}
          <FilterSection title={t("store.filters.brands")}>
            <CheckboxItem
              label="HM"
              selected={selectedBrands.includes('hm')}
              onPress={() => toggleValue('hm', selectedBrands, setSelectedBrands)}
            />
            <CheckboxItem
              label="ZARA"
              selected={selectedBrands.includes('zara')}
              onPress={() => toggleValue('zara', selectedBrands, setSelectedBrands)}
            />
          </FilterSection>

          {/* Season */}
          <FilterSection title={t("store.filters.season")}>
            <View style={[styles.pillsContainer, { justifyContent: 'flex-start' }]}>
              {['summer', 'spring', 'fall', 'winter'].map((s) => {
                const label = t("store.filters.seasons." + s);
                const value = s;
                const selected = selectedSeasons.includes(value);
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.pill, selected && styles.pillSelected]}
                    onPress={() => toggleValue(value, selectedSeasons, setSelectedSeasons)}
                  >
                    <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FilterSection>

          {/* Categories */}
          <FilterSection title={t("store.filters.categories")}>
            <CheckboxItem
              label={t("wardrobe.categories.dress")}
              selected={selectedCategories.includes('dress')}
              onPress={() => toggleValue('dress', selectedCategories, setSelectedCategories)}
            />
            <CheckboxItem
              label={t("wardrobe.categories.top")}
              selected={selectedCategories.includes('top')}
              onPress={() => toggleValue('top', selectedCategories, setSelectedCategories)}
            />
            <CheckboxItem
              label={t("wardrobe.categories.bottom")}
              selected={selectedCategories.includes('bottom')}
              onPress={() => toggleValue('bottom', selectedCategories, setSelectedCategories)}
            />
          </FilterSection>

          {/* Color */}
          <FilterSection title={t("store.filters.color")}>
            <View style={[styles.pillsContainer, { justifyContent: 'flex-start' }]}>
              {availableColors.length > 0 ? (
                availableColors.map((color) => {
                  const display = color.charAt(0).toUpperCase() + color.slice(1);
                  const selected = selectedColors.includes(color);
                  return (
                    <TouchableOpacity
                      key={color}
                      style={[styles.pill, selected && styles.pillSelected]}
                      onPress={() => toggleValue(color, selectedColors, setSelectedColors)}
                    >
                      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{display}</Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.emptyText}>{t("store.filters.loadingColors")}</Text>
              )}
            </View>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title={t("store.filters.priceRange")}>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={1000}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor={Colors.borderStrong}
              thumbTintColor={Colors.primary}
              value={price}
              onValueChange={setPrice}
            />
            <View style={styles.priceLabels}>
              <Text style={styles.priceText}>0</Text>
              <Text style={styles.priceText}>{Math.round(price)} {t("store.currency")}</Text>
            </View>
          </FilterSection>
        </ScrollView>
        
        {/* زرار Apply (اختياري بس مهم) */}
        <TouchableOpacity style={styles.applyBtn} onPress={handleApplyFilters} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.textInverse} />
          ) : (
            <Text style={styles.applyBtnText}>{t("store.filters.apply")}</Text>
          )}
        </TouchableOpacity>
      </SafeScreen>
    </Modal>
  );
};

const createStyles = () => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary },
  content: { paddingHorizontal: 20 },
  section: { marginBottom: 30 },
  sectionHeader: { justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  checkboxRow: { alignItems: 'center', marginBottom: 12 },
  checkboxBox: { width: 20, height: 20, borderWidth: 1, borderColor: Colors.borderDefault, borderRadius: 4, marginHorizontal: 12 },
  checkboxBoxSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkboxLabel: { fontSize: 16, color: Colors.textMuted },
  checkboxLabelSelected: { color: Colors.textPrimary, fontWeight: '700' },
  pillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: { borderWidth: 1, borderColor: Colors.borderDefault, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8, marginEnd: 10, marginBottom: 10 },
  pillSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pillText: { color: Colors.textMuted },
  pillTextSelected: { color: Colors.textInverse },
  priceLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  priceText: { color: Colors.textMuted, fontWeight: 'bold' },
  applyBtn: { backgroundColor: Colors.primary, margin: 20, padding: 18, borderRadius: 15, alignItems: 'center' },
  applyBtnText: { color: Colors.textInverse, fontWeight: 'bold', fontSize: 16 }
});
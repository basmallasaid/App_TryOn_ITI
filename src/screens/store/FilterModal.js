import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { getAllProducts } from '../../api/user_services/userService';

export const FilterModal = ({
  visible,
  onClose,
  onApply,
  initialBrands = [],
  initialSeasons = [],
  initialCategories = [],
  initialColors = [],
  initialPrice = 1000,
}) => {
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

  const loadAvailableColors = async () => {
    try {
      const data = await getAllProducts();
      const colors = new Set();
      Array.isArray(data) && data.forEach((product) => {
        Array.isArray(product.color_tags) &&
          product.color_tags.forEach((tag) => {
            if (tag) colors.add(tag.toLowerCase());
          });
      });
      setAvailableColors(Array.from(colors).sort());
    } catch (error) {
      console.error('Unable to load colors:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      loadAvailableColors();
      setSelectedBrands(initialBrands);
      setSelectedSeasons(initialSeasons);
      setSelectedCategories(initialCategories);
      setSelectedColors(initialColors);
      setPrice(initialPrice);
    }
  }, [visible, initialBrands, initialSeasons, initialCategories, initialColors, initialPrice]);

  const CheckboxItem = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.checkboxRow} onPress={onPress}>
      <View style={[styles.checkboxBox, selected && styles.checkboxBoxSelected]} />
      <Text style={[styles.checkboxLabel, selected && styles.checkboxLabelSelected]}>{label}</Text>
    </TouchableOpacity>
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
      console.error('Filter apply failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
             <Ionicons name="chevron-back" size={28} color="#1A1C24" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
          <View style={{ width: 28 }} /> 
        </View>

        <ScrollView style={styles.content}>
          {/* Brands */}
          <FilterSection title="Brands">
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
          <FilterSection title="Season">
            <View style={styles.pillsContainer}>
              {['Summer', 'Spring', 'Fall', 'Winter'].map((s) => {
                const value = s.toLowerCase();
                const selected = selectedSeasons.includes(value);
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.pill, selected && styles.pillSelected]}
                    onPress={() => toggleValue(value, selectedSeasons, setSelectedSeasons)}
                  >
                    <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{s}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FilterSection>

          {/* Categories */}
          <FilterSection title="Categories">
            <CheckboxItem
              label="Dress"
              selected={selectedCategories.includes('dress')}
              onPress={() => toggleValue('dress', selectedCategories, setSelectedCategories)}
            />
            <CheckboxItem
              label="Top"
              selected={selectedCategories.includes('top')}
              onPress={() => toggleValue('top', selectedCategories, setSelectedCategories)}
            />
            <CheckboxItem
              label="Bottom"
              selected={selectedCategories.includes('bottom')}
              onPress={() => toggleValue('bottom', selectedCategories, setSelectedCategories)}
            />
          </FilterSection>

          {/* Color */}
          <FilterSection title="Color">
            <View style={styles.pillsContainer}>
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
                <Text style={styles.emptyText}>Loading colors...</Text>
              )}
            </View>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={1000}
              minimumTrackTintColor="#5CC1FF"
              maximumTrackTintColor="#D5D9DE"
              thumbTintColor="#5CC1FF"
              value={price}
              onValueChange={setPrice}
            />
            <View style={styles.priceLabels}>
              <Text style={styles.priceText}>0</Text>
              <Text style={styles.priceText}>{Math.round(price)} USD</Text>
            </View>
          </FilterSection>
        </ScrollView>
        
        {/* زرار Apply (اختياري بس مهم) */}
        <TouchableOpacity style={styles.applyBtn} onPress={handleApplyFilters} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

// مكون فرعي لكل قسم
const FilterSection = ({ title, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Ionicons name="chevron-down" size={20} color="#9BA5B0" />
    </View>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1C24' },
  content: { paddingHorizontal: 20 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1C24' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkboxBox: { width: 20, height: 20, borderWidth: 1, borderColor: '#D5D9DE', borderRadius: 4, marginRight: 12 },
  checkboxBoxSelected: { backgroundColor: '#5CC1FF', borderColor: '#5CC1FF' },
  checkboxLabel: { fontSize: 16, color: '#6B7280' },
  checkboxLabelSelected: { color: '#1A1C24', fontWeight: '700' },
  pillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: { borderWidth: 1, borderColor: '#D5D9DE', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8, marginRight: 10, marginBottom: 10 },
  pillSelected: { backgroundColor: '#5CC1FF', borderColor: '#5CC1FF' },
  pillText: { color: '#6B7280' },
  pillTextSelected: { color: '#FFF' },
  priceLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  priceText: { color: '#6B7280', fontWeight: 'bold' },
  applyBtn: { backgroundColor: '#5CC1FF', margin: 20, padding: 18, borderRadius: 15, alignItems: 'center' },
  applyBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
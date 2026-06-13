import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View, Text, Platform, StatusBar } from 'react-native';
import { StoreHeader } from '../../components/store/StoreHeader';
import { ProductCard } from '../../components/store/ProductCard';
import { SearchBar } from '../../components/store/SearchBar';
import { PromoBanner } from '../../components/store/PromoBanner';
import { CategoryTabs } from '../../components/store/CategoryTabs';
import Colors from '../../constants/theme/colors';
import { getAllProducts } from '../../api/user_services/userService';
import { FilterModal } from './FilterModal';
import { useFavorites } from '../../context/FavoritesContext';
import { useTranslation } from 'react-i18next';

import { useNavigation } from '@react-navigation/native';
import { ROUTES, SOURCE } from '../../navigation/routes';

export default function StoreScreen() {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const mapProductToCard = (product) => ({
        id: product._id,
        name: product.name,
        brand: product.store_id?.name || 'Store',
        price: `${product.price} ${product.currency || t("store.currency")}`,
        image: product.images?.[0],
        badge: product.try_on_enabled ? 'Match' : product.is_active ? '' : 'Inactive',
        badgeColor: product.try_on_enabled ? '#8ED321' : '#8A9BAD',
        isOutlined: product.try_on_enabled,
    });

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'dresses':
                return 'dresses';
            case 'top':
                return 'tshirt-crew-outline';
            case 'pants':
                return 'human-male-height';
            default:
                return null;
        }
    };

    const buildCategoriesFromProducts = (products) => {
        const categorySet = new Set();
        products.forEach((product) => {
            const category = product.category?.toLowerCase();
            if (category) categorySet.add(category);
        });

        const categories = [{ id: 'all', name: t("store.all"), icon: null, value: 'all' }];

        Array.from(categorySet)
            .sort()
            .forEach((category) => {
                categories.push({
                    id: category,
                    name: category.charAt(0).toUpperCase() + category.slice(1),
                    value: category,
                    icon: getCategoryIcon(category),
                });
            });

        return categories;
    };
    const { isFavorite, addItem, removeItem, refetch: refetchFavorites } = useFavorites();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filterVisible, setFilterVisible] = useState(false);
    const [filterValues, setFilterValues] = useState({
        brands: [],
        seasons: [],
        categories: [],
        colors: [],
        price: 1000,
    });

    const handleSearchSubmit = () => {
        setSearchQuery((prevQuery) => prevQuery.trim());
    };

    const handleTryOn = (item) => {
        navigation.navigate(ROUTES.TRY_ON, {
            screen: ROUTES.SELECT_MODEL,
            params: { 
                source: SOURCE.STORE,
                itemId: item.id,
                itemType: item.name,
                productImage: item.image, 
                productName: item.name 
            }
        });
    };

    const handleFilterApply = (values) => {
        setFilterValues(values);
        setFilterVisible(false);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getAllProducts();
                setAllProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(t("store.loadError"));
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories = useMemo(() => buildCategoriesFromProducts(allProducts), [allProducts]);

    const filteredProducts = useMemo(() => {
        return allProducts
            .filter((product) => {
                if (selectedCategory === 'all') return true;
                return product.category?.toLowerCase() === selectedCategory;
            })
            .filter((product) => {
                if (!searchQuery?.trim()) return true;
                const normalizedQuery = searchQuery.toLowerCase();
                return (
                    product.name?.toLowerCase().includes(normalizedQuery) ||
                    product.store_id?.name?.toLowerCase().includes(normalizedQuery)
                );
            })
            .filter((product) => {
                if (filterValues.brands.length === 0) return true;
                return filterValues.brands.includes(product.store_id?.name?.toLowerCase());
            })
            .filter((product) => {
                if (filterValues.categories.length === 0) return true;
                return filterValues.categories.includes(product.category?.toLowerCase());
            })
            .filter((product) => {
                if (filterValues.seasons.length === 0) return true;
                return Array.isArray(product.season_tags) &&
                    product.season_tags.some((tag) => filterValues.seasons.includes(tag?.toLowerCase()));
            })
            .filter((product) => {
                if (filterValues.colors.length === 0) return true;
                return Array.isArray(product.color_tags) &&
                    product.color_tags.some((tag) => filterValues.colors.includes(tag?.toLowerCase()));
            })
            .filter((product) => {
                const priceValue = Number(product.price || 0);
                return priceValue <= filterValues.price;
            })
            .map(mapProductToCard);
    }, [allProducts, searchQuery, selectedCategory, filterValues]);

    if (loading) {
        return (
            <View style={[styles.screenWrapper, styles.center]}>
                <ActivityIndicator size="large" color={Colors.primarybrand} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.screenWrapper, styles.center]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.screenWrapper}>
            <FlatList
                data={filteredProducts}
                numColumns={2}
              columnWrapperStyle={styles.row} 
                
                ListHeaderComponent={() => (
                    <View style={{ padding: 20 }}>
                        <StoreHeader onFilterPress={() => setFilterVisible(true)} />
                             <FilterModal
                                visible={filterVisible}
                                onClose={() => setFilterVisible(false)}
                                onApply={handleFilterApply}
                                initialBrands={filterValues.brands}
                                initialSeasons={filterValues.seasons}
                                initialCategories={filterValues.categories}
                                initialColors={filterValues.colors}
                                initialPrice={filterValues.price}
                              />
                        <SearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSearch={handleSearchSubmit}
                        />
                        <PromoBanner />
                        <CategoryTabs
                            categories={categories}
                            activeCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />
                    </View>
                )}
                renderItem={({ item }) => (
                    <ProductCard
                        {...item}
                        isFavorite={isFavorite(item.id)}
                        onToggleFavorite={async () => {
                            try {
                                if (isFavorite(item.id)) {
                                    await removeItem(item.id);
                                } else {
                                    await addItem(item.id, "PRODUCT");
                                }
                            } catch (e) {
                                refetchFavorites();
                            }
                        }}
                        onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: item.id })}
                        onTryOnPress={() => handleTryOn(item)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{t("store.noProducts")}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
     screenWrapper: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    listContent: {
        paddingHorizontal: 12, 
        paddingBottom: 30,
    },
    row: {
        justifyContent:"space-between",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    emptyContainer: {
        width: '100%',
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 14,
    },
});
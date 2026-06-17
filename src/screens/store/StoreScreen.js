import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, FlatList, StyleSheet, View, Text, Platform, StatusBar } from 'react-native';
import { StoreHeader } from '../../components/store/StoreHeader';
import { ProductCard } from '../../components/store/ProductCard';
import { SearchBar } from '../../components/store/SearchBar';
import { PromoBanner } from '../../components/store/PromoBanner';
import { CategoryTabs } from '../../components/store/CategoryTabs';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { useStore } from '../../context/StoreContext';
import { FilterModal } from './FilterModal';
import { useFavorites } from '../../context/FavoritesContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ROUTES, SOURCE } from '../../navigation/routes';
import i18n from '../../localization/i18n';

export default function StoreScreen() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { themeVersion } = useTheme();
    const styles = React.useMemo(() => createStyles(), [themeVersion]);

    const mapProductToCard = useCallback((product) => {
        const hasMatches = product.try_on_enabled ?? false;
        return {
            id: product._id,
            name: product.name,
            brand: product.store_id?.name || t("store.title"),
            price: `${product.price} ${product.currency || t("store.currency")}`,
            image: product.images?.[0],
            badge: hasMatches ? t('store.badge') : '',
            badgeColor: Colors.secondary,
            isOutlined: hasMatches,
        };
    }, [t]);

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

        const categoryKeyMap = {
            top: 'wardrobe.categories.top',
            dress: 'wardrobe.categories.dress',
            bottom: 'wardrobe.categories.bottom',
            suit: 'wardrobe.categories.suit',
            bag: 'wardrobe.categories.bag',
            shoes: 'wardrobe.categories.shoes',
            jacket: 'wardrobe.categories.jacket',
            accessories: 'wardrobe.categories.accessories',
        };

        const categories = [{ id: 'all', name: t("store.all"), icon: null, value: 'all' }];

        Array.from(categorySet)
            .sort()
            .forEach((category) => {
                const key = categoryKeyMap[category];
                categories.push({
                    id: category,
                    name: key ? t(key) : category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
                    value: category,
                    icon: getCategoryIcon(category),
                });
            });

        return categories;
    };
    const { isFavorite, toggleFavorite, refetch: refetchFavorites } = useFavorites();
    const { products: allProducts, loading, error } = useStore();
    const [searchText, setSearchText] = useState('');
    const searchTextRef = useRef(searchText);
    searchTextRef.current = searchText;
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

    const handleSearchSubmit = React.useCallback(() => {
        setSearchQuery(searchTextRef.current.trim());
    }, []);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchText.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchText]);

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

    const listHeader = React.useMemo(() => (
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
                products={allProducts}
            />
            <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                onSearch={handleSearchSubmit}
            />
            <PromoBanner />
            <CategoryTabs
                categories={categories}
                activeCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />
        </View>
    ), [searchText, filterVisible, filterValues, categories, selectedCategory, handleSearchSubmit, allProducts]);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={[styles.screenWrapper, styles.center]}>
                    <ActivityIndicator size="large" color={Colors.primarybrand} />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={[styles.screenWrapper, styles.center]}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.screenWrapper}>
                <FlatList
                    data={filteredProducts}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    ListHeaderComponent={listHeader}
                    renderItem={({ item }) => (
                        <ProductCard
                            {...item}
                            isFavorite={isFavorite(item.id)}
                            onToggleFavorite={async () => {
                                try {
                                    await toggleFavorite(item.id, "PRODUCT");
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
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={8}
                    updateCellsBatchingPeriod={50}
                    windowSize={7}
                    initialNumToRender={6}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyTitle}>{t('store.noProducts')}</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const createStyles = () => StyleSheet.create({
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
        color: Colors.error,
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    emptyContainer: {
        flex: 1,
        minHeight: 300,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        color: Colors.textMuted,
        fontSize: 16,
        textAlign: 'center',
    },
});
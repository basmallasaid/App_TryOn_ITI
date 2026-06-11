import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorites_services/favoritesService';
import { getWardrobeItems } from '../api/wardrobe_services/wardrobeService';
import { getAllProducts, getUserProfile } from '../api/user_services/userService';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

const normalizeId = (id) => id?.$oid ?? id;

const enrichFavorites = (favorites, wardrobeItems, products, tryOnItems, recycleItems) => {
  return favorites.map((fav) => {
    if (fav.itemType === "WARDROBE") {
      const item = wardrobeItems.find((w) => normalizeId(w._id) === normalizeId(fav.itemId));
      if (item) return { ...fav, image: item.image, name: item.name, category: 'Wardrobe' };
    }
    if (fav.itemType === "PRODUCT") {
      const product = products.find((p) => normalizeId(p._id) === normalizeId(fav.itemId));
      if (product) return { ...fav, image: product.images?.[0], name: product.name, category: 'Store' };
    }
    if (fav.itemType === "TRYON") {
      const recycleItem = recycleItems.find((r) => normalizeId(r._id) === normalizeId(fav.itemId));
      if (recycleItem) return { ...fav, image: recycleItem.imageUrl, name: recycleItem.designTitle || 'Recycle', category: 'Recycle' };
      const tryOnItem = tryOnItems.find((t) => normalizeId(t._id) === normalizeId(fav.itemId));
      if (tryOnItem) return { ...fav, image: tryOnItem.imageUrl, name: tryOnItem.name || 'Try-On', category: 'Try On' };
    }
    return fav;
  });
};

const enrichSingleItem = (fav, tryOnItems, recycleItems) => {
  if (fav.itemType === "TRYON") {
    const recycleItem = recycleItems.find((r) => normalizeId(r._id) === normalizeId(fav.itemId));
    if (recycleItem) return { ...fav, image: recycleItem.imageUrl, name: recycleItem.designTitle || 'Recycle', category: 'Recycle' };
    const tryOnItem = tryOnItems.find((t) => normalizeId(t._id) === normalizeId(fav.itemId));
    if (tryOnItem) return { ...fav, image: tryOnItem.imageUrl, name: tryOnItem.name || 'Try-On', category: 'Try On' };
  }
  return fav;
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tryOnRef = useRef([]);
  const recycleRef = useRef([]);

  const fetchFavorites = useCallback(async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getFavorites();
      console.log("GET /users/favorites response:", JSON.stringify(data, null, 2));
      const raw = data?.favorites ?? data?.items ?? [];
      const [wardrobeData, productsData, profileData] = await Promise.all([
        getWardrobeItems().catch(() => []),
        getAllProducts().catch(() => []),
        getUserProfile(user._id).catch(() => ({})),
      ]);
      const products = Array.isArray(productsData) ? productsData : [];
      const tryOnItems = profileData?.latestTryOn ?? [];
      const recycleItems = profileData?.latestRecycle ?? [];
      tryOnRef.current = tryOnItems;
      recycleRef.current = recycleItems;
      setItems(enrichFavorites(raw, wardrobeData ?? [], products, tryOnItems, recycleItems));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load favorites.');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addItem = async (itemId, itemType) => {
    try {
      const id = normalizeId(itemId);
      const res = await addFavorite(id, itemType);
      let newItem = res?.favorite ?? res?.data ?? res;
      if (!newItem?._id) newItem = { itemId: id, itemType };
      newItem = { ...newItem, itemId: id, itemType };
      if (itemType === 'WARDROBE') newItem.category = 'Wardrobe';
      if (itemType === 'PRODUCT') newItem.category = 'Store';
      newItem = enrichSingleItem(newItem, tryOnRef.current, recycleRef.current);
      setItems((prev) => [...prev, newItem]);
    } catch (e) {
      console.error('addItem failed:', e.response?.data || e.message);
      throw e;
    }
  };

  const removeItem = async (wardrobeItemId) => {
    try {
      const id = normalizeId(wardrobeItemId);
      const favorite = items.find((i) => normalizeId(i.itemId) === id);
      if (!favorite) {
        console.warn('removeItem: favorite not found for itemId', wardrobeItemId);
        return;
      }
      await removeFavorite(favorite._id);
      setItems((prev) => prev.filter((i) => i._id !== favorite._id));
    } catch (e) {
      console.error('removeItem failed:', e.response?.data || e.message);
      throw e;
    }
  };

  const isFavorite = (itemId) => items.some((i) => normalizeId(i.itemId) === normalizeId(itemId));

  return (
    <FavoritesContext.Provider
      value={{
        items,
        loading,
        error,
        refetch: fetchFavorites,
        addItem,
        removeItem,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);

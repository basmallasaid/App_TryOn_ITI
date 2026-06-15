import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorites_services/favoritesService';
import { getWardrobeItems } from '../api/wardrobe_services/wardrobeService';
import { getAllProducts, getUserProfile } from '../api/user_services/userService';
import { useAuth } from './AuthContext';
import { getUserFriendlyErrorMessage } from '../utils/errorMessages';
import i18n from '../localization/i18n';

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

const enrichSingleItem = (fav, wardrobeItems, products, tryOnItems, recycleItems) => {
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
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tryOnRef = useRef([]);
  const recycleRef = useRef([]);
  const wardrobeRef = useRef([]);
  const productsRef = useRef([]);
  const itemsRef = useRef([]);
  const inFlight = useRef(new Set());

  itemsRef.current = items;

  const favoriteIds = useMemo(() => {
    const set = new Set();
    items.forEach((item) => set.add(normalizeId(item.itemId)));
    return set;
  }, [items]);

  const favoriteIdsRef = useRef(favoriteIds);
  favoriteIdsRef.current = favoriteIds;

  const fetchFavorites = useCallback(async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getFavorites();
      const raw = data?.favorites ?? data?.items ?? [];

      let wardrobeItems = wardrobeRef.current;
      let products = productsRef.current;
      let tryOnItems = tryOnRef.current;
      let recycleItems = recycleRef.current;

      if (wardrobeItems.length === 0 || products.length === 0) {
        const [wardrobeData, productsData, profileData] = await Promise.all([
          getWardrobeItems().catch(() => []),
          getAllProducts().catch(() => []),
          getUserProfile(user._id).catch(() => ({})),
        ]);
        products = Array.isArray(productsData) ? productsData : [];
        wardrobeItems = wardrobeData ?? [];
        tryOnItems = profileData?.latestTryOn ?? [];
        recycleItems = profileData?.latestRecycle ?? [];
        wardrobeRef.current = wardrobeItems;
        productsRef.current = products;
        tryOnRef.current = tryOnItems;
        recycleRef.current = recycleItems;
      }

      setItems(enrichFavorites(raw, wardrobeItems, products, tryOnItems, recycleItems));
    } catch (e) {
      setError(getUserFriendlyErrorMessage(e, i18n.t.bind(i18n)));
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addItem = useCallback(async (itemId, itemType, itemData = null) => {
    const id = normalizeId(itemId);
    const key = `add:${id}`;
    if (inFlight.current.has(key)) return;
    inFlight.current.add(key);

    let newItem = { itemId: id, itemType };
    if (itemType === 'WARDROBE') newItem.category = 'Wardrobe';
    if (itemType === 'PRODUCT') newItem.category = 'Store';
    if (itemData) {
      if (itemType === 'WARDROBE') {
        newItem = { ...newItem, image: itemData.image, name: itemData.name, category: 'Wardrobe' };
      } else if (itemType === 'PRODUCT') {
        newItem = { ...newItem, image: itemData.image || itemData.images?.[0], name: itemData.name, category: 'Store' };
      } else if (itemType === 'TRYON') {
        newItem = { ...newItem, image: itemData.imageUrl, name: itemData.name || itemData.designTitle, category: itemData.designTitle ? 'Recycle' : 'Try On' };
      }
    } else {
      newItem = enrichSingleItem(newItem, wardrobeRef.current, productsRef.current, tryOnRef.current, recycleRef.current);
    }

    setItems((prev) => [...prev, newItem]);

    try {
      const res = await addFavorite(id, itemType);
      const serverItem = res?.favorite ?? res?.data ?? res;
      if (serverItem?._id) {
        setItems((prev) =>
          prev.map((item) =>
            normalizeId(item.itemId) === id ? { ...item, _id: serverItem._id } : item
          )
        );
      }
    } catch (e) {
      setItems((prev) => prev.filter((item) => normalizeId(item.itemId) !== id));
      throw e;
    } finally {
      inFlight.current.delete(key);
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const id = normalizeId(itemId);
    const key = `remove:${id}`;
    if (inFlight.current.has(key)) return;

    const favorite = itemsRef.current.find((i) => normalizeId(i.itemId) === id);
    if (!favorite) return;

    inFlight.current.add(key);

    setItems((prev) => prev.filter((i) => normalizeId(i.itemId) !== id));

    try {
      await removeFavorite(favorite._id);
    } catch (e) {
      setItems((prev) => {
        if (prev.some((i) => normalizeId(i.itemId) === id)) return prev;
        return [...prev, favorite];
      });
      throw e;
    } finally {
      inFlight.current.delete(key);
    }
  }, []);

  const isFavorite = useCallback((itemId) => favoriteIdsRef.current.has(normalizeId(itemId)), []);

  const toggleFavorite = useCallback(async (itemId, itemType, itemData = null) => {
    const id = normalizeId(itemId);
    if (favoriteIdsRef.current.has(id)) {
      await removeItem(id);
    } else {
      await addItem(id, itemType, itemData);
    }
  }, [addItem, removeItem]);

  const value = useMemo(() => ({
    items, loading, error, refetch: fetchFavorites,
    addItem, removeItem, toggleFavorite, isFavorite,
  }), [items, loading, error, fetchFavorites, addItem, removeItem, toggleFavorite, isFavorite]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);

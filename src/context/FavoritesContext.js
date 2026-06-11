import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorites_services/favoritesService';
import { getWardrobeItems } from '../api/wardrobe_services/wardrobeService';
import { getAllProducts } from '../api/user_services/userService';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

const enrichFavorites = (favorites, wardrobeItems, products) => {
  return favorites.map((fav) => {
    if (fav.itemType === "WARDROBE") {
      const item = wardrobeItems.find((w) => w._id === fav.itemId);
      if (item) return { ...fav, image: item.image, name: item.name, category: item.category };
    }
    if (fav.itemType === "PRODUCT") {
      const product = products.find((p) => p._id === fav.itemId);
      if (product) return { ...fav, image: product.images?.[0], name: product.name, category: product.category };
    }
    return fav;
  });
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getFavorites();
      console.log("GET /users/favorites response:", JSON.stringify(data, null, 2));
      const raw = data?.favorites ?? data?.items ?? [];
      const [wardrobeData, productsData] = await Promise.all([
        getWardrobeItems(),
        getAllProducts(),
      ]);
      const products = Array.isArray(productsData) ? productsData : [];
      setItems(enrichFavorites(raw, wardrobeData ?? [], products));
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
    const res = await addFavorite(itemId, itemType);
    setItems((prev) => [...prev, res?.favorite ?? { _id: res?._id, itemId, itemType }]);
  };

  const removeItem = async (wardrobeItemId) => {
    const favorite = items.find((i) => i.itemId === wardrobeItemId);
    if (!favorite) return;
    await removeFavorite(favorite._id);
    setItems((prev) => prev.filter((i) => i._id !== favorite._id));
  };

  const isFavorite = (itemId) => items.some((i) => i.itemId === itemId);

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

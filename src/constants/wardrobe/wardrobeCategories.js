// src/constants/wardrobeCategories.js

export const MALE_CATEGORIES = [
  'All',
  'Top',
  'Shirt',
  'T-Shirt',
  'Bottom',
  'Jeans',
  'Short',
  'Jacket',
  'Suit',
  'Shoes',
  'Accessories',
];

export const FEMALE_CATEGORIES = [
  'All',
  'Top',
  'Dress',
  'Skirt',
  'Bottom',
  'Jeans',
  'Short',
  'Jacket',
  'Abayas',
  'Shoes',
  'Bag',
  'Accessories',
];

export const UNISEX_CATEGORIES = [
  'All',
  'Top',
  'Bottom',
  'Jeans',
  'Short',
  'Jacket',
  'Shoes',
  'Accessories',
];

/**
 * Returns categories based on user gender
 * @param {'male'|'female'|null} gender
 */
export const getCategoriesByGender = (gender) => {
  if (!gender) return UNISEX_CATEGORIES;
  return gender.toLowerCase() === 'female'
    ? FEMALE_CATEGORIES
    : MALE_CATEGORIES;
};
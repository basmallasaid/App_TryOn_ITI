// src/constants/wardrobeCategories.js

export const MALE_CATEGORIES = [
  'All',
  'Tops',
  'Shirts',
  'T-Shirts',
  'Pants',
  'Jeans',
  'Shorts',
  'Jackets',
  'Suits',
  'Shoes',
  'Accessories',
];

export const FEMALE_CATEGORIES = [
  'All',
  'Tops',
  'Dresses',
  'Skirts',
  'Pants',
  'Jeans',
  'Shorts',
  'Jackets',
  'Abayas',
  'Shoes',
  'Bags',
  'Accessories',
];

export const UNISEX_CATEGORIES = [
  'All',
  'Tops',
  'Pants',
  'Jeans',
  'Shorts',
  'Jackets',
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
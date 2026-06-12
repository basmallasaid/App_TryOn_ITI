// Centralized route name constants
export const ROUTES = {
  // Root-level screens
  AUTH: 'Auth',
  MAIN: 'Main',

  // Auth stack
  SELECT_LANGUAGE: 'SelectLanguage',
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  VERIFY_OTP: 'VerifyOtp',
  RESET_PASSWORD: 'ResetPassword',
  CHECK_EMAIL: 'CheckEmail',

  // Tab screens
  HOME: 'Home',
  WARDROBE: 'Wardrobe',
  STORE: 'Store',
  PROFILE: 'Profile',

  // Feature stacks (root-level)
  TRY_ON: 'TryOn',
  RECYCLE: 'Recycle',
  MATCHING: 'Matching',

  // Wardrobe stack
  WARDROBE_MAIN: 'WardrobeMain',
  VERIFY_ITEM: 'VerifyItem',
  EDIT_WARDROBE: 'EditWardrobe',
  ITEM_DETAILS: 'ItemDetails',

  // TryOn stack
  SELECT_MODEL: 'SelectModel',
  CREATE_AVATAR: 'CreateAvatar',
  UPLOAD_PHOTO: 'UploadPhoto',
  TRY_ON_SCREEN: 'TryOnScreen',
  TRY_ON_RESULT: 'TryOnResult',

  // Store stack
  STORE_MAIN: 'StoreMain',
  PRODUCT_DETAIL: 'ProductDetail',

  // Recycle stack
  RECYCLE_MAIN: 'RecycleMain',
  RECYCLE_RESULT: 'RecycleResult',

  // Matching stack
  MATCHING_MAIN: 'MatchingMain',
  MATCHING_RESULT_DETAILS: 'MatchingResultDetails',

  // Recommendation stack (root-level)
  RECOMMENDATION: 'Recommendation',

  // Recommendation inner screens
  RECOMMENDATIONS_HISTORY: 'RecommendationsHistory',
  RECOMMENDATION_DETAIL: 'RecommendationDetail',

  // Profile stack
  PROFILE_MAIN: 'Profile',
  EDIT_PROFILE: 'EditProfile',
  FAVORITES: 'Favorites',
};

// Entry source constants
export const SOURCE = {
  HOME: 'HOME',
  STORE: 'STORE',
  WARDROBE: 'WARDROBE',
};

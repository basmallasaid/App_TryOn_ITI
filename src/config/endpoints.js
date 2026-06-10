export const ENDPOINTS = {
  LOGIN:    "/auth/login",
  SIGNUP: "/auth/signup",
  FORGOT_PASSWORD:"/auth/forgot-password",
  RESET_PASSWORD:"/auth/reset-password",
  VERIFY_FORGET_PASSWORD_OTP:"/auth/verify-otp",
  SEND_VERIFICATION:  '/auth/send-verification', 
  UPDATE_PROFILE: '/users/profile',
  DELETE_ACCOUNT:"/users/account",
  LOGIN_WITH_GOOGLE:"/auth/google",
  LOGIN_WITH_GOOGLE_MOBILE:"/auth/google/mobile",
  SELECT_LANG:"/users/settings/language",
  GET_USER_PROFILE:"/users",
  GET_ALL_PRODUCT:"/products",
  GET_ALL_STORE:"/stores",
  ANALYZE:"/analyze",
  SAVETOWARDROBE:'/wardrobe/from-analysis',
  WARDROBE:"/wardrobe"
  GET_PRODUCT:"/products/${id}",
  GET_ALL_STORE:"/stores"
};
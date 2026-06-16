import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
} from '../config/env';
import { useEffect } from 'react';

export const useGoogleAuth = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();      
      try { await GoogleSignin.signOut(); } catch (_) {}
      const userInfo = await GoogleSignin.signIn();      
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('No idToken returned from Google');
      }

      return idToken;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Google sign-in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Google sign-in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Play services not available');
      } else {
        throw new Error(`Google sign-in failed: ${error.message}`);
      }
    }
  }
    return { signInWithGoogle, isReady: true };
};
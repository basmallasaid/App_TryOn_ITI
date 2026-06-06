import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = useIdTokenAuthRequest({
    clientId:
      '633519297450-q6d73si7qh57slp3f7216n2040jhlhn7.apps.googleusercontent.com',
    selectAccount: true,
  });

  const signInWithGoogle = async () => {
    const result = await promptAsync();
    if (result?.type !== 'success') {
      throw new Error('Google sign-in was cancelled');
    }
    const idToken = result.params?.id_token;
    if (!idToken) {
      throw new Error('No idToken returned from Google');
    }
    return idToken;
  };

  return { signInWithGoogle, isReady: !!request };
};

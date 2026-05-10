import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useSecureTokenStore } from '../store';
import type { SignInFormData } from '../validators';
import http from '@utils/http';

type SignInSuccessData = {
  mfaRequired?: boolean;
  tempToken?: string;
  access_token?: string;
  refresh_token?: string;
};

export const useSignIn = () => {
  const router = useRouter();
  const { setMfaTempToken, setAccessToken, setRefreshToken } = useSecureTokenStore();

  return useMutation({
    mutationFn: (data: SignInFormData) => http.post<SignInSuccessData>('/auth/sign-in', data),
    onSuccess: (response) => {
      if (!response.success) return;

      if (response.data?.mfaRequired && response.data.tempToken) {
        setMfaTempToken(response.data.tempToken);
        router.push('/auth/mfa-verify');
      } else {
        if (response.data) {
          if (response.data.access_token) {
            setAccessToken(response.data.access_token);
          }
          if (response.data.refresh_token) {
            setRefreshToken(response.data.refresh_token);
          }
        }
        router.replace('/(drawer)/(tabs)');
      }
    },
  });
};

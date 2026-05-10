import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useSecureTokenStore } from '../store';
import type { SignInVerifyFormData } from '../validators';
import http from '@src/shared/utils/http';
import { toast } from 'sonner-native';

type SignInVerifyResponse = {
  access_token: string;
  refresh_token: string;
};

export const useSignInVerify = () => {
  const router = useRouter();
  const { setRefreshToken, setAccessToken } = useSecureTokenStore();

  return useMutation({
    mutationFn: (data: SignInVerifyFormData) =>
      http.post<SignInVerifyResponse>('/auth/sign-in/verify', data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        const refreshToken = response.data?.refresh_token;
        const accessToken = response.data?.access_token;

        if (refreshToken) {
          setRefreshToken(refreshToken);
        }

        if (accessToken) {
          setAccessToken(accessToken);
        }
        router.replace('/(protected)/(tabs)');
      } else {
        toast.error(response.message);
      }
    },
  });
};

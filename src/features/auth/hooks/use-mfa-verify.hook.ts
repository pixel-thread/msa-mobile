import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useSecureTokenStore } from '../store';
import type { MfaVerifyFormData } from '../validators';
import http from '@src/shared/utils/http';

type MFAResponse = {
  access_token: string;
  refresh_token: string;
};

export const useMfaVerify = () => {
  const router = useRouter();
  const { setRefreshToken, setAccessToken } = useSecureTokenStore();

  return useMutation({
    mutationFn: (data: MfaVerifyFormData) => http.post<MFAResponse>('/auth/sign-in/verify', data),
    onSuccess: (response) => {
      if (response.success) {
        const refreshToken = response.data?.refresh_token;
        const accessToken = response.data?.access_token;

        if (refreshToken) {
          setRefreshToken(refreshToken);
        }

        if (accessToken) {
          setAccessToken(accessToken);
        }
        router.replace('/(protected)/(tabs)');
      }
    },
  });
};

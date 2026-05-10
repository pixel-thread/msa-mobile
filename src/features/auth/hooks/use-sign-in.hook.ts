import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import type { SignInFormData } from '../validators';
import http from '@src/shared/utils/http';
import { toast } from 'sonner-native';
import { useSecureTokenStore } from '../store';
import { authEndpoints } from '../utils/constants/endpoints';

type SignInSuccessData = {
  mfaRequired?: boolean;
  tempToken?: string;
  access_token?: string;
  refresh_token?: string;
};

export const useSignIn = () => {
  const router = useRouter();
  const { setAccessToken, setRefreshToken } = useSecureTokenStore();

  return useMutation({
    mutationFn: (data: SignInFormData) => http.post<SignInSuccessData>(authEndpoints.signIn, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        if (response.data?.mfaRequired && response.data.tempToken) {
          router.push(`/(auth)/sign-in-verify?tempToken=${response.data.tempToken}`);
        } else {
          const refreshToken = response.data?.refresh_token;
          const accessToken = response.data?.access_token;
          if (accessToken) {
            setAccessToken(accessToken);
          }

          if (refreshToken) {
            setRefreshToken(refreshToken);
          }
          router.replace('/(protected)/(drawer)/(tabs)');
        }
        return response;
      } else {
        toast.error(response.message);
        return response;
      }
    },
  });
};

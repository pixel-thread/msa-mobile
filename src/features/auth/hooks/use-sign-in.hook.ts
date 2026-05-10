import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import type { SignInFormData } from '../validators';
import http from '@src/shared/utils/http';

type SignInSuccessData = {
  mfaRequired?: boolean;
  tempToken?: string;
  access_token?: string;
  refresh_token?: string;
};

export const useSignIn = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignInFormData) => http.post<SignInSuccessData>('/auth/sign-in', data),
    onSuccess: (response) => {
      if (!response.success) return;

      if (response.data?.mfaRequired && response.data.tempToken) {
        router.push(`/(auth)/sign-in-verify?tempToken=${response.data.tempToken}`);
      } else {
        router.replace('/(protected)/(tabs)');
      }
    },
  });
};

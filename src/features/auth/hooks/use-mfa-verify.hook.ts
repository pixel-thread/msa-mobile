import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuthStore, useSecureTokenStore } from '../store';
import type { MfaVerifyFormData } from '../validators';
import http from '@utils/http';

export const useMfaVerify = () => {
  const router = useRouter();
  const { logout: clearAuth } = useAuthStore();
  const { setMfaTempToken, clearAll } = useSecureTokenStore();

  return useMutation({
    mutationFn: (data: MfaVerifyFormData) => http.post('/auth/mfa/verify', data),
    onSuccess: (response) => {
      if (response.success) {
        setMfaTempToken(null);
        clearAll();
        router.replace('/(drawer)/(tabs)');
      }
      console.log(response);
    },
    onError: () => {
      clearAuth();
      clearAll();
    },
  });
};

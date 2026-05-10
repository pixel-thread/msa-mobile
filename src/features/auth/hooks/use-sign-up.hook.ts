import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import type { SignUpFormData } from '../validators';
import http from '@src/shared/utils/http';
import { toast } from 'sonner-native';

export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignUpFormData) => http.post('/auth/sign-up', data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        router.push('/(auth)/sign-in');
      } else {
        toast.error(response.message);
      }
    },
  });
};

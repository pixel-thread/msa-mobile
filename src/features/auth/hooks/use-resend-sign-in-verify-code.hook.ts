import { useMutation } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import { toast } from 'sonner-native';

export const useResendSignInVerifyCode = () => {
  return useMutation({
    mutationFn: () => http.post('/auth/sign-in/resend'),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    },
  });
};

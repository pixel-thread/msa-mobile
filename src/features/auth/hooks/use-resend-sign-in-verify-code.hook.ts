import { useMutation } from '@tanstack/react-query';
import http from '@src/shared/utils/http';

export const useResendSignInVerifyCode = () => {
  return useMutation({
    mutationFn: () => http.post('/auth/sign-in/resend'),
  });
};

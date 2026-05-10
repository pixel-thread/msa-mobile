import { useMutation } from '@tanstack/react-query';
import http from '@src/shared/utils/http';

export const useResendMfaCode = () => {
  return useMutation({
    mutationFn: () => http.post('/auth/mfa/resend'),
  });
};

import http from '@src/shared/utils/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateProviderInput } from '../types';
import { paymentEndpoints, PaymentQueryKeys } from '../utils/constants';
import { toast } from 'sonner-native';

export const useCreateAdminPaymentProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProviderInput) =>
      http.post(paymentEndpoints.providers, data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: PaymentQueryKeys.all() });
        return data;
      }
      toast.error(data.message);
      return data;
    },
  });
};

import http from '@src/shared/utils/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentEndpoints, PaymentQueryKeys } from '../utils/constants';
import { toast } from 'sonner-native';

export const useActivateAdminPaymentProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (providerId: string) =>
      http.post(paymentEndpoints.activateProvider(providerId)),
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

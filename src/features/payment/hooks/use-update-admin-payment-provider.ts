import http from '@src/shared/utils/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateProviderInput } from '../types';
import { paymentEndpoints, PaymentQueryKeys } from '../utils/constants';
import { toast } from 'sonner-native';

type Props = {
  providerId: string;
};

export const useUpdateAdminPaymentProvider = ({ providerId }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProviderInput) =>
      http.patch(paymentEndpoints.getProvider(providerId), data),
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

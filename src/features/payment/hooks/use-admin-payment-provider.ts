import { useQuery } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import type { ProviderResponse } from '../types';
import { useAuthStore } from '@src/shared/store';
import { paymentEndpoints, PaymentQueryKeys } from '../utils/constants';

export const useAdminPaymentProvider = (id: string) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: PaymentQueryKeys.detail(id),
    queryFn: async () => http.get<ProviderResponse>(paymentEndpoints.getProvider(id)),
    select: (data) => data?.data,
    enabled: isAuthenticated && !!id,
  });
};

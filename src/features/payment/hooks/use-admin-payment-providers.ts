import { useQuery } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import type { ProviderResponse } from '../types';
import { useAuthStore } from '@src/shared/store';
import { paymentEndpoints, PaymentQueryKeys } from '../utils/constants';

export const useAdminPaymentProviders = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: PaymentQueryKeys.all(),
    queryFn: async () => http.get<ProviderResponse[]>(paymentEndpoints.providers),
    select: (data) => data?.data,
    enabled: isAuthenticated,
  });
};

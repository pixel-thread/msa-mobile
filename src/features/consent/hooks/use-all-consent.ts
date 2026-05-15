import { useQuery } from '@tanstack/react-query';
import { ConsentReceiptRecord } from '../types';
import { consentEndpoints, ConsentQueryKeys } from '../utils/constants';
import http from '@src/shared/utils/http';

export const useAllConsent = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ConsentQueryKeys.all(params),
    queryFn: () => http.get<ConsentReceiptRecord[]>(consentEndpoints.lists, { params }),
    select: (data) => data.data,
  });
};

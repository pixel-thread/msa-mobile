import { useQuery } from '@tanstack/react-query';
import { consentEndpoints, ConsentQueryKeys } from '../utils/constants';
import { MyConsentResponse } from '../types';
import http from '@src/shared/utils/http';

export const useMyConsent = () => {
  return useQuery({
    queryKey: ConsentQueryKeys.my(),
    queryFn: () => http.get<MyConsentResponse>(consentEndpoints.my),
    select: (data) => data.data,
  });
};

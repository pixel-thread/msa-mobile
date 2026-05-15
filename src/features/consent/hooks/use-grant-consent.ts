import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ConsentActionResponse, GrantConsentRequest } from '../types';
import { consentEndpoints, ConsentQueryKeys } from '../utils/constants';
import http from '@src/shared/utils/http';

export const useGrantConsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GrantConsentRequest) =>
      http.post<ConsentActionResponse>(consentEndpoints.grant, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ConsentQueryKeys.my() });
      queryClient.invalidateQueries({ queryKey: ConsentQueryKeys.history() });
    },
  });
};

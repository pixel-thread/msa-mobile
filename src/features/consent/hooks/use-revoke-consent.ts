import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ConsentActionResponse, RevokeConsentRequest } from '../types';
import http from '@src/shared/utils/http';
import { consentEndpoints, ConsentQueryKeys } from '../utils/constants';

export const useRevokeConsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RevokeConsentRequest) =>
      http.post<ConsentActionResponse>(consentEndpoints.revoke, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ConsentQueryKeys.my() });
      queryClient.invalidateQueries({ queryKey: ConsentQueryKeys.history() });
    },
  });
};

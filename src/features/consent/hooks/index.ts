import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConsentPurpose } from '../types';
import {
  fetchMyConsents,
  fetchMyConsentHistory,
  grantConsent,
  revokeConsent,
  fetchAllConsents,
  fetchConsentReport,
} from '../services';

export const useMyConsents = () => {
  return useQuery({
    queryKey: ['myConsents'],
    queryFn: fetchMyConsents,
  });
};

export const useConsentHistory = () => {
  return useQuery({
    queryKey: ['myConsentHistory'],
    queryFn: fetchMyConsentHistory,
  });
};

export const useUpdateConsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ purpose, grant }: { purpose: ConsentPurpose; grant: boolean }) => {
      return grant ? grantConsent(purpose) : revokeConsent(purpose);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myConsents'] });
      queryClient.invalidateQueries({ queryKey: ['myConsentHistory'] });
    },
  });
};

export const useAllConsents = (filters?: any) => {
  return useQuery({
    queryKey: ['allConsents', filters],
    queryFn: () => fetchAllConsents(filters),
  });
};

export const useConsentReport = () => {
  return useQuery({
    queryKey: ['consentReport'],
    queryFn: fetchConsentReport,
  });
};

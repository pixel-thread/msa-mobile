import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@src/shared/lib/api-client';
import { memberEndpoints, MemberQueryKeys } from '../utils/constants';
import type { Member } from '../types';

export const useMember = (id: string) => {
  return useQuery<Member>({
    queryKey: MemberQueryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<Member>(memberEndpoints.detail(id));
      return response.data;
    },
    enabled: !!id,
  });
};

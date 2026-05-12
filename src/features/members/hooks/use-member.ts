import { useQuery } from '@tanstack/react-query';
import { memberEndpoints, MemberQueryKeys } from '../utils/constants';
import type { Member } from '../types';
import http from '@src/shared/utils/http';

export const useMember = (id: string) => {
  return useQuery({
    queryKey: MemberQueryKeys.detail(id),
    queryFn: async () => http.get<Member>(memberEndpoints.detail(id)),
    enabled: !!id,
    select: (data) => data.data,
  });
};

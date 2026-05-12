import { useQuery } from '@tanstack/react-query';
import { memberEndpoints, MemberQueryKeys } from '../utils/constants';
import type { Member } from '../types';
import http from '@src/shared/utils/http';

export const useMembers = () => {
  return useQuery({
    queryKey: MemberQueryKeys.all(),
    queryFn: async () => await http.get<Member[]>(memberEndpoints.list),
    select: (data) => data.data,
  });
};

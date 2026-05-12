import http from '@src/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { Member } from '../types';

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => http.get<Member[]>('/members'),
    select: (data) => data.data,
  });
}

import { useQuery } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import type { Meeting } from '../types';
import { useAuthStore } from '@src/shared/store';

/**
 * Hook to fetch a single meeting by ID.
 *
 * @param id - The ID of the meeting to fetch
 * @returns Query result containing the meeting data
 */
export const useMeeting = (id: string) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['meetings', id],
    select: (data) => data?.data,
    queryFn: async () => http.get<Meeting>(`/meetings/${id}`),
    enabled: isAuthenticated && !!id,
  });
};

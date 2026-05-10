import { useQuery } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import { useAuthStore } from '@src/shared/store';
import { MeetingAgenda } from '../types/agenda';

/**
 * Hook to fetch a single meeting by ID.
 *
 * @param id - The ID of the meeting to fetch
 * @returns Query result containing the meeting data
 */
export const useMeetingAgenda = (id: string) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['meetings', 'agenda', id],
    select: (data) => data?.data,
    queryFn: () => http.get<MeetingAgenda[]>(`/meetings/${id}/agenda`),
    enabled: isAuthenticated && !!id,
  });
};

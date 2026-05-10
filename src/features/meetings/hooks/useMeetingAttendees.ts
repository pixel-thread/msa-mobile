import { useQuery } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import { useAuthStore } from '@src/shared/store';
import { MeetingAttendee } from '../types/attendee';

/**
 * Hook to fetch a single meeting by ID.
 *
 * @param id - The ID of the meeting to fetch
 * @returns Query result containing the meeting data
 */
export const useMeetingAttendees = (id: string) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['meetings', 'attendees', id],
    select: (data) => data?.data,
    queryFn: () => http.get<MeetingAttendee[]>(`/meetings/${id}/attendees`),
    enabled: isAuthenticated && !!id,
  });
};

import { useQuery } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import type { Meeting } from '../types';
import { useAuthStore } from '@src/shared/store';
import { meetingEndpoints } from '../utils/constants';
import { MeetingQueryKeys } from '../utils/constants/query-key';

/**
 * Hook to fetch the list of meetings.
 *
 * @param params - Optional query parameters for filtering/pagination
 * @returns Query result containing the meetings list
 */
export const useMeetings = (params?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: MeetingQueryKeys.all(params?.page),
    select: (data) => data?.data,
    queryFn: async () => http.get<Meeting[]>(meetingEndpoints.list, { params }),
    enabled: isAuthenticated,
  });
};

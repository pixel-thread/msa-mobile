import { useQuery } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import type { Meeting } from '../types';
import { useAuthStore } from '@src/shared/store';
import { meetingEndpoints } from '../utils/constants';
import { MeetingQueryKeys } from '../utils/constants/query-key';

/**
 * Fetches a paginated and filtered list of meetings for the authenticated user.
 *
 * Retrieves meetings from the API with support for pagination, filtering by type,
 * and filtering by status. Requires the user to be authenticated.
 *
 * @param params - Optional query parameters for filtering and pagination
 * @param params.page - Page number for pagination (default: 1)
 * @param params.limit - Number of items per page (default: 10)
 * @param params.type - Filter meetings by type ('AGM', 'EGM', 'COMMITTEE', 'SPECIAL')
 * @param params.status - Filter meetings by status ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
 *
 * @returns Query result containing the meetings list and pagination info
 * @returns {Meeting[]} data - Array of meeting objects
 * @returns {boolean} isLoading - Whether the query is in loading state
 * @returns {boolean} isError - Whether an error occurred
 * @returns {Error} error - The error object if an error occurred
 *
 * @throws {Error} When user is not authenticated
 * @throws {Error} Network errors or API failures
 *
 * @example
 * ```typescript
 * const { data: meetings, isLoading, isError } = useMeetings({
 *   page: 1,
 *   limit: 10,
 *   type: 'AGM',
 *   status: 'SCHEDULED'
 * });
 *
 * if (isLoading) return <Spinner />;
 * if (isError) return <ErrorMessage error={error} />;
 *
 * return (
 *   <FlatList
 *     data={meetings}
 *     renderItem={({ item }) => <MeetingCard meeting={item} />}
 *   />
 * );
 * ```
 *
 * @example
 * // Simple fetch without filters:
 * const { data: allMeetings } = useMeetings();
 *
 * @see {@link https://docs.example.com/meetings/list} Meetings API documentation
 * @see {@link useMeeting} For fetching a single meeting by ID
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
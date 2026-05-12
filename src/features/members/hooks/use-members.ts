import { useQuery } from '@tanstack/react-query';
import { memberEndpoints, MemberQueryKeys } from '../utils/constants';
import type { Member } from '../types';
import http from '@src/shared/utils/http';

/**
 * Fetches the complete list of members for the association.
 *
 * Retrieves all members associated with the current user's organization.
 * Members include their profile information, role, status, and membership details.
 * Does not require authentication check as the endpoint handles authorization.
 *
 * @returns Query result containing the members list
 * @returns {Member[]} data - Array of member objects
 * @returns {boolean} isLoading - Whether the query is in loading state
 * @returns {boolean} isError - Whether an error occurred
 * @returns {Error} error - The error object if an error occurred
 *
 * @throws {Error} Network errors or API failures
 * @throws {Error} Authorization errors (insufficient permissions)
 *
 * @example
 * ```typescript
 * const { data: members, isLoading, isError } = useMembers();
 *
 * if (isLoading) return <Spinner />;
 * if (isError) return <ErrorMessage error={error} />;
 *
 * return (
 *   <FlatList
 *     data={members}
 *     keyExtractor={(item) => item.id}
 *     renderItem={({ item }) => (
 *       <MemberCard
 *         name={item.name}
 *         email={item.email}
 *         role={item.role}
 *         status={item.status}
 *       />
 *     )}
 *   />
 * );
 * ```
 *
 * @example
 * // Filter members by role:
 * const { data: members } = useMembers();
 * const admins = members?.filter(m => m.role === 'ADMIN');
 *
 * // Search members by name:
 * const searchMembers = (query: string) => {
 *   return members?.filter(m =>
 *     m.name.toLowerCase().includes(query.toLowerCase())
 *   );
 * };
 *
 * @see {@link https://docs.example.com/members/list} Members API documentation
 * @see {@link useMember} For fetching a single member by ID
 */
export const useMembers = () => {
  return useQuery({
    queryKey: MemberQueryKeys.all(),
    queryFn: async () => await http.get<Member[]>(memberEndpoints.list),
    select: (data) => data.data,
  });
};

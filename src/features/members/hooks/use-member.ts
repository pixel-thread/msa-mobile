import { useQuery } from '@tanstack/react-query';
import { memberEndpoints, MemberQueryKeys } from '../utils/constants';
import type { Member } from '../types';
import http from '@src/shared/utils/http';

/**
 * Fetches a single member by their unique identifier.
 *
 * Retrieves detailed information about a specific member including their
 * profile data, role, status, and membership number. Returns null if the
 * member ID is not provided.
 *
 * @param id - The unique UUID identifier of the member to fetch
 *
 * @returns Query result containing the member details
 * @returns {Member | null} data - The member object or null if not found
 * @returns {boolean} isLoading - Whether the query is in loading state
 * @returns {boolean} isError - Whether an error occurred
 * @returns {Error} error - The error object if an error occurred
 *
 * @throws {Error} When member ID is not provided
 * @throws {Error} Network errors or API failures
 * @throws {Error} Authorization errors (insufficient permissions)
 *
 * @example
 * ```typescript
 * const { data: member, isLoading, isError } = useMember('550e8400-e29b-41d4-a716-446655440000');
 *
 * if (isLoading) return <Spinner />;
 * if (isError) return <ErrorMessage error={error} />;
 * if (!member) return <Text>Member not found</Text>;
 *
 * return (
 *   <View>
 *     <Text>{member.name}</Text>
 *     <Text>{member.email}</Text>
 *     <Text>Role: {member.role}</Text>
 *     <Text>Status: {member.status}</Text>
 *     {member.membershipNumber && (
 *       <Text>Membership #: {member.membershipNumber}</Text>
 *     )}
 *   </View>
 * );
 * ```
 *
 * @example
 * // Using with route params (expo-router):
 * const { params } = useLocalSearchParams();
 * const { data: member } = useMember(params.memberId);
 *
 * // Using with member list for detail view:
 * const { data: members } = useMembers();
 * const selectedMember = useMember(selectedMemberId);
 *
 * @see {@link https://docs.example.com/members/detail} Member detail API documentation
 * @see {@link useMembers} For fetching multiple members
 */
export const useMember = (id: string) => {
  return useQuery({
    queryKey: MemberQueryKeys.detail(id),
    queryFn: async () => http.get<Member>(memberEndpoints.detail(id)),
    enabled: !!id,
    select: (data) => data.data,
  });
};
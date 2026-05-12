import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateMeetingMinuteInput } from '../validators/minuites';
import http from '@src/shared/utils/http';
import { meetingEndpoints } from '../utils/constants';
import { MeetingQueryKeys } from '../utils/constants/query-key';
import { toast } from 'sonner-native';

type Props = {
  meetingId: string;
  meetingMinuiteId: string;
};

/**
 * Updates an existing meeting minute.
 *
 * Modifies an existing minute record with new or updated agenda points,
 * decisions, and action items. Automatically invalidates the meeting minutes
 * query cache to ensure the list reflects the changes.
 *
 * @param props - Configuration object containing meeting and minute IDs
 * @param props.meetingId - The unique UUID identifier of the parent meeting
 * @param props.meetingMinuiteId - The unique UUID identifier of the minute to update
 *
 * @returns Mutation object for updating meeting minutes
 * @returns {MutateFunction} mutate - Function to trigger the mutation
 * @returns {MutateFunction} mutateAsync - Async version of mutate
 * @returns {boolean} isPending - Whether the mutation is in progress
 * @returns {boolean} isError - Whether an error occurred
 * @returns {boolean} isSuccess - Whether the mutation was successful
 * @returns {Error} error - The error object if an error occurred
 *
 * @param data - The minute data to update (all fields optional for partial updates)
 * @param data.agendaPoint - Updated agenda point string (optional)
 * @param data.decision - Updated decision string (optional)
 * @param data.actionItems - Updated action items array (optional)
 *
 * @throws {Error} Network errors or API failures
 * @throws {Error} Validation errors (invalid field formats)
 *
 * @example
 * ```typescript
 * const updateMinuteMutation = useUpdateMeetingMinute({
 *   meetingId: '550e8400-e29b-41d4-a716-446655440000',
 *   meetingMinuiteId: '660e8400-e29b-41d4-a716-446655440001'
 * });
 *
 * // Update just the decision:
 * updateMinuteMutation.mutate({
 *   decision: 'Updated: Approved budget with modifications'
 * });
 *
 * // Update action items:
 * updateMinuteMutation.mutate({
 *   actionItems: [
 *     {
 *       assigneeId: 'new-assignee-uuid',
 *       task: 'Review updated budget proposal',
 *       dueDate: '2024-04-01'
 *     }
 *   ]
 * });
 *
 * if (updateMinuteMutation.isSuccess) {
 *   console.log('Minute updated successfully');
 * }
 * ```
 *
 * @example
 * // Full update:
 * updateMinuteMutation.mutate({
 *   agendaPoint: 'Revised Agenda Point',
 *   decision: 'New Decision Made',
 *   actionItems: [
 *     { task: 'Action item 1' },
 *     { task: 'Action item 2', assigneeId: 'user-uuid' }
 *   ]
 * });
 *
 * @see {@link https://docs.example.com/meetings/minutes/update} Update minute API documentation
 * @see {@link useMeetingMinute} For fetching the updated minutes
 * @see {@link useCreateMeetingMinute} For creating new minutes
 * @see {@link useDeleteMeetingMinute} For deleting minutes
 */
export function useUpdateMeetingMinute({ meetingId, meetingMinuiteId }: Props) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateMeetingMinuteInput) =>
      http.put(meetingEndpoints.minute(meetingId, meetingMinuiteId), data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: MeetingQueryKeys.minutes(meetingId) });
        return data;
      }
      toast.error(data.message);
      return data;
    },
  });
}
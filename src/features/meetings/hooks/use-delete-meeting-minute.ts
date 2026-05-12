import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import { meetingEndpoints } from '../utils/constants';
import { MeetingQueryKeys } from '../utils/constants/query-key';
import { toast } from 'sonner-native';

type Props = {
  meetingId: string;
};

export function useDeleteMeetingMinute({ meetingId }: Props) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (meetingMinuteId: string) =>
      http.delete(meetingEndpoints.minute(meetingId, meetingMinuteId)),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'Minute deleted successfully');
        queryClient.invalidateQueries({ queryKey: MeetingQueryKeys.minutes(meetingId) });
        return data;
      }
      toast.error(data.message || 'Failed to delete minute');
      return data;
    },
  });
}

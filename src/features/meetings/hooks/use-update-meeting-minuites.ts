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

export function useUpdateMeetingMinuite({ meetingId, meetingMinuiteId }: Props) {
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

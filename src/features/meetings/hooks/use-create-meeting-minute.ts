import http from '@src/shared/utils/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateMeetingMinuteInput } from '../validators/minuites';
import { meetingEndpoints } from '../utils/constants';
import { MeetingQueryKeys } from '../utils/constants/query-key';
import { toast } from 'sonner-native';

type Props = {
  meetingId: string;
};
export const useCreateMeetingMinute = ({ meetingId }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMeetingMinuteInput) =>
      http.post(meetingEndpoints.minutes(meetingId), data),
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
};

import http from '@src/shared/utils/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingEndpoints } from '../utils/constants';
import { MeetingQueryKeys } from '../utils/constants/query-key';
import { toast } from 'sonner-native';
import { UpdateAttendeeRsvpInput } from '../validators/rsvp';

type Props = {
  meetingId: string;
};

export function useUpdateAttendeeRsvp({ meetingId }: Props) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateAttendeeRsvpInput) => http.patch(meetingEndpoints.rsvp(meetingId), data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: MeetingQueryKeys.rsvps(meetingId) });
        return data;
      }
      toast.error(data.message);
      return data;
    },
  });
}

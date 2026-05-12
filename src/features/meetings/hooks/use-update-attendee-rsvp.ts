import http from '@src/shared/utils/http';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { UpdateAttendeeRsvpInput } from '../validators/rsvp';

type Props = {
  meetingId: string;
};

export function useUpdateAttendeeRsvp({ meetingId }: Props) {
  return useMutation({
    mutationFn: (data: UpdateAttendeeRsvpInput) => http.patch(`/meetings/${meetingId}/rsvp`, data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        return data;
      }
      toast.error(data.message);
      return data;
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import { toast } from 'sonner-native';

type Props = {
  meetingId: string;
};

export function useDeleteMeetingMinute({ meetingId }: Props) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (meetingMinuteId: string) =>
      http.delete(`/meetings/${meetingId}/minutes/${meetingMinuteId}`),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'Minute deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['meeting', 'minuites', meetingId] });
        return data;
      }
      toast.error(data.message || 'Failed to delete minute');
      return data;
    },
  });
}

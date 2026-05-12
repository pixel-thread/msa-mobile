import http from '@src/shared/utils/http';
import { useQuery } from '@tanstack/react-query';

type Props = {
  meetingId: string;
};

interface MeetingMinute {
  id: string;
  agendaPoint: string;
  meetingId: string;
  decision: string;
  actionItems?: any[] | null;
  recordedAt: string;
}

export function useMeetingMinute({ meetingId }: Props) {
  return useQuery({
    queryKey: ['meetings', 'minutes', meetingId],
    queryFn: () => http.get<MeetingMinute[]>(`/meetings/${meetingId}/minutes`),
    select: (data) => data.data,
    enabled: !!meetingId,
  });
}

import http from '@src/shared/utils/http';
import { useQuery } from '@tanstack/react-query';

type Props = {
  meetingId: string;
};

interface MeetingMinute {
  id: string;
  agendaPoint: string;
  decision: string;
  actionItems?: any[];
  createdAt: string;
}

export function useMeetingMinuite({ meetingId }: Props) {
  return useQuery({
    queryKey: ['meeting', 'minuites', meetingId],
    queryFn: () => http.get<MeetingMinute[]>(`/meetings/${meetingId}/minuites`),
    select: (data) => data.data,
    enabled: !!meetingId,
  });
}

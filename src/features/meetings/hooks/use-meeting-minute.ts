import http from '@src/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { meetingEndpoints } from '../utils/constants';
import { MeetingQueryKeys } from '../utils/constants/query-key';

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
    queryKey: MeetingQueryKeys.minutes(meetingId),
    queryFn: () => http.get<MeetingMinute[]>(meetingEndpoints.minutes(meetingId)),
    select: (data) => data.data,
    enabled: !!meetingId,
  });
}

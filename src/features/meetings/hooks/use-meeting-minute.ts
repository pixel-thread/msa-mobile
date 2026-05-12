import http from '@src/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { meetingEndpoints } from '../utils/constants';
import { MeetingQueryKeys } from '../utils/constants/query-key';
import { MeetingMinute } from '../types/minute';

type Props = {
  meetingId: string;
};

export function useMeetingMinute({ meetingId }: Props) {
  return useQuery({
    queryKey: MeetingQueryKeys.minutes(meetingId),
    queryFn: () => http.get<MeetingMinute[]>(meetingEndpoints.minutes(meetingId)),
    select: (data) => data.data,
    enabled: !!meetingId,
  });
}

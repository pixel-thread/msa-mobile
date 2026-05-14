import { useQuery } from '@tanstack/react-query';
import { dsarService } from '../services/dsar.service';

export const useMyDSARRequests = () => {
  return useQuery({
    queryKey: ['dsar', 'my'],
    queryFn: dsarService.getMyRequests,
  });
};

export const useAllDSARRequests = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['dsar', 'all', params],
    queryFn: () => dsarService.getAllRequests(params),
  });
};

export const useSlaReport = () => {
  return useQuery({
    queryKey: ['dsar', 'sla-report'],
    queryFn: dsarService.getSlaReport,
  });
};

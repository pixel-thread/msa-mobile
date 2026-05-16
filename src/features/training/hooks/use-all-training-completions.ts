import { useQuery } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import type { TrainingCompletionWithUser } from '../types';
import { useAuthStore } from '@src/shared/store';
import { trainingEndpoints, TrainingQueryKeys } from '../utils/constants';

export const useAllTrainingCompletions = (params?: {
  moduleId?: string;
  userId?: string;
}) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: TrainingQueryKeys.allCompletions(params),
    select: (data) => data?.data,
    queryFn: async () =>
      http.get<TrainingCompletionWithUser[]>(trainingEndpoints.completions, {
        params,
      }),
    enabled: isAuthenticated,
  });
};
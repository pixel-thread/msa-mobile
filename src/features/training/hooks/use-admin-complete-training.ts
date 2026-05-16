import http from '@src/shared/utils/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingEndpoints, TrainingQueryKeys } from '../utils/constants';
import { toast } from 'sonner-native';

type Props = {
  moduleId: string;
};

type CompleteForUserInput = {
  userId: string;
};

export const useAdminCompleteTraining = ({ moduleId }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CompleteForUserInput) =>
      http.post(`${trainingEndpoints.complete(moduleId)}?userId=${data.userId}`),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: TrainingQueryKeys.myCompletions() });
        queryClient.invalidateQueries({ queryKey: TrainingQueryKeys.allCompletions() });
        return data;
      }
      toast.error(data.message);
      return data;
    },
  });
};
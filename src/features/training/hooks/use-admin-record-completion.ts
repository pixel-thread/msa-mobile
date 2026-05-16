import http from '@src/shared/utils/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingEndpoints, TrainingQueryKeys } from '../utils/constants';
import { toast } from 'sonner-native';
import { AdminRecordCompletionFormData } from '../validators';

export const useAdminRecordCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminRecordCompletionFormData) =>
      http.post(trainingEndpoints.completions, data),
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

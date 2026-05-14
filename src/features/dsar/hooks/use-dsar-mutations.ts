import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dsarService } from '../services/dsar.service';
import { toast } from 'sonner-native';
import { DSARResponsePayload } from '../types/dsar.types';
import { DSARSubmitFormData } from '../validators/dsar.validator';

export const useSubmitDSAR = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DSARSubmitFormData) => dsarService.submitRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsar', 'my'] });
      toast.success('Request submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to submit request');
    },
  });
};

export const useRespondToDSAR = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, payload }: { ticketId: string; payload: DSARResponsePayload }) =>
      dsarService.respondToRequest(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsar'] });
      toast.success('Response sent successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to send response');
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dsarService } from '../services/dsar.service';
import { toast } from 'sonner-native';
import { DSARResponsePayload } from '../types/dsar.types';

export const useSubmitDSAR = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dsarService.submitRequest,
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

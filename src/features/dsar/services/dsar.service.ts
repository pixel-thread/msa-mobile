import apiClient from '@src/shared/lib/api-client';
import { 
  DSARRequest, 
  DSARSubmitPayload, 
  DSARResponsePayload, 
  SLAReport 
} from '../types/dsar.types';

export const dsarService = {
  submitRequest: async (payload: DSARSubmitPayload): Promise<DSARRequest> => {
    const response = await apiClient.post<{ data: DSARRequest }>('/dsar/submit', payload);
    return response.data.data;
  },

  getMyRequests: async (): Promise<DSARRequest[]> => {
    const response = await apiClient.get<{ data: DSARRequest[] }>('/dsar/my');
    return response.data.data;
  },

  getAllRequests: async (params?: Record<string, any>): Promise<DSARRequest[]> => {
    const response = await apiClient.get<{ data: DSARRequest[] }>('/dsar', { params });
    return response.data.data;
  },

  getRequestDetail: async (ticketId: string): Promise<DSARRequest> => {
    const response = await apiClient.get<{ data: DSARRequest }>(`/dsar/${ticketId}`);
    return response.data.data;
  },

  respondToRequest: async (ticketId: string, payload: DSARResponsePayload): Promise<DSARRequest> => {
    const response = await apiClient.post<{ data: DSARRequest }>(`/dsar/${ticketId}/respond`, payload);
    return response.data.data;
  },

  assignTicket: async (ticketId: string, assignedToId: string): Promise<DSARRequest> => {
    const response = await apiClient.patch<{ data: DSARRequest }>(`/dsar/${ticketId}/assign`, { assignedToId });
    return response.data.data;
  },

  getSlaReport: async (): Promise<SLAReport> => {
    const response = await apiClient.get<{ data: SLAReport }>('/dsar/sla-report');
    return response.data.data;
  },
};

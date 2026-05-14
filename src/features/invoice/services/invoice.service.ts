import apiClient from '@src/shared/lib/api-client';
import { Invoice } from '../types/invoice.types';

export const invoiceService = {
  getInvoices: async (): Promise<Invoice[]> => {
    const response = await apiClient.get<Invoice[]>('/user/invoices');
    return response.data;
  },
  
  getInvoiceById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get<Invoice>(`/user/invoices/${id}`);
    return response.data;
  }
};

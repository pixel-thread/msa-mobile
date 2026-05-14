import { useQuery } from '@tanstack/react-query';
import http from '@src/shared/utils/http';
import { Invoice } from '../types/invoice.types';

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices', 1],
    queryFn: () => http.get<Invoice[]>('/user/invoices'),
    select: (data) => data.data,
  });
};

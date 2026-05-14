import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '../services/invoice.service';

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoiceService.getInvoices(),
  });
};

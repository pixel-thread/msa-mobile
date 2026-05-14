import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '../services/invoice.service';

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getInvoiceById(id),
    enabled: !!id,
  });
};

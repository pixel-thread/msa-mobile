import http from '@src/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { PaymentSummary, Transaction } from '../types/payment';

type PaymentHistory = {
  transactions: Transaction[];
  summary: PaymentSummary;
};

export function usePaymentHistory() {
  return useQuery({
    queryKey: ['payment', 'history'],
    queryFn: async () => http.get<PaymentHistory>('/payments/history'),
    select: (data) => data.data,
  });
}

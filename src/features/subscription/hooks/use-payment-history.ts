import http from '@src/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { SubscriptionEndpoints, SubscriptionQueryKeys } from '../utils/constants';
import { PaymentSummary, Transaction } from '../types/payment';

type PaymentHistory = {
  transactions: Transaction[];
  summary: PaymentSummary;
};

export function usePaymentHistory() {
  return useQuery({
    queryKey: SubscriptionQueryKeys.paymentHistory(),
    queryFn: async () => http.get<PaymentHistory>(SubscriptionEndpoints.paymentHistory()),
    select: (data) => data.data,
  });
}

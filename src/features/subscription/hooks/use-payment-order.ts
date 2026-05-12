import http from '@src/shared/utils/http';
import { useMutation } from '@tanstack/react-query';
import { SubscriptionEndpoints } from '../utils/constants';
import { RazorpayOptions } from '../types/razorpay';

export function usePaymentOption() {
  return useMutation({
    mutationFn: (amount: number) => http.post<RazorpayOptions>(SubscriptionEndpoints.paymentOrder(), { amount }),
    onSuccess: (data) => data,
  });
}

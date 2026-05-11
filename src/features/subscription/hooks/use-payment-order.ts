import http from '@src/shared/utils/http';
import { useMutation } from '@tanstack/react-query';
import { RazorpayOptions } from '../types/razorpay';

export function usePaymentOption() {
  return useMutation({
    mutationFn: (amount: number) => http.post<RazorpayOptions>('/payments/order', { amount }),
    onSuccess: (data) => data,
  });
}

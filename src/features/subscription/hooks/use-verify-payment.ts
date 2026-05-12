import http from '@src/shared/utils/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionEndpoints, SubscriptionQueryKeys } from '../utils/constants';
import { toast } from 'sonner-native';

type PaymentData = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};
export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PaymentData) => http.post(SubscriptionEndpoints.verifyPayment(), data),
    onSuccess: (data) => {
      if (data.success) {
        console.log('Success Verify payment', data);
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: SubscriptionQueryKeys.paymentHistory() });
        return data;
      }
      toast.error(data.message);
      return data;
    },
  });
}

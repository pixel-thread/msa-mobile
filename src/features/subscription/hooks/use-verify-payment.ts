import http from '@src/shared/utils/http';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

type PaymentData = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};
export function useVerifyPayment() {
  return useMutation({
    mutationFn: (data: PaymentData) => http.post('/payments/verify', data),
    onSuccess: (data) => {
      if (data.success) {
        console.log('Success Verify payment', data);
        toast.success(data.message);
        return data;
      }
      toast.error(data.message);
      console.log('Error Verify payment', data);
      return data;
    },
  });
}

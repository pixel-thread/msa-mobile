import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { Ionicons } from '@expo/vector-icons';

import { Button, Text } from '@src/shared/components/ui';
import { cn } from '@src/shared/lib/cn';
import { logger } from '@src/shared/utils';

import { isRazorpayError } from '../types/razorpay';
import { usePaymentOption } from '../hooks/use-payment-order';
import { useVerifyPayment } from '../hooks/use-verify-payment';
import { useSubscriptionPlans } from '../hooks';

export const PayButton = () => {
  const { data: plans = [], isFetching } = useSubscriptionPlans();
  const { mutateAsync: createPaymentOrder, isPending: isOrderPending } = usePaymentOption();
  const { mutate: verifyPayment, isPending: isVerifyPending } = useVerifyPayment();

  const plan = plans?.[0];
  const baseAmount = Number(plan?.amount ?? 200);

  // Increment/decrement by 50% of plan amount
  const stepAmount = useMemo(() => Math.max(baseAmount * 0.5, 1), [baseAmount]);

  const [amount, setAmount] = useState<number>(baseAmount);

  // Sync amount when the plan data is loaded asynchronously
  useEffect(() => {
    if (plan?.amount) {
      setAmount(Number(plan.amount));
    }
  }, [plan?.amount]);

  const increaseAmount = useCallback(() => {
    setAmount((prev) => prev + stepAmount);
  }, [stepAmount]);

  const decreaseAmount = useCallback(() => {
    setAmount((prev) => Math.max(baseAmount, prev - stepAmount));
  }, [baseAmount, stepAmount]);

  const isDecreasingDisabled = amount <= baseAmount;
  const isProcessing = isOrderPending || isVerifyPending;

  const onClickPay = useCallback(async () => {
    try {
      const res = await createPaymentOrder(amount);
      const data = res.data;

      if (!data) {
        throw new Error('Failed to create payment order');
      }

      const response = await RazorpayCheckout.open(data);

      verifyPayment({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });
    } catch (error) {
      if (isRazorpayError(error)) {
        logger.error('Razorpay Error', {
          error: error.error,
          message: error.description,
          reason: error.error.reason,
          code: error.error.code,
        });
      } else {
        logger.error('Payment Error', { error });
      }
    }
  }, [amount, createPaymentOrder, verifyPayment]);

  return (
    <View className="absolute bottom-0 left-0 right-0 gap-y-4 border-t border-slate-200 bg-white px-5 pb-8 pt-4 dark:border-slate-800 dark:bg-slate-950">
      {/* Amount Controller */}
      <View className="flex-row items-center justify-center gap-x-6">
        <TouchableOpacity
          onPress={decreaseAmount}
          disabled={isDecreasingDisabled || isProcessing}
          activeOpacity={0.7}
          className={cn(
            'h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800',
            (isDecreasingDisabled || isProcessing) && 'opacity-50'
          )}>
          <Ionicons name="remove" size={24} color={isDecreasingDisabled ? '#94a3b8' : '#475569'} />
        </TouchableOpacity>

        <View className="min-w-[120px] items-center">
          <Text variant="heading" size="3xl" className="text-slate-900 dark:text-white">
            ₹{amount}
          </Text>
          <Text variant="subtext" size="xs" className="mt-1">
            Step: ₹{stepAmount}
          </Text>
        </View>

        <TouchableOpacity
          onPress={increaseAmount}
          disabled={isProcessing}
          activeOpacity={0.7}
          className={cn(
            'h-12 w-12 items-center justify-center rounded-full',
            isProcessing && 'opacity-50'
          )}>
          <Ionicons name="add" size={24} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      {/* Info Box */}
      <View className="flex-row items-start gap-x-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
        <Ionicons name="shield-checkmark" size={20} color="#059669" />
        <Text variant="subtext" size="sm" className="flex-1 leading-snug">
          Your subscription is processed securely using Razorpay with encrypted payment protection.
        </Text>
      </View>

      {/* Pay Button */}
      <Button
        title={isProcessing ? 'Processing...' : `Pay ₹${amount}`}
        onPress={onClickPay}
        disabled={isProcessing || isFetching}
        className="h-14 rounded-2xl shadow-md shadow-indigo-200 dark:shadow-none"
      />
    </View>
  );
};

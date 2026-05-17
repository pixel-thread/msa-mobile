import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { Ionicons } from '@expo/vector-icons';

import { Button, Text } from '@src/shared/components/ui';
import { cn } from '@src/shared/lib/cn';
import { logger } from '@src/shared/utils';

import { isRazorpayError } from '../types/razorpay';
import { usePaymentOption } from '../hooks/use-payment-order';
import { useVerifyPayment } from '../hooks/use-verify-payment';
import { useSubscriptionPlans } from '../hooks';
import { useRateLimit } from '@src/shared/hooks/use-rate-limiting';

export const PayButton = () => {
  const { data: plans = [], isFetching } = useSubscriptionPlans();
  const { mutateAsync: createPaymentOrder, isPending: isOrderPending } = usePaymentOption();
  const { mutate: verifyPayment, isPending: isVerifyPending } = useVerifyPayment();
  const { isLimited, executeWithLimit, retryAfter } = useRateLimit('PAYMENT_BUTTON', {
    limit: 1,
    windowMs: 10000,
    message: 'You can only pay once every 10 seconds',
  });

  const plan = plans?.[0];
  const baseAmount = Number(plan?.amount ?? 200);

  const stepAmount = useMemo(() => Math.max(baseAmount * 0.5, 1), [baseAmount]);

  const [amount, setAmount] = useState<number>(baseAmount);

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
    <View className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white px-6 pb-10 pt-5 dark:border-slate-800 dark:bg-slate-950">
      {/* Amount Selector */}
      <View className="mb-5 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Payment amount
        </Text>

        <View className="flex-row items-center gap-x-3">
          <TouchableOpacity
            onPress={decreaseAmount}
            disabled={isDecreasingDisabled || isProcessing}
            activeOpacity={0.7}
            className={cn(
              'h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
              (isDecreasingDisabled || isProcessing) && 'opacity-40'
            )}>
            <Ionicons
              name="remove"
              size={18}
              color={isDecreasingDisabled ? '#cbd5e1' : '#475569'}
            />
          </TouchableOpacity>

          <View className="w-24 items-center">
            <Text variant="heading" size="xl" className="text-slate-900 dark:text-white">
              ₹{amount}
            </Text>
          </View>

          <TouchableOpacity
            onPress={increaseAmount}
            disabled={isProcessing}
            activeOpacity={0.7}
            className={cn(
              'h-10 w-10 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950',
              isProcessing && 'opacity-40'
            )}>
            <Ionicons name="add" size={18} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pay Button */}
      <Button
        title={
          isLimited ? retryAfter.toString() : isProcessing ? 'Processing...' : `Pay ₹${amount}`
        }
        onPress={() => executeWithLimit(() => onClickPay())}
        disabled={isProcessing || isFetching || isLimited}
        className="h-14 rounded-2xl"
      />

      {/* Security Note */}
      <View className="mt-4 flex-row items-center justify-center gap-x-1.5">
        <Ionicons name="lock-closed-outline" size={13} color="#94a3b8" />
        <Text variant="subtext" size="xs">
          Secured by Razorpay
        </Text>
      </View>
    </View>
  );
};

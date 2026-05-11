import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useSubscriptionPlans } from '../hooks';
import { Container, StackHeader } from '@src/shared/components';
import { Card, CardContent, Text, Button } from '@src/shared/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { ErrorScreen } from '@src/shared/components/screens';
import { ErrorBoundary } from '@components/common/error-boundary';
import RazorpayCheckout from 'react-native-razorpay';
import { usePaymentOption } from '../hooks/use-payment-order';
import { isRazorpayError } from '../types/razorpay';
import { logger } from '@src/shared/utils/logger';
import { useVerifyPayment } from '../hooks/use-verify-payment';

export const SubscriptionScreen = () => {
  const { data: plans = [], isLoading, isError, refetch } = useSubscriptionPlans();
  const { mutateAsync, isPending } = usePaymentOption();
  const { mutate, isPending: isVerifyPending } = useVerifyPayment();
  if (isLoading) {
    return (
      <Container>
        <StackHeader title="Subscription" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <StackHeader title="Subscription" />
        <ErrorScreen
          title="Failed to load plans"
          message="There was an error retrieving the subscription plans. Please try again."
          onRetry={() => refetch()}
        />
      </Container>
    );
  }

  // Only show the first plan as per requirements
  const plan = plans?.[0];

  const onClickPay = async () => {
    try {
      const res = await mutateAsync(100);

      const data = res.data;
      if (data) {
        const response = await RazorpayCheckout.open(data);

        mutate({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
      }
    } catch (error) {
      if (isRazorpayError(error)) {
        logger.error('Razorpay Error', {
          error: error.error,
          message: error.description,
          reason: error.error.reason,
          code: error.error.code,
        });
      }
      logger.error('Payment Error', { error });
    }
  };

  return (
    <ErrorBoundary isComponentError componentName="SubscriptionScreen">
      <Container>
        <StackHeader title="Subscription" />
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {!plan ? (
            <View className="items-center justify-center py-24">
              <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                <Ionicons name="card-outline" size={32} color="#94a3b8" />
              </View>
              <Text variant="heading" size="lg" className="text-slate-900 dark:text-white">
                No plans available
              </Text>
              <Text variant="subtext" size="sm" className="mt-2 text-center">
                Check back later for newly available subscription plans.
              </Text>
              <Button title="Refresh" onPress={() => refetch()} className="mt-8 px-8" />
            </View>
          ) : (
            <Card className="border-indigo-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardContent className="p-6">
                <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/20">
                  <Ionicons name="star" size={24} color="#4f46e5" />
                </View>

                <Text variant="heading" size="xl" className="mb-1 text-slate-900 dark:text-white">
                  {plan.name}
                </Text>
                <Text variant="subtext" className="mb-6">
                  {plan.description}
                </Text>

                <View className="mb-6 flex-row items-baseline">
                  <Text
                    variant="heading"
                    size="3xl"
                    className="text-indigo-600 dark:text-indigo-400">
                    ${plan.amount}
                  </Text>
                  <Text variant="subtext" className="ml-1">
                    /{plan.billingCycle}
                  </Text>
                </View>

                <Button
                  title="Pay for Subscription"
                  className="h-14 rounded-2xl bg-indigo-600"
                  onPress={() => onClickPay()}
                  disabled={isPending || isVerifyPending}
                />
              </CardContent>
            </Card>
          )}
        </ScrollView>
      </Container>
    </ErrorBoundary>
  );
};

import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useSubscriptionPlans } from '../hooks';
import { usePaymentOption } from '../hooks/use-payment-order';
import { useVerifyPayment } from '../hooks/use-verify-payment';

import { Container, StackHeader } from '@src/shared/components';
import { Card, CardContent, Text, Button } from '@src/shared/components/ui';

import { ErrorScreen } from '@src/shared/components/screens';
import { ErrorBoundary } from '@components/common/error-boundary';

import { isRazorpayError } from '../types/razorpay';
import { logger } from '@src/shared/utils/logger';
import { PaymentHistory } from '../components';
import { isExpoGo } from '@src/shared/utils';

export const SubscriptionScreen = () => {
  const [activeTab, setActiveTab] = useState<'plan' | 'history'>('plan');

  const { data: plans = [], isLoading, isFetching, isError, refetch } = useSubscriptionPlans();

  const { mutateAsync, isPending } = usePaymentOption();

  const { mutate, isPending: isVerifyPending } = useVerifyPayment();

  const isExpo = isExpoGo();

  const plan = plans?.[0];

  const onClickPay = async () => {
    try {
      const res = await mutateAsync(100);
      const data = res.data;

      if (data && !isExpo) {
        const RazorpayCheckout = require('react-native-razorpay');

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

  if (isLoading) {
    return (
      <Container>
        <StackHeader title="Subscription" />

        <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-black">
          <ActivityIndicator size="large" color="#6366f1" />
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
          message="There was an error retrieving the subscription plans."
          onRetry={() => refetch()}
        />
      </Container>
    );
  }

  return (
    <ErrorBoundary isComponentError componentName="SubscriptionScreen">
      <Container>
        <StackHeader title="Subscription" />

        {/* Tabs */}
        <View className="mx-4 mt-3 flex-row rounded-2xl bg-slate-200/70 p-1 dark:bg-slate-900">
          {(['plan', 'history'] as const).map((tab) => {
            const active = activeTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 rounded-xl py-3 ${active ? 'bg-white dark:bg-slate-800' : ''}`}>
                <Text
                  variant="subtext"
                  className={`text-center text-sm font-semibold capitalize ${
                    active ? 'text-indigo-600' : 'text-slate-500'
                  }`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === 'plan' ? (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1"
              contentContainerStyle={{
                padding: 16,
                paddingBottom: 140,
              }}>
              {!plan ? (
                <View className="flex-1 items-center justify-center py-24">
                  <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                    <Ionicons name="card-outline" size={34} color="#94a3b8" />
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
                <>
                  {/* Hero Card */}
                  <Card className="overflow-hidden rounded-[32px] border-0 bg-indigo-600 shadow-xl">
                    <CardContent className="p-0">
                      {/* Top Gradient Section */}
                      <View className="bg-indigo-600 px-7 pb-8 pt-8">
                        <View className="mb-6 flex-row items-center justify-between">
                          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                            <Ionicons name="diamond" size={28} color="#fff" />
                          </View>

                          <View className="rounded-full bg-white/15 px-4 py-2">
                            <Text className="text-xs font-bold uppercase tracking-widest text-white">
                              Most Popular
                            </Text>
                          </View>
                        </View>

                        <Text variant="heading" size="2xl" className="text-white">
                          {plan.name}
                        </Text>

                        <Text className="mt-2 text-base leading-6 text-indigo-100">
                          {plan.description}
                        </Text>

                        <View className="mt-8 flex-row items-end">
                          <Text className="text-5xl font-extrabold text-white">₹{plan.amount}</Text>

                          <Text className="mb-1 ml-2 text-base text-indigo-100">
                            /{plan.billingCycle}
                          </Text>
                        </View>
                      </View>

                      {/* Features */}
                      <View className="bg-white px-7 py-7 dark:bg-slate-900">
                        <Text className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
                          Included Features
                        </Text>

                        {[
                          'Unlimited access',
                          'Premium support',
                          'Advanced analytics',
                          'Priority updates',
                          'Secure payments',
                        ].map((feature) => (
                          <View key={feature} className="mb-4 flex-row items-center">
                            <View className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                              <Ionicons name="checkmark" size={18} color="#10b981" />
                            </View>

                            <Text className="flex-1 text-base text-slate-700 dark:text-slate-200">
                              {feature}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </CardContent>
                  </Card>
                </>
              )}
            </ScrollView>

            {/* Bottom Fixed CTA */}
            {plan && (
              <View className="absolute bottom-0 left-0 right-0 gap-2 border-t border-slate-200 bg-white px-5 pb-7 pt-2 dark:border-slate-800 dark:bg-black">
                <View className="m-0 rounded-3xl bg-gray-100 px-4 py-2 dark:bg-slate-900">
                  <View className="flex-row items-center">
                    <View className="flex-1">
                      <Text className="mt-1 leading-6 text-slate-500">
                        Your subscription is processed securely using Razorpay with encrypted
                        payment protection.
                      </Text>
                    </View>
                  </View>
                </View>
                <Button
                  title={isPending || isVerifyPending ? 'Processing...' : `Pay ₹${plan.amount}`}
                  onPress={onClickPay}
                  disabled={isPending || isVerifyPending || isFetching}
                  className="h-16 rounded-2xl bg-indigo-600"
                />
              </View>
            )}
          </>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}>
            <PaymentHistory />
          </ScrollView>
        )}
      </Container>
    </ErrorBoundary>
  );
};

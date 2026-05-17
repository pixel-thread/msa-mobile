import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useSubscriptionPlans } from '../hooks';

import { Container, StackHeader } from '@src/shared/components';
import { Text, Button } from '@src/shared/components/ui';

import { ErrorScreen } from '@src/shared/components/screens';
import { ErrorBoundary } from '@components/common/error-boundary';

import { PaymentHistory } from '../components';
import { PayButton } from '../components/pay-button';

import type { SubscriptionPlan } from '../types';

function formatBillingCycle(cycle: SubscriptionPlan['billingCycle']): string {
  const map: Record<SubscriptionPlan['billingCycle'], string> = {
    MONTHLY: 'month',
    QUARTERLY: 'quarter',
    HALF_YEARLY: '6 months',
    YEARLY: 'year',
    LIFETIME: 'lifetime',
  };
  return map[cycle] ?? cycle.toLowerCase();
}

const Divider = () => <View className="h-px bg-slate-100 dark:bg-slate-800/60" />;

export const SubscriptionScreen = () => {
  const [activeTab, setActiveTab] = useState<'plan' | 'history'>('plan');

  const { data: plans = [], isLoading, isError, refetch } = useSubscriptionPlans();

  const plan = plans?.[0];

  if (isLoading) {
    return (
      <Container>
        <StackHeader title="Subscription" />
        <View className="flex-1 items-center justify-center bg-white dark:bg-black">
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

        {/* Tab Bar */}
        <View className="flex-row border-b border-slate-100 px-6 dark:border-slate-800">
          {(['plan', 'history'] as const).map((tab) => {
            const active = activeTab === tab;

            return (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className="flex-1 py-4">
                <View className="flex-row items-center justify-center gap-x-2">
                  <Ionicons
                    name={tab === 'plan' ? 'receipt-outline' : 'time-outline'}
                    size={20}
                    color={active ? '#6366f1' : '#94a3b8'}
                  />
                  <Text
                    className={`text-center text-base font-semibold capitalize ${
                      active
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}>
                    {tab}
                  </Text>
                </View>
                {active && (
                  <View className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
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
                padding: 24,
                paddingBottom: 160,
              }}>
              {!plan ? (
                <View className="items-center justify-center py-24">
                  <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900">
                    <Ionicons name="receipt-outline" size={28} color="#cbd5e1" />
                  </View>
                  <Text variant="heading" size="lg" className="text-slate-900 dark:text-white">
                    No plans available
                  </Text>
                  <Text variant="subtext" size="sm" className="mt-2 px-8 text-center">
                    Check back later for newly available subscription plans.
                  </Text>
                  <Button
                    title="Refresh"
                    onPress={() => refetch()}
                    variant="outline"
                    className="mt-6 px-8"
                  />
                </View>
              ) : (
                <View>
                  {/* Plan Header */}
                  <View className="mb-8">
                    <Text
                      variant="subtext"
                      size="xs"
                      className="mb-2 font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Current Plan
                    </Text>
                    <Text variant="heading" size="2xl" className="text-slate-900 dark:text-white">
                      {plan.name}
                    </Text>
                    {plan.description && (
                      <Text variant="subtext" size="sm" className="mt-2 leading-relaxed">
                        {plan.description}
                      </Text>
                    )}
                  </View>

                  <Divider />

                  {/* Pricing */}
                  <View className="my-8 flex-row items-end">
                    <Text className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                      ₹{plan.amount}
                    </Text>
                    <Text className="mb-1.5 ml-2 text-base text-slate-400 dark:text-slate-500">
                      / {formatBillingCycle(plan.billingCycle)}
                    </Text>
                  </View>

                  <Divider />

                  {/* Details */}
                  <View className="mt-8">
                    <Text
                      variant="subtext"
                      size="xs"
                      className="mb-3 font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      About
                    </Text>
                    <Text className="text-base leading-7 text-slate-600 dark:text-slate-300">
                      Your subscription supports the association&apos;s operations, events, and
                      member welfare programs. Payments are processed securely through Razorpay and
                      a receipt will be generated after each transaction.
                    </Text>
                  </View>

                  {/* Info Row */}
                  <View className="mt-8 flex-row items-center gap-x-3 rounded-xl bg-slate-50 px-4 py-3.5 dark:bg-slate-900/50">
                    <Ionicons name="shield-checkmark-outline" size={18} color="#6366f1" />
                    <Text variant="subtext" size="sm" className="flex-1 leading-snug">
                      Secure payments powered by Razorpay
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {plan && <PayButton />}
          </>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              padding: 24,
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

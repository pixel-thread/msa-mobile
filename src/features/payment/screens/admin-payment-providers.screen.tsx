import React from 'react';
import { View, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useAdminPaymentProviders } from '../hooks';
import { LoadingScreen, ErrorScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';
import { AdminProviderCard } from '../components/admin-provider-card.component';
import type { ProviderResponse } from '../types';

const HeaderActions = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push('/(protected)/admin/payment/add')}
      className="p-2"
      accessibilityLabel="Add payment provider">
      <Ionicons name="add-circle-outline" size={24} color="#64748b" />
    </TouchableOpacity>
  );
};

export const AdminPaymentProvidersScreen = () => {
  const router = useRouter();
  const { data: providers, isLoading, isError, refetch, isRefetching } = useAdminPaymentProviders();

  if (isLoading) return <LoadingScreen message="Loading payment providers..." />;

  if (isError) {
    return (
      <>
        <StackHeader showBackButton title="Payment Providers" />
        <ErrorScreen
          title="Failed to load"
          message="There was an error loading the payment providers. Please try again."
          onRetry={() => refetch()}
        />
      </>
    );
  }

  return (
    <Container>
      <StackHeader title="Payment Providers" showBackButton rightAction={<HeaderActions />} />
      <FlashList
        data={providers}
        renderItem={({ item }: { item: ProviderResponse }) => (
          <AdminProviderCard provider={item} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6366f1" />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-24">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
              <Ionicons name="card-outline" size={32} color="#64748b" />
            </View>
            <Text variant="heading" size="lg" className="text-slate-900 dark:text-white">
              No payment providers
            </Text>
            <Text variant="subtext" size="sm" className="mt-2 text-center">
              Add a payment provider to get started.
            </Text>
          </View>
        }
      />
    </Container>
  );
};

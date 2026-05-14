// src/app/(protected)/profile/invoices/[id].tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StackHeader, Container } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { useInvoice } from '@src/features/invoice/hooks/use-invoice';
import { InvoiceDetailView } from '@src/features/invoice/components/invoice-detail-view';

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: invoice, isLoading, isError } = useInvoice(id as string);

  return (
    <Container>
      <StackHeader title="Invoice Details" />
      {isLoading ? (
        <View className="flex-1 items-center pt-10">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : isError || !invoice ? (
        <View className="flex-1 pt-10">
          <Text className="text-center text-red-500">Failed to load invoice details.</Text>
        </View>
      ) : (
        <InvoiceDetailView invoice={invoice} />
      )}
    </Container>
  );
}

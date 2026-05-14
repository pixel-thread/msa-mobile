// src/app/(protected)/profile/invoices/index.tsx
import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { StackHeader, Container } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';
import { useInvoices } from '@src/features/invoice/hooks/use-invoices';
import { InvoiceListItem } from '@src/features/invoice/components/invoice-list-item';

export default function InvoicesScreen() {
  const { data: invoices, isLoading, isError } = useInvoices();
  return (
    <Container>
      <StackHeader title="Invoices" />
      <View className="flex-1 px-4 pt-6">
        {isLoading ? (
          <ActivityIndicator size="large" color="#6366f1" className="mt-10" />
        ) : isError ? (
          <Text className="mt-10 text-center text-red-500">Failed to load invoices.</Text>
        ) : invoices?.length === 0 ? (
          <Text className="mt-10 text-center text-slate-500">No invoices found.</Text>
        ) : (
          <FlatList
            data={invoices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <InvoiceListItem invoice={item} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Container>
  );
}

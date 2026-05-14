import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { StackHeader, Container } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';
import { useInvoices } from '@src/features/invoice/hooks/use-invoices';
import { InvoiceListItem } from '@src/features/invoice/components/invoice-list-item';

export const InvoicesScreen = () => {
  const { data: invoices = [], isFetching, isError } = useInvoices();

  if (isFetching) {
    return <ActivityIndicator size="large" color="#6366f1" className="mt-10" />;
  }

  if (isError) {
    return <Text className="mt-10 text-center text-red-500">Failed to load invoices.</Text>;
  }

  return (
    <Container>
      <StackHeader title="Invoices" />
      <View className="flex-1 px-4 pt-6">
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <InvoiceListItem invoice={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Container>
  );
};

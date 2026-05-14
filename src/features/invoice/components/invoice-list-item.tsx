import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@src/shared/components/ui';
import { Invoice } from '../types/invoice.types';
import { useRouter } from 'expo-router';

export const InvoiceListItem = ({ invoice }: { invoice: Invoice }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="mb-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      onPress={() => router.push(`/(protected)/profile/invoices/${invoice.id}`)}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text weight="semibold" className="text-slate-900">
          {new Date(invoice.paymentDate).toLocaleDateString()}
        </Text>
        <View className="rounded-full bg-slate-100 px-2 py-1">
          <Text size="xs" weight="medium" className="text-slate-600">
            {invoice.status}
          </Text>
        </View>
      </View>
      <Text className="text-slate-500">
        Amount: {invoice.amount} {invoice.currency}
      </Text>
    </TouchableOpacity>
  );
};

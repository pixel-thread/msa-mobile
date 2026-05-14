import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button } from '@src/shared/components/ui';
import { Invoice } from '../types/invoice.types';
import { generateAndShareInvoicePdf } from '../utils/pdf';

export const InvoiceDetailView = ({ invoice }: { invoice: Invoice }) => {
  const handleSharePdf = async () => {
    await generateAndShareInvoicePdf(invoice);
  };

  return (
    <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
      <View className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <View className="mb-6 items-center border-b border-slate-100 pb-6">
          <Text variant="heading" size="2xl" className="text-slate-900 mb-2">Invoice</Text>
          <Text className="text-slate-500">{invoice.id}</Text>
        </View>
        
        <View className="mb-6">
          <Text weight="bold" className="mb-2 text-slate-700">Billed To</Text>
          <Text className="text-slate-600">{invoice.user?.name}</Text>
          <Text className="text-slate-600">{invoice.user?.email}</Text>
        </View>

        <View className="mb-6">
          <Text weight="bold" className="mb-2 text-slate-700">Details</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-slate-600">Date</Text>
            <Text weight="medium">{new Date(invoice.paymentDate).toLocaleDateString()}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-slate-600">Status</Text>
            <Text weight="medium">{invoice.status}</Text>
          </View>
        </View>

        <View className="mb-8">
          <Text weight="bold" className="mb-3 text-slate-700">Allocations</Text>
          {invoice.allocations?.map((alloc, idx) => (
            <View key={idx} className="flex-row justify-between mb-2">
              <Text className="text-slate-600">Period {alloc.contributionPeriod?.month}/{alloc.contributionPeriod?.year}</Text>
              <Text weight="medium">{alloc.allocatedAmount} {invoice.currency}</Text>
            </View>
          ))}
          <View className="mt-4 border-t border-slate-100 pt-4 flex-row justify-between">
            <Text weight="bold" className="text-slate-900">Total Amount</Text>
            <Text weight="bold" className="text-slate-900">{invoice.amount} {invoice.currency}</Text>
          </View>
        </View>

        <Button title="Share PDF" onPress={handleSharePdf} />
      </View>
    </ScrollView>
  );
};

import React from 'react';
import { View, Text } from 'react-native';
import { ConsentReceipt } from '../types';

export const ConsentHistoryItem = ({ receipt }: { receipt: ConsentReceipt }) => {
  return (
    <View className="mb-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <View className="mb-1 flex-row justify-between">
        <Text className="font-semibold text-slate-800">{receipt.purpose}</Text>
        <Text
          className={`font-bold ${receipt.status === 'GRANTED' ? 'text-green-600' : 'text-red-600'}`}>
          {receipt.status}
        </Text>
      </View>
      <Text className="text-xs text-slate-500">
        {new Date(receipt.createdAt).toLocaleString()} via {receipt.channel}
      </Text>
    </View>
  );
};

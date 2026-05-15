import React from 'react';
import { View, Text } from 'react-native';
import { ConsentReport } from '../types';

export const ConsentReportWidget = ({ report }: { report: ConsentReport }) => {
  return (
    <View className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <Text className="mb-3 text-lg font-bold text-slate-900">Consent Metrics</Text>
      {Object.entries(report).map(([purpose, metrics]) => (
        <View
          key={purpose}
          className="flex-row justify-between border-b border-slate-100 py-2 last:border-0">
          <Text className="font-medium text-slate-700">{purpose}</Text>
          <Text className="font-semibold text-indigo-600">{metrics.rate}</Text>
        </View>
      ))}
    </View>
  );
};

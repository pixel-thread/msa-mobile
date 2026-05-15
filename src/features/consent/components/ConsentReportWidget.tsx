import React from 'react';
import { View, Text } from 'react-native';
import { ConsentSummaryReport } from '../types';

export const ConsentReportWidget = ({ report }: { report: ConsentSummaryReport[] }) => {
  return (
    <View className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <Text className="mb-3 text-lg font-bold text-slate-900">Consent Metrics</Text>
      {report.map((metrics) => (
        <View
          key={metrics.purpose}
          className="flex-row justify-between border-b border-slate-100 py-2 last:border-0">
          <Text className="font-medium text-slate-700">{metrics.purpose}</Text>
          <Text className="font-semibold text-indigo-600">{metrics.rate}</Text>
        </View>
      ))}
    </View>
  );
};

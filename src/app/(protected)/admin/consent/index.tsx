import React from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Link } from 'expo-router';
import { useConsentReport } from '@src/features/consent/hooks';
import { ConsentReportWidget } from '@src/features/consent/components';
import { Container, StackHeader } from '@src/shared/components';

export default function AdminConsentDashboard() {
  const { data: report = [], isLoading } = useConsentReport();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <Container>
      <StackHeader title="Manage Consent" />
      <ScrollView className="flex-1 bg-slate-50 p-4">
        <Text className="mb-6 text-xl font-bold text-slate-800">DPO Dashboard</Text>

        {report ? (
          <ConsentReportWidget report={report} />
        ) : (
          <Text className="text-slate-500">No report data available.</Text>
        )}

        <Link
          href="/admin/consent/audit"
          className="mt-4 rounded-lg bg-indigo-600 p-4 text-center font-bold text-white">
          View Full Audit Trail
        </Link>
      </ScrollView>
    </Container>
  );
}

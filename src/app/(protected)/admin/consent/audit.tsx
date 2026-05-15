import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useAllConsent } from '@src/features/consent/hooks';
import { ConsentHistoryItem } from '@src/features/consent/components';
import { Container, StackHeader } from '@src/shared/components';

export default function AdminConsentAuditScreen() {
  const { data: allConsents, isLoading } = useAllConsent();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <Container className="p-4">
      <StackHeader title="Consent Audit Trail" showBackButton />
      <Text className="mb-4 text-lg font-bold">Association Audit Trail</Text>
      {allConsents?.length === 0 ? (
        <Text className="mt-10 text-center text-slate-500">No consent records found.</Text>
      ) : (
        <FlatList
          data={allConsents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-3">
              <Text className="mb-1 text-xs text-slate-400">User ID: {item.userId}</Text>
              <ConsentHistoryItem receipt={item} />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </Container>
  );
}

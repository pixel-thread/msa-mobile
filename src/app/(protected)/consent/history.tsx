import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useConsentHistory } from '@src/features/consent/hooks';
import { ConsentHistoryItem } from '@src/features/consent/components';

export default function ConsentHistoryScreen() {
  const { data: history, isLoading } = useConsentHistory();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      {history?.length === 0 ? (
        <Text className="mt-10 text-center text-slate-500">No consent history found.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ConsentHistoryItem receipt={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

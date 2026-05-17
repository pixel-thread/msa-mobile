import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useConsentHistory } from '@src/features/consent/hooks';
import { ConsentHistoryItem } from '@src/features/consent/components';
import { Container, StackHeader } from '@src/shared/components';
import { FLASHLIST_ESTIMATED_ITEM_SIZE } from '@src/shared/constants';

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
    <Container className="p-4">
      <StackHeader title="Consent History" showBackButton />
      {history?.length === 0 ? (
        <Text className="mt-10 text-center text-slate-500">No consent history found.</Text>
      ) : (
        <FlashList
          data={history}
          keyExtractor={(item) => item.id}
          estimatedItemSize={FLASHLIST_ESTIMATED_ITEM_SIZE.CONSENT_ITEM}
          renderItem={({ item }) => <ConsentHistoryItem receipt={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </Container>
  );
}

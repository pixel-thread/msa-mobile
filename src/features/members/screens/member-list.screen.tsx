import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMembers } from '../hooks';
import { MemberCard } from '../components';
import { LoadingScreen, ErrorScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';

export const MemberListScreen = () => {
  const { data, isLoading, isError, refetch, isRefetching } = useMembers();

  if (isLoading) return <LoadingScreen message="Fetching members..." />;

  if (isError) {
    return (
      <>
        <StackHeader showBackButton title="Members" />
        <ErrorScreen
          title="Failed to load members"
          message="There was an error retrieving the member list. Please try again."
          onRetry={() => refetch()}
        />
      </>
    );
  }

  return (
    <Container>
      <StackHeader title="Members" showBackButton />
      <FlatList
        data={data}
        renderItem={({ item }) => <MemberCard member={item} />}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6366f1" />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-24">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
              <Ionicons name="people-outline" className="text-accent" size={32} />
            </View>
            <Text variant="heading" size="lg" className="text-slate-900 dark:text-white">
              No members found
            </Text>
            <Text variant="subtext" size="sm" className="mt-2 text-center">
              There are currently no members in the system.
            </Text>
          </View>
        }
      />
    </Container>
  );
};

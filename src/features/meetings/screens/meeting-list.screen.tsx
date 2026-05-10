import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useMeetings } from '../hooks';
import { LoadingScreen, ErrorScreen } from '@src/shared/components/screens';
import { Ionicons } from '@expo/vector-icons';
import { MeetingCard } from '../components';
import { Container, StackHeader } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';

/**
 * Main screen for displaying the list of meetings.
 */
export const MeetingListScreen = () => {
  const { data, isLoading, isError, refetch, isRefetching } = useMeetings();

  if (isLoading) return <LoadingScreen message="Fetching meetings..." />;

  if (isError) {
    return (
      <>
        <StackHeader showBackButton title="Meetings" />
        <ErrorScreen
          title="Failed to load meetings"
          message="There was an error retrieving the meeting list. Please try again."
          onRetry={() => refetch()}
        />
      </>
    );
  }

  return (
    <Container>
      <StackHeader title="Meetings" showBackButton={false} />
      <FlatList
        data={data}
        renderItem={({ item }) => <MeetingCard meeting={item} />}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6366f1" />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-24">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
              <Ionicons name="calendar-clear-outline" size={32} color="#94a3b8" />
            </View>
            <Text variant="heading" size="lg" className="text-slate-900 dark:text-white">
              No meetings found
            </Text>
            <Text variant="subtext" size="sm" className="mt-2 text-center">
              Check back later for newly scheduled meetings.
            </Text>
          </View>
        }
      />
    </Container>
  );
};

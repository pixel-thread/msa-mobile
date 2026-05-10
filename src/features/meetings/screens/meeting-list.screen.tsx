import React from 'react';
import { View, FlatList, Text, RefreshControl } from 'react-native';
import { useMeetings } from '../hooks';
import { LoadingScreen, ErrorScreen } from '@src/shared/components/screens';
import { Ionicons } from '@expo/vector-icons';
import { MeetingCard } from '../components';

/**
 * Main screen for displaying the list of meetings.
 */
export const MeetingListScreen = () => {
  const { data, isLoading, isError, refetch, isRefetching } = useMeetings();

  if (isLoading) return <LoadingScreen message="Fetching meetings..." />;

  if (isError) {
    return (
      <ErrorScreen
        title="Failed to load meetings"
        message="There was an error retrieving the meeting list. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
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
          <View className="items-center justify-center py-20">
            <Ionicons name="calendar-clear-outline" size={64} color="#d1d5db" />
            <Text className="mt-4 text-lg font-medium text-gray-400">No meetings found</Text>
          </View>
        }
      />
    </View>
  );
};

import React from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useMeetings } from '../hooks';
import { LoadingScreen } from '@src/shared/components/screens';
import { Ionicons } from '@expo/vector-icons';
import type { Meeting } from '../types';
import { formattedDate, formattedTime } from '@src/shared/utils/format';

/**
 * Main screen for displaying the list of meetings.
 */
export const MeetingListScreen = () => {
  const { data = [], isLoading, isError, refetch, isRefetching } = useMeetings();
  const renderMeetingItem = ({ item }: { item: Meeting }) => {
    const date = new Date(item.scheduledAt);

    return (
      <TouchableOpacity
        className="mb-4 flex-1 flex-row items-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        activeOpacity={0.7}>
        <View className="mr-4 items-center justify-center rounded-xl bg-indigo-50 px-3 py-2">
          <Text className="text-xs font-bold uppercase text-indigo-600">{item.type}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
            {item.title}
          </Text>
          <View className="mt-1 flex-row items-center">
            <Ionicons name="calendar-outline" size={14} color="#6b7280" />
            <Text className="ml-1 text-xs text-gray-500">
              {formattedDate(date)} • {formattedTime(date)}
            </Text>
          </View>
          {item.venue && (
            <View className="mt-1 flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#6b7280" />
              <Text className="ml-1 text-xs text-gray-500" numberOfLines={1}>
                {item.venue}
              </Text>
            </View>
          )}
        </View>

        <View className="items-end">
          <View
            className={`rounded-full px-2 py-0.5 ${
              item.status === 'SCHEDULED'
                ? 'bg-green-100'
                : item.status === 'IN_PROGRESS'
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
            }`}>
            <Text
              className={`text-[10px] font-bold ${
                item.status === 'SCHEDULED'
                  ? 'text-green-700'
                  : item.status === 'IN_PROGRESS'
                    ? 'text-blue-700'
                    : 'text-gray-600'
              }`}>
              {item.status}
            </Text>
          </View>
          <Text className="mt-2 text-[10px] text-gray-400">{item._count.attendees} attendees</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) return <LoadingScreen message="Fetching meetings..." />;

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="mt-4 text-center text-lg font-bold text-gray-900">
          Failed to load meetings
        </Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          There was an error retrieving the meeting list. Please try again.
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-6 rounded-xl bg-indigo-500 px-6 py-3">
          <Text className="font-bold text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={data}
        renderItem={renderMeetingItem}
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

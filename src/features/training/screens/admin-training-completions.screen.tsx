import React, { useState } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAllTrainingCompletions, useTrainingModules } from '../hooks';
import { LoadingScreen, ErrorScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';
import { formattedDate, formattedTime } from '@utils/format';
import type { TrainingCompletionWithUser } from '../types';

export const AdminTrainingCompletionsScreen = () => {
  const router = useRouter();
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>();

  const { data: completions, isLoading, isError, refetch, isRefetching } = useAllTrainingCompletions({
    moduleId: selectedModuleId,
  });
  const { data: modules } = useTrainingModules();

  const renderFilterChip = (moduleId: string | undefined, label: string) => (
    <TouchableOpacity
      onPress={() => setSelectedModuleId(moduleId)}
      className={`rounded-full px-3 py-1.5 ${
        selectedModuleId === moduleId
          ? 'bg-indigo-600'
          : 'border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
      }`}>
      <Text
        size="sm"
        className={selectedModuleId === moduleId ? 'text-white' : 'text-slate-600 dark:text-slate-400'}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderCompletionItem = ({ item }: { item: TrainingCompletionWithUser }) => {
    const completedDate = new Date(item.completedAt);
    
    return (
      <View className="mb-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text variant="heading" size="lg" weight="semibold" className="text-slate-900 dark:text-white">
              {item.module.title}
            </Text>
            <View className="mt-1 flex-row items-center gap-2">
              <Ionicons name="person-outline" size={14} color="#64748b" />
              <Text variant="subtext" size="sm" className="text-slate-600 dark:text-slate-400">
                {item.user.name || item.user.email}
              </Text>
            </View>
          </View>
          <View className="rounded-full bg-green-100 px-2 py-1 dark:bg-green-900/30">
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
          </View>
        </View>

        <View className="mt-3 flex-row items-center gap-x-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={12} color="#64748b" />
            <Text size="xs" className="text-slate-500">
              {formattedDate(completedDate)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={12} color="#64748b" />
            <Text size="xs" className="text-slate-500">
              {formattedTime(completedDate)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) return <LoadingScreen message="Loading completions..." />;

  if (isError) {
    return (
      <>
        <StackHeader showBackButton title="Training Completions" />
        <ErrorScreen
          title="Failed to load completions"
          message="There was an error loading the training completions."
          onRetry={() => refetch()}
        />
      </>
    );
  }

  return (
    <Container>
      <StackHeader title="Training Completions" showBackButton />
      
      <View className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:bg-slate-900">
        <View className="flex-row flex-wrap gap-2">
          {renderFilterChip(undefined, 'All')}
          {modules?.map((module) =>
            renderFilterChip(module.id, module.title)
          )}
        </View>
      </View>

      <FlatList
        data={completions}
        renderItem={renderCompletionItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6366f1" />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-24">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
              <Ionicons name="document-text-outline" size={32} color="#64748b" />
            </View>
            <Text variant="heading" size="lg" className="text-slate-900 dark:text-white">
              No completions yet
            </Text>
            <Text variant="subtext" size="sm" className="mt-2 text-center">
              Training completions will appear here.
            </Text>
          </View>
        }
      />
    </Container>
  );
};
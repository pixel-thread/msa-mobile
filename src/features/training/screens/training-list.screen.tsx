import React from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTrainingModules, useMyTrainingCompletions } from '../hooks';
import { LoadingScreen, ErrorScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';
import type { TrainingModule } from '../types';

interface TrainingCardProps {
  module: TrainingModule;
  isCompleted: boolean;
  onPress: () => void;
}

const TrainingCard: React.FC<TrainingCardProps> = ({ module, isCompleted, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="mb-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
    <View className="flex-row items-start justify-between">
      <View className="flex-1">
        <Text variant="heading" size="lg" weight="semibold" className="text-slate-900 dark:text-white">
          {module.title}
        </Text>
        {module.description && (
          <Text variant="subtext" size="sm" className="mt-1 text-slate-600 dark:text-slate-400">
            {module.description}
          </Text>
        )}
      </View>
      {isCompleted ? (
        <View className="ml-3 rounded-full bg-green-100 px-2 py-1 dark:bg-green-900/30">
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
        </View>
      ) : (
        <View className="ml-3 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-700">
          <Ionicons name="chevron-forward" size={20} color="#64748b" />
        </View>
      )}
    </View>

    <View className="mt-3 flex-row flex-wrap items-center gap-2">
      {module.requiredForRoles.map((role) => (
        <View
          key={role}
          className="rounded-full bg-indigo-50 px-2 py-1 dark:bg-indigo-900/30">
          <Text size="xs" className="text-indigo-700 dark:text-indigo-400">
            {role.replace('_', ' ')}
          </Text>
        </View>
      ))}
    </View>
  </TouchableOpacity>
);

export const TrainingListScreen = () => {
  const router = useRouter();
  const { data: modules, isLoading, isError, refetch, isRefetching } = useTrainingModules();
  const { data: completions } = useMyTrainingCompletions();

  const completedModuleIds = new Set(completions?.map((c) => c.moduleId) || []);

  const activeModules = modules?.filter((m) => m.isActive) || [];

  if (isLoading) return <LoadingScreen message="Loading training modules..." />;

  if (isError) {
    return (
      <>
        <StackHeader showBackButton title="Training" />
        <ErrorScreen
          title="Failed to load training"
          message="There was an error loading the training modules. Please try again."
          onRetry={() => refetch()}
        />
      </>
    );
  }

  return (
    <Container>
      <StackHeader title="Training" showBackButton />
      <FlatList
        data={activeModules}
        renderItem={({ item }) => (
          <TrainingCard
            module={item}
            isCompleted={completedModuleIds.has(item.id)}
            onPress={() => router.push(`/(protected)/training/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6366f1" />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-24">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
              <Ionicons name="school-outline" size={32} color="#64748b" />
            </View>
            <Text variant="heading" size="lg" className="text-slate-900 dark:text-white">
              No training available
            </Text>
            <Text variant="subtext" size="sm" className="mt-2 text-center">
              Check back later for new training modules.
            </Text>
          </View>
        }
      />
    </Container>
  );
};
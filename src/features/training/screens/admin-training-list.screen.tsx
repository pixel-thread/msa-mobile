import React from 'react';
import { View, RefreshControl, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTrainingModules } from '../hooks';
import { LoadingScreen, ErrorScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';
import { FLASHLIST_ESTIMATED_ITEM_SIZE } from '@src/shared/constants';
import type { TrainingModule } from '../types';

const HeaderActions = () => {
  const router = useRouter();
  return (
    <View className="flex-row items-center gap-2">
      <TouchableOpacity
        onPress={() => router.push('/(protected)/admin/training/completions')}
        className="p-2"
        accessibilityLabel="View completions">
        <Ionicons name="document-text-outline" size={24} color="#64748b" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/(protected)/admin/training/create')}
        className="p-2"
        accessibilityLabel="Create new training">
        <Ionicons name="add-circle-outline" size={24} color="#64748b" />
      </TouchableOpacity>
    </View>
  );
};

interface AdminTrainingCardProps {
  module: TrainingModule;
  onPress: () => void;
}

const AdminTrainingCard: React.FC<AdminTrainingCardProps> = ({ module, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="mb-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
    <View className="flex-row items-start justify-between">
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text variant="heading" size="lg" weight="semibold" className="text-slate-900 dark:text-white">
            {module.title}
          </Text>
          <View
            className={`rounded-full px-2 py-0.5 ${module.isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
            <Text size="xs" className={module.isActive ? 'text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}>
              {module.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
        {module.description && (
          <Text variant="subtext" size="sm" className="mt-1 text-slate-600 dark:text-slate-400">
            {module.description}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#64748b" />
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

export const AdminTrainingListScreen = () => {
  const router = useRouter();
  const { data: modules, isLoading, isError, refetch, isRefetching } = useTrainingModules();

  if (isLoading) return <LoadingScreen message="Loading training modules..." />;

  if (isError) {
    return (
      <>
        <StackHeader showBackButton title="Training Management" />
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
      <StackHeader title="Training Management" showBackButton rightAction={<HeaderActions />} />
      <FlashList
        data={modules}
        renderItem={({ item }) => (
          <AdminTrainingCard
            module={item}
            onPress={() => router.push(`/(protected)/admin/training/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
        estimatedItemSize={FLASHLIST_ESTIMATED_ITEM_SIZE.TRAINING_CARD}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6366f1" />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-24">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
              <Ionicons name="school-outline" size={32} color="#64748b" />
            </View>
            <Text variant="heading" size="lg" className="text-slate-900 dark:text-white">
              No training modules
            </Text>
            <Text variant="subtext" size="sm" className="mt-2 text-center">
              Create your first training module to get started.
            </Text>
          </View>
        }
      />
    </Container>
  );
};

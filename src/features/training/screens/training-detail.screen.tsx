import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTrainingModule, useMyTrainingCompletions, useCompleteTraining } from '../hooks';
import { LoadingScreen, ErrorScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';
import { formattedDate } from '@utils/format';
import { ActivityIndicator } from 'react-native';

export const TrainingDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: module, isLoading, isError, refetch } = useTrainingModule(id || '');
  const { data: completions } = useMyTrainingCompletions();
  const completeTraining = useCompleteTraining({ moduleId: id || '' });

  const isCompleted = completions?.some((c) => c.moduleId === id) || false;

  if (isLoading) return <LoadingScreen message="Loading training module..." />;

  if (isError || !module) {
    return (
      <>
        <StackHeader showBackButton title="Training" />
        <ErrorScreen
          title="Failed to load training"
          message="There was an error loading this training module. Please try again."
          onRetry={() => refetch()}
        />
      </>
    );
  }

  const content = React.useMemo(() => {
    try {
      return JSON.parse(module.content);
    } catch {
      return module.content;
    }
  }, [module.content]);

  return (
    <Container>
      <StackHeader showBackButton title="Training" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}>
        <View className="mb-4 flex-row flex-wrap items-center gap-2">
          {module.requiredForRoles.map((role) => (
            <View
              key={role}
              className="rounded-full bg-indigo-50 px-3 py-1.5 dark:bg-indigo-900/30">
              <Text size="sm" className="text-indigo-700 dark:text-indigo-400">
                {role.replace('_', ' ')}
              </Text>
            </View>
          ))}

          {isCompleted && (
            <View className="rounded-full bg-green-50 px-3 py-1.5 dark:bg-green-900/30">
              <View className="flex-row items-center gap-1">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text size="sm" className="text-green-700 dark:text-green-400">
                  Completed
                </Text>
              </View>
            </View>
          )}
        </View>

        <Text
          variant="heading"
          size="xl"
          weight="bold"
          className="mb-2 text-slate-900 dark:text-white">
          {module.title}
        </Text>

        {module.description && (
          <Text variant="subtext" size="lg" className="mb-4 text-slate-600 dark:text-slate-400">
            {module.description}
          </Text>
        )}

        <View className="mb-6 flex-row items-center gap-x-4">
          <View className="flex-row items-center gap-x-2">
            <Ionicons name="calendar-outline" size={14} color="#64748b" />
            <Text variant="subtext" size="sm" className="text-slate-500">
              Updated {formattedDate(new Date(module.updatedAt))}
            </Text>
          </View>
        </View>

        <View className="mb-6 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          {typeof content === 'string' ? (
            <Text variant="default" size="lg" className="text-slate-700 dark:text-slate-300">
              {content}
            </Text>
          ) : (
            <View>
              {content.sections?.map((section: { title: string; content: string }, index: number) => (
                <View key={index} className="mb-4">
                  <Text variant="heading" size="lg" weight="semibold" className="mb-2 text-slate-900 dark:text-white">
                    {section.title}
                  </Text>
                  <Text variant="default" size="lg" className="text-slate-600 dark:text-slate-400">
                    {section.content}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        {isCompleted ? (
          <View className="flex-row items-center justify-center gap-2">
            <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
            <Text variant="heading" size="lg" className="text-green-700 dark:text-green-400">
              Training Completed
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => completeTraining.mutate(undefined)}
            disabled={completeTraining.isPending}
            className="flex-row items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3">
            {completeTraining.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text variant="heading" size="lg" className="text-white">
                  Mark as Complete
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </Container>
  );
};
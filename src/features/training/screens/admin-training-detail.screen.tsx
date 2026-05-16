import React, { useMemo } from 'react';
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useTrainingModule,
  useTrainingAssignments,
  useRemoveTrainingAssignment,
  useAllTrainingCompletions,
  useAdminCompleteTraining,
} from '../hooks';
import { LoadingScreen, ErrorScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text, Button } from '@src/shared/components/ui';
import { formattedDate } from '@utils/format';
import type { TrainingAssignmentWithUser, TrainingAssignmentStatus } from '../types';

const statusColors: Record<TrainingAssignmentStatus, { bg: string; text: string; label: string }> =
  {
    ASSIGNED: {
      bg: 'bg-slate-100 dark:bg-slate-700',
      text: 'text-slate-600 dark:text-slate-400',
      label: 'Assigned',
    },
    IN_PROGRESS: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
      label: 'In Progress',
    },
    COMPLETED: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-400',
      label: 'Completed',
    },
    EXPIRED: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
      label: 'Expired',
    },
  };

export const AdminTrainingDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const moduleId = useMemo(() => id as string, [id]);

  const router = useRouter();

  const {
    data: module,
    isLoading: isModuleLoading,
    isError: isModuleError,
    refetch: refetchModule,
  } = useTrainingModule(moduleId);

  const { data: assignments, isLoading: isAssignmentsLoading } = useTrainingAssignments(moduleId);
  const { data: completions } = useAllTrainingCompletions({ moduleId });

  const removeAssignment = useRemoveTrainingAssignment({ moduleId });
  const completeTraining = useAdminCompleteTraining({ moduleId });

  const completedUserIds = new Set(completions?.map((c) => c.userId) || []);

  const handleRemoveAssignment = async (userId: string) => {
    await removeAssignment.mutateAsync({ userId });
  };

  if (isModuleLoading || isAssignmentsLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  if (isModuleError || !module) {
    return (
      <>
        <StackHeader showBackButton title="Training Details" />
        <ErrorScreen
          title="Failed to load"
          message="Could not load training data."
          onRetry={refetchModule}
        />
      </>
    );
  }

  const renderAssignmentItem = ({ item }: { item: TrainingAssignmentWithUser }) => {
    const isCompleted = completedUserIds.has(item.userId);
    const status = isCompleted ? 'COMPLETED' : item.status;
    const statusStyle = statusColors[status];
    const isCompleting = completeTraining.isPending;
    const userId = item.userId;

    return (
      <View className="mb-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text
              variant="heading"
              size="lg"
              weight="semibold"
              className="text-slate-900 dark:text-white">
              {item.user.name}
            </Text>
            <Text variant="subtext" size="sm" className="text-slate-500">
              {item.user.email}
            </Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
              {item.user.role.map((role) => (
                <View
                  key={role}
                  className="rounded-full bg-indigo-50 px-2 py-0.5 dark:bg-indigo-900/30">
                  <Text size="xs" className="text-indigo-700 dark:text-indigo-400">
                    {role.replace('_', ' ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View className={`rounded-full px-2 py-1 ${statusStyle.bg}`}>
            <Text size="xs" className={statusStyle.text}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <View className="flex-row gap-3">
            <Text size="xs" className="text-slate-400">
              Assigned: {formattedDate(new Date(item.assignedAt))}
            </Text>
            {item.dueDate && (
              <Text size="xs" className="text-slate-400">
                Due: {formattedDate(new Date(item.dueDate))}
              </Text>
            )}
          </View>
        </View>

        <View className="mt-3 flex-row items-center gap-2">
          {!isCompleted && (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/(protected)/admin/training/record-completion',
                  params: { userId, moduleId },
                });
              }}
              disabled={isCompleting}
              className="flex-1 rounded-lg bg-green-600 px-3 py-2">
              {isCompleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <View className="flex-row items-center justify-center gap-1">
                  <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                  <Text size="sm" className="font-semibold text-white">
                    Mark Complete
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => handleRemoveAssignment(item.userId)}
            className="rounded-lg border border-red-200 px-3 py-2 dark:border-red-800">
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Container>
      <StackHeader
        showBackButton
        title="Training Details"
        rightAction={
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.push(`/(protected)/admin/training/${moduleId}/edit`)}
              className="p-2"
              accessibilityLabel="Edit training">
              <Ionicons name="create-outline" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView className="flex-1">
        <View className="border-b border-slate-200 p-4 dark:border-slate-700">
          <View className="flex-row items-center gap-2">
            <Text variant="heading" size="xl" className="text-slate-900 dark:text-white">
              {module.title}
            </Text>
            <View
              className={`rounded-full px-2 py-0.5 ${module.isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
              <Text
                size="xs"
                className={
                  module.isActive
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-slate-600 dark:text-slate-400'
                }>
                {module.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          {module.description && (
            <Text variant="subtext" size="lg" className="mt-2 text-slate-600 dark:text-slate-400">
              {module.description}
            </Text>
          )}

          <View className="mt-4 flex-row flex-wrap gap-2">
            {module.requiredForRoles.map((role) => (
              <View
                key={role}
                className="rounded-full bg-indigo-50 px-3 py-1.5 dark:bg-indigo-900/30">
                <Text size="sm" className="text-indigo-700 dark:text-indigo-400">
                  {role.replace('_', ' ')}
                </Text>
              </View>
            ))}
          </View>

          {module.durationMinutes && (
            <View className="mt-3 flex-row items-center gap-2">
              <Ionicons name="time-outline" size={16} color="#64748b" />
              <Text variant="subtext" size="sm" className="text-slate-500">
                {module.durationMinutes} minutes
              </Text>
            </View>
          )}

          <Text variant="subtext" size="xs" className="mt-3 text-slate-400">
            Version {module.version} • Updated {formattedDate(new Date(module.updatedAt))}
          </Text>
        </View>

        <View className="border-b border-slate-200 p-4 dark:border-slate-700">
          <Text variant="heading" size="lg" className="text-slate-900 dark:text-white">
            Assigned Members
          </Text>
          <Text variant="subtext" size="sm" className="text-slate-500">
            {assignments?.length || 0} users assigned
          </Text>
        </View>

        <View className="p-4 pb-24">
          {assignments?.map((item) => (
            <View key={item.id}>
              {renderAssignmentItem({ item: item as TrainingAssignmentWithUser })}
            </View>
          ))}

          {(!assignments || assignments.length === 0) && (
            <View className="items-center justify-center py-12">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                <Ionicons name="people-outline" size={28} color="#64748b" />
              </View>
              <Text variant="subtext" size="lg" className="text-center text-slate-500">
                No members assigned yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <Button
          title="Assign Users"
          onPress={() => router.push(`/(protected)/admin/training/${moduleId}/assign`)}
          className="w-full"
        />
      </View>
    </Container>
  );
};

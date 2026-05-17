import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTrainingAssignments, useBulkAssignTraining } from '../hooks';
import { LoadingScreen, ErrorScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text, TextInput, Button } from '@src/shared/components/ui';
import { useMembers } from '@src/features/members';
import { FLASHLIST_ESTIMATED_ITEM_SIZE } from '@src/shared/constants';
import type { TrainingAssignmentWithUser, TrainingAssignmentStatus } from '../types';
import { formattedDate } from '@utils/format';

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

export const AdminTrainingAssignScreen = () => {
  const { id } = useLocalSearchParams();
  const moduleId = typeof id === 'string' ? id : id?.[0] || '';
  const router = useRouter();

  const { data: assignments, isLoading: isAssignmentsLoading } = useTrainingAssignments(moduleId);
  const { data: members } = useMembers();
  const bulkAssignTraining = useBulkAssignTraining({ moduleId });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const assignedUserIds = new Set(assignments?.map((a) => a.userId) || []);
  const availableMembers = members?.filter((m) => !assignedUserIds.has(m.id)) || [];

  const filteredMembers = availableMembers.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleBulkAssign = async () => {
    if (selectedUsers.length === 0) return;
    await bulkAssignTraining.mutateAsync({ userIds: selectedUsers });
    setSelectedUsers([]);
    router.back();
  };

  if (isAssignmentsLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  const renderAssignmentItem = ({ item }: { item: TrainingAssignmentWithUser }) => {
    const statusStyle = statusColors[item.status];
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
      </View>
    );
  };

  return (
    <Container>
      <StackHeader showBackButton title="Assign Users" />

      <View className="border-b border-slate-200 p-4 dark:border-slate-700">
        <Text variant="subtext" size="sm" className="text-slate-500">
          {assignments?.length || 0} users currently assigned
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

      <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <Button
          title="Add More Users"
          onPress={() => router.push(`/(protected)/admin/training/${moduleId}/assign/add`)}
          className="w-full"
        />
      </View>
    </Container>
  );
};

export const AdminTrainingAssignAddScreen = () => {
  const { id } = useLocalSearchParams();
  const moduleId = typeof id === 'string' ? id : id?.[0] || '';
  const router = useRouter();

  const { data: assignments } = useTrainingAssignments(moduleId);
  const { data: members } = useMembers();
  const bulkAssignTraining = useBulkAssignTraining({ moduleId });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const assignedUserIds = new Set(assignments?.map((a) => a.userId) || []);
  const availableMembers = members?.filter((m) => !assignedUserIds.has(m.id)) || [];

  const filteredMembers = availableMembers.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleBulkAssign = async () => {
    if (selectedUsers.length === 0) return;
    await bulkAssignTraining.mutateAsync({ userIds: selectedUsers });
    router.back();
  };

  return (
    <Container>
      <StackHeader
        showBackButton
        title="Add Users"
        rightAction={
          <TouchableOpacity
            onPress={() => {
              setSelectedUsers([]);
              router.back();
            }}
            className="p-2">
            <Ionicons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
        }
      />

      <View className="p-4">
        <TextInput
          placeholder="Search members..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="mb-4"
        />
      </View>

      <FlashList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        estimatedItemSize={FLASHLIST_ESTIMATED_ITEM_SIZE.MEMBER_SELECT_ROW}
        renderItem={({ item }) => {
          const isSelected = selectedUsers.includes(item.id);
          return (
            <TouchableOpacity
              onPress={() => toggleUserSelection(item.id)}
              className={`flex-row items-center gap-3 border-b border-slate-100 p-4 dark:border-slate-800 ${
                isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
              }`}>
              <View
                className={`h-5 w-5 rounded-full border-2 ${
                  isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                }`}>
                {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <View>
                <Text className="text-slate-900 dark:text-white">{item.name}</Text>
                <Text size="sm" className="text-slate-500">
                  {item.email}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text className="p-4 text-center text-slate-500">No available users to assign.</Text>
        }
      />

      <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <Button
          title={`Assign ${selectedUsers.length} User${selectedUsers.length !== 1 ? 's' : ''}`}
          onPress={handleBulkAssign}
          disabled={selectedUsers.length === 0 || bulkAssignTraining.isPending}
          className="w-full"
        />
      </View>
    </Container>
  );
};

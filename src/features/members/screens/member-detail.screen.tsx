import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMember, useUpdateMemberStatus } from '../hooks';
import { LoadingScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text, Button } from '@src/shared/components/ui';
import { ErrorBoundary } from '@src/shared/components/common';
import { MemberErrorScreen } from './member-error';
import { MemberInfoCard, ManageRolesModal } from '../components';
import { cn } from '@src/shared/lib/cn';
import { useAuthStore } from '@src/shared/store/auth.store';
import { hasHighRoleAccess } from '@src/features/meetings/utils/permission';

export const MemberDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const memberId = id as string;

  const { data: member, isLoading, isError, refetch, isRefetching } = useMember(memberId);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateMemberStatus();
  const { user } = useAuthStore();

  const canUpdateStatus = hasHighRoleAccess(user?.role) && member?.status === 'INACTIVE';
  const canManageRoles = hasHighRoleAccess(user?.role);

  const [isRolesModalVisible, setIsRolesModalVisible] = useState(false);

  const handleAccept = () => {
    Alert.alert('Approve Member', 'Are you sure you want to approve this member?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Accept',
        style: 'default',
        onPress: () =>
          updateStatus(
            { id: memberId, status: 'ACTIVE' },
            { onError: () => Alert.alert('Error', 'Failed to update member status.') }
          ),
      },
    ]);
  };

  const handleReject = () => {
    Alert.alert('Reject Member', 'Are you sure you want to reject and suspend this member?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () =>
          updateStatus(
            { id: memberId, status: 'SUSPENDED' },
            { onError: () => Alert.alert('Error', 'Failed to update member status.') }
          ),
      },
    ]);
  };

  if (isLoading) return <LoadingScreen message="Loading member details..." />;

  if (isError || !member) return <MemberErrorScreen refetch={refetch} />;

  return (
    <ErrorBoundary componentName="MemberDetailScreen">
      <Container>
        <StackHeader showBackButton title="Member Details" />
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6366f1" />
          }>
          {/* Hero Section */}
          <View className="px-4 pb-8 pt-6">
            <View className="mb-3 flex-row items-center gap-x-2">
              <View className="rounded-md bg-indigo-600 px-2 py-0.5">
                <Text weight="bold" size="xs" className="uppercase tracking-widest text-white">
                  {member.role.join(', ')}
                </Text>
              </View>
              <View
                className={cn(
                  'rounded-full px-2 py-0.5',
                  member.status === 'ACTIVE'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20'
                    : 'bg-slate-50 dark:bg-slate-950/20'
                )}>
                <Text
                  size="xs"
                  weight="medium"
                  className={cn(
                    'text-[10px]',
                    member.status === 'ACTIVE'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-400'
                  )}>
                  {member.status}
                </Text>
              </View>
            </View>

            <Text variant="heading" size="3xl" className="text-slate-900 dark:text-white">
              {member.name}
            </Text>

            <Text variant="subtext" size="sm" className="mt-3 leading-relaxed">
              {member.email}
            </Text>

            {/* Accept/Reject Buttons */}
            {canUpdateStatus && (
              <View className="mt-6 flex-row gap-x-4">
                <Button
                  className="flex-1"
                  variant="default"
                  onPress={handleAccept}
                  disabled={isUpdating}
                  loading={isUpdating}
                  title="Accept"
                />
                <Button
                  className="flex-1"
                  variant="destructive"
                  onPress={handleReject}
                  disabled={isUpdating}
                  loading={isUpdating}
                  title="Reject Member"
                />
              </View>
            )}

            {/* Manage Roles Button */}
            {canManageRoles && (
              <View className="mt-4">
                <Button
                  variant="outline"
                  onPress={() => setIsRolesModalVisible(true)}
                  title="Manage Roles"
                />
              </View>
            )}
          </View>

          {/* Quick Info Grid */}
          <View className="flex-1 flex-row flex-wrap gap-4 px-4">
            <MemberInfoCard
              icon="mail-outline"
              label="Email"
              value={member.email}
              className="min-w-[45%] flex-1"
            />
            {member.membershipNumber && (
              <MemberInfoCard
                icon="card-outline"
                label="Member ID"
                value={member.membershipNumber}
                className="min-w-[45%] flex-1"
              />
            )}
            <MemberInfoCard
              icon="calendar-outline"
              label="Joined"
              value={new Date(member.createdAt).toLocaleDateString()}
              className="min-w-[45%] flex-1"
            />
          </View>
        </ScrollView>

        {/* Roles Modal */}
        <ManageRolesModal 
          memberId={memberId}
          currentRoles={member.role}
          isVisible={isRolesModalVisible}
          onClose={() => setIsRolesModalVisible(false)}
        />
      </Container>
    </ErrorBoundary>
  );
};

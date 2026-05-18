import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, Alert, Modal, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMember, useUpdateMemberStatus } from '../hooks';
import { LoadingScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text, Button, TextInput } from '@src/shared/components/ui';
import { MemberErrorScreen } from './member-error';
import { MemberInfoCard, ManageRolesModal } from '../components';
import { cn } from '@src/shared/lib/cn';
import { useAuthStore } from '@src/shared/store/auth.store';
import { hasHighRoleAccess } from '@src/features/meetings/utils/permission';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MEMBER', 'PRESIDENT', 'SECRETARY', 'DPO'] as const;

const AcceptMemberSchema = z.object({
  memberTypeId: z.string().min(1, 'Member type is required'),
  role: z.enum(USER_ROLES).default('MEMBER'),
  dateOfJoiningGovt: z.coerce.date().optional(),
  dateOfJoiningMfsa: z.coerce.date().optional(),
});

type AcceptMemberInput = z.infer<typeof AcceptMemberSchema>;

const formatDate = (date: Date | undefined) => {
  if (!date || isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

const parseDate = (text: string) => {
  const parsed = new Date(text);
  return isNaN(parsed.getTime()) ? null : parsed;
};

interface RoleChipProps {
  role: string;
  isSelected: boolean;
  onPress: () => void;
}

const RoleChip = ({ role, isSelected, onPress }: RoleChipProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      'flex-row items-center rounded-full border px-3 py-2',
      isSelected
        ? 'border-indigo-600 bg-indigo-600'
        : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
    )}>
    <Text
      weight={isSelected ? 'bold' : 'medium'}
      size="xs"
      className={cn(
        'tracking-wide',
        isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-300'
      )}>
      {role}
    </Text>
  </TouchableOpacity>
);

export const MemberDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const memberId = id as string;

  const { data: member, isLoading, isError, refetch, isRefetching } = useMember(memberId);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateMemberStatus();
  const { user } = useAuthStore();

  const canUpdateStatus =
    (hasHighRoleAccess(user?.role) && member?.status === 'INACTIVE') ||
    member?.status === 'PENDING';
  const canManageRoles = hasHighRoleAccess(user?.role);

  const [isRolesModalVisible, setIsRolesModalVisible] = useState(false);
  const [isAcceptFormVisible, setIsAcceptFormVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(AcceptMemberSchema),
    defaultValues: {
      memberTypeId: '',
      role: 'MEMBER',
      dateOfJoiningGovt: new Date(),
      dateOfJoiningMfsa: new Date(),
    },
  });

  const openAcceptForm = () => {
    reset({
      memberTypeId: '',
      role: 'MEMBER',
      dateOfJoiningGovt: new Date(),
      dateOfJoiningMfsa: new Date(),
    });
    setIsAcceptFormVisible(true);
  };

  const closeAcceptForm = () => {
    setIsAcceptFormVisible(false);
    reset();
  };

  const onSubmitAccept = (data: AcceptMemberInput) => {
    updateStatus(
      {
        id: memberId,
        memberTypeId: data.memberTypeId,
        role: data.role,
        dateOfJoiningGovt: data.dateOfJoiningGovt,
        dateOfJoiningMfsa: data.dateOfJoiningMfsa,
        status: 'ACTIVE',
      },
      {
        onSuccess: () => {
          closeAcceptForm();
        },
        onError: () => Alert.alert('Error', 'Failed to accept member. Please try again.'),
      }
    );
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
    <Container>
      <StackHeader showBackButton title="Member Details" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6366f1" />
        }>
        {/* Hero Section */}
        <View className="px-4 pb-6 pt-6">
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

          <Text variant="subtext" size="sm" className="mt-3 leading-relaxed">
            {member.memberTypeId}
          </Text>

          {/* Accept/Reject Actions */}
          {canUpdateStatus && (
            <View className="mt-6 gap-y-3">
              <Button
                variant="default"
                onPress={openAcceptForm}
                disabled={isUpdating}
                loading={isUpdating}
                title="Accept Member"
              />
              <Button
                variant="ghost"
                onPress={handleReject}
                disabled={isUpdating}
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

        {/* Divider */}
        <View className="mx-4 h-px bg-slate-100 dark:bg-slate-800" />

        {/* Quick Info Grid */}
        <View className="flex-1 flex-row flex-wrap gap-4 px-4 py-6">
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

      {/* Accept Member Full-Screen Form */}
      <Modal visible={isAcceptFormVisible} animationType="slide" presentationStyle="pageSheet">
        <View className="pt-safe pb-safe flex-1 bg-slate-50 dark:bg-slate-950">
          {/* Custom Header */}
          <View className="flex-row items-center border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <TouchableOpacity onPress={closeAcceptForm} className="p-2">
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text variant="heading" size="lg" className="ml-2 text-slate-900 dark:text-white">
              Accept Member
            </Text>
          </View>

          <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
            {/* Member Summary Card */}
            <View className="mb-6 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/20">
              <Text weight="bold" size="lg" className="text-indigo-900 dark:text-indigo-100">
                {member.name}
              </Text>
              <Text size="sm" className="mt-1 text-indigo-700 dark:text-indigo-300">
                {member.email}
              </Text>
              <Text size="xs" className="mt-2 text-indigo-600 dark:text-indigo-400">
                Current status: {member.status}
              </Text>
            </View>

            {/* Form Fields */}
            <Text weight="bold" size="default" className="mb-4 text-slate-900 dark:text-white">
              Member Details
            </Text>

            {/* Divider */}
            <View className="my-4 h-px bg-slate-100 dark:bg-slate-800" />

            <View className="gap-y-2">
              <Controller
                control={control}
                name="memberTypeId"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={cn(
                      'h-12 rounded-lg border bg-white px-4 dark:bg-slate-800',
                      errors.memberTypeId
                        ? 'border-red-500'
                        : 'border-slate-200 dark:border-slate-700'
                    )}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter member type ID"
                    label="Member Type ID"
                    error={errors.memberTypeId?.message}
                    autoCapitalize="none"
                  />
                )}
              />

              <Controller
                control={control}
                name="role"
                render={({ field: { onChange, value } }) => (
                  <>
                    <Text
                      weight="bold"
                      size="default"
                      className="mb-4 text-slate-900 dark:text-white">
                      Role
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {USER_ROLES.map((roleOption) => (
                        <RoleChip
                          key={roleOption}
                          role={roleOption}
                          isSelected={value === roleOption}
                          onPress={() => onChange(roleOption)}
                        />
                      ))}
                    </View>
                  </>
                )}
              />

              <Controller
                control={control}
                name="dateOfJoiningGovt"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={cn(
                      'h-12 rounded-lg border bg-white px-4 dark:bg-slate-800',
                      errors.dateOfJoiningGovt
                        ? 'border-red-500'
                        : 'border-slate-200 dark:border-slate-700'
                    )}
                    error={errors.dateOfJoiningGovt?.message}
                    onChangeText={(text) => {
                      const parsed = parseDate(text);
                      if (parsed) onChange(parsed);
                    }}
                    value={formatDate(value)}
                    label="Date of joining govt"
                    placeholder="YYYY-MM-DD"
                    keyboardType="numbers-and-punctuation"
                  />
                )}
              />

              <Controller
                control={control}
                name="dateOfJoiningMfsa"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    error={errors?.dateOfJoiningMfsa?.message}
                    className={cn(
                      'h-12 rounded-lg border bg-white px-4 dark:bg-slate-800',
                      errors.dateOfJoiningMfsa
                        ? 'border-red-500'
                        : 'border-slate-200 dark:border-slate-700'
                    )}
                    onChangeText={(text) => {
                      const parsed = parseDate(text);
                      if (parsed) onChange(parsed);
                    }}
                    value={formatDate(value)}
                    label="Date of joining MFSA"
                    placeholder="YYYY-MM-DD"
                    keyboardType="numbers-and-punctuation"
                  />
                )}
              />
            </View>
            {/* Spacer for bottom button */}
            <View className="h-8" />
          </ScrollView>

          {/* Bottom Action Bar */}
          <View className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <Button
              variant="default"
              onPress={handleSubmit(onSubmitAccept)}
              disabled={isUpdating}
              loading={isUpdating}
              title="Accept Member"
              size="lg"
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
};

import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMember } from '../hooks';
import { LoadingScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';
import { ErrorBoundary } from '@src/shared/components/common';
import { MemberErrorScreen } from './member-error';
import { MemberInfoCard } from '../components';
import { cn } from '@src/shared/lib/cn';

export const MemberDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: member, isLoading, isError, refetch, isRefetching } = useMember(id as string);

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
                  {member.role}
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
      </Container>
    </ErrorBoundary>
  );
};

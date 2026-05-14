import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Member } from '../types';
import { formattedDate } from '@src/shared/utils/format';
import { Card, CardContent, Text } from '@src/shared/components/ui';
import { cn } from '@src/shared/lib/cn';
import { useRouter } from 'expo-router';

interface MemberCardProps {
  member: Member;
}

export const MemberCard = ({ member }: MemberCardProps) => {
  const date = new Date(member.createdAt || Date.now());
  const router = useRouter();

  const onPress = () => {
    router.push(`/(protected)/admin/members/${member.id}`);
  };

  return (
    <View className="mb-4">
      <Card className="overflow-hidden border-slate-100 shadow-sm dark:border-slate-800">
        <TouchableOpacity activeOpacity={0.7} onPress={() => onPress()}>
          <CardContent className="p-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <View className="mb-2 flex-row items-center gap-x-2">
                  <View className="flex-row flex-wrap gap-1">
                    {member.role.map((role, i) => (
                      <View
                        key={role + i}
                        className={cn(
                          'rounded-md px-2 py-0.5',
                          'bg-indigo-50 dark:bg-indigo-900/20'
                        )}>
                        <Text
                          variant="label"
                          size="xs"
                          className="font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                          {role
                            .replace(/_/g, ' ')
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View
                    className={cn(
                      'rounded-full px-2 py-0.5',
                      member.status === 'ACTIVE'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20'
                        : member.status === 'INACTIVE'
                          ? 'bg-amber-50 dark:bg-amber-900/20'
                          : 'bg-slate-50 dark:bg-slate-800'
                    )}>
                    <Text
                      size="xs"
                      weight="medium"
                      className={cn(
                        'text-[10px]',
                        member.status === 'ACTIVE'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : member.status === 'INACTIVE'
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-slate-600 dark:text-slate-400'
                      )}>
                      {member.status}
                    </Text>
                  </View>
                </View>

                <Text
                  weight={'semibold'}
                  variant="heading"
                  size="sm"
                  className="mb-2 text-slate-900 dark:text-white">
                  {member.name}
                </Text>

                <View className="gap-y-1.5">
                  <View className="flex-row items-center gap-x-2">
                    <Ionicons name="mail-outline" size={14} color="#64748b" />
                    <Text variant="subtext" size="xs">
                      {member.email}
                    </Text>
                  </View>

                  {member.membershipNumber && (
                    <View className="flex-row items-center gap-x-2">
                      <Ionicons name="card-outline" size={14} color="#64748b" />
                      <Text variant="subtext" size="xs" numberOfLines={1}>
                        {member.membershipNumber}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View className="items-end justify-between self-stretch">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                  <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                </View>
                <Text size="xs" variant="subtext" className="mt-4">
                  Joined {formattedDate(date)}
                </Text>
              </View>
            </View>
          </CardContent>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

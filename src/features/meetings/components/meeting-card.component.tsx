import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Meeting } from '../types';
import { formattedDate, formattedTime } from '@src/shared/utils/format';
import { Card, CardContent, Text } from '@src/shared/components/ui';
import { cn } from '@lib/cn';

interface MeetingCardProps {
  meeting: Meeting;
  onPress?: (meeting: Meeting) => void;
}

export const MeetingCard = ({ meeting, onPress }: MeetingCardProps) => {
  const date = new Date(meeting.scheduledAt);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress?.(meeting)} className="mb-4">
      <Card className="overflow-hidden border-slate-100 shadow-sm dark:border-slate-800">
        <CardContent className="p-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <View className="mb-2 flex-row items-center gap-x-2">
                <View
                  className={cn(
                    'rounded-md px-2 py-0.5',
                    meeting.type === 'AGM'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20'
                      : 'bg-slate-100 dark:bg-slate-800'
                  )}>
                  <Text
                    variant="label"
                    size="xs"
                    className={cn(
                      'font-bold tracking-wider',
                      meeting.type === 'AGM'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400'
                    )}>
                    {meeting.type}
                  </Text>
                </View>
                <View
                  className={cn(
                    'rounded-full px-2 py-0.5',
                    meeting.status === 'SCHEDULED'
                      ? 'bg-emerald-50 dark:bg-emerald-900/20'
                      : meeting.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-slate-50 dark:bg-slate-800'
                  )}>
                  <Text
                    size="xs"
                    weight="medium"
                    className={cn(
                      'text-[10px]',
                      meeting.status === 'SCHEDULED'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : meeting.status === 'IN_PROGRESS'
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-400'
                    )}>
                    {meeting.status}
                  </Text>
                </View>
              </View>

              <Text
                weight={'semibold'}
                variant="heading"
                size="sm"
                className="mb-2 text-slate-900 dark:text-white">
                {meeting.title}
              </Text>

              <View className="gap-y-1.5">
                <View className="flex-row items-center gap-x-2">
                  <Ionicons name="calendar-outline" size={14} color="#64748b" />
                  <Text variant="subtext" size="xs">
                    {formattedDate(date)} • {formattedTime(date)}
                  </Text>
                </View>

                {meeting.venue && (
                  <View className="flex-row items-center gap-x-2">
                    <Ionicons name="location-outline" size={14} color="#64748b" />
                    <Text variant="subtext" size="xs" numberOfLines={1}>
                      {meeting.venue}
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
                {meeting._count.attendees} attendees
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

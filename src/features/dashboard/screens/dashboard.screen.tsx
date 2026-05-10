import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@src/shared/store';
import { Container, StackHeader } from '@src/shared/components';
import { Card, CardContent, Text } from '@src/shared/components/ui';
import { cn } from '@lib/cn';
import { useRouter } from 'expo-router';
import { useMeetings } from '@src/features/meetings/hooks';
import { formattedDate, formattedTime } from '@src/shared/utils/format';

export const DashboardScreen = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: meetings } = useMeetings({ limit: 1 });
  const nextMeeting = meetings?.[0];

  if (!user) return null;

  return (
    <Container className="bg-slate-50 dark:bg-slate-950">
      <StackHeader title="Dashboard" showDrawerButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View className="px-4 pb-8 pt-6">
          <Text
            variant="subtext"
            size="sm"
            weight="medium"
            className="uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Welcome back,
          </Text>
          <Text variant="heading" size="3xl" className="mt-1 text-slate-900 dark:text-white">
            {user.name}
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="flex-row gap-x-4 px-4">
          <QuickAction
            icon="calendar"
            label="Meetings"
            onPress={() => router.push('/(protected)/(tabs)/meetings')}
            className="bg-indigo-600"
          />
          <QuickAction
            icon="document-text"
            label="Documents"
            onPress={() => {}}
            className="bg-slate-800"
          />
          <QuickAction
            icon="people"
            label="Directory"
            onPress={() => {}}
            className="bg-emerald-600"
          />
        </View>

        {/* Next Meeting Highlight */}
        {nextMeeting && (
          <View className="mt-8 px-4">
            <Text variant="heading" size="lg" className="mb-4 px-1 text-slate-900 dark:text-white">
              Next Briefing
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/(protected)/meetings/${nextMeeting.id}`)}>
              <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm dark:border-indigo-900/30 dark:bg-indigo-950/10">
                <CardContent className="p-5">
                  <View className="mb-4 flex-row items-center justify-between">
                    <View className="rounded-full bg-indigo-600 px-3 py-1">
                      <Text
                        weight="bold"
                        size="xs"
                        className="uppercase tracking-tighter text-white">
                        Upcoming
                      </Text>
                    </View>
                    <Ionicons name="arrow-forward" size={18} color="#4f46e5" />
                  </View>
                  <Text variant="heading" size="xl" className="mb-2 text-slate-900 dark:text-white">
                    {nextMeeting.title}
                  </Text>
                  <View className="flex-row items-center gap-x-4">
                    <View className="flex-row items-center gap-x-1.5">
                      <Ionicons name="calendar-outline" size={16} color="#6366f1" />
                      <Text
                        weight="semibold"
                        size="sm"
                        className="text-indigo-700 dark:text-indigo-400">
                        {formattedDate(new Date(nextMeeting.scheduledAt))}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-x-1.5">
                      <Ionicons name="time-outline" size={16} color="#6366f1" />
                      <Text
                        weight="semibold"
                        size="sm"
                        className="text-indigo-700 dark:text-indigo-400">
                        {formattedTime(new Date(nextMeeting.scheduledAt))}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Activity / Announcements */}
        <View className="mt-8 px-4">
          <View className="mb-4 flex-row items-center justify-between px-1">
            <Text variant="heading" size="lg" className="text-slate-900 dark:text-white">
              Announcements
            </Text>
            <TouchableOpacity>
              <Text variant="link" size="sm" weight="semibold">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <Card className="mb-4 border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="p-4">
              <View className="flex-row gap-x-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
                  <Ionicons name="megaphone" size={24} color="#d97706" />
                </View>
                <View className="flex-1">
                  <Text weight="bold" size="base" className="text-slate-900 dark:text-white">
                    System Maintenance
                  </Text>
                  <Text variant="subtext" size="xs" className="mt-1">
                    Scheduled downtime on May 15th, 10:00 PM to 2:00 AM for database optimization.
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="p-4">
              <View className="flex-row gap-x-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                  <Ionicons name="information-circle" size={24} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text weight="bold" size="base" className="text-slate-900 dark:text-white">
                    New Policy Guidelines
                  </Text>
                  <Text variant="subtext" size="xs" className="mt-1">
                    The 2026 administrative guidelines have been published and are available in
                    Documents.
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Status Summary */}
        <View className="mt-8 px-4 pb-12">
          <Text variant="heading" size="lg" className="mb-4 px-1 text-slate-900 dark:text-white">
            Institution Status
          </Text>
          <View className="flex-row flex-wrap gap-4">
            <StatusMetric label="Staff Active" value="94%" color="text-emerald-600" />
            <StatusMetric label="Tasks Pending" value="12" color="text-amber-600" />
            <StatusMetric label="Security Rank" value="A+" color="text-indigo-600" />
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const QuickAction = ({
  icon,
  label,
  onPress,
  className,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  className?: string;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="flex-1">
    <View
      className={cn(
        'items-center justify-center rounded-3xl p-4 shadow-lg shadow-slate-200 dark:shadow-none',
        className
      )}>
      <Ionicons name={icon} size={28} color="white" />
      <Text weight="bold" size="xs" className="mt-2 text-center text-white">
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

const StatusMetric = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <Card className="min-w-[100px] flex-1 border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <CardContent className="items-center p-4">
      <Text weight="bold" size="xl" className={color}>
        {value}
      </Text>
      <Text variant="subtext" size="xs" className="mt-1 text-center">
        {label}
      </Text>
    </CardContent>
  </Card>
);

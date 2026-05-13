import React from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMeeting } from '../hooks';
import { LoadingScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import {
  Card,
  CardContent,
  Text,
  Button,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Alert,
} from '@src/shared/components/ui';
import { formattedDate, formattedTime } from '@src/shared/utils/format';
import { cn } from '@lib/cn';
import { logger } from '@src/shared/utils/logger';
import { useMeetingAttendees } from '../hooks/useMeetingAttendees';
import { useMeetingAgenda } from '../hooks/useMeetingAgenda';
import { useUpdateAttendeeRsvp } from '../hooks/use-update-attendee-rsvp';
import { useAuthStore } from '@src/features/auth';
import { useQueryClient } from '@tanstack/react-query';
import { MeetingQueryKeys } from '../utils/constants/query-key';
import { MeetingErrorScreen } from './meeting-error';
import { ErrorBoundary } from '@src/shared/components/common';
import { MeetingInfoCard } from '../components/meeting-info-card';

export const MeetingDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: meeting, isLoading, isError, refetch, isRefetching } = useMeeting(id as string);
  const { data: attendees = [] } = useMeetingAttendees(id as string);
  const { data: agenda = [] } = useMeetingAgenda(id as string);

  const { mutate: updateRsvp, isPending: isUpdatingRsvp } = useUpdateAttendeeRsvp({
    meetingId: id as string,
  });

  const userRsvp = attendees?.find((a) => a.user.id === user?.id);

  const isAccepted = userRsvp?.rsvpStatus === 'ACCEPTED';
  const isDeclined = userRsvp?.rsvpStatus === 'DECLINED';

  const handleRsvp = (status: 'ACCEPTED' | 'DECLINED') => {
    updateRsvp(
      { rsvpStatus: status, userId: user?.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: MeetingQueryKeys.attendees(id as string) });
        },
      }
    );
  };

  if (isLoading) return <LoadingScreen message="Loading meeting details..." />;

  if (isError || !meeting) return <MeetingErrorScreen refetch={refetch} />;

  const date = new Date(meeting?.scheduledAt);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Meeting: ${meeting.title}\nDate: ${formattedDate(date)}\nTime: ${formattedTime(date)}\nVenue: ${meeting.venue || 'N/A'}`,
      });
    } catch (error) {
      logger.error('Error sharing meeting', { error });
    }
  };

  return (
    <ErrorBoundary componentName="MeetingDetailScreen">
      <Container>
        <StackHeader
          showBackButton
          title="Meeting Details"
          rightAction={
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => router.push(`/meetings/${id}/minutes`)}
                className="mr-4">
                <Ionicons name="document-text-outline" size={22} color="#4f46e5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} className="mr-2">
                <Ionicons name="share-outline" size={22} color="#4f46e5" />
              </TouchableOpacity>
            </View>
          }
        />
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
                  {meeting.type}
                </Text>
              </View>
              <View
                className={cn(
                  'rounded-full px-2 py-0.5',
                  meeting.status === 'SCHEDULED'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20'
                    : 'bg-blue-50 dark:bg-blue-950/20'
                )}>
                <Text
                  size="xs"
                  weight="medium"
                  className={cn(
                    'text-[10px]',
                    meeting.status === 'SCHEDULED'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-blue-700 dark:text-blue-400'
                  )}>
                  {meeting.status}
                </Text>
              </View>
            </View>

            <Text variant="heading" size="3xl" className="text-slate-900 dark:text-white">
              {meeting.title}
            </Text>

            {meeting.description && (
              <Text variant="subtext" size="sm" className="mt-3 leading-relaxed">
                {meeting.description}
              </Text>
            )}
          </View>

          {/* Quick Info Grid */}
          <View className="flex-1 flex-row flex-wrap gap-4 px-4">
            <MeetingInfoCard
              icon="calendar"
              label="Date"
              value={formattedDate(date)}
              className="min-w-[45%] flex-1"
            />
            <MeetingInfoCard
              icon="time"
              label="Time"
              value={formattedTime(date)}
              className="min-w-[45%] flex-1"
            />
            <MeetingInfoCard
              icon="location"
              label="Location"
              value={meeting.venue || 'To be announced'}
              className="w-[45%]"
            />
          </View>

          {/* Agenda Section */}
          {agenda && agenda.length > 0 && (
            <View className="mt-8 px-4">
              <Text
                variant="heading"
                size="lg"
                className="mb-4 px-1 text-slate-900 dark:text-white">
                Order of Business
              </Text>
              <Card className="border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-0">
                  {agenda?.map((item, index) => (
                    <View
                      key={index}
                      className={cn(
                        'flex-1 flex-col gap-x-4 p-4',
                        index !== agenda.length - 1 &&
                          'border-b border-slate-50 dark:border-slate-800'
                      )}>
                      <View className="flex-row">
                        <View className="h-6 w-6 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                          <Text size="xs" weight="bold" className="text-slate-400">
                            {index + 1}
                          </Text>
                        </View>
                        <Text className="flex-1 leading-tight text-slate-700 dark:text-slate-300">
                          {item.title}
                        </Text>
                      </View>
                      <Text className="ml-6 flex-1 leading-tight text-slate-700 dark:text-slate-300">
                        {item.description}
                      </Text>
                    </View>
                  ))}
                </CardContent>
              </Card>
            </View>
          )}

          {/* Personnel Section */}
          <View className="mt-8 px-4">
            <Text variant="heading" size="lg" className="mb-4 px-1 text-slate-900 dark:text-white">
              Attendance
            </Text>
            <Card className="border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Accordion className="px-4">
                <AccordionItem value="attendees">
                  <AccordionTrigger>
                    <Text>Registered Attendees</Text>
                  </AccordionTrigger>
                  <AccordionContent>
                    {attendees?.map((attendee, index) => (
                      <View key={index} className="flex-row items-center justify-between py-2">
                        <View className="flex-row items-center gap-x-3">
                          <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                            <Text size="xs" weight="bold" className="text-slate-400">
                              {index + 1}
                            </Text>
                          </View>
                          <Text className="flex-1 leading-tight text-slate-700 dark:text-slate-300">
                            {attendee.user.name}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-x-3">
                          <Text variant={'heading'}>{attendee.rsvpStatus}</Text>
                        </View>
                      </View>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="organizer" className="border-b-0">
                  <AccordionTrigger>
                    <View className="flex-row items-center gap-x-3">
                      <Ionicons name="ribbon-outline" size={20} color="#6366f1" />
                      <Text weight="medium">Institutional Lead</Text>
                    </View>
                  </AccordionTrigger>
                  <AccordionContent>
                    <View className="flex-row items-center gap-x-3 py-2">
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20">
                        <Text weight="bold" className="text-indigo-600 dark:text-indigo-400">
                          {meeting.createdBy.name?.charAt(0) ||
                            meeting.createdBy.email.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text weight="semibold" size="sm">
                          {meeting.createdBy.name || 'Administrative Office'}
                        </Text>
                        <Text variant="subtext" size="xs">
                          {meeting.createdBy.email}
                        </Text>
                      </View>
                    </View>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </View>

          {/* Action Bar */}
          <View className="mt-10 px-4 pb-12">
            <Alert className="mb-6 border-amber-100 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/10">
              <Ionicons name="warning-outline" size={18} color="#d97706" />
              <View className="ml-2 flex-1">
                <Text size="xs" weight="medium" className="text-amber-800 dark:text-amber-400">
                  Attendance is mandatory for all committee members. Please RSVP by 24h prior.
                </Text>
              </View>
            </Alert>

            <View className="flex-row gap-x-4">
              <Button
                title={
                  attendees?.some((a) => a.user.id === user?.id && a.rsvpStatus !== 'PENDING')
                    ? 'Update RSVP'
                    : 'Confirm Attendance'
                }
                loading={isUpdatingRsvp}
                disabled={isUpdatingRsvp || isAccepted}
                onPress={() => handleRsvp('ACCEPTED')}
                className="h-14 flex-[2] rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none"
              />
              <Button
                title="Unable to Attend"
                variant="outline"
                loading={isUpdatingRsvp}
                disabled={isUpdatingRsvp || isDeclined}
                onPress={() => handleRsvp('DECLINED')}
                className="h-14 flex-1 rounded-2xl"
              />
            </View>
            <View className="mt-8 items-center">
              <Text variant="subtext" size="xs" className="opacity-50">
                Reference ID: {meeting.id.toUpperCase()}
              </Text>
            </View>
          </View>
        </ScrollView>
      </Container>
    </ErrorBoundary>
  );
};

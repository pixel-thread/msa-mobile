import React from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Container } from '@src/shared/components/common/Container';
import { StackHeader } from '@src/shared/components/common/header/stack-header.component';
import { Text } from '@src/shared/components/ui/text';
import { Card, CardContent } from '@src/shared/components/ui/card';
import { useAllDSARRequests, useSlaReport } from '../hooks/use-dsar';
import { DSARStatusBadge } from '../components/DSARStatusBadge';
import { SLAIndicator } from '../components/SLAIndicator';
import { FLASHLIST_ESTIMATED_ITEM_SIZE } from '@src/shared/constants';
import { DSARRequest } from '../types/dsar.types';
import { cn } from '@src/shared/lib/cn';
import { Stack, useRouter } from 'expo-router';

export const AdminDSARDashboardScreen = () => {
  const { data: requests, isLoading: isRequestsLoading } = useAllDSARRequests();
  const { data: slaReport, isLoading: isSlaLoading } = useSlaReport();
  const router = useRouter();

  const renderSLACard = (label: string, count: number, colorClass: string, subtext: string) => (
    <Card className="mx-1 flex-1 border-none shadow-sm">
      <CardContent className="items-center p-4">
        <Text className={cn('text-2xl font-bold', colorClass)}>{count}</Text>
        <Text className="mt-1 text-[10px] font-bold uppercase text-slate-500">{label}</Text>
        <Text className="mt-0.5 text-[9px] text-slate-400">{subtext}</Text>
      </CardContent>
    </Card>
  );

  const renderRequestItem = ({ item }: { item: DSARRequest }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/(protected)/admin/dsar/${item.id}`)}
      className="mx-4 mb-3">
      <Card>
        <CardContent className="p-4">
          <View className="mb-2 flex-row items-start justify-between">
            <View>
              <Text className="font-bold text-slate-900">{item.ticketNumber}</Text>
              <Text className="mt-0.5 text-xs text-slate-500">{item.requestType}</Text>
            </View>
            <DSARStatusBadge status={item.status} />
          </View>

          <View className="mt-2 flex-row items-end justify-between">
            <View>
              <Text className="text-xs text-slate-400">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              <Text className="text-xs text-slate-400">
                User ID: {item.userId.substring(0, 8)}...
              </Text>
            </View>
            <SLAIndicator createdAt={item.createdAt} />
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      <Container className="bg-slate-50">
        <ScrollView className="flex-1" stickyHeaderIndices={[1]}>
          <StackHeader title="DSAR Management" showDrawerButton />
          <View className="flex-row justify-between p-4">
            {isSlaLoading ? (
              <ActivityIndicator size="small" color="#64748b" className="flex-1" />
            ) : (
              <>
                {renderSLACard(
                  'Breached',
                  slaReport?.breached || 0,
                  'text-red-600',
                  'Immediate Action'
                )}
                {renderSLACard('At Risk', slaReport?.atRisk || 0, 'text-orange-500', 'Due Soon')}
                {renderSLACard('On Track', slaReport?.onTrack || 0, 'text-green-600', 'Within SLA')}
              </>
            )}
          </View>

          <View className="border-b border-slate-200 bg-slate-50 px-4 py-2">
            <Text className="text-sm font-bold uppercase tracking-wider text-slate-500">
              All Requests {requests ? `(${requests.length})` : ''}
            </Text>
          </View>

          {isRequestsLoading ? (
            <View className="items-center p-8">
              <ActivityIndicator size="large" color="#0f172a" />
            </View>
          ) : (
            <FlashList
              data={requests}
              renderItem={renderRequestItem}
              keyExtractor={(item) => item.id}
              estimatedItemSize={FLASHLIST_ESTIMATED_ITEM_SIZE.DSAR_REQUEST}
              scrollEnabled={false}
              ListEmptyComponent={
                <View className="items-center p-8">
                  <Text className="text-slate-400">No requests found</Text>
                </View>
              }
              contentContainerStyle={{ paddingVertical: 12 }}
            />
          )}
        </ScrollView>
      </Container>
    </>
  );
};

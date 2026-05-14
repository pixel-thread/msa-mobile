import React from 'react';
import { View, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Container } from '@src/shared/components/common/Container';
import { StackHeader } from '@src/shared/components/common/header/stack-header.component';
import { Text } from '@src/shared/components/ui/text';
import { Card, CardContent } from '@src/shared/components/ui/card';
import { useAllDSARRequests, useSlaReport } from '../hooks/use-dsar';
import { DSARStatusBadge } from '../components/DSARStatusBadge';
import { SLAIndicator } from '../components/SLAIndicator';
import { DSARRequest } from '../types/dsar.types';
import { cn } from '@src/shared/lib/cn';

export const AdminDSARDashboardScreen = () => {
  const { data: requests, isLoading: isRequestsLoading } = useAllDSARRequests();
  const { data: slaReport, isLoading: isSlaLoading } = useSlaReport();

  const renderSLACard = (label: string, count: number, colorClass: string, subtext: string) => (
    <Card className="flex-1 mx-1 border-none shadow-sm">
      <CardContent className="p-4 items-center">
        <Text className={cn('text-2xl font-bold', colorClass)}>{count}</Text>
        <Text className="text-[10px] font-bold uppercase text-slate-500 mt-1">{label}</Text>
        <Text className="text-[9px] text-slate-400 mt-0.5">{subtext}</Text>
      </CardContent>
    </Card>
  );

  const renderRequestItem = ({ item }: { item: DSARRequest }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/(protected)/admin/dsar/${item.id}`)}
      className="mb-3 mx-4"
    >
      <Card>
        <CardContent className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="font-bold text-slate-900">{item.ticketNumber}</Text>
              <Text className="text-xs text-slate-500 mt-0.5">{item.requestType}</Text>
            </View>
            <DSARStatusBadge status={item.status} />
          </View>
          
          <View className="flex-row justify-between items-end mt-2">
            <View>
              <Text className="text-xs text-slate-400">Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
              <Text className="text-xs text-slate-400">User ID: {item.userId.substring(0, 8)}...</Text>
            </View>
            <SLAIndicator createdAt={item.createdAt} />
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  return (
    <Container className="bg-slate-50">
      <StackHeader title="DSAR Management" showDrawerButton />
      
      <ScrollView className="flex-1" stickyHeaderIndices={[1]}>
        <View className="p-4 flex-row justify-between">
          {isSlaLoading ? (
            <ActivityIndicator size="small" color="#64748b" className="flex-1" />
          ) : (
            <>
              {renderSLACard('Breached', slaReport?.breached || 0, 'text-red-600', 'Immediate Action')}
              {renderSLACard('At Risk', slaReport?.atRisk || 0, 'text-orange-500', 'Due Soon')}
              {renderSLACard('On Track', slaReport?.onTrack || 0, 'text-green-600', 'Within SLA')}
            </>
          )}
        </View>

        <View className="px-4 py-2 bg-slate-50 border-b border-slate-200">
          <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            All Requests {requests ? `(${requests.length})` : ''}
          </Text>
        </View>

        {isRequestsLoading ? (
          <View className="p-8 items-center">
            <ActivityIndicator size="large" color="#0f172a" />
          </View>
        ) : (
          <FlatList
            data={requests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View className="p-8 items-center">
                <Text className="text-slate-400">No requests found</Text>
              </View>
            }
            contentContainerStyle={{ paddingVertical: 12 }}
          />
        )}
      </ScrollView>
    </Container>
  );
};

import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

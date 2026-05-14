import React from 'react';
import { FlatList, View, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@src/shared/components/ui/text';
import { Button } from '@src/shared/components/ui/button';
import { Container } from '@src/shared/components/common/Container';
import { StackHeader } from '@src/shared/components/common/header/stack-header.component';
import { useMyDSARRequests } from '../hooks/use-dsar';
import { DSARListItem } from '../components/DSARListItem';

export const MemberDSARListScreen = () => {
  const router = useRouter();
  const { data: requests, isLoading, refetch } = useMyDSARRequests();

  const handleNewRequest = () => {
    router.push('/(protected)/profile/privacy/submit');
  };

  if (isLoading && !requests) {
    return (
      <Container>
        <StackHeader title="Privacy Requests" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <StackHeader
        title="Privacy Requests"
        rightAction={
          <TouchableOpacity onPress={handleNewRequest} className="mr-1 p-2">
            <Ionicons name="add" size={26} color="#1E293B" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DSARListItem request={item} onPress={(req) => {}} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-8 py-20">
            <View className="mb-6 rounded-full bg-slate-100 p-6">
              <Ionicons name="shield-checkmark-outline" size={64} color="#94A3B8" />
            </View>
            <Text weight="bold" size="xl" className="mb-2 text-center text-slate-900">
              No Privacy Requests
            </Text>
            <Text variant="subtext" className="mb-8 text-center text-slate-500">
              You haven&apos;t submitted any data privacy requests yet. You can request access to
              your profile data or payment history anytime.
            </Text>
            <Button title="Submit New Request" onPress={handleNewRequest} className="w-full" />
          </View>
        }
      />
    </Container>
  );
};

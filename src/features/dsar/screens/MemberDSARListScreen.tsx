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
  const { data: requests, isLoading, isError, refetch } = useMyDSARRequests();

  const handleNewRequest = () => {
    router.push('/(protected)/profile/privacy/submit');
  };

  if (isLoading && !requests) {
    return (
      <Container>
        <StackHeader title="Privacy Requests" />
        <View className="flex-1 justify-center items-center">
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
          <TouchableOpacity onPress={handleNewRequest} className="p-2 mr-1">
            <Ionicons name="add" size={26} color="#1E293B" />
          </TouchableOpacity>
        }
      />
      
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DSARListItem 
            request={item} 
            onPress={(req) => {
               // Detail view task (Task 10/11)
            }} 
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20 px-8">
            <View className="bg-slate-100 p-6 rounded-full mb-6">
              <Ionicons name="shield-checkmark-outline" size={64} color="#94A3B8" />
            </View>
            <Text weight="bold" size="xl" className="mb-2 text-center text-slate-900">
              No Privacy Requests
            </Text>
            <Text variant="subtext" className="text-center mb-8 text-slate-500">
              You haven't submitted any data privacy requests yet. You can request access to your profile data or payment history anytime.
            </Text>
            <Button 
              title="Submit New Request" 
              onPress={handleNewRequest}
              className="w-full"
            />
          </View>
        }
      />
    </Container>
  );
};

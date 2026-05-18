import React from 'react';
import { View, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@src/shared/components/ui';
import { useUpdateAdminPaymentProvider, useDeleteAdminPaymentProvider } from '../hooks';
import type { ProviderResponse } from '../types';

interface AdminProviderCardProps {
  provider: ProviderResponse;
}

export const AdminProviderCard: React.FC<AdminProviderCardProps> = ({ provider }) => {
  const updateMutation = useUpdateAdminPaymentProvider({ providerId: provider.id });
  const deleteMutation = useDeleteAdminPaymentProvider();

  const handleToggleActive = async (value: boolean) => {
    await updateMutation.mutateAsync({ isActive: value });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Provider',
      `Are you sure you want to delete ${provider.provider}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMutation.mutateAsync(provider.id);
          },
        },
      ]
    );
  };

  const maskedKeyId = provider.keyId.length > 8
    ? `${provider.keyId.slice(0, 4)}****${provider.keyId.slice(-4)}`
    : provider.keyId;

  return (
    <View className="mb-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text variant="heading" size="lg" weight="semibold" className="text-slate-900 dark:text-white">
              {provider.provider}
            </Text>
            <View
              className={`rounded-full px-2 py-0.5 ${provider.isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
              <Text size="xs" className={provider.isActive ? 'text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}>
                {provider.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          <Text variant="subtext" size="sm" className="mt-1 text-slate-500">
            {maskedKeyId}
          </Text>
        </View>
        <Switch
          value={provider.isActive}
          onValueChange={handleToggleActive}
          disabled={updateMutation.isPending}
          trackColor={{ false: '#e2e8f0', true: '#818cf8' }}
          thumbColor={provider.isActive ? '#4f46e5' : '#f1f5f9'}
        />
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <Text size="xs" className="text-slate-400">
          Updated {new Date(provider.updatedAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          onPress={handleDelete}
          disabled={deleteMutation.isPending}
          className="rounded-lg border border-red-200 px-3 py-2 dark:border-red-800">
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

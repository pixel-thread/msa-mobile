import React from 'react';
import { View } from 'react-native';
import { useAuthStore } from '@src/shared/store/auth.store';
import { Text } from '@src/shared/components/ui';
import { Ionicons } from '@expo/vector-icons';

export const UserProfileHeader = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <View className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-800">
      <View className="flex-row items-center gap-4">
        <View className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 items-center justify-center">
          <Ionicons name="person" size={24} color="#4f46e5" />
        </View>
        <View className="flex-1">
          <Text variant="heading" size="md" className="text-slate-900 dark:text-white">
            {user.name}
          </Text>
          <Text variant="subtext" size="xs" className="text-slate-500">
            {user.email}
          </Text>
          <Text variant="subtext" size="xs" className="mt-1 font-mono text-slate-400">
            ID: {user.id}
          </Text>
        </View>
      </View>
    </View>
  );
};

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@src/shared/store';
import { useSecureTokenStore } from '@src/features/auth/store';
import { Container } from '@src/shared/components/common/Container';
import { StackHeader } from '@src/shared/components/common/stack-header';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { clearAll } = useSecureTokenStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            logout();
            router.replace('/(auth)/sign-in');
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) return null;

  return (
    <Container>
      <StackHeader title="Profile" />
      <ScrollView className="flex-1 bg-gray-50">
        {/* Header Section */}
        <View className="items-center bg-white pb-8 pt-10 shadow-sm">
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-indigo-500">
            <Text className="text-3xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">{user.name}</Text>
          <Text className="mt-1 text-gray-500">{user.email}</Text>
        </View>

        {/* Info Sections */}
        <View className="mt-6 px-4">
          <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-wider text-gray-400">
            Account Information
          </Text>
          <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <InfoRow
              icon="person-outline"
              label="Role"
              value={user.role}
              isFirst
            />
            <InfoRow
              icon="shield-checkmark-outline"
              label="MFA Status"
              value={user.mfaEnabled ? 'Enabled' : 'Disabled'}
            />
            <InfoRow
              icon="id-card-outline"
              label="User ID"
              value={user.id}
              isLast
            />
          </View>
        </View>

        <View className="mt-8 px-4">
          <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-wider text-gray-400">
            Settings
          </Text>
          <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <MenuRow icon="notifications-outline" label="Notifications" isFirst />
            <MenuRow icon="lock-closed-outline" label="Security" />
            <MenuRow icon="help-circle-outline" label="Help & Support" isLast />
          </View>
        </View>

        {/* Logout Button */}
        <View className="mt-10 px-4 pb-10">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-red-50 py-4 active:bg-red-100">
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text className="text-base font-bold text-red-600">Logout</Text>
          </TouchableOpacity>
          <Text className="mt-4 text-center text-xs text-gray-400">Version 1.0.0 (Build 1)</Text>
        </View>
      </ScrollView>
    </Container>
  );
}

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const InfoRow = ({ icon, label, value, isFirst, isLast }: InfoRowProps) => (
  <View
    className={`flex-row items-center justify-between border-gray-50 px-4 py-4 ${
      !isLast ? 'border-b' : ''
    } ${isFirst ? 'pt-5' : ''} ${isLast ? 'pb-5' : ''}`}>
    <View className="flex-row items-center gap-3">
      <Ionicons name={icon} size={20} color="#6366f1" />
      <Text className="text-sm font-medium text-gray-700">{label}</Text>
    </View>
    <Text className="text-sm font-semibold text-gray-900">{value}</Text>
  </View>
);

interface MenuRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const MenuRow = ({ icon, label, isFirst, isLast }: MenuRowProps) => (
  <TouchableOpacity
    className={`flex-row items-center justify-between border-gray-50 px-4 py-4 active:bg-gray-50 ${
      !isLast ? 'border-b' : ''
    } ${isFirst ? 'pt-5' : ''} ${isLast ? 'pb-5' : ''}`}>
    <View className="flex-row items-center gap-3">
      <View className="h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
        <Ionicons name={icon} size={18} color="#6366f1" />
      </View>
      <Text className="text-sm font-medium text-gray-700">{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
  </TouchableOpacity>
);

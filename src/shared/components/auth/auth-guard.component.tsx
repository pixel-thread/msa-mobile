import { useEffect, useState } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';

import { useAuthStore } from '@features/auth/store';

interface AuthGuardProps {
  children: React.ReactNode;
  publicRoutes?: string[];
}

export const AuthGuard = ({ children, publicRoutes = [] }: AuthGuardProps) => {
  const router = useRouter();
  const segments = useSegments();
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    const currentPath = '/' + segments.join('/');
    const isPublicRoute = publicRoutes.some((route) => currentPath.startsWith(route));

    if (isPublicRoute && isAuthenticated && user) {
      router.replace('/(protected)/(tabs)');
    } else if (!isPublicRoute && !isAuthenticated && !user) {
      router.replace('/(auth)/login');
    } else {
      setChecked(true);
    }
  }, [isHydrated, isAuthenticated, user, segments, publicRoutes, router]);

  if (!checked || !isHydrated) {
    return (
      <View className="flex flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="mt-4 text-gray-500">Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

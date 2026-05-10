import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Route, useRouter, useSegments } from 'expo-router';

import { useAuthStore } from '@features/auth/store';

interface AuthGuardProps {
  children: React.ReactNode;
  publicRoutes?: Route[];
}

const publicAuthRoutes: Route[] = ['/(auth)/login', '/(auth)/mfa-verify', '/(auth)/signup'];

export const AuthGuard = ({ children, publicRoutes = publicAuthRoutes }: AuthGuardProps) => {
  const router = useRouter();
  const segments = useSegments();

  const { isAuthenticated, isHydrated } = useAuthStore();

  const currentPath = '/' + segments.join('/');

  const isPublicRoute = publicRoutes.includes(currentPath as Route);

  useEffect(() => {
    if (!isHydrated) return;

    // User NOT authenticated -> block protected routes
    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/(auth)/login');
      return;
    }

    // User authenticated -> block auth pages
    if (isAuthenticated && isPublicRoute) {
      router.replace('/');
    }
  }, [isHydrated, isAuthenticated, isPublicRoute, router]);

  // Wait for persisted auth state
  if (!isHydrated) {
    return (
      <View className="flex flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="mt-4 text-gray-500">Loading...</Text>
      </View>
    );
  }

  // Prevent flash while redirecting
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  if (isAuthenticated && isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};

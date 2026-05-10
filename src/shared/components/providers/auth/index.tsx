import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { useAuthStore, useSecureTokenStore } from '@features/auth/store';
import http from '@src/shared/utils/http';
import type { AuthUser } from '@features/auth/types';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { setUser, logout, setHydrated, isHydrated } = useAuthStore();
  const { init: initTokens, accessToken, refreshToken, clearAll } = useSecureTokenStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      await initTokens();
      if (mounted) {
        setHydrated(true);
        setIsReady(true);
      }
    };

    bootstrap();
    return () => {
      mounted = false;
    };
  }, [initTokens, setHydrated]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => http.get<AuthUser>('/auth/me'),
    enabled: isReady && !!accessToken && !!refreshToken,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isReady) return;

    if (data?.success && data.data) {
      setUser(data.data);
    } else if (isError || (!isLoading && data && !data.success)) {
      logout();
      clearAll();
      router.replace('/auth/login');
    }
  }, [data, isError, isLoading, isReady, setUser, logout, clearAll, router]);

  if (!isReady || !isHydrated) {
    return (
      <View className="flex flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="mt-4 text-gray-500">Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

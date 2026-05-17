import { useEffect, useState } from 'react';
import * as Network from 'expo-network';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@src/shared/store';
import { useSecureTokenStore } from '@features/auth/store';
import http from '@src/shared/utils/http';
import type { AuthUser } from '@features/auth/types';
import { isConnectedToNetwork } from '@src/shared/utils/helper/is-connect-to-network';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { setUser, logout, setHydrated } = useAuthStore();
  const { init: initTokens, accessToken, refreshToken, clearAll } = useSecureTokenStore();
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

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

  const { data, isFetched } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => http.get<AuthUser>('/auth/me'),
    enabled: isReady && !!accessToken && !!refreshToken,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    networkMode: 'offlineFirst',
  });

  useEffect(() => {
    async function checkConnection() {
      const connected = await isConnectedToNetwork();
      setIsConnected(connected);
    }

    checkConnection();

    const subscription = Network.addNetworkStateListener((state) => {
      setIsConnected(Boolean(state.isConnected && state.isInternetReachable));
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isReady || !isConnected) return;

    if (data?.success) {
      setUser(data.data);
    } else if (!data?.success && isFetched) {
      logout();
      router.replace('/(auth)/sign-in');
    }
  }, [data, isFetched, isConnected, isReady, setUser, logout, clearAll, router]);

  return <>{children}</>;
};

import { useEffect, useState } from 'react';
import { useSegments, useRouter, Route } from 'expo-router';

import { useAuthStore } from '@src/shared/store';
import { LoadingScreen } from '../screens';

interface AuthGuardProps {
  children: React.ReactNode;
  publicRoutes?: Route[];
}
const authRoutes: Route[] = ['/(auth)/sign-in', '/(auth)/sign-in-verify', '/(auth)/sign-up'];

export const AuthGuard = ({ children, publicRoutes = authRoutes }: AuthGuardProps) => {
  const router = useRouter();
  const segments = useSegments();
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    const currentPath = '/' + segments.join('/');
    const isPublicRoute = publicRoutes.some((route) => currentPath.startsWith(route));

    if (isPublicRoute && isAuthenticated && user) {
      router.replace('/(protected)/(drawer)/(tabs)');
    } else if (!isPublicRoute && !isAuthenticated && !user) {
      router.replace('/(auth)/sign-in');
    } else {
      setChecked(true);
    }
  }, [isHydrated, isAuthenticated, user, segments, publicRoutes, router]);

  if (!checked || !isHydrated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

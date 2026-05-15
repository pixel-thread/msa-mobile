import { useEffect } from 'react';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@src/shared/store';
import { hasHighRoleAccess } from '@src/features/meetings';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const hasRole = hasHighRoleAccess(user?.role);

  useEffect(() => {
    if (!hasRole) {
      router.push('/');
    }
  }, [router, hasRole]);

  return <>{children}</>;
};

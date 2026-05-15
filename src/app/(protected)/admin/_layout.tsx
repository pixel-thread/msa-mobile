import { AdminAuthGuard } from '@src/shared/components/auth/admin-auth-guard';
import { Stack } from 'expo-router';

export default function layout() {
  return (
    <AdminAuthGuard>
      <Stack screenOptions={{ headerShown: false }} />
    </AdminAuthGuard>
  );
}

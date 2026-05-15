import { Stack } from 'expo-router';
import { AuthGuard } from '@src/shared/components/auth';

export default function AuthLayout() {
  return (
    <AuthGuard
      publicRoutes={[
        '/(auth)/sign-in',
        '/(auth)/sign-up',
        '/(auth)/sign-in-verify',
        '/(auth)/forgot-password',
      ]}>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthGuard>
  );
}

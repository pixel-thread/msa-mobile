import { Stack } from 'expo-router';
import { AuthGuard } from '@src/shared/components/auth';

export default function AuthLayout() {
  return (
    <AuthGuard publicRoutes={['/(auth)/login', '/(auth)/signup', '/(auth)/mfa-verify']}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="mfa-verify" />
      </Stack>
    </AuthGuard>
  );
}

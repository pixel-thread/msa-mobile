import { Stack } from 'expo-router';
import { AuthGuard } from '@src/shared/components/auth';

export default function AuthLayout() {
  return (
    <AuthGuard publicRoutes={['/(auth)/sign-in', '/(auth)/sign-up', '/(auth)/sign-in-verify']}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="sign-in-verify" />
      </Stack>
    </AuthGuard>
  );
}

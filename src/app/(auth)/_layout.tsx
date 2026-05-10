import { Stack } from 'expo-router';
import { AuthGuard } from '@components/auth';

export default function AuthLayout() {
  return (
    <AuthGuard>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthGuard>
  );
}

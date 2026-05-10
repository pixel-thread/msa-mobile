import { Stack } from 'expo-router';
import { AuthProvider } from './auth';

export const AppProviders = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
};

import { Stack } from 'expo-router';
import { AuthProvider } from './auth';
import { Toaster } from 'sonner-native';

export const AppProviders = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toaster />
    </AuthProvider>
  );
};

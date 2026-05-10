import '@src/shared/styles/global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProviders } from '@components/providers';
import { Toaster } from 'sonner-native';
import React from 'react';

export const unstable_settings = {
  initialRouteName: '(drawer)',
};

const queryClient = new QueryClient();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  return (
    <>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <AppProviders />
          </QueryClientProvider>
          <Toaster />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </>
  );
}

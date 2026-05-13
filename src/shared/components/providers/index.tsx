import { Stack } from 'expo-router';
import { AuthProvider } from './auth';
import React from 'react';
import { AuthGuard } from '../auth';
import { NotificationProvider, PushNotificationProvider } from './notifications';
import { ThemeProvider } from './theme.provider';

export * from './auth';
export * from './notifications';
export * from './theme.provider';

export const AppProviders = () => {
  return (
    <React.Fragment>
      <ThemeProvider>
        <PushNotificationProvider>
          <AuthProvider>
            <AuthGuard>
              <NotificationProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </NotificationProvider>
            </AuthGuard>
          </AuthProvider>
        </PushNotificationProvider>
      </ThemeProvider>
    </React.Fragment>
  );
};

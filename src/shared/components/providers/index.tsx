import { Stack } from 'expo-router';
import { AuthProvider } from './auth';
import React from 'react';
import { AuthGuard } from '../auth';
import { NotificationProvider } from './notifications';

export * from './auth';
export * from './notifications';

export const AppProviders = () => {
  return (
    <React.Fragment>
      <AuthProvider>
        <AuthGuard>
          <NotificationProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </NotificationProvider>
        </AuthGuard>
      </AuthProvider>
    </React.Fragment>
  );
};

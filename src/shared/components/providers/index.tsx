import { Stack } from 'expo-router';
import { AuthProvider } from './auth';
import React from 'react';
import { AuthGuard } from '../auth';

export * from './auth';

export const AppProviders = () => {
  return (
    <React.Fragment>
      <AuthProvider>
        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthGuard>
      </AuthProvider>
    </React.Fragment>
  );
};

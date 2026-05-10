import { Stack } from 'expo-router';
import { AuthProvider } from './auth';
import React from 'react';

export * from './auth';

export const AppProviders = () => {
  return (
    <React.Fragment>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </React.Fragment>
  );
};

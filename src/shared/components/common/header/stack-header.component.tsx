import React from 'react';
import { Stack } from 'expo-router';
import { Appearance } from 'react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';

export interface StackHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  showDrawerButton?: boolean;
}

/**
 * StackHeader: A wrapper for Expo Router's Stack.Screen options.
 * Matches the visual design of the standalone Header component.
 */
export const StackHeader = ({
  title,
  rightAction,
  showBackButton = true,
  showDrawerButton = false,
}: StackHeaderProps) => {
  const isDark = Appearance.getColorScheme() === 'dark';

  return (
    <Stack.Screen
      options={{
        headerTitle: title,
        headerShown: true,
        headerShadowVisible: false,
        headerBackVisible: showDrawerButton ? false : showBackButton,
        headerStyle: {
          backgroundColor: isDark ? '#020617' : '#f8fafc',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
          color: isDark ? '#f8fafc' : '#0f172a',
        },
        headerTintColor: isDark ? '#f8fafc' : '#0f172a',
        headerRight: rightAction ? () => rightAction : undefined,
        headerLeft: showDrawerButton ? () => <DrawerToggleButton /> : undefined,
      }}
    />
  );
};

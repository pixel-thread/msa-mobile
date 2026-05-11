import React from 'react';
import { Stack, useNavigation } from 'expo-router';
import { Appearance, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { logger } from '@src/shared/utils/logger';

export interface StackHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  showDrawerButton?: boolean;
}

/**
 * Custom Drawer toggle button that targets the parent navigator explicitly.
 * This avoids the "Is your screen inside a Drawer navigator?" warning.
 */
const CustomDrawerToggleButton = ({ tintColor }: { tintColor?: string }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="ml-2 p-2"
      accessibilityRole="button"
      accessibilityLabel="Open drawer">
      <Ionicons name="menu" size={24} color={tintColor || '#64748b'} />
    </TouchableOpacity>
  );
};

/**
 * StackHeader: A wrapper for Expo Router's Screen options.
 * Targets the immediate navigator (Stack, Tabs, or Drawer) to avoid context issues.
 * Follows the proper pattern for defining headers in nested layouts.
 */
export const StackHeader = ({
  title,
  rightAction,
  showBackButton = true,
  showDrawerButton = false,
}: StackHeaderProps) => {
  const isDark = Appearance.getColorScheme() === 'dark';
  const navigation = useNavigation();

  // Check if we are nested within a Drawer navigator
  const hasDrawer = React.useMemo(() => {
    let current = navigation;
    while (current) {
      if (current.getState()?.type === 'drawer') return true;
      try {
        current = current.getParent();
      } catch (e) {
        logger.error('Could not get parent navigator', { error: e });
        break;
      }
    }
    return false;
  }, [navigation]);

  const ableToGoBack = navigation.canGoBack();

  const headerTintColor = isDark ? '#f8fafc' : '#0f172a';

  return (
    <Stack.Screen
      options={{
        headerTitle: title,
        headerShown: true,
        headerShadowVisible: false,
        headerBackVisible: showDrawerButton ? false : showBackButton ? ableToGoBack : false,
        headerStyle: {
          backgroundColor: isDark ? '#020617' : '#f8fafc',
        },
        contentStyle: {
          borderBlockColor: '#000',
          borderBottomWidth: 2,
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
          color: headerTintColor,
        },
        headerTintColor: headerTintColor,
        headerRight: rightAction ? () => rightAction : undefined,
        headerLeft:
          showDrawerButton && hasDrawer
            ? () => <CustomDrawerToggleButton tintColor={headerTintColor} />
            : undefined,
      }}
    />
  );
};

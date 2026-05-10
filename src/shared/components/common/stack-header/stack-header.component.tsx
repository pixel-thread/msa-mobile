import { Stack } from 'expo-router';
import { Appearance } from 'react-native';

interface StackHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

export const StackHeader = ({ title, rightAction, showBackButton = true }: StackHeaderProps) => {
  const isDark = Appearance.getColorScheme() === 'dark';

  return (
    <Stack.Screen
      options={{
        headerTitle: title,
        headerShown: true,
        headerShadowVisible: false,
        headerBackVisible: showBackButton,
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
      }}
    />
  );
};

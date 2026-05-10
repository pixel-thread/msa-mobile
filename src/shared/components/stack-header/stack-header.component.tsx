import { Stack } from 'expo-router';

interface StackHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const StackHeader = ({ title, rightAction }: StackHeaderProps) => {
  return (
    <Stack.Screen
      options={{
        headerTitle: title,
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerRight: rightAction ? () => rightAction : undefined,
      }}
    />
  );
};

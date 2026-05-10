import { Stack, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface StackHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const StackHeader = ({ title, showBack = false, onBack, rightAction }: StackHeaderProps) => {
  return (
    <Stack.Screen
      options={{
        headerTitle: title,
        headerShown: true,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerLeft: showBack
          ? () => (
              <Link
                href={onBack ? '#' : '/(protected)'}
                onPress={onBack ? onBack : undefined}
                className="ml-2">
                <Ionicons name="arrow-back" size={24} color="#000" />
              </Link>
            )
          : undefined,
        headerRight: rightAction ? () => rightAction : undefined,
      }}
    />
  );
};

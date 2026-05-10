import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

/**
 * A full-screen centered loading indicator component.
 *
 * @param message - Optional message to display below the spinner.
 */
export const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="items-center gap-4">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-sm font-medium text-gray-500">{message}</Text>
      </View>
    </View>
  );
};

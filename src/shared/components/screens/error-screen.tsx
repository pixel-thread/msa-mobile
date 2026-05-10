import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

/**
 * A full-screen error indicator component with a retry option.
 *
 * @param title - The main error heading.
 * @param message - Detailed error message.
 * @param onRetry - Callback function for the retry button.
 * @param retryText - Label for the retry button.
 */
export const ErrorScreen = ({
  title = 'Something went wrong',
  message = 'There was an error processing your request. Please try again.',
  onRetry,
  retryText = 'Retry',
}: ErrorScreenProps) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-6">
      <View className="items-center">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="mt-6 text-center text-xl font-bold text-gray-900">{title}</Text>
        <Text className="mt-2 text-center text-sm leading-5 text-gray-500">{message}</Text>

        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="mt-8 rounded-2xl bg-indigo-500 px-10 py-4 shadow-sm active:opacity-90">
            <Text className="text-base font-bold text-white">{retryText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

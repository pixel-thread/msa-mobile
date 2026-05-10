import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Text } from './text';
import { cn } from '@lib/cn';

interface SearchInputProps extends TextInputProps {
  containerClassName?: string;
}

export const SearchInput = ({ containerClassName, ...props }: SearchInputProps) => (
  <View
    className={cn(
      'flex-row items-center rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800',
      containerClassName
    )}>
    <Text className="mr-2 text-gray-400">🔍</Text>
    <TextInput
      className="flex-1 text-base text-gray-900 dark:text-white"
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  </View>
);

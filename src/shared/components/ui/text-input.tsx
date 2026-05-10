import { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
} from 'react-native';
import { Text } from './text';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, error, value, onChangeText, className, ...props }, ref) => {
    return (
      <View className="flex gap-1">
        {label && (
          <Text variant="label" className="mb-1">
            {label}
          </Text>
        )}
        <RNTextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          className={`rounded-lg border border-gray-300 bg-white px-4 py-3 ${
            error ? 'border-red-500' : ''
          } ${className ?? ''}`}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {error && (
          <Text variant="error" size="xs" className="mt-1">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

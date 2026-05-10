import { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  Text,
} from 'react-native';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, error, value, onChangeText, className, ...props }, ref) => {
    return (
      <View className="flex gap-1">
        {label && <Text className="text-sm font-medium text-gray-700">{label}</Text>}
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
        {error && <Text className="text-xs text-red-500">{error}</Text>}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { cn } from '@lib/cn';

interface InputProps extends TextInputProps {
  className?: string;
  error?: boolean;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 text-base text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white',
          'focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800', // Focus states
          error && 'border-red-500 bg-red-50/10 focus:border-red-500 dark:bg-red-900/10',
          className
        )}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };

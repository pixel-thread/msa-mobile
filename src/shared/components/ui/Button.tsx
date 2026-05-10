import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  type TouchableOpacityProps,
  type View,
} from 'react-native';

import { Text } from './text';
import { cn } from '@lib/cn';

const buttonVariants = cva('flex items-center justify-center rounded-md disabled:opacity-50', {
  variants: {
    variant: {
      default: 'bg-primary shadow-md',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive',
      outline: 'border border-input bg-background',
      ghost: 'bg-transparent',
      link: 'bg-transparent',
    },
    size: {
      default: 'h-14 px-4 py-2',
      sm: 'h-10 px-3',
      lg: 'h-16 px-8',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const textVariants = {
  default: 'text-sm font-medium text-primary-foreground',
  secondary: 'text-sm font-medium text-secondary-foreground',
  destructive: 'text-sm font-medium text-destructive-foreground',
  outline: 'text-sm font-medium text-foreground',
  ghost: 'text-sm font-medium text-foreground',
  link: 'text-sm font-medium text-primary underline',
};

const activityIndicatorColors = {
  default: '#FFFFFF',
  secondary: '#363636',
  destructive: '#FFFFFF',
  outline: '#000000',
  ghost: '#000000',
  link: '#0055d4',
};

export interface ButtonProps extends TouchableOpacityProps, VariantProps<typeof buttonVariants> {
  title?: string;
  loading?: boolean;
}

export const Button = forwardRef<View, ButtonProps>(
  (
    { className, variant = 'default', size = 'default', title, loading, children, ...props },
    ref
  ) => {
    const isDisabled = props.disabled || loading;

    return (
      <TouchableOpacity
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        {...props}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={
              activityIndicatorColors[variant as keyof typeof activityIndicatorColors] ||
              activityIndicatorColors.default
            }
          />
        ) : title ? (
          <Text
            className={cn(
              textVariants[variant as keyof typeof textVariants] || textVariants.default
            )}>
            {title}
          </Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

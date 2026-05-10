import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@lib/cn';

const textVariants = cva('text-slate-900 dark:text-slate-50', {
  variants: {
    variant: {
      default: 'text-base',
      heading: 'font-bold',
      subtext: 'text-slate-500 dark:text-slate-400',
      error: 'text-red-500 dark:text-red-400',
      link: 'text-blue-600 dark:text-blue-400',
      label: 'text-sm font-medium text-slate-700 dark:text-slate-300',
    },
    size: {
      default: 'text-base',
      xs: 'text-xs',
      sm: 'text-sm',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
    weight: {
      default: 'font-normal',
      light: 'font-light',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    weight: 'default',
  },
});

export interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {
  className?: string;
}

const Text = React.forwardRef<RNText, TextProps>(
  ({ className, variant, size, weight, ...props }, ref) => {
    return (
      <RNText
        className={cn(textVariants({ variant, size, weight, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text, textVariants };

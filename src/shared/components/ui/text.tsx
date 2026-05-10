import * as React from 'react';

import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@lib/cn';

const textVariants = cva('text-foreground font-sans', {
  variants: {
    variant: {
      hero: ['text-[80px]', 'leading-[84px]', 'tracking-[-0.8px]', 'font-semibold'],

      heading: ['text-[56px]', 'leading-[58px]', 'font-semibold'],

      subheading: ['text-[32px]', 'leading-[42px]', 'font-medium'],

      title: ['text-2xl', 'leading-[31px]', 'font-semibold'],

      bodyLg: ['text-[20px]', 'leading-[30px]', 'font-normal'],

      body: ['text-base', 'leading-[26px]', 'tracking-[-0.16px]', 'font-normal'],

      button: ['text-base', 'leading-[26px]', 'tracking-[-0.16px]', 'font-medium'],

      label: ['text-[15px]', 'leading-[20px]', 'tracking-[1.5px]', 'uppercase', 'font-medium'],

      caption: ['text-sm', 'leading-6', 'font-normal'],

      badge: ['text-[12.8px]', 'leading-[15px]', 'uppercase', 'font-semibold'],

      micro: ['text-[10px]', 'leading-[13px]', 'tracking-[1px]', 'uppercase', 'font-semibold'],

      code: ['font-mono', 'text-sm', 'leading-6'],
    },

    color: {
      default: 'text-foreground',

      muted: 'text-gray-700',

      subtle: 'text-gray-300',

      primary: 'text-primary',

      purple: 'text-secondary-purple',

      pink: 'text-secondary-pink',

      green: 'text-secondary-green',

      orange: 'text-secondary-orange',

      yellow: 'text-secondary-yellow',

      red: 'text-secondary-red',

      white: 'text-white',
    },

    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },

  defaultVariants: {
    variant: 'body',
    color: 'default',
    align: 'left',
  },
});

export interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {
  className?: string;
}

export function Text({ variant, color, align, className, children, ...props }: TextProps) {
  return (
    <RNText
      className={cn(
        textVariants({
          variant,
          color,
          align,
        }),
        className
      )}
      {...props}>
      {children}
    </RNText>
  );
}

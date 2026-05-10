import React from 'react';
import { Toaster as SonnerToaster, toast as originalToast } from 'sonner-native';
import { Appearance, Platform } from 'react-native';
import { cssInterop } from 'nativewind';
import { truncateText } from '@src/shared/utils/text';

/**
 * Configure sonner-native to be tailwind-aware in v4
 */
cssInterop(SonnerToaster, {
  className: 'style',
});

/**
 * A custom shadcn/ui inspired Toaster component.
 * Wraps sonner-native and applies project-wide design tokens.
 */
export const Toaster = () => {
  // Resolve actual theme color scheme for sonner-native's internal logic
  const isDark = Appearance.getColorScheme() === 'dark';

  return (
    <SonnerToaster
      position="top-center"
      theme={isDark ? 'dark' : 'light'}
      richColors={true}
      toastOptions={{
        style: {
          borderRadius: 24,
          padding: 16,
          backgroundColor: isDark ? '#020617' : '#FFFFFF',
          borderWidth: 1,
          borderColor: isDark ? '#1e293b' : '#e2e8f0',
          ...Platform.select({
            android: {
              elevation: 100,
              zIndex: 1000,
            },
            ios: {
              zIndex: 9999,
            },
          }),
        },
        titleStyle: {
          fontSize: 14,
          fontWeight: '600',
          color: isDark ? '#f8fafc' : '#0f172a',
        },
        descriptionStyle: {
          fontSize: 12,
          color: isDark ? '#94a3b8' : '#64748b',
        },
      }}
    />
  );
};

/**
 * Proxy toast calls to apply global truncation
 */
export const toast = Object.assign(
  (message: string, options?: any) => {
    const description = options?.description
      ? truncateText({ text: options.description, maxLength: 120 })
      : undefined;
    return originalToast(message, { ...options, description });
  },
  {
    success: (message: string, options?: any) => {
      const description = options?.description
        ? truncateText({ text: options.description, maxLength: 120 })
        : undefined;
      return originalToast.success(message, { ...options, description });
    },
    error: (message: string, options?: any) => {
      const description = options?.description
        ? truncateText({ text: options.description, maxLength: 120 })
        : undefined;
      return originalToast.error(message, { ...options, description });
    },
    info: (message: string, options?: any) => {
      const description = options?.description
        ? truncateText({ text: options.description, maxLength: 120 })
        : undefined;
      return originalToast.info(message, { ...options, description });
    },
    warning: (message: string, options?: any) => {
      const description = options?.description
        ? truncateText({ text: options.description, maxLength: 120 })
        : undefined;
      return originalToast.warning(message, { ...options, description });
    },
  }
);

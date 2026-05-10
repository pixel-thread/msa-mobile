import React from 'react';
import { View, TouchableOpacity, Appearance } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../ui/text';
import { cn } from '@lib/cn';
import { useRouter } from 'expo-router';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
  transparent?: boolean;
}

/**
 * BaseHeader: A standalone UI header component for use outside of navigation stacks.
 * Follows a modern, minimalistic government-app aesthetic.
 */
export const Header = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
  className,
  transparent = false,
}: HeaderProps) => {
  const router = useRouter();
  const isDark = Appearance.getColorScheme() === 'dark';

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      className={cn(
        'flex-row items-center justify-between px-4 py-3',
        !transparent && 'bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900',
        className
      )}>
      <View className="flex-row items-center flex-1">
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <Ionicons
              name="chevron-back"
              size={20}
              color={isDark ? '#f8fafc' : '#0f172a'}
            />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text variant="heading" size="lg" className="text-slate-900 dark:text-white leading-tight">
            {title}
          </Text>
          {subtitle && (
            <Text variant="subtext" size="xs" className="mt-0.5 font-medium opacity-70">
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightAction && (
        <View className="ml-3">
          {rightAction}
        </View>
      )}
    </View>
  );
};

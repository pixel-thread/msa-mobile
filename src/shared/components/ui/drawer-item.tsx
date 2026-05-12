import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './text';
import { cn } from '@lib/cn';

interface DrawerItemProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  focused?: boolean;
  onPress: () => void;
  variant?: 'default' | 'destructive';
}

export const DrawerItem = ({ label, icon, focused, onPress, variant = 'default' }: DrawerItemProps) => {
  const isDestructive = variant === 'destructive';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={cn(
        'flex-row items-center px-6 py-3.5 mb-1 mx-2 rounded-xl transition-all',
        focused && 'bg-indigo-50 dark:bg-slate-900 border-l-4 border-indigo-600',
        !focused && 'hover:bg-slate-50 dark:hover:bg-slate-900'
      )}
    >
      <Ionicons 
        name={icon} 
        size={22} 
        color={isDestructive ? '#ef4444' : focused ? '#4f46e5' : '#64748b'} 
      />
      <Text
        className={cn(
          'ml-3 font-semibold',
          isDestructive ? 'text-red-500' : focused ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400'
        )}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, Text } from '@src/shared/components/ui';
import { cn } from '@src/shared/lib/cn';

interface MemberInfoCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  className?: string;
}

export const MemberInfoCard = ({ icon, label, value, className }: MemberInfoCardProps) => {
  return (
    <Card className={cn('border-slate-100 shadow-sm dark:border-slate-800', className)}>
      <CardContent className="p-4">
        <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20">
          <Ionicons name={icon} size={16} color="#6366f1" />
        </View>
        <Text variant="subtext" size="xs" className="mb-1">
          {label}
        </Text>
        <Text weight="medium" size="sm" className="text-slate-900 dark:text-white" numberOfLines={2}>
          {value}
        </Text>
      </CardContent>
    </Card>
  );
};

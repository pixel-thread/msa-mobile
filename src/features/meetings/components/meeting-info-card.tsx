import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, Text } from '@src/shared/components/ui';
import { cn } from '@src/shared/lib/cn';
import { View } from 'react-native';

export const MeetingInfoCard = ({
  icon,
  label,
  value,
  className,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  className?: string;
}) => (
  <Card
    className={cn(
      'border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
      className
    )}>
    <CardContent className="flex-row items-center justify-center gap-x-3 p-4">
      <View className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
        <Ionicons name={icon} size={20} color="#64748b" />
      </View>
      <View className="flex-1">
        <Text variant="label" size="xs" className="uppercase tracking-widest text-slate-400">
          {label}
        </Text>
        <Text weight="bold" size="sm" className="mt-0.5 text-slate-900 dark:text-white">
          {value}
        </Text>
      </View>
    </CardContent>
  </Card>
);

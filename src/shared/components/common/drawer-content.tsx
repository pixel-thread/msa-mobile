import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuthStore } from '@src/features/auth';
import { useRouter, useSegments } from 'expo-router';
import { Container } from './Container';
import { ScrollView, View } from 'react-native';
import { Text } from '@components/ui';
import { DrawerItem } from '../ui/drawer-item';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@src/shared/lib/cn';

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const router = useRouter();
  const segments = useSegments();
  const logout = useAuthStore((state) => state.logout);
  const inset = useSafeAreaInsets();

  // Active route detection
  const currentPath = segments.join('/');

  return (
    <Container className={cn('flex-1', inset.top > 0 && 'pb-0')}>
      {/* Header */}
      <View className="border-b border-slate-100 px-6 py-8 dark:border-slate-900">
        <Text className="text-2xl font-black tracking-tighter text-indigo-600">MFSA</Text>
        <Text
          variant="subtext"
          size="xs"
          className="font-bold uppercase tracking-widest opacity-60">
          Association App
        </Text>
      </View>

      <ScrollView className="flex-1 py-4">
        {/* Main Menu Group */}
        <View className="mb-6">
          <Text className="mb-1 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Main Menu
          </Text>
          <DrawerItem
            label="Meetings"
            icon="calendar"
            focused={currentPath.includes('meetings')}
            onPress={() => router.push('/(protected)/(drawer)/(tabs)/meetings')}
          />
          <DrawerItem
            label="Members"
            icon="people"
            focused={currentPath.includes('members')}
            onPress={() => router.push('/(protected)/members')}
          />
        </View>

        {/* Account Group */}
        <View className="mb-6">
          <Text className="mb-1 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Account
          </Text>
          <DrawerItem
            label="My Profile"
            icon="person"
            focused={currentPath.includes('profile')}
            onPress={() => router.push('/(protected)/(drawer)/(tabs)/profile')}
          />
          <DrawerItem
            label="Subscription"
            icon="card"
            focused={currentPath.includes('subscription')}
            onPress={() => router.push('/(protected)/(drawer)/(tabs)/subscription')}
          />
        </View>
      </ScrollView>

      {/* Footer Group */}
      <View className="border-t border-slate-100 pb-6 pt-4 dark:border-slate-900">
        <DrawerItem label="Terms & Conditions" icon="document-text" onPress={() => {}} />
        <DrawerItem label="Privacy Policy" icon="shield-checkmark" onPress={() => {}} />
        <DrawerItem label="Logout" icon="log-out" variant="destructive" onPress={logout} />
        <View className="mt-4 px-6">
          <Text className="text-[10px] font-medium text-slate-400">v1.0.0</Text>
        </View>
      </View>
    </Container>
  );
};

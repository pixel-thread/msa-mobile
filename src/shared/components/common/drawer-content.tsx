import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuthStore } from '@src/features/auth';
import { useRouter, useSegments } from 'expo-router';
import { Container } from './Container';
import { ScrollView, View } from 'react-native';
import { Text } from '@components/ui';
import { DrawerItem } from '../ui/drawer-item';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Constants from 'expo-constants';

type DrawerMenuItem = Omit<any, 'focused'>;
type DrawerMenuGroup = {
  title: string;
  items: DrawerMenuItem[];
};

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const router = useRouter();
  const segments = useSegments();
  const { logout, user } = useAuthStore((state) => ({
    logout: state.logout,
    user: state.user,
  }));
  const inset = useSafeAreaInsets();

  const currentPath = segments.join('/');

  const isAdmin = user?.role.some((r) => ['ADMIN', 'SUPER_ADMIN', 'DPO', 'SECRETARY', 'PRESIDENT'].includes(r));

  const menuGroups: DrawerMenuGroup[] = [
    {
      title: 'Main Menu',
      items: [
        {
          label: 'Meetings',
          icon: 'calendar',
          onPress: () => router.push('/(protected)/(drawer)/(tabs)/meetings'),
        },
        {
          label: 'Members',
          icon: 'people',
          onPress: () => router.push('/(protected)/members'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          label: 'My Profile',
          icon: 'person',
          onPress: () => router.push('/(protected)/(drawer)/(tabs)/profile'),
        },
        {
          label: 'Subscription',
          icon: 'card',
          onPress: () => router.push('/(protected)/(drawer)/(tabs)/subscription'),
        },
      ],
    },
  ];

  if (isAdmin) {
    menuGroups.push({
      title: 'Administrative',
      items: [
        {
          label: 'DSAR Management',
          icon: 'shield-checkmark',
          onPress: () => router.push('/(protected)/admin/dsar'),
        },
      ],
    });
  }

  const footerItems: DrawerMenuItem[] = [
    { label: 'Terms & Conditions', icon: 'document-text', onPress: () => {} },
    { label: 'Privacy Policy', icon: 'shield-checkmark', onPress: () => {} },
    { label: 'Logout', icon: 'log-out', variant: 'destructive' as const, onPress: logout },
  ];

  return (
    <Container className="flex-1" style={{ paddingTop: inset.top }}>
      <View className="border-b border-slate-100 px-6 py-8 dark:border-slate-900">
        <Text className="text-center text-4xl font-black tracking-tighter text-indigo-600">
          {Constants.default.expoConfig?.name}
        </Text>
        <Text
          variant="subtext"
          size="xs"
          className="text-center font-bold uppercase tracking-widest opacity-60">
          Association App
        </Text>
      </View>

      <ScrollView className="flex-1 py-4">
        {menuGroups.map((group, groupIndex) => (
          <View key={group.title} className={groupIndex < menuGroups.length - 1 ? 'mb-6' : ''}>
            <Text className="mb-1 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {group.title}
            </Text>
            {group.items.map((item) => (
              <DrawerItem
                key={item.label}
                label={item.label}
                icon={item.icon}
                focused={currentPath.includes(item.label.toLowerCase())}
                onPress={item.onPress}
                variant={item.variant}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      <View
        className="border-t border-slate-100 pt-4 dark:border-slate-900"
        style={{ paddingBottom: inset.bottom }}>
        {footerItems.map((item) => (
          <DrawerItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            onPress={item.onPress}
            variant={item.variant}
          />
        ))}
        <View className="mt-4 px-6">
          <Text className="text-[10px] font-medium text-slate-400">v1.0.0</Text>
        </View>
      </View>
    </Container>
  );
};

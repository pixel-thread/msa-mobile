import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuthStore } from '@src/features/auth';
import { useRouter, useSegments } from 'expo-router';
import { Container } from './Container';
import { ScrollView, View } from 'react-native';
import { Text } from '@components/ui';
import { DrawerItem } from '../ui/drawer-item';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Constants from 'expo-constants';
import { hasHighRoleAccess } from '@src/features/meetings';
import { canManageTraining } from '@src/features/training';
import { Ionicons } from '@expo/vector-icons';

type DrawerMenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'default' | 'destructive';
};

type DrawerMenuGroup = {
  title: string;
  items: DrawerMenuItem[];
};

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const router = useRouter();
  const segments = useSegments();
  const { user, logout } = useAuthStore();
  const inset = useSafeAreaInsets();

  const currentPath = segments.join('/');

  const isAdmin = hasHighRoleAccess(user?.role);

  const menuGroups: DrawerMenuGroup[] = [
    {
      title: 'Main Menu',
      items: [
        {
          label: 'Announcements',
          icon: 'megaphone-outline',
          onPress: () => router.push('/(protected)/announcements'),
        },
        {
          label: 'Meetings',
          icon: 'calendar-outline',
          onPress: () => router.push('/(protected)/(drawer)/(tabs)/meetings'),
        },
        {
          label: 'Training',
          icon: 'school-outline',
          onPress: () => router.push('/(protected)/training'),
        },
        {
          label: 'Consent',
          icon: 'document-lock-outline',
          onPress: () => router.push('/(protected)/consent'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          label: 'My Profile',
          icon: 'person-outline',
          onPress: () => router.push('/(protected)/(drawer)/(tabs)/profile'),
        },
        {
          label: 'Subscription',
          icon: 'card-outline',
          onPress: () => router.push('/(protected)/(drawer)/(tabs)/subscription'),
        },
      ],
    },
  ];

  if (isAdmin) {
    const adminItems = [
      {
        label: 'DSAR Management',
        icon: 'shield-checkmark-outline',
        onPress: () => router.push('/(protected)/admin/dsar'),
      },
      {
        label: 'Members',
        icon: 'people-outline',
        onPress: () => router.push('/(protected)/admin/members'),
      },
      {
        label: 'Consents',
        icon: 'document-lock-outline',
        onPress: () => router.push('/(protected)/admin/consent'),
      },
    ];

    if (canManageTraining(user?.role)) {
      adminItems.push({
        label: 'Training Management',
        icon: 'school-outline',
        onPress: () => router.push('/(protected)/admin/training'),
      });
      adminItems.push({
        label: 'Training Completions',
        icon: 'document-text-outline',
        onPress: () => router.push('/(protected)/admin/training/completions'),
      });
    }

    menuGroups.push({
      title: 'Administrative',
      items: adminItems,
    });
  }

  const footerItems: DrawerMenuItem[] = [
    { label: 'Terms & Conditions', icon: 'document-text-outline', onPress: () => {} },
    { label: 'Privacy Policy', icon: 'shield-checkmark-outline', onPress: () => {} },
    {
      label: 'Logout',
      icon: 'log-out-outline',
      variant: 'destructive' as const,
      onPress: () => logout(),
    },
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
      </View>
    </Container>
  );
};

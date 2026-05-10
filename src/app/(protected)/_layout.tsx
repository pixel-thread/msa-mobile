import { Drawer } from 'expo-router/drawer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { AuthGuard } from '@src/shared/components/auth';
import { HeaderButton } from '@src/shared/components/HeaderButton';

const DrawerLayout = () => {
  return (
    <AuthGuard>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            headerTitle: 'Home',
            drawerLabel: 'Home',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="(tabs)"
          options={{
            headerTitle: 'Tabs',
            drawerLabel: 'Tabs',
            drawerIcon: ({ size, color }) => (
              <MaterialIcons name="border-bottom" size={size} color={color} />
            ),
            headerRight: () => (
              <Link href="/modal" asChild>
                <HeaderButton />
              </Link>
            ),
          }}
        />
      </Drawer>
    </AuthGuard>
  );
};

export default DrawerLayout;

import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

import { AuthGuard } from '@src/shared/components/auth';

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
      </Drawer>
    </AuthGuard>
  );
};

export default DrawerLayout;

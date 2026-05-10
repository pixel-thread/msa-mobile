import { Drawer } from 'expo-router/drawer';

import { AuthGuard } from '@src/shared/components/auth';
import { Stack } from 'expo-router';

const DrawerLayout = () => {
  return (
    <AuthGuard>
      <Drawer screenOptions={{ headerShown: false }}>
        <Stack />
      </Drawer>
    </AuthGuard>
  );
};

export default DrawerLayout;

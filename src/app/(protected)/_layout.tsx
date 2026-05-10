import { Drawer } from 'expo-router/drawer';

import { AuthGuard } from '@src/shared/components/auth';

const DrawerLayout = () => {
  return (
    <AuthGuard>
      <Drawer screenOptions={{ headerShown: false }} />
    </AuthGuard>
  );
};

export default DrawerLayout;

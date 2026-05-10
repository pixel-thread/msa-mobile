import { Drawer } from 'expo-router/drawer';

const DrawerLayout = () => {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Home' }} />
    </Drawer>
  );
};

export default DrawerLayout;

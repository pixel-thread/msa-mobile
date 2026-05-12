import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Text } from '@src/shared/components/ui/text';
import { DrawerItem } from '@src/shared/components/ui/drawer-item';
import { useAuthStore } from '@src/shared/store/auth.store';
import { useRouter, useSegments } from 'expo-router';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const router = useRouter();
  const segments = useSegments();
  const logout = useAuthStore((state) => state.logout);

  // Active route detection
  const currentPath = segments.join('/');

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      {/* Header */}
      <View className="px-6 py-8 border-b border-slate-100 dark:border-slate-900">
        <Text className="text-2xl font-black text-indigo-600 tracking-tighter">MFSA</Text>
        <Text variant="subtext" size="xs" className="uppercase tracking-widest font-bold opacity-60">
          Association App
        </Text>
      </View>

      <ScrollView className="flex-1 py-4">
        {/* Main Menu Group */}
        <View className="mb-6">
          <Text className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Main Menu
          </Text>
          <DrawerItem 
            label="Home" 
            icon="home" 
            focused={currentPath === '(protected)/(drawer)/(tabs)' || currentPath === '(protected)/(drawer)/(tabs)/index'} 
            onPress={() => router.push('/(protected)/(drawer)/(tabs)')} 
          />
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
          <Text className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
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
      <View className="border-t border-slate-100 dark:border-slate-900 pt-4 pb-6">
         <DrawerItem 
            label="Terms & Conditions" 
            icon="document-text" 
            onPress={() => {}} 
          />
          <DrawerItem 
            label="Privacy Policy" 
            icon="shield-checkmark" 
            onPress={() => {}} 
          />
          <DrawerItem 
            label="Logout" 
            icon="log-out" 
            variant="destructive"
            onPress={logout} 
          />
          <View className="px-6 mt-4">
             <Text className="text-[10px] text-slate-400 font-medium">v1.0.0</Text>
          </View>
      </View>
    </SafeAreaView>
  );
};

const DrawerLayout = () => {
  return (
    <Drawer 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Home' }} />
    </Drawer>
  );
};

export default DrawerLayout;

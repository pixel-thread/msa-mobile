import { Link, Stack } from 'expo-router';

import { Container, ScreenContent } from '@src/shared/components';
import { useAuthStore, useSecureTokenStore } from '@src/features/auth';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native-gesture-handler';

export default function Home() {
  const { user, logout } = useAuthStore();
  const { clearAll } = useSecureTokenStore();

  const onLogout = () => {
    logout();
    clearAll();
  };
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <Container>
        <ScreenContent path="app/(drawer)/(tabs)/index.tsx" title={user?.email || ''} />
        <TouchableOpacity onPress={onLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
        <Link href={'/(auth)/sign-in'}>Signin</Link>
      </Container>
    </>
  );
}

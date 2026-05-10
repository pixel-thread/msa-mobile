import { Link, Stack } from 'expo-router';

import { Container, ScreenContent } from '@src/shared/components';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <Container>
        <ScreenContent path="app/(drawer)/(tabs)/index.tsx" title="Tab One" />
        <Link href={'/(auth)/login'}>Signin</Link>
      </Container>
    </>
  );
}

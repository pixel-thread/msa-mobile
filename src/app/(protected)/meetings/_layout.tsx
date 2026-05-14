import { Container } from '@src/shared/components';
import { Stack } from 'expo-router';

export default function layout() {
  return (
    <Container>
      <Stack screenOptions={{ headerShown: false }} />
    </Container>
  );
}

import { Stack } from 'expo-router';

export default function ConsentLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Manage Consent' }} />
      <Stack.Screen name="history" options={{ title: 'Consent History' }} />
    </Stack>
  );
}

import { Stack } from 'expo-router';

export default function AdminConsentLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Consent Dashboard' }} />
      <Stack.Screen name="audit" options={{ title: 'Consent Audit Trail' }} />
    </Stack>
  );
}

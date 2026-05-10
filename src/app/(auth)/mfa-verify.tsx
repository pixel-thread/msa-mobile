import { Container, StackHeader } from '@src/shared/components';
import { View } from 'react-native';
import { MfaVerifyForm } from '@features/auth/components';

export default function MfaVerifyPage() {
  return (
    <Container>
      <StackHeader title="Verify MFA" />
      <View className="flex-1 justify-center px-6">
        <MfaVerifyForm />
      </View>
    </Container>
  );
}

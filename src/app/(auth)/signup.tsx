import { Container, StackHeader } from '@src/shared/components';
import { View } from 'react-native';
import { SignUpForm } from '@features/auth/components';

export default function SignUpPage() {
  return (
    <Container>
      <StackHeader title="Sign Up" />
      <View className="flex-1 justify-center px-6">
        <SignUpForm />
      </View>
    </Container>
  );
}

import { Container, StackHeader } from '@src/shared/components';
import { View } from 'react-native';
import { LoginForm } from '@features/auth/components';

export default function LoginPage() {
  return (
    <Container>
      <StackHeader title="Login" />
      <View className="flex-1 justify-center px-6">
        <LoginForm />
      </View>
    </Container>
  );
}

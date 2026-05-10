import { SafeAreaView } from 'react-native-safe-area-context';
import { SignUpScreen } from '@features/auth/screens';

export default function SignUpPage() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <SignUpScreen />
    </SafeAreaView>
  );
}

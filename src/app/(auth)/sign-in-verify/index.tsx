import { SafeAreaView } from 'react-native-safe-area-context';
import { SignInVerifyScreen } from '@features/auth/screens';

export default function SignInVerifyPage() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <SignInVerifyScreen />
    </SafeAreaView>
  );
}

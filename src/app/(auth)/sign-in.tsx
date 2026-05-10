import { SafeAreaView } from 'react-native-safe-area-context';
import { SignInScreen } from '@features/auth/screens';

export default function SignInPage() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <SignInScreen />
    </SafeAreaView>
  );
}

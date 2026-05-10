import { useForm, Controller } from 'react-hook-form';
import {
  Text,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import { SignInVerifySchema, type SignInVerifyFormData } from '../validators';
import { useSignInVerify } from '../hooks';
import { Button } from '@src/shared/components/Button';
import { TextInput } from '@src/shared/components/ui/text-input';
import { useResendSignInVerifyCode } from '../hooks/use-resend-sign-in-verify-code.hook';
import { useSearchParams } from 'expo-router/build/hooks';

export const SignInVerifyScreen = () => {
  const searchParams = useSearchParams();
  const mfaTempToken = searchParams.get('tempToken') || '';
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInVerifyFormData>({
    resolver: zodResolver(SignInVerifySchema),
  });

  const { mutate: verifySignIn, isPending, error } = useSignInVerify();
  const { mutate: resendCode, isPending: isResending } = useResendSignInVerifyCode();

  const onSubmit = (data: SignInVerifyFormData) => {
    const payload = {
      code: data.code,
      mfa_temp_token: mfaTempToken,
    };

    verifySignIn(payload);
  };
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="mb-10 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-indigo-500">
            <Ionicons name="shield-checkmark" size={32} color="#fff" />
          </View>
          <Text className="mt-4 text-2xl font-bold text-gray-900">Verify Code</Text>
          <Text className="mt-2 text-center text-sm text-gray-500">
            Enter the 6-digit code sent to your email
          </Text>
        </View>

        <View className="gap-5">
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="mb-1.5 text-sm font-medium text-gray-700">Verification Code</Text>
                <TextInput
                  placeholder="000000"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.code?.message}
                  keyboardType="number-pad"
                  maxLength={6}
                  textAlign="center"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-center text-xl tracking-widest"
                />
              </View>
            )}
          />

          {error && (
            <View className="flex-row items-center gap-2 rounded-lg bg-red-50 p-3">
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text className="flex-1 text-sm text-red-600">{error.message}</Text>
            </View>
          )}

          <Button
            title={isPending ? 'Verifying...' : 'Verify Code'}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className={`rounded-xl py-4 ${isPending ? 'bg-indigo-400' : 'bg-indigo-500'}`}>
            {isPending && <ActivityIndicator color="#fff" size="small" />}
          </Button>

          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-sm text-gray-500">{`Didn't receive a code?`}</Text>
            <Text
              className={`text-sm font-semibold ${
                isResending ? 'text-gray-400' : 'text-indigo-500'
              }`}
              onPress={() => !isResending && resendCode()}>
              {isResending ? 'Sending...' : 'Resend'}
            </Text>
          </View>

          <Link href="/(auth)/sign-in" className="items-center pt-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="arrow-back" size={14} color="#9ca3af" />
              <Text className="text-sm text-gray-400">Back to Sign In</Text>
            </View>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

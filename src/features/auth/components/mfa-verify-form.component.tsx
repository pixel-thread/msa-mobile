import { useForm, Controller } from 'react-hook-form';
import { Text, View, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { mfaVerifySchema, type MfaVerifyFormData } from '../validators';
import { useMfaVerify, useResendMfaCode } from '../hooks';
import { Button } from '@src/shared/components/Button';
import { TextInput } from '@src/shared/components/ui/text-input';

export const MfaVerifyForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MfaVerifyFormData>({
    resolver: zodResolver(mfaVerifySchema),
  });

  const { mutate: verifyMfa, isPending, error } = useMfaVerify();
  const { mutate: resendCode, isPending: isResending } = useResendMfaCode();

  const onSubmit = (data: MfaVerifyFormData) => {
    reset();
    verifyMfa(data);
  };

  return (
    <View className="flex gap-4">
      <Text className="mb-2 text-center text-gray-600">
        Enter the 6-digit code sent to your email
      </Text>

      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Verification Code"
            placeholder="000000"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.code?.message}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />
        )}
      />

      {error && <Text className="text-red-500">{error.message}</Text>}

      <Button
        title={isPending ? 'Verifying...' : 'Verify'}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}>
        {isPending && <ActivityIndicator color="#fff" />}
      </Button>

      <View className="flex-row justify-center gap-2">
        <Text className="text-gray-600">{`Didn't receive a code?`}</Text>
        <Text className="font-semibold text-indigo-500" onPress={() => resendCode()}>
          {isResending ? 'Sending...' : 'Resend'}
        </Text>
      </View>

      <Link href="/auth/login" className="text-center">
        <Text className="text-sm text-gray-400">Back to Sign In</Text>
      </Link>
    </View>
  );
};

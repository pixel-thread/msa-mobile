import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import { SignInVerifySchema, type SignInVerifyFormData } from '../validators';
import { useSignInVerify } from '../hooks';
import {
  Button,
  Text,
  FieldInput,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@src/shared/components/ui';
import { useResendSignInVerifyCode } from '../hooks';
import { useSearchParams } from 'expo-router/build/hooks';

export const SignInVerifyScreen = () => {
  const searchParams = useSearchParams();
  const mfaTempToken = searchParams.get('tempToken') || '';
  const methods = useForm<SignInVerifyFormData>({
    resolver: zodResolver(SignInVerifySchema),
    mode: 'onBlur',
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
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="mb-10 items-center">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none">
            <Ionicons name="mail-unread" size={36} color="#fff" />
          </View>
          <Text variant="heading" size="3xl" className="text-slate-900 dark:text-white">
            Verify Identity
          </Text>
          <Text variant="subtext" size="sm" className="mt-2 px-8 text-center">
            Please enter the 6-digit authentication code sent to your registered email
          </Text>
        </View>

        <Card className="border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6">
            <FormProvider {...methods}>
              <View className="gap-y-4">
                <FieldInput
                  name="code"
                  label="Verification Code"
                  placeholder="000000"
                  keyboardType="number-pad"
                  maxLength={6}
                  textAlign="center"
                  className="h-16 text-2xl font-bold tracking-[12px]"
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}

                <Button
                  title={isPending ? 'Validating...' : 'Verify & Continue'}
                  onPress={methods.handleSubmit(onSubmit)}
                  loading={isPending}
                  className="h-14 rounded-2xl bg-indigo-600"
                />

                <View className="flex-row items-center justify-center gap-x-2 py-2">
                  <Text variant="subtext" size="sm">
                    No code received?
                  </Text>
                  <TouchableOpacity
                    onPress={() => !isResending && resendCode()}
                    disabled={isResending}>
                    <Text variant="link" size="sm" weight="bold">
                      {isResending ? 'Sending...' : 'Resend Code'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </FormProvider>
          </CardContent>
        </Card>

        <View className="mt-8 items-center">
          <Link href="/(auth)/sign-in">
            <View className="flex-row items-center gap-x-2">
              <Ionicons name="arrow-back" size={16} color="#64748b" />
              <Text variant="subtext" size="sm" weight="medium">
                Back to Authentication
              </Text>
            </View>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

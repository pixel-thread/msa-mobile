import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import { ForgotPasswordSchema, type ForgotPasswordInput } from '@features/auth/validators/forgot-password';
import { useForgotPassword } from '@features/auth/hooks/use-forgot-password';
import { Button, Text, FieldInput, Card, CardContent } from '@src/shared/components/ui';

export default function ForgotPasswordPage() {
  const methods = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: 'onBlur',
  });

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordInput) => forgotPassword(data);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="mb-12 items-center">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none">
            <Ionicons name="key" size={40} color="#fff" />
          </View>
          <Text variant="heading" size="3xl" className="text-slate-900 dark:text-white">
            Reset Password
          </Text>
          <Text variant="subtext" size="sm" className="mt-2 text-center">
            Enter your email to receive a password reset code
          </Text>
        </View>

        <Card className="border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6">
            <FormProvider {...methods}>
              <View className="gap-y-2">
                <FieldInput
                  name="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Button
                  title={isPending ? 'Sending...' : 'Send Reset Code'}
                  onPress={methods.handleSubmit(onSubmit)}
                  loading={isPending}
                  className="mt-4 h-14 rounded-2xl"
                />
              </View>
            </FormProvider>
          </CardContent>
        </Card>

        <View className="mt-8 flex-row items-center justify-center gap-x-2">
          <Text variant="subtext" size="sm">
            Remember your password?
          </Text>
          <Link href="/(auth)/sign-in">
            <Text variant="link" size="sm" weight="bold">
              Sign In
            </Text>
          </Link>
        </View>

        <View className="mt-12 items-center">
          <Text variant="subtext" size="xs" className="text-center opacity-50">
            Check your email for the reset code.{'\n'}
            Enter the code and your new password below.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
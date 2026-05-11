import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import { SignInSchema, type SignInFormData } from '../validators';
import { useSignIn } from '../hooks';
import { Button, Text, FieldInput, Card, CardContent } from '@src/shared/components/ui';

export const SignInScreen = () => {
  const methods = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    mode: 'onBlur',
  });

  const { mutate: signIn, isPending } = useSignIn();

  const onSubmit = (data: SignInFormData) => {
    signIn(data);
  };

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
            <Ionicons name="shield-checkmark" size={40} color="#fff" />
          </View>
          <Text variant="heading" size="3xl" className="text-slate-900 dark:text-white">
            Portal Access
          </Text>
          <Text variant="subtext" size="sm" className="mt-2 text-center">
            Secure authentication for authorized personnel
          </Text>
        </View>

        <Card className="border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6">
            <FormProvider {...methods}>
              <View className="gap-y-2">
                <FieldInput
                  name="email"
                  label="Official Email"
                  placeholder="name@institution.gov"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <FieldInput
                  name="password"
                  label="Security Password"
                  placeholder="••••••••"
                  secureTextEntry
                />

                <View className="flex-row justify-end py-1">
                  <Link href="/">
                    <Text variant="link" size="sm" weight="medium">
                      Recovery Options
                    </Text>
                  </Link>
                </View>

                <Button
                  title={isPending ? 'Verifying...' : 'Authenticate'}
                  onPress={methods.handleSubmit(onSubmit)}
                  loading={isPending}
                  className="mt-4 h-14 rounded-2xl bg-indigo-600"
                />
              </View>
            </FormProvider>
          </CardContent>
        </Card>

        <View className="mt-8 flex-row items-center justify-center gap-x-2">
          <Text variant="subtext" size="sm">
            Need credentials?
          </Text>
          <Link href="/(auth)/sign-up">
            <Text variant="link" size="sm" weight="bold">
              Register Now
            </Text>
          </Link>
        </View>

        <View className="mt-12 items-center">
          <Text variant="subtext" size="xs" className="text-center opacity-50">
            Protected by end-to-end encryption.{'\n'}
            Unauthorized access is strictly prohibited.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

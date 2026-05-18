import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import { SignUpSchema, type SignUpFormData } from '../validators';
import { useSignUp } from '../hooks';
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
import { useRateLimit } from '@src/shared/hooks/use-rate-limiting';

export const SignUpScreen = () => {
  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onBlur',
  });

  const { mutate: signUp, isPending, error } = useSignUp();
  const passwordValue = methods.watch('password') || '';

  const { isLimited, retryAfter, executeWithLimit } = useRateLimit('SIGN_UP_BUTTON', {
    limit: 1,
    windowMs: 30000,
  });

  const onSubmit = (data: SignUpFormData) => {
    executeWithLimit(() => signUp(data));
  };

  const requirements = [
    { label: '8+ characters', test: (v: string) => v.length >= 8 },
    { label: 'Uppercase', test: (v: string) => /[A-Z]/.test(v) },
    { label: 'Lowercase', test: (v: string) => /[a-z]/.test(v) },
    { label: 'Number', test: (v: string) => /\d/.test(v) },
    { label: 'Special symbol', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
  ];

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="mb-10 items-center">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none">
            <Ionicons name="person-add" size={36} color="#fff" />
          </View>
          <Text variant="heading" size="3xl" className="text-slate-900 dark:text-white">
            Registry
          </Text>
          <Text variant="subtext" size="sm" className="mt-2 text-center">
            Create an official account to access institutional services
          </Text>
        </View>

        <Card className="border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6">
            <FormProvider {...methods}>
              <View className="gap-y-2">
                <FieldInput
                  name="name"
                  label="Full Legal Name"
                  placeholder="Johnathan Doe"
                  autoCapitalize="words"
                />

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

                <View className="mb-4 mt-2">
                  <Text
                    variant="label"
                    size="xs"
                    className="mb-3 uppercase tracking-widest text-slate-400">
                    Security Requirements
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {requirements.map(({ label, test }) => {
                      const met = test(passwordValue);
                      return (
                        <View
                          key={label}
                          className={`flex-row items-center gap-1.5 rounded-full border px-3 py-1.5 ${
                            met
                              ? 'border-emerald-100 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-950/20'
                              : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
                          }`}>
                          <Ionicons
                            name={met ? 'checkmark-circle' : 'ellipse-outline'}
                            size={12}
                            color={met ? '#059669' : '#94a3b8'}
                          />
                          <Text
                            size="xs"
                            weight="medium"
                            className={
                              met ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'
                            }>
                            {label}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Registration Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}

                <Button
                  title={
                    isLimited
                      ? `Try again in ${retryAfter} seconds`
                      : isPending
                        ? 'Processing...'
                        : 'Register Account'
                  }
                  onPress={methods.handleSubmit(onSubmit)}
                  className="mt-2 h-14 rounded-2xl bg-indigo-600"
                />
              </View>
            </FormProvider>
          </CardContent>
        </Card>

        <View className="mt-8 flex-row items-center justify-center gap-x-2">
          <Text variant="subtext" size="sm">
            Already registered?
          </Text>
          <Link href="/(auth)/sign-in">
            <Text variant="link" size="sm" weight="bold">
              Sign In
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

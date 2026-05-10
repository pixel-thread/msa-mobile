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

import { SignUpSchema, type SignUpFormData } from '../validators';
import { useSignUp } from '../hooks';
import { Button } from '@src/shared/components/Button';
import { TextInput } from '@src/shared/components/ui/text-input';

export const SignUpScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  const { mutate: signUp, isPending, error } = useSignUp();

  const onSubmit = (data: SignUpFormData) => {
    signUp(data);
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
            <Ionicons name="person-add" size={32} color="#fff" />
          </View>
          <Text className="mt-4 text-2xl font-bold text-gray-900">Create Account</Text>
          <Text className="mt-2 text-sm text-gray-500">Join us and get started today</Text>
        </View>

        <View className="gap-5">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="mb-1.5 text-sm font-medium text-gray-700">Full Name</Text>
                <TextInput
                  placeholder="Enter your full name"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.name?.message}
                  autoCapitalize="words"
                  autoCorrect={false}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="mb-1.5 text-sm font-medium text-gray-700">Email</Text>
                <TextInput
                  placeholder="Enter your email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="mb-1.5 text-sm font-medium text-gray-700">Password</Text>
                <TextInput
                  placeholder="Create a strong password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5"
                />
                <View className="mt-2 flex-row flex-wrap gap-2">
                  {[
                    { label: '8+ chars', test: (v: string) => v.length >= 8 },
                    { label: 'Upper', test: (v: string) => /[A-Z]/.test(v) },
                    { label: 'Lower', test: (v: string) => /[a-z]/.test(v) },
                    { label: 'Number', test: (v: string) => /\d/.test(v) },
                    { label: 'Special', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
                  ].map(({ label, test }) => (
                    <View
                      key={label}
                      className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${
                        value && test(value) ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                      <Ionicons
                        name={value && test(value) ? 'checkmark-circle' : 'ellipse-outline'}
                        size={10}
                        color={value && test(value) ? '#22c55e' : '#9ca3af'}
                      />
                      <Text
                        className={`text-xs ${
                          value && test(value) ? 'text-green-700' : 'text-gray-400'
                        }`}>
                        {label}
                      </Text>
                    </View>
                  ))}
                </View>
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
            title={isPending ? 'Creating account...' : 'Create Account'}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className={`rounded-xl py-4 ${isPending ? 'bg-indigo-400' : 'bg-indigo-500'}`}>
            {isPending && <ActivityIndicator color="#fff" size="small" />}
          </Button>

          <View className="flex-row items-center justify-center gap-2 pt-2">
            <Text className="text-sm text-gray-500">Already have an account?</Text>
            <Link href="/(auth)/sign-in">
              <Text className="text-sm font-semibold text-indigo-500">Sign In</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

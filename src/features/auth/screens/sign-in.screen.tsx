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

import { SignInSchema, type SignInFormData } from '../validators';
import { useSignIn } from '../hooks';
import { Button } from '@src/shared/components/Button';
import { TextInput } from '@src/shared/components/ui/text-input';

export const SignInScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
  });

  const { mutate: signIn, isPending, error } = useSignIn();

  const onSubmit = (data: SignInFormData) => {
    signIn(data);
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
            <Ionicons name="person" size={32} color="#fff" />
          </View>
          <Text className="mt-4 text-2xl font-bold text-gray-900">Welcome Back</Text>
          <Text className="mt-2 text-sm text-gray-500">Sign in to continue to your account</Text>
        </View>

        <View className="gap-5">
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
                  placeholder="Enter your password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5"
                />
              </View>
            )}
          />

          <View className="flex-row justify-end">
            <Link href="/">
              <Text className="text-sm font-medium text-indigo-500">Forgot password?</Text>
            </Link>
          </View>

          {error && (
            <View className="flex-row items-center gap-2 rounded-lg bg-red-50 p-3">
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text className="flex-1 text-sm text-red-600">{error.message}</Text>
            </View>
          )}

          <Button
            title={isPending ? 'Signing in...' : 'Sign In'}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className={`rounded-xl py-4 ${isPending ? 'bg-indigo-400' : 'bg-indigo-500'}`}>
            {isPending && <ActivityIndicator color="#fff" size="small" />}
          </Button>

          <View className="flex-row items-center justify-center gap-2 pt-2">
            <Text className="text-sm text-gray-500">{`Don't have an account?`}</Text>
            <Link href="/(auth)/sign-up">
              <Text className="text-sm font-semibold text-indigo-500">Sign Up</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

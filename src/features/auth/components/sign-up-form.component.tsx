import { useForm, Controller } from 'react-hook-form';
import { Text, View, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { signUpSchema, type SignUpFormData } from '../validators';
import { useSignUp } from '../hooks';
import { Button } from '@src/shared/components/Button';
import { TextInput } from '@src/shared/components/ui/text-input';

export const SignUpForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate: signUp, isPending, error } = useSignUp();

  const onSubmit = (data: SignUpFormData) => {
    signUp(data);
  };

  return (
    <View className="flex gap-4">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Name"
            placeholder="Enter your name"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Password"
            placeholder="Create a password"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.password?.message}
            secureTextEntry
          />
        )}
      />

      {error && <Text className="text-red-500">{error.message}</Text>}

      <Button
        title={isPending ? 'Creating account...' : 'Create Account'}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}>
        {isPending && <ActivityIndicator color="#fff" />}
      </Button>

      <View className="flex-row justify-center gap-2">
        <Text className="text-gray-600">Already have an account?</Text>
        <Link href="/auth/login">
          <Text className="font-semibold text-indigo-500">Sign In</Text>
        </Link>
      </View>
    </View>
  );
};

import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@src/shared/store';
import { Container, StackHeader } from '@src/shared/components';
import { Button, Text } from '@src/shared/components/ui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';

const editProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

export const EditProfileScreen = () => {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: EditProfileForm) => {
    if (!user) return;
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 800));
      
      setUser({
        ...user,
        name: data.name,
        email: data.email,
      });
      
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <Container>
      <StackHeader title="Edit Profile" showBackButton />
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className="relative">
            <View className="h-28 w-28 items-center justify-center rounded-full bg-indigo-600 shadow-xl">
              <Text weight="bold" className="text-4xl text-white">
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-slate-100">
              <Ionicons name="camera" size={16} color="#475569" />
            </TouchableOpacity>
          </View>
          <Text className="mt-2 text-slate-500">Tap to change avatar</Text>
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-slate-700 font-medium">Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-12 border rounded-lg px-4 bg-white ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter your name"
              />
            )}
          />
          {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>}
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-slate-700 font-medium">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-12 border rounded-lg px-4 bg-white ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
        </View>

        <Button 
          title={isSubmitting ? "Saving..." : "Save Changes"} 
          onPress={handleSubmit(onSubmit)} 
          disabled={isSubmitting}
        />
      </ScrollView>
    </Container>
  );
};

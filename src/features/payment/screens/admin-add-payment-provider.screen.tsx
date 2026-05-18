import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCreateAdminPaymentProvider } from '../hooks';
import { Container, StackHeader } from '@src/shared/components';
import { Text, Button } from '@src/shared/components/ui';
import { TextInput } from '@src/shared/components/ui/text-input';
import type { PaymentProviderName, CreateProviderInput } from '../types';

const PROVIDERS: { label: string; value: PaymentProviderName }[] = [
  { label: 'Razorpay', value: 'RAZORPAY' },
  { label: 'Stripe', value: 'STRIPE' },
  { label: 'PayU', value: 'PAYU' },
  { label: 'Cashfree', value: 'CASHFREE' },
];

export const AdminAddPaymentProviderScreen = () => {
  const router = useRouter();
  const createMutation = useCreateAdminPaymentProvider();

  const [provider, setProvider] = useState<PaymentProviderName | null>(null);
  const [keyId, setKeyId] = useState('');
  const [keySecret, setKeySecret] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!provider) {
      newErrors.provider = 'Please select a provider';
    }
    if (!keyId.trim()) {
      newErrors.keyId = 'Key ID is required';
    }
    if (!keySecret.trim()) {
      newErrors.keySecret = 'Key Secret is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !provider) return;

    const data: CreateProviderInput = {
      provider,
      keyId: keyId.trim(),
      keySecret: keySecret.trim(),
      webhookSecret: webhookSecret.trim() || undefined,
      isActive,
    };

    const result = await createMutation.mutateAsync(data);
    if (result.success) {
      router.back();
    }
  };

  const isSubmitting = createMutation.isPending;

  return (
    <Container>
      <StackHeader showBackButton title="Add Payment Provider" />
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text variant="label" className="mb-2 text-slate-700 dark:text-slate-300">
            Provider
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {PROVIDERS.map((p) => (
              <TouchableOpacity
                key={p.value}
                onPress={() => {
                  setProvider(p.value);
                  setErrors((prev) => ({ ...prev, provider: '' }));
                }}
                className={`rounded-lg px-4 py-2 border ${
                  provider === p.value
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600'
                }`}>
                <Text
                  className={
                    provider === p.value
                      ? 'text-white font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.provider && (
            <Text size="sm" className="mt-1 text-red-500">
              {errors.provider}
            </Text>
          )}
        </View>

        <View className="mb-4">
          <TextInput
            label="Key ID"
            value={keyId}
            onChangeText={(text) => {
              setKeyId(text);
              setErrors((prev) => ({ ...prev, keyId: '' }));
            }}
            placeholder="Enter Key ID"
            autoCapitalize="none"
            error={errors.keyId}
          />
        </View>

        <View className="mb-4">
          <TextInput
            label="Key Secret"
            value={keySecret}
            onChangeText={(text) => {
              setKeySecret(text);
              setErrors((prev) => ({ ...prev, keySecret: '' }));
            }}
            placeholder="Enter Key Secret"
            secureTextEntry
            autoCapitalize="none"
            error={errors.keySecret}
          />
        </View>

        <View className="mb-4">
          <TextInput
            label="Webhook Secret (Optional)"
            value={webhookSecret}
            onChangeText={setWebhookSecret}
            placeholder="Enter Webhook Secret"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View className="mb-8 flex-row items-center justify-between">
          <Text variant="label" className="text-slate-700 dark:text-slate-300">
            Active
          </Text>
          <TouchableOpacity
            onPress={() => setIsActive(!isActive)}
            className={`h-7 w-12 rounded-full ${isActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <View
              className={`h-5 w-5 rounded-full bg-white m-1 ${isActive ? 'self-end' : 'self-start'}`}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <Button
          title="Add Provider"
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        />
      </View>
    </Container>
  );
};

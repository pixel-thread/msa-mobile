import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, StackHeader } from '@src/shared/components';
import { Text, TextInput, Button } from '@src/shared/components/ui';
import { useTrainingModules } from '@src/features/training/hooks';
import { AdminRecordCompletionFormData, AdminRecordCompletionSchema } from '../validators';
import { useAdminRecordCompletion } from '../hooks/use-admin-record-completion';
import { useLocalSearchParams } from 'expo-router';
import { logger } from '@src/shared/utils';

export const AdminRecordCompletionScreen = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const moduleId = useLocalSearchParams().moduleId;

  const { data: modules } = useTrainingModules();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdminRecordCompletionFormData>({
    resolver: zodResolver(AdminRecordCompletionSchema),
    defaultValues: {
      userId: '',
      moduleId: moduleId.toString(),
      scorePercent: undefined,
      certificateUrl: undefined,
    },
  });

  const moduleIdValue = watch('moduleId');

  useEffect(() => {
    if (moduleIdValue) {
      setSelectedModuleId(moduleIdValue);
    }
  }, [moduleIdValue]);

  const { mutate, isPending: isSubmitting } = useAdminRecordCompletion();

  const onSubmit = (data: AdminRecordCompletionFormData) => {
    logger.debug('data', data);
    mutate(data);
  };

  return (
    <Container>
      <StackHeader showBackButton title="Record Completion" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <View>
            <Text variant="label" className="mb-1">
              User ID (UUID)
            </Text>
            <Controller
              control={control}
              name="userId"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter user UUID"
                  error={errors.userId?.message}
                />
              )}
            />
          </View>

          <View>
            <Text variant="label" className="mb-1">
              Training Module
            </Text>
            <Controller
              control={control}
              name="moduleId"
              render={({ field: { onChange, value } }) => (
                <View className="gap-2">
                  {modules?.map((module) => (
                    <TouchableOpacity
                      key={module.id}
                      onPress={() => onChange(module.id)}
                      className={`rounded-lg border p-3 ${
                        value === module.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                      }`}>
                      <Text
                        weight={value === module.id ? 'semibold' : 'medium'}
                        className={
                          value === module.id
                            ? 'text-indigo-700 dark:text-indigo-400'
                            : 'text-slate-900 dark:text-white'
                        }>
                        {module.title}
                      </Text>
                      {module.description && (
                        <Text size="sm" className="mt-1 text-slate-500">
                          {module.description}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                  {errors.moduleId && (
                    <Text className="text-xs text-red-500">{errors.moduleId.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          <View>
            <Text variant="label" className="mb-1">
              Score (Optional)
            </Text>
            <Controller
              control={control}
              name="scorePercent"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value?.toString() ?? ''}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const num = parseInt(text, 10);
                    onChange(isNaN(num) ? undefined : num);
                  }}
                  placeholder="Enter score 0-100"
                  keyboardType="numeric"
                  error={errors.scorePercent?.message}
                />
              )}
            />
          </View>

          <View>
            <Text variant="label" className="mb-1">
              Certificate URL (Optional)
            </Text>
            <Controller
              control={control}
              name="certificateUrl"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value ?? ''}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="https://example.com/certificate.pdf"
                  keyboardType="url"
                  autoCapitalize="none"
                  error={errors.certificateUrl?.message}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting || !selectedModuleId}
          className="w-full"
          title={isSubmitting ? 'Recording...' : 'Record Completion'}
        />
      </View>
    </Container>
  );
};

